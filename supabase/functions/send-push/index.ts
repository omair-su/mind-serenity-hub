// Sends a web push to the authenticated caller's devices. Used for testing
// and for in-app triggers (e.g. "send me a sample notification").
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sendWebPush } from "../_shared/webpush.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json().catch(() => ({}));
    const payload = {
      title: body.title || "Willow Vibes 🌿",
      body: body.body || "Your gentle reminder to breathe.",
      url: body.url || "/app",
      tag: body.tag || "wv-test",
    };

    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const subject = Deno.env.get("VAPID_SUBJECT") || "mailto:support@willowvibes.com";
    if (!publicKey || !privateKey) {
      return new Response(JSON.stringify({ error: "VAPID keys not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: subs } = await admin.from("push_subscriptions").select("*").eq("user_id", user.id);
    if (!subs?.length) return new Response(JSON.stringify({ sent: 0, message: "No subscriptions" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let sent = 0;
    for (const s of subs) {
      try {
        const res = await sendWebPush({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }, payload, { publicKey, privateKey, subject });
        if (res.ok) sent++;
        else if (res.status === 404 || res.status === 410) {
          await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
        }
      } catch (e) {
        console.warn("[send-push] error", e);
      }
    }

    return new Response(JSON.stringify({ sent, total: subs.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[send-push] fatal", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
