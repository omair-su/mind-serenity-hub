// Cron-triggered: scans all users with push enabled and a reminder_time matching
// the current 5-minute window in their timezone, then sends a daily reminder push.
// Schedule from cron-job.org or Supabase scheduled functions to run every 5 minutes.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sendWebPush } from "../_shared/webpush.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getLocalHHMM(timezone: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone || "UTC",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return fmt.format(new Date()); // "HH:MM"
  } catch {
    return new Date().toISOString().slice(11, 16);
  }
}

function withinWindow(reminderTime: string, nowHHMM: string, windowMinutes: number): boolean {
  const [rh, rm] = reminderTime.split(":").map(Number);
  const [nh, nm] = nowHHMM.split(":").map(Number);
  if ([rh, rm, nh, nm].some((n) => isNaN(n))) return false;
  const reminderMin = rh * 60 + rm;
  const nowMin = nh * 60 + nm;
  const diff = Math.abs(nowMin - reminderMin);
  return diff < windowMinutes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const subject = Deno.env.get("VAPID_SUBJECT") || "mailto:support@willowvibes.com";
    if (!publicKey || !privateKey) {
      return new Response(JSON.stringify({ error: "VAPID keys not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get all profiles with browser_push enabled
    const { data: profiles, error: pErr } = await admin
      .from("profiles")
      .select("user_id, display_name, timezone, reminder_time, notification_preferences");
    if (pErr) throw pErr;

    let candidates = 0;
    let pushed = 0;
    let removed = 0;

    for (const p of profiles || []) {
      const prefs = (p.notification_preferences as { browser_push?: boolean; daily_streak?: boolean } | null) || {};
      if (!prefs.browser_push) continue;
      if (prefs.daily_streak === false) continue;

      const tz = (p.timezone as string) || "UTC";
      const reminderTime = (p.reminder_time as string) || "07:00";
      const nowLocal = getLocalHHMM(tz);
      if (!withinWindow(reminderTime, nowLocal, 5)) continue;
      candidates++;

      const { data: subs } = await admin.from("push_subscriptions").select("*").eq("user_id", p.user_id);
      if (!subs?.length) continue;

      const greeting = p.display_name ? `Hi ${p.display_name}, ` : "";
      const payload = {
        title: "Time for your Willow practice 🌿",
        body: `${greeting}take 10 minutes to breathe and reset.`,
        url: "/app",
        tag: "wv-daily-reminder",
      };

      for (const s of subs) {
        try {
          const res = await sendWebPush({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }, payload, { publicKey, privateKey, subject });
          if (res.ok) pushed++;
          else if (res.status === 404 || res.status === 410) {
            await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
            removed++;
          }
        } catch (e) {
          console.warn("[send-daily-reminders] push error", e);
        }
      }
    }

    return new Response(JSON.stringify({ candidates, pushed, removed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[send-daily-reminders] fatal", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
