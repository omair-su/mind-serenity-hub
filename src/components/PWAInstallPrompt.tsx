// Strong PWA install prompt that fires after the user has been around 3+ days.
// Captures the browser's `beforeinstallprompt` event and surfaces a branded
// modal instead of waiting for the user to discover the install affordance.
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FIRST_LAUNCH_KEY = "wv-first-launch-at";
const DISMISSED_KEY = "wv-install-prompt-dismissed-at";
const DAYS_BEFORE_PROMPT = 0;
const DISMISS_COOLDOWN_DAYS = 3;

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function ensureFirstLaunchStamp(): number {
  const existing = Number(localStorage.getItem(FIRST_LAUNCH_KEY) || "0");
  if (existing > 0) return existing;
  const now = Date.now();
  localStorage.setItem(FIRST_LAUNCH_KEY, String(now));
  return now;
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    ensureFirstLaunchStamp();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      maybeOpen();
    };

    const maybeOpen = () => {
      const firstLaunch = Number(localStorage.getItem(FIRST_LAUNCH_KEY) || "0");
      const dismissed = Number(localStorage.getItem(DISMISSED_KEY) || "0");
      const daysSinceFirst = (Date.now() - firstLaunch) / (24 * 60 * 60 * 1000);
      const daysSinceDismiss = (Date.now() - dismissed) / (24 * 60 * 60 * 1000);
      if (daysSinceFirst >= DAYS_BEFORE_PROMPT && (dismissed === 0 || daysSinceDismiss >= DISMISS_COOLDOWN_DAYS)) {
        setOpen(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setOpen(false);
    setDeferred(null);
  };

  const onDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setOpen(false);
  };

  if (!open || !deferred) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto rounded-2xl border border-border bg-card shadow-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Install Willow Vibes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add to your home screen for offline sessions, lockscreen controls, and a smoother experience.
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onInstall} className="text-xs h-8">Install app</Button>
            <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs h-8">Later</Button>
          </div>
        </div>
        <button
          aria-label="Dismiss"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
