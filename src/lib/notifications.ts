// Local daily reminder notifications.
// Schedules a single timer that fires at the user's chosen `reminderTime` (HH:MM),
// shows a Notification when fired, then re-arms for the next day.
// Works while the app/PWA is open. Cross-device push notifications would require
// a separate push subscription service (out of scope for this iteration).
import { supabase } from "@/integrations/supabase/client";

let timeoutId: number | null = null;
let watcherStarted = false;

interface Schedule {
  enabled: boolean;
  reminderTime: string; // "HH:MM"
  userName?: string;
}

function msUntilNext(reminderTime: string): number {
  const [hh, mm] = reminderTime.split(":").map(Number);
  if (isNaN(hh) || isNaN(mm)) return 24 * 60 * 60 * 1000;
  const now = new Date();
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

function fireNotification(name?: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const greeting = name ? `Hi ${name}, ` : "";
    new Notification("Time for your Willow practice 🌿", {
      body: `${greeting}take 10 minutes to breathe and reset.`,
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "wv-daily-reminder",
    });
  } catch (err) {
    console.warn("[notifications] fire failed", err);
  }
}

function clear() {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function schedule({ enabled, reminderTime, userName }: Schedule) {
  clear();
  if (!enabled) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const wait = msUntilNext(reminderTime);
  timeoutId = window.setTimeout(() => {
    fireNotification(userName);
    // Re-arm for the next day
    schedule({ enabled, reminderTime, userName });
  }, wait);
}

async function loadAndSchedule() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      clear();
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("display_name, notification_preferences")
      .eq("user_id", user.id)
      .maybeSingle();

    const prefs = (data?.notification_preferences as { browser_push?: boolean; daily_streak?: boolean } | null) || {};
    const enabled = !!(prefs.browser_push && prefs.daily_streak !== false);
    // Reminder time is stored only locally in profile (UserProfile.reminderTime)
    let reminderTime = "07:00";
    try {
      const local = JSON.parse(localStorage.getItem("wv-profile") || "{}");
      if (typeof local.reminderTime === "string") reminderTime = local.reminderTime;
    } catch {}

    schedule({ enabled, reminderTime, userName: (data?.display_name as string) || undefined });
  } catch (err) {
    console.warn("[notifications] load failed", err);
  }
}

/** Start the reminder scheduler. Safe to call multiple times. */
export function startReminderScheduler() {
  if (watcherStarted) return;
  watcherStarted = true;

  loadAndSchedule();

  // Re-evaluate when the user updates their settings, signs in/out, or the tab regains focus
  window.addEventListener("wv-settings-changed", loadAndSchedule);
  window.addEventListener("focus", loadAndSchedule);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") loadAndSchedule();
  });
  supabase.auth.onAuthStateChange(() => loadAndSchedule());
}
