// Cloud-synced profile hook.
// Loads the row from `profiles` for the signed-in user, falls back to localStorage
// when offline / signed-out, and writes through to both layers on update.
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getProfile as getLocalProfile, saveProfile as saveLocalProfile, UserProfile } from "@/lib/userStore";

export interface CloudProfile extends UserProfile {
  avatarUrl?: string | null;
  authEmail?: string | null;
  userId?: string | null;
}

type NotificationPrefs = {
  daily_streak: boolean;
  weekly_recap: boolean;
  browser_push: boolean;
  email_reminders: boolean;
  marketing: boolean;
};

const DEFAULT_NOTIF_PREFS: NotificationPrefs = {
  daily_streak: true,
  weekly_recap: true,
  browser_push: false,
  email_reminders: false,
  marketing: false,
};

export function useProfile() {
  const [profile, setProfile] = useState<CloudProfile>(() => ({ ...getLocalProfile() }));
  const [loading, setLoading] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIF_PREFS);
  const userIdRef = useRef<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  const loadFromCloud = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        userIdRef.current = null;
        setLoading(false);
        return;
      }
      userIdRef.current = user.id;

      const { data } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url, goals, experience_level, timezone, preferred_voice, notification_preferences, onboarding_answers")
        .eq("user_id", user.id)
        .maybeSingle();

      const local = getLocalProfile();
      const merged: CloudProfile = {
        ...local,
        userId: user.id,
        authEmail: user.email ?? null,
        name: (data?.display_name as string) || local.name || (user.user_metadata?.full_name as string) || "",
        email: (data?.email as string) || user.email || local.email || "",
        avatarUrl: (data?.avatar_url as string) || null,
        goals: Array.isArray(data?.goals) ? (data!.goals as string[]) : local.goals,
        experience: ((data?.experience_level as UserProfile["experience"]) || local.experience),
      };
      setProfile(merged);
      saveLocalProfile(merged);

      const prefs = (data?.notification_preferences as Partial<NotificationPrefs>) || {};
      setNotifPrefs({ ...DEFAULT_NOTIF_PREFS, ...prefs });
    } catch (err) {
      console.warn("[useProfile] cloud load failed, using local", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromCloud();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadFromCloud());
    return () => sub.subscription.unsubscribe();
  }, [loadFromCloud]);

  const update = useCallback((partial: Partial<CloudProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial };
      saveLocalProfile(next);
      // Debounced cloud write
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(async () => {
        const uid = userIdRef.current;
        if (!uid) return;
        await supabase.from("profiles").update({
          display_name: next.name,
          avatar_url: next.avatarUrl ?? null,
          goals: next.goals,
          experience_level: next.experience,
        }).eq("user_id", uid);
      }, 600);
      return next;
    });
  }, []);

  const updateNotifPrefs = useCallback(async (partial: Partial<NotificationPrefs>) => {
    const next = { ...notifPrefs, ...partial };
    setNotifPrefs(next);
    const uid = userIdRef.current;
    if (!uid) return;
    await supabase.from("profiles").update({ notification_preferences: next }).eq("user_id", uid);
  }, [notifPrefs]);

  return { profile, loading, update, notifPrefs, updateNotifPrefs, reload: loadFromCloud };
}
