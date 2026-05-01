// Floating live theme toggle — light/dark switch with instant preview.
// Persists to user profile and dispatches `wv-settings-changed` so
// `useApplySettings` re-applies tokens to <html> across the app.
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { getProfile, saveProfile } from "@/lib/userStore";

type Mode = "light" | "dark";

function resolveCurrent(): Mode {
  const p = getProfile();
  if (p.theme === "light" || p.theme === "dark") return p.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    setMode(resolveCurrent());
    const sync = () => setMode(resolveCurrent());
    window.addEventListener("wv-settings-changed", sync);
    return () => window.removeEventListener("wv-settings-changed", sync);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "light" ? "dark" : "light";
    setMode(next);
    const p = getProfile();
    saveProfile({ ...p, theme: next });
  };

  const isDark = mode === "dark";

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Calm palette · ${isDark ? "Dark" : "Light"} mode`}
      className="fixed z-[60] right-4 bottom-24 lg:bottom-6 lg:right-6
                 h-12 w-[88px] rounded-full
                 bg-card/95 backdrop-blur-md
                 border border-border
                 shadow-[var(--shadow-card-val)]
                 flex items-center px-1.5
                 hover:shadow-[var(--shadow-elevated-val)] transition-shadow"
    >
      {/* Track icons */}
      <span className="absolute left-3 text-[hsl(var(--gold))]">
        <Sun className="w-4 h-4" />
      </span>
      <span className="absolute right-3 text-[hsl(var(--primary))]">
        <Moon className="w-4 h-4" />
      </span>
      {/* Knob */}
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`relative z-10 h-9 w-9 rounded-full
                    flex items-center justify-center
                    bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--sage-dark))]
                    text-white shadow-[var(--shadow-gold-val)]
                    ${isDark ? "ml-auto" : ""}`}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </motion.span>
    </motion.button>
  );
}
