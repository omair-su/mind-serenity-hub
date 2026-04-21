import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startReminderScheduler } from "./lib/notifications";
import { registerServiceWorker } from "./lib/webPush";

createRoot(document.getElementById("root")!).render(<App />);

// Schedule local daily reminder notifications when permission is granted (in-app fallback)
startReminderScheduler();

// Register service worker for background web push
registerServiceWorker();
