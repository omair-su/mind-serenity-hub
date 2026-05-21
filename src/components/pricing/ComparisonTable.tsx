// Comparison table: Willow Vibes vs. Calm vs. Headspace.
// Plain JSX for SEO + accessibility.
import { Check, Minus } from "lucide-react";

type Cell = boolean | string;
interface Row { label: string; willow: Cell; calm: Cell; headspace: Cell; }

const ROWS: Row[] = [
  { label: "Monthly price", willow: "$14.99", calm: "$14.99", headspace: "$12.99" },
  { label: "Yearly price",  willow: "$79.99", calm: "$69.99", headspace: "$69.99" },
  { label: "Lifetime plan", willow: "$149",   calm: false,    headspace: false },
  { label: "AI Coach (Claude)",          willow: true,  calm: false, headspace: false },
  { label: "Personalized daily insight", willow: true,  calm: false, headspace: false },
  { label: "Sleep stories",              willow: true,  calm: true,  headspace: true },
  { label: "Sound baths & binaural",     willow: true,  calm: true,  headspace: false },
  { label: "SOS / panic protocols",      willow: true,  calm: false, headspace: false },
  { label: "Cycle-sync women's program", willow: true,  calm: false, headspace: false },
  { label: "ADHD focus stack",           willow: true,  calm: false, headspace: false },
  { label: "Streak garden + heatmap",    willow: true,  calm: false, headspace: false },
  { label: "Offline downloads",          willow: true,  calm: true,  headspace: true },
];

function CellView({ value, accent }: { value: Cell; accent?: boolean }) {
  if (typeof value === "string") {
    return <span className={accent ? "font-semibold text-foreground" : "text-muted-foreground"}>{value}</span>;
  }
  return value
    ? <Check className={`w-4 h-4 mx-auto ${accent ? "text-primary" : "text-foreground/70"}`} />
    : <Minus className="w-4 h-4 mx-auto text-muted-foreground/50" />;
}

export default function ComparisonTable() {
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-card">
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] text-xs sm:text-sm">
        <div className="px-4 py-4 bg-muted/50 font-semibold">Feature</div>
        <div className="px-4 py-4 bg-primary/10 text-primary font-semibold text-center">Willow Vibes</div>
        <div className="px-4 py-4 bg-muted/50 text-center text-muted-foreground">Calm</div>
        <div className="px-4 py-4 bg-muted/50 text-center text-muted-foreground">Headspace</div>
        {ROWS.map((r, i) => (
          <div key={r.label} className="contents">
            <div className={`px-4 py-3 ${i % 2 ? "bg-muted/20" : ""} text-foreground/90`}>{r.label}</div>
            <div className={`px-4 py-3 text-center ${i % 2 ? "bg-primary/10" : "bg-primary/5"}`}>
              <CellView value={r.willow} accent />
            </div>
            <div className={`px-4 py-3 text-center ${i % 2 ? "bg-muted/20" : ""}`}>
              <CellView value={r.calm} />
            </div>
            <div className={`px-4 py-3 text-center ${i % 2 ? "bg-muted/20" : ""}`}>
              <CellView value={r.headspace} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
