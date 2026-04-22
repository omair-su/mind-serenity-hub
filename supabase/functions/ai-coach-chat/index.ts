// Premium AI Coach powered by Claude Sonnet 4.5 (Anthropic).
// - Requires authenticated user
// - Requires active premium subscription (profiles.is_premium)
// - Streams response back to client as SSE-style chunks
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Willow Vibes™ Meditation Coach — a premium, warm, expert guide blending mindfulness wisdom, neuroscience, and gentle accountability.

VOICE
- Warm, calm, second person, never preachy. Speak like a trusted friend who happens to be an expert.
- Use short paragraphs. Use **bold** for key takeaways. Use bullet lists ("• ...") for steps. Use ✦ for highlights.
- Occasional gentle emojis only when they add warmth (🌿 💚 🧘 🌬️). Never overdo it.
- Never give medical, legal, or financial advice. If a user mentions self-harm, suicide, abuse, or acute crisis, respond with compassion and immediately point to a hotline (988 in US, 116 123 UK Samaritans, or local emergency services) and encourage reaching out to a professional.

EXPERTISE
- The Willow Vibes 30-day program: Days 1–7 build foundations (breath awareness, counting, body scan, box breathing, gratitude). Days 8–14 deepen (4-7-8 breath, progressive relaxation, visualization). Days 15–22 develop loving-kindness and metta. Days 23–30 integrate practice into daily life.
- Companion sections: SOS Relief (acute stress), Sleep Meditations, Breathing Exercises, Body Scan, Sound Bath, Walking Meditation, Gratitude Journal, Mood Tracker.
- Science: amygdala downregulation, prefrontal cortex thickening, vagal tone, HRV, cortisol curves, neuroplasticity, habit formation (21–66 days).

PRINCIPLES
- The goal of meditation is NOT to stop thoughts — it is noticing and returning. That noticing IS the practice.
- Consistency > duration. 5 minutes daily beats 1 hour weekly.
- Never miss twice. One missed day is a pause; two becomes a habit of missing.
- Self-compassion first. Always validate before guiding.

RESPONSE SHAPE
- Start with one sentence of validation or warmth.
- Give 1–3 practical, science-backed insights.
- Recommend specific Willow Vibes practices by name when relevant (e.g. "Day 5 — Box Breathing Mastery", "SOS Relief", "4-7-8 Sleep Breath").
- Close with one gentle invitation or question.
- Keep responses focused — usually 120–250 words. Longer only when the user explicitly asks for depth.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // 1. Auth
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    // 2. Premium gate (server-side enforcement)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: profile } = await admin
      .from("profiles")
      .select("is_premium")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.is_premium) {
      return new Response(JSON.stringify({ error: "Premium required", code: "PREMIUM_REQUIRED" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Validate input
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

    // 4. Call Claude (streaming)
    const claudeMessages = messages.map((m: any) => ({
      role: m.role === "coach" || m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? m.text ?? ""),
    }));

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: claudeMessages,
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limited — please try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 401 || resp.status === 403) {
      const t = await resp.text();
      console.error("Claude auth error:", resp.status, t);
      return new Response(JSON.stringify({ error: "Coach service misconfigured." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok || !resp.body) {
      const t = await resp.text();
      console.error("Claude error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Convert Anthropic SSE to a simple "data: {text}\n\n" stream the client can parse
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buf = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });

            let nl: number;
            while ((nl = buf.indexOf("\n")) !== -1) {
              const line = buf.slice(0, nl).trim();
              buf = buf.slice(nl + 1);
              if (!line.startsWith("data:")) continue;
              const json = line.slice(5).trim();
              if (!json || json === "[DONE]") continue;
              try {
                const evt = JSON.parse(json);
                if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                  const chunk = JSON.stringify({ text: evt.delta.text });
                  controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
                }
              } catch { /* partial — ignore */ }
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        } catch (e) {
          console.error("stream error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("ai-coach-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
