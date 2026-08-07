// Willow Coach voice replies — streams Lovable AI text-to-speech audio.
// Premium-only to control spend. Free users fall back to browser TTS.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Matches the "Sarah" brand voice — warm, calming, on-brand for coaching.
const COACH_VOICE = "sage";
const TTS_MODEL = "openai/gpt-4o-mini-tts";
const TTS_ENDPOINT = "https://ai.gateway.lovable.dev/v1/audio/speech";
const MAX_CHARS = 1500;


function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/[•✦]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {

      return new Response(JSON.stringify({ error: "TTS_NOT_CONFIGURED" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const auth = createClient(SUPABASE_URL, ANON_KEY);
    const { data: userData } = await auth.auth.getUser(token);
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile } = await admin
      .from("profiles").select("is_premium").eq("user_id", userData.user.id).maybeSingle();
    if (!profile?.is_premium) {
      return new Response(JSON.stringify({ error: "PREMIUM_REQUIRED" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const clean = stripMarkdown(text).slice(0, MAX_CHARS);

    const r = await fetch(TTS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: TTS_MODEL,
        input: clean,
        voice: COACH_VOICE,
        response_format: "mp3",
        speed: 1.0,
        instructions:
          "Speak like a warm, grounded wellness coach: calm, encouraging and natural, with an unhurried pace.",
      }),
    });

    if (!r.ok || !r.body) {
      const err = await r.text().catch(() => "");
      console.error("[coach-tts] gateway error", r.status, err);
      return new Response(JSON.stringify({ error: "TTS_ERROR" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(r.body, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
    });

  } catch (e) {
    console.error("[coach-tts] fatal", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
