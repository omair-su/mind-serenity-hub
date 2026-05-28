// LocalStorage-backed SOS tracking + custom toolkit + trusted contacts.
// Lightweight, offline-first. Migrates to Lovable Cloud later.

export interface SOSUsageEvent {
  toolId: string;          // e.g. "panic-protocol", "rescue-54321"
  toolTitle: string;
  category: "panic" | "anxiety" | "anger" | "overwhelm" | "protocol";
  startedAt: number;       // ms epoch
  durationSec: number;
  panicBefore?: number;    // 1-10
  panicAfter?: number;     // 1-10
  helpful?: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone?: string;
  relation?: string;
}

const KEY_EVENTS = "willow.sos.events.v1";
const KEY_FAVS = "willow.sos.favorites.v1";
const KEY_CONTACTS = "willow.sos.contacts.v1";

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch { return fallback; }
}
function safeWrite(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ─── Events ────────────────────────────────────────────────────────────────
export function logSOSEvent(ev: SOSUsageEvent) {
  const list = safeRead<SOSUsageEvent[]>(KEY_EVENTS, []);
  list.unshift(ev);
  // cap at 200 to keep localStorage small
  safeWrite(KEY_EVENTS, list.slice(0, 200));
}
export function getSOSEvents(): SOSUsageEvent[] {
  return safeRead<SOSUsageEvent[]>(KEY_EVENTS, []);
}

// ─── Favorites (custom toolkit) ────────────────────────────────────────────
export function getFavorites(): string[] {
  return safeRead<string[]>(KEY_FAVS, []);
}
export function toggleFavorite(toolId: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(toolId) ? favs.filter(f => f !== toolId) : [toolId, ...favs];
  safeWrite(KEY_FAVS, next);
  return next;
}
export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

// ─── Trusted contacts ──────────────────────────────────────────────────────
import { fetchSOSContacts, upsertSOSContact, deleteSOSContactCloud } from "./cloudSync";

export function getContacts(): TrustedContact[] {
  return safeRead<TrustedContact[]>(KEY_CONTACTS, []);
}
export function saveContact(c: TrustedContact) {
  const list = getContacts();
  const idx = list.findIndex(x => x.id === c.id);
  if (idx >= 0) list[idx] = c; else list.unshift(c);
  safeWrite(KEY_CONTACTS, list);
  upsertSOSContact({ id: c.id, name: c.name, phone: c.phone, relation: c.relation }).catch(() => {});
}
export function deleteContact(id: string) {
  safeWrite(KEY_CONTACTS, getContacts().filter(c => c.id !== id));
  deleteSOSContactCloud(id).catch(() => {});
}

/** Pull server-side contacts into local cache. Call once after sign-in. */
export async function hydrateContactsFromCloud(): Promise<void> {
  const remote = await fetchSOSContacts();
  if (!remote) return;
  const mapped: TrustedContact[] = remote.map(c => ({
    id: c.id, name: c.name, phone: c.phone ?? undefined, relation: c.relation ?? undefined,
  }));
  safeWrite(KEY_CONTACTS, mapped);
}

// ─── Insights ──────────────────────────────────────────────────────────────
export interface SOSInsights {
  totalUses: number;
  last7d: number;
  topToolId?: string;
  topToolTitle?: string;
  avgRelief: number | null; // panicBefore - panicAfter average
  triggerDay?: string;      // "Monday" etc.
}

export function getInsights(): SOSInsights {
  const events = getSOSEvents();
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const last7d = events.filter(e => now - e.startedAt < week).length;

  const counts = new Map<string, { title: string; n: number }>();
  const dayCounts = new Map<string, number>();
  let reliefSum = 0, reliefN = 0;
  for (const e of events) {
    const cur = counts.get(e.toolId);
    counts.set(e.toolId, { title: e.toolTitle, n: (cur?.n ?? 0) + 1 });
    const d = new Date(e.startedAt).toLocaleDateString("en-US", { weekday: "long" });
    dayCounts.set(d, (dayCounts.get(d) ?? 0) + 1);
    if (typeof e.panicBefore === "number" && typeof e.panicAfter === "number") {
      reliefSum += (e.panicBefore - e.panicAfter);
      reliefN++;
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1].n - a[1].n)[0];
  const topDay = [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return {
    totalUses: events.length,
    last7d,
    topToolId: top?.[0],
    topToolTitle: top?.[1].title,
    avgRelief: reliefN ? +(reliefSum / reliefN).toFixed(1) : null,
    triggerDay: topDay?.[0],
  };
}
