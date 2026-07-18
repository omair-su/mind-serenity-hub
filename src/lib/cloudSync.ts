// Local ↔ Cloud sync helper. Mirrors writes to Supabase when authenticated, otherwise uses localStorage.
import { supabase } from "@/integrations/supabase/client";

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ============ Gratitude ============
export interface CloudGratitudeEntry {
  id: string;
  text: string;
  category?: string | null;
  ai_reflection?: string | null;
  voice_url?: string | null;
  created_at: string;
}

export async function fetchGratitudeEntries(limit = 200): Promise<CloudGratitudeEntry[]> {
  const uid = await getUserId();
  if (!uid) {
    try {
      const raw = localStorage.getItem("wv-gratitude");
      const local = raw ? JSON.parse(raw) : [];
      return local.map((e: any) => ({
        id: e.id,
        text: e.text,
        category: e.category,
        ai_reflection: e.ai_reflection ?? null,
        voice_url: null,
        created_at: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
      }));
    } catch { return []; }
  }
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("id, text, category, ai_reflection, voice_url, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function saveGratitudeEntry(entry: { text: string; category?: string; ai_reflection?: string; voice_url?: string }) {
  const uid = await getUserId();
  if (!uid) {
    try {
      const raw = localStorage.getItem("wv-gratitude");
      const all = raw ? JSON.parse(raw) : [];
      all.unshift({
        id: Date.now().toString(),
        text: entry.text,
        date: new Date().toISOString().split("T")[0],
        category: entry.category,
        ai_reflection: entry.ai_reflection,
      });
      localStorage.setItem("wv-gratitude", JSON.stringify(all));
    } catch {}
    return null;
  }
  const { data, error } = await supabase
    .from("gratitude_entries")
    .insert({ user_id: uid, ...entry })
    .select()
    .single();
  if (error) console.error(error);
  return data;
}

// ============ Rituals ============
export async function logRitualCompletion(ritualId: string, intentionWord?: string) {
  const uid = await getUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("ritual_completions")
    .insert({ user_id: uid, ritual_id: ritualId, intention_word: intentionWord })
    .select()
    .single();
  if (error) console.error(error);
  return data;
}

export async function fetchRitualCompletions(limit = 100) {
  const uid = await getUserId();
  if (!uid) return [];
  const { data } = await supabase
    .from("ritual_completions")
    .select("*")
    .order("completed_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ============ Day State (30-day program) ============
export interface DayState {
  intention?: string;
  moodBefore?: number;
  moodAfter?: number;
  reflection?: string;
  challengeText?: string;
  rememberText?: string;
  checklist?: boolean[];
  bookmarked?: boolean;
  calmRating?: number;
  completedAt?: string;
  /** ISO timestamp of last mood_entries sync — prevents duplicate rows */
  moodSyncedAt?: string;
  /** UUID of the linked mood_entries row */
  moodEntryId?: string;
}

const dayLocalKey = (n: number) => `wv-day-${n}`;

export async function loadDayState(dayNum: number): Promise<DayState> {
  // Always read local cache first for instant UI
  let local: DayState = {};
  try {
    const raw = localStorage.getItem(dayLocalKey(dayNum));
    if (raw) local = JSON.parse(raw);
  } catch {}

  const uid = await getUserId();
  if (!uid) return local;

  const { data } = await supabase
    .from("ritual_completions")
    .select("day_state, completed_at, intention_word")
    .eq("user_id", uid)
    .eq("ritual_id", `day-${dayNum}`)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (data) {
    const merged: DayState = {
      ...local,
      ...((data.day_state as DayState | null) ?? {}),
      intention: ((data.day_state as DayState | null)?.intention) ?? data.intention_word ?? local.intention,
      completedAt: data.completed_at ?? local.completedAt,
    };
    try { localStorage.setItem(dayLocalKey(dayNum), JSON.stringify(merged)); } catch {}
    return merged;
  }
  return local;
}

export async function saveDayState(dayNum: number, state: DayState) {
  // Local first (offline cache)
  try { localStorage.setItem(dayLocalKey(dayNum), JSON.stringify(state)); } catch {}

  const uid = await getUserId();
  if (!uid) return;

  // Upsert by (user_id, ritual_id) — latest row wins
  const { data: existing } = await supabase
    .from("ritual_completions")
    .select("id")
    .eq("user_id", uid)
    .eq("ritual_id", `day-${dayNum}`)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("ritual_completions")
      .update({
        day_state: state as any,
        intention_word: state.intention ?? null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("ritual_completions").insert({
      user_id: uid,
      ritual_id: `day-${dayNum}`,
      intention_word: state.intention ?? null,
      day_state: state as any,
    });
  }
}

export async function fetchAllDayCompletions(): Promise<Record<number, DayState>> {
  const uid = await getUserId();
  const out: Record<number, DayState> = {};
  if (!uid) {
    // Local only
    for (let i = 1; i <= 30; i++) {
      try {
        const raw = localStorage.getItem(dayLocalKey(i));
        if (raw) out[i] = JSON.parse(raw);
      } catch {}
    }
    return out;
  }
  const { data } = await supabase
    .from("ritual_completions")
    .select("ritual_id, day_state, completed_at, intention_word")
    .eq("user_id", uid)
    .like("ritual_id", "day-%")
    .order("completed_at", { ascending: false });
  for (const row of data ?? []) {
    const m = String(row.ritual_id).match(/^day-(\d+)$/);
    if (!m) continue;
    const n = parseInt(m[1], 10);
    if (out[n]) continue;
    out[n] = {
      ...((row.day_state as DayState | null) ?? {}),
      intention: ((row.day_state as DayState | null)?.intention) ?? row.intention_word ?? undefined,
      completedAt: row.completed_at,
    };
  }
  return out;
}

// ============ Mood ============
export interface CloudMoodEntry {
  id: string;
  emotion_primary: string;
  emotion_secondary?: string | null;
  energy?: number | null;
  focus?: number | null;
  ai_insight?: string | null;
  note?: string | null;
  created_at: string;
}

export async function fetchMoodEntries(limit = 90): Promise<CloudMoodEntry[]> {
  const uid = await getUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error(error);
  return data ?? [];
}

export async function saveMoodEntry(entry: {
  emotion_primary: string;
  emotion_secondary?: string;
  energy?: number;
  focus?: number;
  note?: string;
  ai_insight?: string;
}) {
  const uid = await getUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("mood_entries")
    .insert({ user_id: uid, ...entry })
    .select()
    .single();
  if (error) console.error(error);
  return data;
}

// ============ Day → Mood / Journal Coherence ============

/** Map a 1-10 calm/mood score to an emotion label for mood_entries.emotion_primary */
function moodScoreToEmotion(score: number): string {
  if (score >= 9) return "joyful";
  if (score >= 7) return "calm";
  if (score >= 5) return "neutral";
  if (score >= 3) return "tense";
  return "heavy";
}

/**
 * Sync a Day's reflection + mood-after to the mood_entries table so it appears
 * in Mood Tracker. Idempotent — if a moodEntryId already exists for this day
 * we update it rather than insert a duplicate.
 *
 * Returns the updated DayState (with moodEntryId / moodSyncedAt set) so the
 * caller can persist it back via saveDayState.
 */
export async function syncDayToMood(
  dayNum: number,
  state: DayState,
): Promise<DayState> {
  const uid = await getUserId();
  if (!uid) return state;
  if (typeof state.moodAfter !== "number") return state;

  const emotion = moodScoreToEmotion(state.moodAfter);
  const note = state.reflection?.trim()
    ? `Day ${dayNum} · ${state.reflection.trim().slice(0, 240)}`
    : `Day ${dayNum} reflection`;

  const payload = {
    user_id: uid,
    emotion_primary: emotion,
    energy: typeof state.moodBefore === "number" ? state.moodBefore : null,
    focus: state.calmRating ?? null,
    note,
  };

  if (state.moodEntryId) {
    const { error } = await supabase
      .from("mood_entries")
      .update(payload)
      .eq("id", state.moodEntryId)
      .eq("user_id", uid);
    if (error) {
      console.warn("[syncDayToMood] update failed, inserting new row", error.message);
    } else {
      return { ...state, moodSyncedAt: new Date().toISOString() };
    }
  }

  const { data, error } = await supabase
    .from("mood_entries")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    console.error("[syncDayToMood] insert failed", error);
    return state;
  }
  return {
    ...state,
    moodEntryId: data?.id,
    moodSyncedAt: new Date().toISOString(),
  };
}

// ============ Streak Freezes ============
export interface CloudStreak {
  freezes_available: number;
  last_grant_week: string;
  used_freeze_dates: string[];
  longest_streak?: number;
}

export async function fetchUserStreak(): Promise<CloudStreak | null> {
  const uid = await getUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("user_streaks")
    .select("freezes_available, last_grant_week, used_freeze_dates, longest_streak")
    .eq("user_id", uid)
    .maybeSingle();
  if (error) { console.warn("[fetchUserStreak]", error.message); return null; }
  return (data as CloudStreak) ?? null;
}

export async function upsertUserStreak(s: CloudStreak): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("user_streaks")
    .upsert({ user_id: uid, ...s }, { onConflict: "user_id" });
  if (error) console.warn("[upsertUserStreak]", error.message);
}

/** Mirror the longest-ever streak up to the cloud. Only overwrites if higher. */
export async function upsertLongestStreak(longest: number): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  // Read-modify-write to avoid regressing a higher server value.
  const { data } = await supabase
    .from("user_streaks")
    .select("longest_streak")
    .eq("user_id", uid)
    .maybeSingle();
  const currentServer = (data?.longest_streak as number | undefined) ?? 0;
  if (longest <= currentServer) return;
  const { error } = await supabase
    .from("user_streaks")
    .upsert({ user_id: uid, longest_streak: longest }, { onConflict: "user_id" });
  if (error) console.warn("[upsertLongestStreak]", error.message);
}

// ============ Timer Sessions ============
export interface CloudTimerSession {
  id: string;
  duration_minutes: number;
  session_type: string;
  created_at: string;
}

export async function insertTimerSession(session: { date: string; duration: number; type: string }): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase.from("timer_sessions").insert({
    user_id: uid,
    duration_minutes: Math.max(0, Math.round(session.duration)),
    session_type: session.type || "custom",
    created_at: session.date || new Date().toISOString(),
  });
  if (error) console.warn("[insertTimerSession]", error.message);
}

export async function fetchTimerSessions(limit = 200): Promise<CloudTimerSession[]> {
  const uid = await getUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from("timer_sessions")
    .select("id, duration_minutes, session_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) { console.warn("[fetchTimerSessions]", error.message); return []; }
  return (data as CloudTimerSession[]) ?? [];
}

// ============ SOS Contacts ============
export interface CloudSOSContact {
  id: string;
  name: string;
  phone?: string | null;
  relation?: string | null;
}

export async function fetchSOSContacts(): Promise<CloudSOSContact[] | null> {
  const uid = await getUserId();
  if (!uid) return null;
  const { data, error } = await supabase
    .from("sos_contacts")
    .select("id, name, phone, relation")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });
  if (error) { console.warn("[fetchSOSContacts]", error.message); return null; }
  return (data as CloudSOSContact[]) ?? [];
}

export async function upsertSOSContact(c: CloudSOSContact): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase
    .from("sos_contacts")
    .upsert({ id: c.id, user_id: uid, name: c.name, phone: c.phone ?? null, relation: c.relation ?? null }, { onConflict: "id" });
  if (error) console.warn("[upsertSOSContact]", error.message);
}

export async function deleteSOSContactCloud(id: string): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  const { error } = await supabase.from("sos_contacts").delete().eq("id", id).eq("user_id", uid);
  if (error) console.warn("[deleteSOSContactCloud]", error.message);
}
