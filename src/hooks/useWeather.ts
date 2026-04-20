// Geolocation + Open-Meteo lookup. No API key required.
import { useCallback, useEffect, useState } from "react";

export interface Weather {
  tempC: number;
  code: number;
  description: string;
  isGoodForWalking: boolean;
  emoji: string;
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

async function fetchWeatherForCoords(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
  const res = await fetch(url);
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
  };
}

// IP-based fallback (no permission needed). Used when geolocation is denied/unavailable.
async function fetchWeatherByIP(): Promise<Weather | null> {
  try {
    // Open-Meteo doesn't do IP lookup; use ipapi.co (free, no key) for coords.
    const ip = await fetch("https://ipapi.co/json/").then((r) => r.json()).catch(() => null);
    if (!ip?.latitude || !ip?.longitude) return null;
    return await fetchWeatherForCoords(ip.latitude, ip.longitude);
  } catch {
    return null;
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    let cancelled = false;

    const tryIPFallback = async () => {
      const w = await fetchWeatherByIP();
      if (cancelled) return;
      if (w) {
        setWeather(w);
        setError(null);
      } else {
        setError("Weather unavailable");
      }
      setLoading(false);
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      tryIPFallback();
      return () => { cancelled = true; };
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const w = await fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude);
          if (cancelled) return;
          setWeather(w);
        } catch {
          if (!cancelled) await tryIPFallback();
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      async () => {
        // Permission denied or timeout — fall back to IP lookup so widget still shows.
        if (!cancelled) await tryIPFallback();
      },
      { timeout: 6000, maximumAge: 600000 }
    );

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { weather, loading, error, retry: load };
}
