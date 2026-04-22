// Willow Vibes™ AI Coach
// - Premium users: Claude Sonnet 4.5 (Anthropic) — full depth, longer answers
// - Free users:    Lovable AI Gateway (Gemini) — shorter answers, gentle upgrade nudges,
//                  daily message limit to encourage upgrade
// Streams response back to client as SSE-style chunks: `data: {"text":"..."}\n\n`
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FREE_DAILY_LIMIT = 5; // messages per day for free users

const PREMIUM_SYSTEM_PROMPT = `You are the Willow Vibes™ AI Meditation Coach — a warm, knowledgeable, and supportive guide helping users navigate their 30-day mindfulness journey.

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

SAFETY:
If a user mentions self-harm, suicide, abuse, or acute crisis, respond with compassion and immediately point them to a hotline (988 in US, 116 123 UK Samaritans, or local emergency services) and encourage reaching out to a professional.

Remember: You're here to support, guide, and encourage. Every user is trying their best. Meet them with compassion.`;

const FREE_SYSTEM_PROMPT = `You are the Willow Vibes™ AI Meditation Coach (Free Preview) — a warm, supportive guide helping users on their 30-day mindfulness journey.

PERSONALITY:
- Empathetic, calm, grounding (like a trusted friend)
- Science-backed but simple, never academic
- Encouraging but honest — no false promises
- Non-judgmental, meet users where they are

TONE:
- Conversational and warm, use "you" and "I"
- Gentle, never preachy or spiritual pressure
- Like Headspace's Andy but more authentic

RESPONSE STYLE (FREE TIER — IMPORTANT):
- Keep responses CONCISE: 100-150 words maximum
- Start with one line of empathy/validation
- Give 2-3 practical, actionable tips (use short bullet points starting with "• ")
- Reference specific Willow Vibes Days when relevant (e.g. "Try Day 6 — Walking Meditation")
- End warmly with encouragement (occasional 💚 emoji is fine)

CONVERSION (subtle, never pushy):
- Roughly every 3rd response, end with ONE short, friendly line that hints at Premium — e.g.
  "✦ Want me to go deeper on this? Premium unlocks unlimited 1-on-1 coaching."
  "✦ Premium members get personalized daily plans — worth a peek if this resonates."
- NEVER beg, NEVER use sales language, NEVER mention price. Make it feel like a friend's tip.
- The line MUST start with "✦ " so the UI can style it.

WHAT TO AVOID:
- No medical diagnoses or treatment advice
- No religious/spiritual claims
- No miracle promises
- Never say "I am Claude" or mention which AI model you are — you are simply "Willow Coach"

SAFETY:
If a user mentions self-harm, suicide, abuse, or acute crisis, respond with compassion and immediately share a hotline (988 in US, 116 123 UK Samaritans, or local emergency services) and encourage them to reach a professional.

You are giving users a real, valuable taste of coaching — generous and helpful — while letting Premium speak for itself.`;

function sseChunk(text: string): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`);
}
function sseDone(): Uint8Array {
  return new TextEncoder().encode(`data: [DONE]\n\n`);
}

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

    // 2. Premium check (NOT a hard gate anymore — free users get a limited preview)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: profile } = await admin
      .from("profiles")
      .select("is_premium")
      .eq("user_id", userId)
      .maybeSingle();
    const isPremium = !!profile?.is_premium;

    // 3. Validate input
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normalize messages
    const normalized = messages.map((m: any) => ({
      role: m.role === "coach" || m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? m.text ?? ""),
    }));

    // 4. Free-user daily message limit (counts user-role messages sent today)
    if (!isPremium) {
      const userMsgsToday = normalized.filter((m) => m.role === "user").length;
      // We approximate "today's count" by relying on client history length;
      // for stricter enforcement we'd persist counts. This is the gentle limiter.
      if (userMsgsToday > FREE_DAILY_LIMIT) {
        return new Response(JSON.stringify({
          error: "FREE_LIMIT_REACHED",
          message: `You've used your ${FREE_DAILY_LIMIT} free coach messages for today. Upgrade to Premium for unlimited 1-on-1 coaching.`,
        }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ===== PREMIUM PATH: Claude Sonnet 4.5 =====
    if (isPremium) {
      const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
      if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          temperature: 0.7,
          stream: true,
          system: PREMIUM_SYSTEM_PROMPT,
          messages: normalized,
        }),
      });

      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!resp.ok || !resp.body) {
        const t = await resp.text();
        console.error("Claude error:", resp.status, t);
        return new Response(JSON.stringify({ error: "AI service error" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
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
                    controller.enqueue(sseChunk(evt.delta.text));
                  }
                } catch { /* partial */ }
              }
            }
            controller.enqueue(sseDone());
          } catch (e) {
            console.error("premium stream error:", e);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    // ===== FREE PATH: Lovable AI Gateway (Gemini) =====
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [
          { role: "system", content: FREE_SYSTEM_PROMPT },
          ...normalized,
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Coach is busy — please try again in a moment." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "Coach temporarily unavailable. Please try again later." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok || !resp.body) {
      const t = await resp.text();
      console.error("Lovable AI error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
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
              let line = buf.slice(0, nl);
              buf = buf.slice(nl + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (line.startsWith(":") || line.trim() === "") continue;
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const evt = JSON.parse(jsonStr);
                const content = evt.choices?.[0]?.delta?.content;
                if (content) controller.enqueue(sseChunk(content));
              } catch {
                // re-buffer partial line
                buf = line + "\n" + buf;
                break;
              }
            }
          }
          controller.enqueue(sseDone());
        } catch (e) {
          console.error("free stream error:", e);
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
