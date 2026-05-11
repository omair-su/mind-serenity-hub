// Geolocation + Open-Meteo weather lookup with cascading IP fallbacks.
// No API key required. Survives blocked geolocation, blocked iframes, and IP provider outages.
import { useCallback, useEffect, useState } from "react";

export interface Weather {
  tempC: number;
  code: number;
  description: string;
  isGoodForWalking: boolean;
  emoji: string;
  city?: string;
  source: "gps" | "ip";
}

const codeMap: Record<number, { desc: string; good: boolean; emoji: string }> = {
  0: { desc: "Clear skies", good: true, emoji: "☀️" },
  1: { desc: "Mostly clear", good: true, emoji: "🌤️" },
  2: { desc: "Partly cloudy", good: true, emoji: "⛅" },
  3: { desc: "Overcast", good: true, emoji: "☁️" },
  45: { desc: "Foggy", good: false, emoji: "🌫️" },
  48: { desc: "Foggy", good: false, emoji: "🌫️" },
  51: { desc: "Light drizzle", good: false, emoji: "🌦️" },
  53: { desc: "Drizzle", good: false, emoji: "🌦️" },
  55: { desc: "Heavy drizzle", good: false, emoji: "🌧️" },
  61: { desc: "Light rain", good: false, emoji: "🌧️" },
  63: { desc: "Rain", good: false, emoji: "🌧️" },
  65: { desc: "Heavy rain", good: false, emoji: "🌧️" },
  71: { desc: "Light snow", good: false, emoji: "🌨️" },
  73: { desc: "Snow", good: false, emoji: "❄️" },
  75: { desc: "Heavy snow", good: false, emoji: "❄️" },
  80: { desc: "Showers", good: false, emoji: "🌦️" },
  95: { desc: "Thunderstorm", good: false, emoji: "⛈️" },
};

const CACHE_KEY = "wv-weather-cache-v1";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

async function fetchWeatherForCoords(lat: number, lon: number, source: "gps" | "ip", city?: string): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await withTimeout(fetch(url), 7000);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = await res.json();
  const code = data?.current?.weather_code ?? 0;
  const tempC = data?.current?.temperature_2m ?? 0;
  const meta = codeMap[code] ?? { desc: "Mild", good: true, emoji: "🌍" };
  return {
    tempC: Math.round(tempC),
    code,
    description: meta.desc,
    isGoodForWalking: meta.good && tempC > 0 && tempC < 35,
    emoji: meta.emoji,
    city,
    source,
  };
}

// Cascade through several free no-key IP geolocation providers.
const IP_PROVIDERS: Array<() => Promise<{ lat: number; lon: number; city?: string } | null>> = [
  async () => {
    const r = await withTimeout(fetch("https://ipwho.is/"), 4000);
    const j = await r.json();
    if (j?.success === false || !j?.latitude) return null;
    return { lat: j.latitude, lon: j.longitude, city: j.city };
  },
  async () => {
    const r = await withTimeout(fetch("https://get.geojs.io/v1/ip/geo.json"), 4000);
    const j = await r.json();
    if (!j?.latitude) return null;
    return { lat: parseFloat(j.latitude), lon: parseFloat(j.longitude), city: j.city };
  },
  async () => {
    const r = await withTimeout(fetch("https://ipapi.co/json/"), 4000);
    const j = await r.json();
    if (!j?.latitude) return null;
    return { lat: j.latitude, lon: j.longitude, city: j.city };
  },
];

async function fetchWeatherByIP(): Promise<Weather | null> {
  for (const provider of IP_PROVIDERS) {
    try {
      const loc = await provider();
      if (!loc) continue;
      return await fetchWeatherForCoords(loc.lat, loc.lon, "ip", loc.city);
    } catch {
      // try next provider
    }
  }
  return null;
}

function readCache(): Weather | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { weather, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return weather;
  } catch { return null; }
}
function writeCache(w: Weather) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ weather: w, ts: Date.now() })); } catch { /* ignore */ }
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(() => readCache());
  const [loading, setLoading] = useState(!readCache());
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    let cancelled = false;

    const finish = (w: Weather | null, err?: string) => {
      if (cancelled) return;
      if (w) { setWeather(w); writeCache(w); setError(null); }
      else if (err) { setError(err); }
      setLoading(false);
    };

    const tryIPFallback = async () => {
      const w = await fetchWeatherByIP();
      finish(w, w ? undefined : "Weather unavailable");
    };

    // Geolocation only works in secure contexts and may be blocked in iframes.
    // We race a short timer so the widget never hangs waiting on the prompt.
    const useGeo = typeof navigator !== "undefined"
      && !!navigator.geolocation
      && typeof window !== "undefined"
      && window.isSecureContext;

    if (!useGeo) { tryIPFallback(); return () => { cancelled = true; }; }

    let settled = false;
    const fallbackTimer = setTimeout(() => {
      if (!settled) { settled = true; tryIPFallback(); }
    }, 3500);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (settled) return; settled = true; clearTimeout(fallbackTimer);
        try {
          const w = await fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude, "gps");
          finish(w);
        } catch {
          await tryIPFallback();
        }
      },
      async () => {
        if (settled) return; settled = true; clearTimeout(fallbackTimer);
        await tryIPFallback();
      },
      { timeout: 3000, maximumAge: 600000, enableHighAccuracy: false }
    );

    return () => { cancelled = true; clearTimeout(fallbackTimer); };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { weather, loading, error, retry: load };
}
