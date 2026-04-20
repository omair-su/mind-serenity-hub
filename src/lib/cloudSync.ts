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
