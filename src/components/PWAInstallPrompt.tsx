// Strong PWA install prompt that fires after the user has been around 3+ days.
// Captures the browser's `beforeinstallprompt` event and surfaces a branded
// modal instead of waiting for the user to discover the install affordance.
import { useEffect, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
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
  const [iosMode, setIosMode] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios|opr\//.test(ua);
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(ua);
    let manualTimer: number | null = null;

    const canOpenPrompt = () => {
      const dismissed = Number(localStorage.getItem(DISMISSED_KEY) || "0");
      const daysSinceDismiss = (Date.now() - dismissed) / (24 * 60 * 60 * 1000);
      return dismissed === 0 || daysSinceDismiss >= DISMISS_COOLDOWN_DAYS;
    };

    if (isIOS && isSafari) {
      setIosMode(true);
      if (canOpenPrompt()) {
        setOpen(true);
      }
    }

    ensureFirstLaunchStamp();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setManualMode(false);
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

    if (!isIOS && isMobile) {
      manualTimer = window.setTimeout(() => {
        if (!deferred && canOpenPrompt()) {
          setManualMode(true);
          setOpen(true);
        }
      }, 1800);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (manualTimer) window.clearTimeout(manualTimer);
    };
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

  if (!open || (!deferred && !iosMode && !manualMode)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto rounded-2xl border border-border bg-card shadow-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          {iosMode ? <Smartphone className="w-5 h-5" /> : <Download className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">Install Willow Vibes</h3>
          {iosMode ? (
            <>
              <p className="text-xs text-muted-foreground mt-0.5">
                On iPhone, tap <span className="inline-flex items-center gap-1 font-medium text-foreground"><Share2 className="w-3 h-3" /> Share</span> then choose <span className="font-medium text-foreground">Add to Home Screen</span>.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs h-8">Got it</Button>
              </div>
            </>
          ) : manualMode && !deferred ? (
            <>
              <p className="text-xs text-muted-foreground mt-0.5">
                If your browser does not show the popup, open the browser menu and choose <span className="font-medium text-foreground">Install app</span> or <span className="font-medium text-foreground">Add to Home screen</span>.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs h-8">Got it</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add to your home screen for offline sessions, lockscreen controls, and a smoother experience.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={onInstall} className="text-xs h-8">Install app</Button>
                <Button size="sm" variant="ghost" onClick={onDismiss} className="text-xs h-8">Later</Button>
              </div>
            </>
          )}
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
