// Personalized recommendations for the home feed.
// Uses Lovable AI Gateway (no API key needed from user).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReqBody {
  goals?: string[];
  experience?: string;
  recentTracks?: { title: string; category: string; liked?: boolean }[];
  completedDays?: number;
  recentMood?: number; // 1-10, optional
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
}

interface Recommendation {
  label: string;
  reason: string;
  path: string;
  emoji: string;
  category: "sleep" | "focus" | "stress" | "course" | "breath" | "sound";
}

const VALID_PATHS: Record<Recommendation["category"], string> = {
  sleep: "/app/sleep",
  focus: "/app/focus",
  stress: "/app/sos",
  course: "/day/1",
  breath: "/app/breathing",
  sound: "/app/sound-bath",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Require authenticated user — prevents AI credit drain via anonymous calls
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: ReqBody = await req.json().catch(() => ({}));

    const systemPrompt = `You are a meditation coach for the Willow Vibes app. Generate exactly 3 highly personalized session recommendations for this user.

Return ONLY a JSON object with this exact shape:
{
  "recommendations": [
    { "label": "...", "reason": "...", "category": "sleep|focus|stress|course|breath|sound", "emoji": "..." }
  ]
}

Rules:
- "label" is a short, action-oriented title (max 5 words). e.g. "Wind-down for tonight"
- "reason" is 1 sentence (max 12 words) referencing user data. e.g. "Because you set a sleep goal"
- "category" must be one of: sleep, focus, stress, course, breath, sound
- "emoji" is a single emoji that matches the recommendation
- Each of the 3 recommendations must use a DIFFERENT category
- Match the time of day when sensible (sleep at night, focus in morning/afternoon)`;

    const userPrompt = `User context:
- Goals: ${(body.goals ?? []).join(", ") || "none specified"}
- Experience: ${body.experience ?? "beginner"}
- Days completed in 30-day program: ${body.completedDays ?? 0}
- Time of day: ${body.timeOfDay ?? "unknown"}
- Recent mood (1-10): ${body.recentMood ?? "unknown"}
- Recently played: ${
      (body.recentTracks ?? [])
        .slice(0, 5)
        .map((t) => `"${t.title}" (${t.category})${t.liked ? " ❤️" : ""}`)
        .join("; ") || "nothing yet"
    }`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI error", aiRes.status, txt);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const raw = aiJson.choices?.[0]?.message?.content ?? "{}";
    let parsed: { recommendations: Omit<Recommendation, "path">[] } = { recommendations: [] };
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Failed to parse AI JSON", raw);
    }

    const recommendations: Recommendation[] = (parsed.recommendations ?? [])
      .slice(0, 3)
      .map((r) => ({
        label: String(r.label ?? "").slice(0, 60),
        reason: String(r.reason ?? "").slice(0, 100),
        emoji: String(r.emoji ?? "✨").slice(0, 4),
        category: (VALID_PATHS[r.category as Recommendation["category"]]
          ? r.category
          : "course") as Recommendation["category"],
        path: VALID_PATHS[r.category as Recommendation["category"]] ?? "/day/1",
      }));

    return new Response(JSON.stringify({ recommendations }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("personalize-feed error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
