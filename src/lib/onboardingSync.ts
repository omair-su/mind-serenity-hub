// Robust local + cloud sync for onboarding answers.
// - Mirrors every step to localStorage immediately.
// - Pushes a debounced upsert to the `profiles` table so progress survives device switches.
// - Retries with exponential backoff if the network blips.
// - Emits lightweight analytics events that the rest of the app (or a future
//   analytics provider) can listen to via `window.addEventListener("wv-analytics", ...)`.

import { supabase } from "@/integrations/supabase/client";
import { getProfile, saveProfile, type UserProfile } from "@/lib/userStore";

const STEP_KEY = "wv-onboarding-step";
const COMPLETE_KEY = "wv-onboarding-complete-at";

export type OnboardingEvent =
  | { type: "onboarding_started" }
  | { type: "onboarding_step_view"; step: string; index: number }
  | { type: "onboarding_step_answered"; step: string; index: number; value?: unknown }
  | { type: "onboarding_skipped"; atStep: string; index: number }
  | { type: "onboarding_completed"; durationMs: number };

export function track(event: OnboardingEvent) {
  try {
    // Console in dev so devs can see drop-off without a provider attached.
    if (import.meta.env.DEV) console.log("[analytics]", event);
    window.dispatchEvent(new CustomEvent("wv-analytics", { detail: event }));
  } catch {
    /* never block UX on analytics */
  }
}

export function getResumeStep(totalSteps: number): number {
  try {
    const raw = localStorage.getItem(STEP_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    if (Number.isFinite(n) && n >= 0 && n < totalSteps) return n;
  } catch {}
  return 0;
}

export function setResumeStep(step: number) {
  try { localStorage.setItem(STEP_KEY, String(step)); } catch {}
}

export function clearResumeStep() {
  try { localStorage.removeItem(STEP_KEY); } catch {}
}

// Debounced upsert. Multiple rapid step changes coalesce into one network call.
let pending: ReturnType<typeof setTimeout> | null = null;
let lastError: Error | null = null;

async function pushOnce(profile: UserProfile, retries = 2): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return; // unauthed onboarding (rare) — local only is fine
  const payload = {
    user_id: auth.user.id,
    display_name: profile.name || null,
    experience_level: profile.experience,
    goals: profile.goals,
    onboarding_answers: {
      stressLevel: profile.stressLevel,
      stressManagement: profile.stressManagement,
      desiredFeeling: profile.desiredFeeling,
      preferredTime: profile.preferredTime,
      dailyMinutes: profile.dailyMinutes,
      onboardingComplete: profile.onboardingComplete,
      lastSyncedAt: new Date().toISOString(),
    },
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    lastError = error as unknown as Error;
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 600 * (3 - retries)));
      return pushOnce(profile, retries - 1);
    }
    console.warn("[onboarding-sync] upsert failed", error);
  } else {
    lastError = null;
  }
}

export function syncOnboardingAnswers(profile: UserProfile, opts: { immediate?: boolean } = {}) {
  // Always mirror local first — it must never lose data.
  saveProfile(profile);

  if (pending) clearTimeout(pending);
  const run = () => { void pushOnce(profile); };
  if (opts.immediate) run();
  else pending = setTimeout(run, 600);
}

export async function finalizeOnboarding(profile: UserProfile, startedAt: number) {
  const finished: UserProfile = { ...profile, onboardingComplete: true };
  saveProfile(finished);
  try { localStorage.setItem(COMPLETE_KEY, new Date().toISOString()); } catch {}
  clearResumeStep();
  // Force an immediate, awaited sync so the next route guard sees cloud truth.
  await pushOnce(finished, 3);
  track({ type: "onboarding_completed", durationMs: Date.now() - startedAt });
  return { synced: !lastError, error: lastError };
}

export function getProfileSafe(): UserProfile {
  return getProfile();
}
