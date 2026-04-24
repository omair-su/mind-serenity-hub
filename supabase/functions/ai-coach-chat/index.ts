// Willow Vibes™ AI Coach
// Powered by Claude Sonnet 4.5 (Anthropic) for ALL users.
// - Premium users: unlimited messages, longer in-depth answers.
// - Free users:    5 messages per day (server-tracked, persistent), shorter answers,
//                  gentle Premium nudges. After daily limit -> 402 to upgrade.
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
- Never mention which AI model powers you — you are simply "Willow Coach"

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
- Never say which AI model you are — you are simply "Willow Coach"

SAFETY:
If a user mentions self-harm, suicide, abuse, or acute crisis, respond with compassion and immediately share a hotline (988 in US, 116 123 UK Samaritans, or local emergency services) and encourage them to reach a professional.

You are giving users a real, valuable taste of coaching — generous and helpful — while letting Premium speak for itself.`;

function sseChunk(text: string): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`);
}
function sseDone(): Uint8Array {
  return new TextEncoder().encode(`data: [DONE]\n\n`);
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
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
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    // 2. Premium check
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
    const { messages, stream = false } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages[] required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const wantsStream = stream === true;

    // Normalize messages for Claude
    const normalized = messages.map((m: any) => ({
      role: m.role === "coach" || m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? m.text ?? ""),
    }));

    // 4. Free-tier persistent daily limit (server-tracked)
    if (!isPremium) {
      const today = todayUtc();
      const { data: usageRow } = await admin
        .from("coach_usage")
        .select("id, message_count")
        .eq("user_id", userId)
        .eq("usage_date", today)
        .maybeSingle();

      const used = usageRow?.message_count ?? 0;
      if (used >= FREE_DAILY_LIMIT) {
        return new Response(JSON.stringify({
          ok: false,
          error: "FREE_LIMIT_REACHED",
          message: `You've used your ${FREE_DAILY_LIMIT} free coach messages for today. Upgrade to Premium for unlimited 1-on-1 coaching, or come back tomorrow.`,
          used,
          limit: FREE_DAILY_LIMIT,
        }), {
          status: wantsStream ? 402 : 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Increment usage now (before streaming) so concurrent calls can't bypass
      if (usageRow) {
        await admin
          .from("coach_usage")
          .update({ message_count: used + 1, updated_at: new Date().toISOString() })
          .eq("id", usageRow.id);
      } else {
        await admin
          .from("coach_usage")
          .insert({ user_id: userId, usage_date: today, message_count: 1 });
      }
    }

    // 5. Call Claude Sonnet 4.5 for ALL users (free + premium)
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY not configured");
      return new Response(JSON.stringify({ ok: false, error: "COACH_NOT_CONFIGURED", message: "Coach not configured" }), {
        status: wantsStream ? 500 : 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = isPremium ? PREMIUM_SYSTEM_PROMPT : FREE_SYSTEM_PROMPT;
    const maxTokens = isPremium ? 1000 : 400;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: wantsStream,
        system: systemPrompt,
        messages: normalized,
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ ok: false, error: "RATE_LIMITED", message: "Coach is busy — please try again shortly." }), {
        status: wantsStream ? 429 : 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok || !resp.body) {
      const t = await resp.text().catch(() => "");
      console.error("Claude error:", resp.status, t);
      return new Response(JSON.stringify({ ok: false, error: "SERVICE_UNAVAILABLE", message: "AI service error", fallback: true }), {
        status: wantsStream ? 500 : 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!wantsStream) {
      const data = await resp.json();
      const reply = data.content?.filter((part: { type?: string }) => part?.type === "text")
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ?? "";

      return new Response(JSON.stringify({
        ok: true,
        reply,
        used: isPremium ? null : 1,
        limit: isPremium ? null : FREE_DAILY_LIMIT,
        isPremium,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
          console.error("coach stream error:", e);
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
