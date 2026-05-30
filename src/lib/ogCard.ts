// Helper to build URLs for the og-card edge function (dynamic social previews).
const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-card`;

export interface OgCardParams {
  type?: "streak" | "achievement" | "wellness" | "program" | "default";
  title?: string;
  subtitle?: string;
  value?: string | number;
  unit?: string;
  brand?: string;
}

export function ogCardUrl(p: OgCardParams = {}): string {
  const u = new URL(FN_BASE);
  if (p.type) u.searchParams.set("type", p.type);
  if (p.title) u.searchParams.set("title", p.title);
  if (p.subtitle) u.searchParams.set("subtitle", p.subtitle);
  if (p.value !== undefined) u.searchParams.set("value", String(p.value));
  if (p.unit) u.searchParams.set("unit", p.unit);
  if (p.brand) u.searchParams.set("brand", p.brand);
  return u.toString();
}
