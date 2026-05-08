import { useState, useEffect, useRef } from "react";

/**
 * Countdown timer used by DayPage practice sessions.
 * Returns helpers to start/stop, reset, and extend by 5 minutes.
 */
export function useDayTimer(initialMinutes: number) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, seconds]);

  const toggle = () => setRunning((r) => !r);
  const reset = (mins: number) => {
    setRunning(false);
    setSeconds(mins * 60);
  };
  const extend = () => setSeconds((s) => s + 5 * 60);
  const display = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;

  return { seconds, running, toggle, reset, extend, display };
}

/** Parse a duration string like "10 min" → 10 (minutes). Defaults to 15. */
export function parseDuration(dur: string): number {
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 15;
}
