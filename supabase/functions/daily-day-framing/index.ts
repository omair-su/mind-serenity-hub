// Personalized 1-2 sentence daily framing for the Day Page.
// Reads recent mood + completion data and returns a warm, specific reflection.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FrameRequest {
  dayNumber: number;
  practice: string;
  focus: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    // Require authenticated user — prevents AI credit drain via anonymous calls
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: claimsData, error: claimsErr } = await authClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();

    const body = (await req.json()) as FrameRequest;
    if (!body?.dayNumber || !body?.practice) {
      return new Response(JSON.stringify({ error: "dayNumber and practice required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull recent context
    let recentMoodLine = "";
    let streakLine = "";
    if (user) {
      const [{ data: moods }, { data: completions }] = await Promise.all([
        userClient.from("mood_entries")
          .select("emotion_primary, energy, focus, note, created_at")
          .order("created_at", { ascending: false })
          .limit(3),
        userClient.from("ritual_completions")
          .select("ritual_id, completed_at")
          .order("completed_at", { ascending: false })
          .limit(7),
      ]);

      if (moods && moods.length > 0) {
        const m = moods[0];
        recentMoodLine = `Latest mood: ${m.emotion_primary}` +
          (m.energy != null ? `, energy ${m.energy}/10` : "") +
          (m.focus != null ? `, focus ${m.focus}/10` : "") +
          (m.note ? `. Note: "${String(m.note).slice(0, 120)}"` : "") + ".";
      }
      const dayCompletes = (completions ?? []).filter((c) => c.ritual_id?.startsWith("day-"));
      if (dayCompletes.length > 0) {
        streakLine = `They've completed ${dayCompletes.length} day(s) in the past week.`;
      }
    }

    const systemPrompt = `You are a warm, wise meditation coach for the Willow Vibes app. Generate a single 1-2 sentence personalized framing for today's practice. Be specific, warm, and gently invitational. Never say "I" or "as an AI". Never give medical advice. Speak directly to the user (use "you"). End on a hopeful, grounded note. Maximum 220 characters.`;

    const userPrompt = `Today is Day ${body.dayNumber} of a 30-day program. The practice is "${body.practice}". The focus is "${body.focus}". ${recentMoodLine} ${streakLine}\n\nWrite the personalized framing now.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited" }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const framing = data.choices?.[0]?.message?.content?.trim()
      ?? `Today's ${body.practice.toLowerCase()} is well-timed. Trust your breath — it knows the way home.`;

    return new Response(JSON.stringify({ framing }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("daily-day-framing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
