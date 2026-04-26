import { Phone, ExternalLink, ShieldAlert } from "lucide-react";
import { HOTLINES, getRegionFromTimezone } from "@/data/extraSOS";
import { useState } from "react";

export default function EmergencyContacts() {
  const [region, setRegion] = useState(getRegionFromTimezone());
  const list = HOTLINES.filter((h) => h.region === region || h.region === "INTL");

  return (
    <div className="rounded-2xl border-2 border-destructive/30 bg-gradient-to-br from-destructive/5 via-card to-gold/5 p-5 shadow-soft">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-rose-500/15">
          <ShieldAlert className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold text-foreground">Need to talk to someone right now?</h3>
          <p className="text-xs font-body text-muted-foreground mt-0.5">
            Free, confidential help. You are not alone.
          </p>
        </div>
      </div>

      <div className="flex gap-1.5 mb-3 flex-wrap">
        {["US", "UK", "CA", "AU", "IN", "PK", "INTL"].map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`text-[10px] font-body px-2.5 py-1 rounded-full border transition-all ${
              region === r
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-card text-muted-foreground border-border hover:border-rose-300"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((h) => {
          const isUrl = h.number.includes(".");
          const isText = h.number.startsWith("Text");
          return (
            <a
              key={h.name}
              href={isUrl ? `https://${h.number}` : isText ? "#" : `tel:${h.number.replace(/\D/g, "")}`}
              target={isUrl ? "_blank" : undefined}
              rel={isUrl ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-rose-300 hover:bg-rose-50/50 transition-all"
            >
              <div className="p-1.5 rounded-lg bg-rose-500/10">
                {isUrl ? <ExternalLink className="w-4 h-4 text-destructive" /> : <Phone className="w-4 h-4 text-destructive" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-semibold text-foreground truncate">{h.name}</p>
                <p className="text-xs font-body text-muted-foreground">{h.number} · {h.hours}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
