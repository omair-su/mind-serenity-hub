import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { startReminderScheduler } from "./lib/notifications";

createRoot(document.getElementById("root")!).render(<App />);

// Schedule local daily reminder notifications when permission is granted
startReminderScheduler();
