// Redundant auth persistence for installed Android/PWA users.
//
// The Supabase client persists its session in localStorage by default. On some
// Android WebViews, PWA reinstalls, or aggressive storage eviction, localStorage
// can be wiped while cookies and IndexedDB survive. That kicks the user back to
// the landing/sign-in page on every relaunch.
//
// This module mirrors the {access_token, refresh_token} pair into TWO
// independent stores (a long-lived cookie + IndexedDB) every time the session
// changes, and rehydrates Supabase from that backup at app boot if its own
// storage came up empty. The user's logged-in state therefore survives any
// single store being cleared.
//
// Security note: tokens are already in localStorage — moving the same pair to
// a same-origin SameSite=Lax cookie + IndexedDB on the same origin does not
// broaden the attack surface, and matches how native auth SDKs persist.

import { supabase } from "@/integrations/supabase/client";

type BackupTokens = { access_token: string; refresh_token: string };

const COOKIE_NAME = "wv_auth_backup";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const IDB_NAME = "wv-auth";
const IDB_STORE = "session";
const IDB_KEY = "tokens";

// ---------- Cookie helpers ----------
function writeCookieBackup(tokens: BackupTokens | null) {
  if (typeof document === "undefined") return;
  try {
    if (!tokens) {
      document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
      return;
    }
    const secure = location.protocol === "https:" ? "; Secure" : "";
    const value = encodeURIComponent(
      btoa(JSON.stringify({ a: tokens.access_token, r: tokens.refresh_token }))
    );
    document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

function readCookieBackup(): BackupTokens | null {
  if (typeof document === "undefined") return null;
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!m) return null;
    const parsed = JSON.parse(atob(decodeURIComponent(m[1])));
    if (!parsed?.a || !parsed?.r) return null;
    return { access_token: parsed.a, refresh_token: parsed.r };
  } catch {
    return null;
  }
}

// ---------- IndexedDB helpers ----------
function withDB<T>(fn: (db: IDBDatabase) => Promise<T> | T): Promise<T | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    let settled = false;
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onerror = () => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      };
      req.onsuccess = async () => {
        try {
          const out = await fn(req.result);
          req.result.close();
          if (!settled) {
            settled = true;
            resolve(out);
          }
        } catch {
          if (!settled) {
            settled = true;
            resolve(null);
          }
        }
      };
    } catch {
      resolve(null);
    }
  });
}

function writeIdbBackup(tokens: BackupTokens | null): Promise<void> {
  return withDB((db) => {
    return new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      if (tokens) store.put(tokens, IDB_KEY);
      else store.delete(IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    });
  }).then(() => undefined);
}

function readIdbBackup(): Promise<BackupTokens | null> {
  return withDB<BackupTokens | null>((db) => {
    return new Promise<BackupTokens | null>((resolve) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        const v = req.result as BackupTokens | undefined;
        if (v?.access_token && v?.refresh_token) resolve(v);
        else resolve(null);
      };
      req.onerror = () => resolve(null);
    });
  });
}

// ---------- Detect whether Supabase already has its own session ----------
function hasSupabaseLocalSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || "";
      if (k.startsWith("sb-") && k.endsWith("-auth-token")) {
        const raw = localStorage.getItem(k);
        if (raw && raw.length > 10) return true;
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}

// ---------- Public API ----------

/**
 * Rehydrate Supabase from the cookie/IndexedDB backup if its own localStorage
 * came up empty. Resolves once the session is restored (or determined to be
 * unrestorable). Call this once during app boot, before route guards mount.
 */
export async function restoreSessionFromBackup(): Promise<void> {
  try {
    if (hasSupabaseLocalSession()) return;

    let tokens: BackupTokens | null = readCookieBackup();
    if (!tokens) tokens = await readIdbBackup();
    if (!tokens) return;

    await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
  } catch {
    /* never block boot on restore failures */
  }
}

/**
 * Subscribe to auth events and mirror the session into the redundant stores.
 * Returns an unsubscribe function (rarely needed — meant to live for the
 * entire app lifetime).
 */
export function startSessionBackupMirror(): () => void {
  // Seed immediately from the current session in case the app started with one.
  supabase.auth.getSession().then(({ data }) => {
    const s = data.session;
    if (s?.access_token && s?.refresh_token) {
      writeCookieBackup({ access_token: s.access_token, refresh_token: s.refresh_token });
      writeIdbBackup({ access_token: s.access_token, refresh_token: s.refresh_token });
    }
  });

  const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      writeCookieBackup(null);
      writeIdbBackup(null);
      return;
    }
    if (session.access_token && session.refresh_token) {
      const t = { access_token: session.access_token, refresh_token: session.refresh_token };
      writeCookieBackup(t);
      writeIdbBackup(t);
    }
  });

  return () => sub.subscription.unsubscribe();
}
