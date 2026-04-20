// Real pedometer using DeviceMotionEvent accelerometer.
// Falls back to a steady cadence estimator on desktop / permission denied.
import { useEffect, useRef, useState, useCallback } from "react";

interface PedometerState {
  steps: number;
  cadence: number; // steps per minute (rolling)
  isReal: boolean; // true if using device motion
  permissionState: "granted" | "denied" | "prompt" | "unsupported";
}

interface UsePedometerOptions {
  active: boolean;
  fallbackCadence?: number; // steps/min for fallback (default 110)
}

const STEP_THRESHOLD = 11; // m/s^2 magnitude delta — calibrated for typical walking
const MIN_STEP_INTERVAL_MS = 280; // debounce ~ 215 spm cap

export function usePedometer({ active, fallbackCadence = 110 }: UsePedometerOptions): PedometerState & {
  requestPermission: () => Promise<void>;
  reset: () => void;
} {
  const [steps, setSteps] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [isReal, setIsReal] = useState(false);
  const [permissionState, setPermissionState] = useState<PedometerState["permissionState"]>("prompt");

  const lastStepAtRef = useRef(0);
  const lastMagRef = useRef(9.81);
  const stepTimesRef = useRef<number[]>([]);
  const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handlerRef = useRef<((e: DeviceMotionEvent) => void) | null>(null);

  const handleMotion = useCallback((e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const delta = Math.abs(mag - lastMagRef.current);
    lastMagRef.current = mag;
    const now = Date.now();
    if (delta > STEP_THRESHOLD && now - lastStepAtRef.current > MIN_STEP_INTERVAL_MS) {
      lastStepAtRef.current = now;
      setSteps((s) => s + 1);
      stepTimesRef.current.push(now);
      // Keep a rolling 30s window for cadence
      const cutoff = now - 30000;
      stepTimesRef.current = stepTimesRef.current.filter((t) => t > cutoff);
      if (stepTimesRef.current.length >= 3) {
        const span = (now - stepTimesRef.current[0]) / 1000;
        if (span > 0) setCadence(Math.round((stepTimesRef.current.length / span) * 60));
      }
    }
  }, []);

  const requestPermission = useCallback(async () => {
    // iOS 13+ requires explicit permission
    const DM = (window as unknown as {
      DeviceMotionEvent?: { requestPermission?: () => Promise<"granted" | "denied"> };
    }).DeviceMotionEvent;
    if (!DM) {
      setPermissionState("unsupported");
      return;
    }
    if (typeof DM.requestPermission === "function") {
      try {
        const res = await DM.requestPermission();
        setPermissionState(res === "granted" ? "granted" : "denied");
      } catch {
        setPermissionState("denied");
      }
    } else {
      // Android & desktop — assume granted; will simply not fire on desktop
      setPermissionState("granted");
    }
  }, []);

  const startFallback = useCallback(() => {
    if (fallbackIntervalRef.current) return;
    setCadence(fallbackCadence);
    const intervalMs = (60 / fallbackCadence) * 1000;
    fallbackIntervalRef.current = setInterval(() => {
      setSteps((s) => s + 1);
    }, intervalMs);
  }, [fallbackCadence]);

  const stopFallback = useCallback(() => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setSteps(0);
    setCadence(0);
    stepTimesRef.current = [];
    lastStepAtRef.current = 0;
  }, []);

  useEffect(() => {
    if (!active) {
      if (handlerRef.current) {
        window.removeEventListener("devicemotion", handlerRef.current);
        handlerRef.current = null;
      }
      stopFallback();
      return;
    }

    const supported = typeof window !== "undefined" && "DeviceMotionEvent" in window;
    if (supported && permissionState === "granted") {
      handlerRef.current = handleMotion;
      window.addEventListener("devicemotion", handleMotion);
      setIsReal(true);

      // If after 4s no motion detected (desktop), fall back
      const probe = setTimeout(() => {
        if (stepTimesRef.current.length === 0) {
          setIsReal(false);
          startFallback();
        }
      }, 4000);
      return () => {
        clearTimeout(probe);
        if (handlerRef.current) {
          window.removeEventListener("devicemotion", handlerRef.current);
          handlerRef.current = null;
        }
        stopFallback();
      };
    }

    // No permission yet, or unsupported — fallback immediately
    setIsReal(false);
    startFallback();
    return () => stopFallback();
  }, [active, permissionState, handleMotion, startFallback, stopFallback]);

  return { steps, cadence, isReal, permissionState, requestPermission, reset };
}
