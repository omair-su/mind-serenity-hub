// Monthly Wellness Report Card (premium) — generates a polished PDF summarising
// the past 30 days of practice using jsPDF. Pure client-side, no edge function.
import { useState } from "react";
import { Crown, FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useProfile } from "@/hooks/useProfile";
import {
  getCurrentStreak,
  getLongestStreak,
  getCompletedDays,
  getTotalMinutes,
  getAllDayStates,
} from "@/lib/userStore";

interface MonthlyStats {
  monthLabel: string;
  sessions: number;
  minutes: number;
  uniqueDays: number;
}

function statsForLast30Days(): MonthlyStats {
  const states = getAllDayStates();
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let sessions = 0;
  let minutes = 0;
  const days = new Set<string>();
  Object.values(states).forEach((s) => {
    if (s?.completedAt && s.checklist?.every(Boolean)) {
      const t = new Date(s.completedAt).getTime();
      if (t >= cutoff) {
        sessions++;
        minutes += s.duration || 15;
        days.add(s.completedAt.slice(0, 10));
      }
    }
  });
  return {
    monthLabel: new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    sessions,
    minutes,
    uniqueDays: days.size,
  };
}

const FOREST: [number, number, number] = [29, 58, 47];
const GOLD: [number, number, number] = [201, 168, 76];
const CREAM: [number, number, number] = [245, 240, 224];
const CHARCOAL: [number, number, number] = [38, 38, 40];
const MUTED: [number, number, number] = [110, 110, 115];

function pdfBackground(doc: jsPDF) {
  // Cream page
  doc.setFillColor(...CREAM);
  doc.rect(0, 0, 210, 297, "F");
  // Forest header band
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, 210, 60, "F");
  // Gold accent
  doc.setFillColor(...GOLD);
  doc.rect(0, 58, 210, 2, "F");
}

export default function MonthlyReportCard() {
  const { isPremium } = useIsPremium();
  const { profile } = useProfile();
  const [busy, setBusy] = useState(false);

  const generate = () => {
    setBusy(true);
    try {
      const stats = statsForLast30Days();
      const streak = getCurrentStreak();
      const longest = getLongestStreak();
      const lifetimeDone = getCompletedDays().length;
      const lifetimeMin = getTotalMinutes();
      const name = profile.display_name || "Willow Member";

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      pdfBackground(doc);

      // Title
      doc.setTextColor(...CREAM);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("WILLOW VIBES · MONTHLY WELLNESS REPORT", 20, 22);

      doc.setFontSize(28);
      doc.text(stats.monthLabel, 20, 38);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Prepared for ${name}`, 20, 50);

      // Body
      doc.setTextColor(...CHARCOAL);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Your month in numbers", 20, 80);

      // Stat boxes
      const drawStat = (x: number, y: number, label: string, value: string) => {
        doc.setDrawColor(...GOLD);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, 82, 30, 4, 4, "FD");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        doc.text(label.toUpperCase(), x + 6, y + 9);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...FOREST);
        doc.text(value, x + 6, y + 22);
      };

      drawStat(20, 88, "Sessions", String(stats.sessions));
      drawStat(108, 88, "Mindful minutes", String(stats.minutes));
      drawStat(20, 124, "Active days", String(stats.uniqueDays));
      drawStat(108, 124, "Current streak", `${streak}d`);

      // Lifetime
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...CHARCOAL);
      doc.text("Lifetime totals", 20, 175);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...MUTED);
      doc.text(`Days completed:  ${lifetimeDone} / 30`, 20, 186);
      doc.text(`Total mindful minutes:  ${lifetimeMin}`, 20, 193);
      doc.text(`Longest streak:  ${longest} days`, 20, 200);

      // Reflection
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...CHARCOAL);
      doc.text("A note from your coach", 20, 225);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(...CHARCOAL);
      const reflection = stats.uniqueDays >= 20
        ? "Twenty active days is a remarkable month. The practice has become a rhythm. Keep going."
        : stats.uniqueDays >= 10
          ? "A steady month. The body and mind have begun to remember. Small consistency, compounded."
          : "Every practice counts, including the ones that almost did not happen. Next month begins now.";
      doc.text(doc.splitTextToSize(reflection, 170), 20, 234);

      // Footer
      doc.setDrawColor(...GOLD);
      doc.line(20, 270, 190, 270);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text("willowvibes.com  ·  Premium member report", 20, 278);
      doc.text(new Date().toLocaleDateString(), 190, 278, { align: "right" });

      doc.save(`willow-report-${stats.monthLabel.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast.success("Your monthly report is ready.");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate the report. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-[hsl(var(--gold))]/40 bg-gradient-to-br from-[hsl(var(--cream))]/40 via-card to-card p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center flex-shrink-0">
          <Crown className="w-6 h-6 text-[hsl(var(--charcoal))]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-foreground">
            Monthly Wellness Report Card
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-1">
            A premium, designed PDF of your last 30 days — perfect to keep,
            print, or send to your coach.
          </p>

          {isPremium ? (
            <button
              onClick={generate}
              disabled={busy}
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {busy ? "Generating…" : "Download report (PDF)"}
            </button>
          ) : (
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-[hsl(var(--gold))]/90 text-[hsl(var(--charcoal))] font-body font-bold text-sm hover:scale-105 transition-transform"
            >
              <Crown className="w-4 h-4" /> Unlock with Premium
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
