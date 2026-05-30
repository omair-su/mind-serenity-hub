// og-card — renders a branded social-share SVG for streaks, achievements,
// wellness scores, and program completions. Public endpoint, no auth required.
// Modern crawlers (Twitter, LinkedIn, Discord, Slack, iMessage) render SVG OG
// images. Width 1200x630 is the standard OG card aspect.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

function esc(s: string) {
  return s.replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" } as Record<string, string>)[c]
  );
}

function clamp(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

interface CardOpts {
  type: string;       // streak | achievement | wellness | program | default
  title: string;
  subtitle: string;
  value: string;      // big number / metric
  unit: string;       // e.g. "days", "%", "min"
  brand: string;
}

function svgCard(o: CardOpts): string {
  const palettes: Record<string, [string, string, string]> = {
    streak:      ["#2B3F2A", "#5E7C58", "#C9A961"], // forest -> sage -> gold
    achievement: ["#3B2F1E", "#9B7B3A", "#E8D5A3"], // bronze
    wellness:    ["#1F3A36", "#4A8B7F", "#D4E5DD"], // teal sage
    program:     ["#2B3F2A", "#7A9B76", "#F5F0E6"], // sage / cream
    default:     ["#2B3F2A", "#5E7C58", "#C9A961"],
  };
  const [c1, c2, accent] = palettes[o.type] ?? palettes.default;

  const title = esc(clamp(o.title, 64));
  const subtitle = esc(clamp(o.subtitle, 110));
  const value = esc(clamp(o.value, 12));
  const unit = esc(clamp(o.unit, 12));
  const brand = esc(clamp(o.brand, 32));
  const tag = esc(clamp(o.type.toUpperCase(), 24));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.9">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- decorative arcs -->
  <g stroke="${accent}" stroke-opacity="0.15" fill="none" stroke-width="1.5">
    <circle cx="1050" cy="120" r="220"/>
    <circle cx="1050" cy="120" r="320"/>
    <circle cx="1050" cy="120" r="420"/>
  </g>

  <!-- brand bar -->
  <g font-family="Georgia, 'Cormorant Garamond', serif" fill="${accent}">
    <circle cx="80" cy="78" r="10" fill="${accent}"/>
    <text x="106" y="86" font-size="28" font-weight="600" letter-spacing="2">${brand}</text>
  </g>

  <!-- tag chip -->
  <g transform="translate(80,140)">
    <rect rx="22" ry="22" width="${Math.max(140, tag.length * 14)}" height="44"
      fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.5"/>
    <text x="22" y="29" font-family="Helvetica, Arial, sans-serif"
      font-size="14" font-weight="700" letter-spacing="4" fill="${accent}">${tag}</text>
  </g>

  <!-- big value -->
  <g transform="translate(80,330)" fill="#FFFFFF">
    <text font-family="Georgia, 'Cormorant Garamond', serif"
      font-size="180" font-weight="700" letter-spacing="-4">${value}</text>
    <text x="${value.length * 88 + 10}" y="-30" font-family="Helvetica, Arial, sans-serif"
      font-size="34" font-weight="500" fill="${accent}">${unit}</text>
  </g>

  <!-- title -->
  <text x="80" y="430" font-family="Georgia, 'Cormorant Garamond', serif"
    font-size="56" font-weight="600" fill="#FFFFFF">${title}</text>

  <!-- subtitle -->
  <text x="80" y="490" font-family="Helvetica, Arial, sans-serif"
    font-size="26" font-weight="400" fill="#FFFFFF" fill-opacity="0.85">${subtitle}</text>

  <!-- footer -->
  <g transform="translate(80,580)" font-family="Helvetica, Arial, sans-serif"
    fill="${accent}" font-size="18" letter-spacing="3">
    <text font-weight="700">WILLOWVIBES.COM</text>
  </g>
</svg>`;
}

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const p = url.searchParams;
  const opts: CardOpts = {
    type:     (p.get("type") || "default").toLowerCase(),
    title:    p.get("title")    || "Daily practice, deeper calm",
    subtitle: p.get("subtitle") || "Science-backed meditation for modern life",
    value:    p.get("value")    || "7",
    unit:     p.get("unit")     || "days",
    brand:    p.get("brand")    || "WILLOW VIBES",
  };

  const svg = svgCard(opts);
  return new Response(svg, {
    headers: {
      ...corsHeaders,
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
});
