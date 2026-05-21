// Money-back guarantee seal — round badge for trust signal.
import { ShieldCheck } from "lucide-react";

export default function GuaranteeSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 ${className}`}>
      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">14-day guarantee</p>
        <p className="text-[10px] text-muted-foreground">Cancel for any reason — 100% refund</p>
      </div>
    </div>
  );
}
