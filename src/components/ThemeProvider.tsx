import { useEffect } from "react";
import { getProfile } from "@/lib/userStore";

export function useApplySettings() {
  useEffect(() => {
    const apply = () => {
      const profile = getProfile();

      // Theme
      const root = document.documentElement;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = profile.theme === "dark" || (profile.theme === "auto" && prefersDark);
      root.classList.toggle("dark", isDark);

      // Font size
      const sizeMap = { small: "14px", medium: "16px", large: "18px" } as const;
      root.style.fontSize = sizeMap[profile.fontSize] || "16px";

      // Reduce motion
      root.classList.toggle("reduce-motion", profile.reduceMotion);
    };

    apply();

    // Listen for storage changes (settings updated from another tab or same-tab save)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wv-profile") apply();
    };
    window.addEventListener("storage", onStorage);

    // Listen for custom event dispatched when profile is saved
    window.addEventListener("wv-settings-changed", apply);

    // Auto theme listener
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wv-settings-changed", apply);
      mq.removeEventListener("change", apply);
    };
  }, []);
}
