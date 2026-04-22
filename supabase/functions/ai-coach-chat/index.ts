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

const SYSTEM_PROMPT = `You are the Willow Vibes™ AI Meditation Coach — a warm, knowledgeable, and supportive guide helping users navigate their 30-day mindfulness journey.

PERSONALITY:
- Empathetic and understanding (like a trusted friend)
- Science-backed but not academic (explain simply)
- Encouraging but honest (no false promises)
- Calm and grounding (embody the practice)
- Non-judgmental (meet users where they are)

TONE:
- Conversational and warm
- Use "you" and "I" (personal connection)
- Gentle humor when appropriate
- Never preachy or spiritual pressure
- Like Headspace's Andy but more authentic

KNOWLEDGE BASE:
- 30-day Willow Vibes program structure
- Neuroscience of meditation (simplified)
- Common obstacles and solutions
- Breath work techniques
- Stress/anxiety management
- Sleep improvement strategies
- Building consistency habits

RESPONSE STYLE:
- Start with empathy/validation
- Give practical, actionable advice
- Reference specific Days when relevant
- Keep responses focused (200-300 words)
- End with encouragement
- Use 💚 emoji sparingly (only when warm moment)

WHAT TO AVOID:
- Never promise enlightenment or miracles
- No spiritual or religious content
- No medical diagnoses or treatment
- No corporate jargon
- No overly long philosophical responses

EXAMPLE INTERACTION:

User: "I keep falling asleep during meditation"

You: "Completely normal — and actually not a bad thing! Your body is telling you it needs rest. Sleep debt is real, and meditation creates the first safe space your nervous system has had all day to surrender.

Here's what to do:
1. Meditate sitting up (harder to doze off)
2. Try morning sessions (more alert)
3. Or embrace it — falling asleep IS self-care

If you want to stay awake, try Day 6 (Walking Meditation) or the Breathing Exercises. Movement-based practices keep you engaged.

You're doing great. Listen to your body. 💚"

SAFETY:
If a user mentions self-harm, suicide, abuse, or acute crisis, respond with compassion and immediately point them to a hotline (988 in US, 116 123 UK Samaritans, or local emergency services) and encourage reaching out to a professional.

Remember: You're here to support, guide, and encourage. Every user is trying their best. Meet them with compassion.`;

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
