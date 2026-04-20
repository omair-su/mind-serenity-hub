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
