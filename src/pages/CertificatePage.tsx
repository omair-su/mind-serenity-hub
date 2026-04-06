import AppLayout from "@/components/AppLayout";
import { getProfile, getCompletedDays, getTotalMinutes } from "@/lib/userStore";
import { Award, Download } from "lucide-react";

export default function CertificatePage() {
  const profile = getProfile();
  const completed = getCompletedDays();
  const totalMins = getTotalMinutes();
  const isComplete = completed.length >= 30;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Award className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Completion Certificate</h1>
            <p className="text-sm font-body text-muted-foreground">{isComplete ? "Congratulations on completing the journey!" : `${completed.length}/30 days complete — keep going!`}</p>
          </div>
        </div>

        {/* Certificate preview */}
        <div className={`relative bg-card rounded-2xl border-2 ${isComplete ? "border-gold" : "border-border opacity-60"} p-10 shadow-elevated`}>
          {/* Decorative border */}
          <div className="absolute inset-2 border border-gold/20 rounded-xl pointer-events-none" />
          <div className="absolute inset-4 border border-gold/10 rounded-lg pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-gold" />
            </div>

            <p className="text-xs font-body font-semibold text-gold uppercase tracking-[0.3em] mb-2">Willow Vibes™</p>
            <h2 className="font-display text-3xl font-bold text-foreground mb-1">Certificate of Completion</h2>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-6" />

            <p className="font-body text-muted-foreground mb-1">This certifies that</p>
            <p className="font-display text-2xl font-bold text-foreground mb-1">
              {profile.name || "Your Name Here"}
            </p>
            <p className="font-body text-muted-foreground mb-6">has successfully completed the</p>

            <p className="font-display text-xl font-semibold text-primary mb-2">
              Willow Vibes™ 30-Day Mindfulness & Meditation Challenge
            </p>

            <p className="font-body text-sm text-muted-foreground">
              Consisting of 30 guided meditation practices<br />
              Totaling {(totalMins / 60).toFixed(1)} hours of mindfulness practice
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent my-6" />

            <p className="font-body text-sm text-muted-foreground">
              Completed on {isComplete ? new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "—"}
            </p>

            <div className="mt-6">
              <p className="font-display text-sm italic text-muted-foreground">Michael, Founder</p>
              <p className="text-xs font-body text-muted-foreground">Willow Vibes™</p>
            </div>
          </div>
        </div>

        {isComplete ? (
          <div className="text-center space-y-3">
            <button className="px-8 py-3.5 btn-gold rounded-xl text-base font-body font-semibold flex items-center gap-2 mx-auto">
              <Download className="w-5 h-5" /> Download Certificate (PDF)
            </button>
            <p className="text-xs font-body text-muted-foreground">Share your achievement on social media!</p>
          </div>
        ) : (
          <div className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
            <p className="font-body text-foreground">Complete all 30 days to unlock your certificate.</p>
            <p className="text-sm font-body text-muted-foreground mt-1">{30 - completed.length} days remaining</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
