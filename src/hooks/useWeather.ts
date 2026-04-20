// Geolocation + Open-Meteo lookup. No API key required.
import { useEffect, useState } from "react";

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

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLoading(false);
      setError("Geolocation unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          if (cancelled) return;
          const code = data?.current?.weather_code ?? 0;
          const tempC = data?.current?.temperature_2m ?? 0;
          const meta = codeMap[code] ?? { desc: "Mild", good: true, emoji: "🌍" };
          setWeather({
            tempC: Math.round(tempC),
            code,
            description: meta.desc,
            isGoodForWalking: meta.good && tempC > 0 && tempC < 35,
            emoji: meta.emoji,
          });
        } catch (e) {
          if (!cancelled) setError("Weather fetch failed");
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      () => {
        if (!cancelled) {
          setLoading(false);
          setError("Location denied");
        }
      },
      { timeout: 8000, maximumAge: 600000 }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return { weather, loading, error };
}
