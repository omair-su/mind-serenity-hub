// Streak Freeze tokens — protect a missed day from breaking your streak.
// One free token granted per ISO week; up to 3 stored at a time.
// Pure client-side (localStorage). No DB schema needed for v1.

const FREEZES_KEY = "wv-streak-freezes";
const FREEZE_GRANTS_KEY = "wv-streak-freeze-grants";
const FREEZE_USED_KEY = "wv-streak-freeze-used"; // dates a freeze was applied
const MAX_FREEZES = 3;

interface FreezeStore {
  available: number;
  lastGrantWeek: string; // ISO week key, e.g. "2026-W17"
}

function getISOWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function readStore(): FreezeStore {
  try {
    const raw = localStorage.getItem(FREEZES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { available: 1, lastGrantWeek: getISOWeekKey() };
}

function writeStore(s: FreezeStore) {
  try { localStorage.setItem(FREEZES_KEY, JSON.stringify(s)); } catch {}
}

/**
 * Grants 1 freeze if a new ISO week has begun since the last grant. Idempotent.
 * Returns the current store after grant.
 */
export function ensureWeeklyGrant(): FreezeStore {
  const store = readStore();
  const thisWeek = getISOWeekKey();
  if (store.lastGrantWeek !== thisWeek) {
    const next: FreezeStore = {
      available: Math.min(MAX_FREEZES, store.available + 1),
      lastGrantWeek: thisWeek,
    };
    writeStore(next);
    // Mark as a grant event for celebratory toast
    try {
      const grants = JSON.parse(localStorage.getItem(FREEZE_GRANTS_KEY) || "[]");
      grants.push({ week: thisWeek, at: new Date().toISOString() });
      localStorage.setItem(FREEZE_GRANTS_KEY, JSON.stringify(grants.slice(-10)));
    } catch {}
    return next;
  }
  return store;
}

export function getAvailableFreezes(): number {
  return ensureWeeklyGrant().available;
}

export function useFreeze(forDate: string): boolean {
  const store = ensureWeeklyGrant();
  if (store.available <= 0) return false;
  writeStore({ ...store, available: store.available - 1 });
  try {
    const used = JSON.parse(localStorage.getItem(FREEZE_USED_KEY) || "[]");
    used.push(forDate);
    localStorage.setItem(FREEZE_USED_KEY, JSON.stringify(used));
  } catch {}
  return true;
}

export function getUsedFreezeDates(): string[] {
  try { return JSON.parse(localStorage.getItem(FREEZE_USED_KEY) || "[]"); } catch { return []; }
}

/** Was a freeze just granted in the last 24h that the UI hasn't shown yet? */
export function consumePendingGrantToast(): boolean {
  try {
    const grants = JSON.parse(localStorage.getItem(FREEZE_GRANTS_KEY) || "[]");
    if (!grants.length) return false;
    const last = grants[grants.length - 1];
    const seenKey = `wv-freeze-grant-seen-${last.week}`;
    if (sessionStorage.getItem(seenKey)) return false;
    sessionStorage.setItem(seenKey, "1");
    const ageMs = Date.now() - new Date(last.at).getTime();
    return ageMs < 24 * 60 * 60 * 1000;
  } catch { return false; }
}
