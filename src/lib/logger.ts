// Central client logger. Swap in Sentry/PostHog here later without
// touching call sites. For now: dev = console; prod = silent + buffer
// so we can flip on remote reporting in one place.

type LogLevel = "error" | "warn" | "info";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: unknown;
  at: number;
}

const buffer: LogEntry[] = [];
const MAX = 50;

function push(level: LogLevel, message: string, context?: unknown) {
  const entry: LogEntry = { level, message, context, at: Date.now() };
  buffer.push(entry);
  if (buffer.length > MAX) buffer.shift();
  if (import.meta.env.DEV) {
    const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
    fn(`[wv] ${message}`, context ?? "");
  }
  // TODO: forward to Sentry / PostHog when configured.
}

export const logger = {
  error: (message: string, context?: unknown) => push("error", message, context),
  warn: (message: string, context?: unknown) => push("warn", message, context),
  info: (message: string, context?: unknown) => push("info", message, context),
  recent: () => buffer.slice(),
};
