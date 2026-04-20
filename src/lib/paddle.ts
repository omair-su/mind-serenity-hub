import { supabase } from "@/integrations/supabase/client";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

declare global {
  interface Window {
    Paddle: any;
  }
}

let paddleInitialized = false;
let paddleInitPromise: Promise<void> | null = null;

export function getPaddleEnvironment(): "sandbox" | "live" {
  return clientToken?.startsWith("test_") ? "sandbox" : "live";
}

export async function initializePaddle(): Promise<void> {
  if (paddleInitialized) return;
  if (paddleInitPromise) return paddleInitPromise;

  if (!clientToken) {
    throw new Error("Payments are not configured (missing client token)");
  }

  paddleInitPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-paddle="true"]');
    if (existing) {
      existing.addEventListener("load", () => initFromWindow(resolve, reject));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.dataset.paddle = "true";
    script.onload = () => initFromWindow(resolve, reject);
    script.onerror = () => reject(new Error("Failed to load Paddle.js"));
    document.head.appendChild(script);
  });

  return paddleInitPromise;
}

function initFromWindow(resolve: () => void, reject: (e: Error) => void) {
  try {
    const env = clientToken!.startsWith("test_") ? "sandbox" : "production";
    window.Paddle.Environment.set(env);
    window.Paddle.Initialize({ token: clientToken });
    paddleInitialized = true;
    resolve();
  } catch (e) {
    reject(e as Error);
  }
}

const priceIdCache = new Map<string, string>();

export async function getPaddlePriceId(priceId: string): Promise<string> {
  if (priceIdCache.has(priceId)) return priceIdCache.get(priceId)!;

  const environment = getPaddleEnvironment();
  const { data, error } = await supabase.functions.invoke("get-paddle-price", {
    body: { priceId, environment },
  });
  if (error || !data?.paddleId) {
    throw new Error(`Failed to resolve price: ${priceId}`);
  }
  priceIdCache.set(priceId, data.paddleId);
  return data.paddleId;
}
