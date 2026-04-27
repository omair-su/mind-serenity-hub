import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { getAllDayStates } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { BookOpen, Search, Star, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHero, LuxeCard, EmptyState } from "@/components/ui-premium";
import journalHero from "@/assets/journal-hero.jpg";

export default function JournalPage() {
  const [filter, setFilter] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const allStates = getAllDayStates();
  const allDays = weeks.flatMap((w) => w.days);

  const entries = Object.entries(allStates)
    .filter(([, s]) => s.reflection || s.challengeText || s.rememberText)
    .map(([d, s]) => {
      const dayNum = parseInt(d);
      const dayData = allDays.find((a) => a.day === dayNum);
      const weekNum = Math.ceil(dayNum / 7);
      return { dayNum, state: s, dayData, weekNum };
    })
    .filter((e) => filter === "all" || e.weekNum === filter)
    .filter((e) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        e.state.reflection?.toLowerCase().includes(s) ||
        e.state.challengeText?.toLowerCase().includes(s) ||
        e.state.rememberText?.toLowerCase().includes(s) ||
        e.dayData?.title.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => b.dayNum - a.dayNum);

  const totalReflections = Object.values(allStates).filter((s) => s.reflection).length;
  const totalDays = Object.keys(allStates).length;

  return (
    <AppLayout>
      <div className="space-y-7">
        <PageHero
          eyebrow="Inner Library"
          title="Your Journal"
          description={`${totalReflections} reflections gathered across ${totalDays} mindful days. A living record of your becoming.`}
          image={journalHero}
          height="sm"
          overlay="forest"
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-soft" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reflections..."
              className="pl-9 font-body bg-white border-[hsl(var(--cream-dark))]"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", 1, 2, 3, 4] as const).map((w) => (
              <button
                key={String(w)}
                onClick={() => setFilter(w as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-semibold tracking-wide transition-all ${
                  filter === w
                    ? "bg-[hsl(var(--forest))] text-cream shadow-[var(--shadow-soft-val)]"
                    : "bg-[hsl(var(--sage-light))] text-[hsl(var(--forest))] hover:bg-[hsl(var(--sage)/0.4)]"
                }`}
              >
                {w === "all" ? "All" : `Week ${w}`}
              </button>
            ))}
          </div>
        </div>

        {/* Entries */}
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map((e) => (
              <LuxeCard key={e.dayNum} variant="default" padded>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Link
                      to={`/day/${e.dayNum}`}
                      className="font-display text-lg font-bold text-charcoal hover:text-[hsl(var(--forest))] transition-colors"
                    >
                      Day {e.dayNum}: {e.dayData?.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-body text-charcoal-soft">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {e.state.completedAt
                          ? new Date(e.state.completedAt).toLocaleDateString()
                          : "Undated"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--sage-light))] text-[hsl(var(--forest))] font-semibold">
                        Week {e.weekNum}
                      </span>
                      {e.state.calmRating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
                          Calm: {e.state.calmRating}/10
                        </span>
                      )}
                    </div>
                  </div>
                  {e.state.bookmarked && (
                    <Star className="w-5 h-5 text-[hsl(var(--gold))] fill-[hsl(var(--gold))] shrink-0" />
                  )}
                </div>

                <div className="space-y-3">
                  {e.state.reflection && <ReflectionBlock label="What I noticed" text={e.state.reflection} />}
                  {e.state.challengeText && (
                    <ReflectionBlock label="Biggest challenge" text={e.state.challengeText} />
                  )}
                  {e.state.rememberText && (
                    <ReflectionBlock label="What to remember" text={e.state.rememberText} />
                  )}
                </div>
              </LuxeCard>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Your journal awaits its first page"
            description="Complete a meditation practice and share what you noticed. Your reflections become your inner library."
            action={
              <Link
                to="/day/1"
                className="inline-flex px-7 py-3 btn-gold-primary rounded-xl text-sm"
              >
                Begin Day 1
              </Link>
            }
          />
        )}
      </div>
    </AppLayout>
  );
}

function ReflectionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-[hsl(var(--sage-light)/0.5)] border-l-2 border-[hsl(var(--gold)/0.6)] rounded-xl p-4">
      <p className="text-[10px] font-body font-bold text-[hsl(var(--forest))] uppercase tracking-[0.2em] mb-1.5">
        {label}
      </p>
      <p className="text-sm font-body text-charcoal leading-relaxed">{text}</p>
    </div>
  );
}
