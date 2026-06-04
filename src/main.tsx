import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { restoreSessionFromBackup, startSessionBackupMirror } from "./lib/authPersistence";

// Restore any auth session backup BEFORE mounting React so route guards see
// the authenticated user on the very first render. This keeps installed
// Android/PWA users signed in across relaunches even if the WebView's
// localStorage was cleared.
const boot = async () => {
  try {
    await restoreSessionFromBackup();
  } catch {
    /* never block boot */
  }
  startSessionBackupMirror();
  createRoot(document.getElementById("root")!).render(<App />);
};

boot();

// Defer non-critical bootstrap (reminder scheduler + service-worker registration)
// until the browser is idle so they don't extend the main-thread long task that
// drives Max Potential FID. Behavior is unchanged — same modules, just later.
const bootDeferred = () => {
  import("./lib/notifications").then((m) => m.startReminderScheduler?.());
  import("./lib/webPush").then((m) => m.registerServiceWorker?.());
};
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};
const w = window as IdleWindow;
if (typeof w.requestIdleCallback === "function") {
  w.requestIdleCallback(bootDeferred, { timeout: 4000 });
} else {
  setTimeout(bootDeferred, 2500);
}
