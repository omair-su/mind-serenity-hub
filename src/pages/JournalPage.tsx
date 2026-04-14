import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { getAllDayStates } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { BookOpen, Search, Star, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import journalHero from "@/assets/journal-hero.jpg";

export default function JournalPage() {
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState("");
  const allStates = getAllDayStates();
  const allDays = weeks.flatMap(w => w.days);

  const entries = Object.entries(allStates)
    .filter(([, s]) => s.reflection || s.challengeText || s.rememberText)
    .map(([d, s]) => {
      const dayNum = parseInt(d);
      const dayData = allDays.find(a => a.day === dayNum);
      const weekNum = Math.ceil(dayNum / 7);
      return { dayNum, state: s, dayData, weekNum };
    })
    .filter(e => filter === 'all' || e.weekNum === filter)
    .filter(e => {
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

  const totalReflections = Object.values(allStates).filter(s => s.reflection).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden h-[180px]">
          <img src={journalHero} alt="Mindful journaling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Your Journal</h1>
                <p className="text-sm text-white/80">{totalReflections} reflections across {Object.keys(allStates).length} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reflections..." className="pl-9 font-body" />
          </div>
          <div className="flex gap-1.5">
            {['all', 1, 2, 3, 4].map(w => (
              <button key={String(w)} onClick={() => setFilter(w as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                  filter === w ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}>
                {w === 'all' ? 'All' : `Week ${w}`}
              </button>
            ))}
          </div>
        </div>

        {/* Entries */}
        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(e => (
              <div key={e.dayNum} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Link to={`/day/${e.dayNum}`} className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      Day {e.dayNum}: {e.dayData?.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {e.state.completedAt ? new Date(e.state.completedAt).toLocaleDateString() : 'Undated'}</span>
                      <span>Week {e.weekNum}</span>
                      {e.state.calmRating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold" /> Calm: {e.state.calmRating}/10</span>}
                    </div>
                  </div>
                  {e.state.bookmarked && <Star className="w-4 h-4 text-gold fill-gold" />}
                </div>

                <div className="space-y-3">
                  {e.state.reflection && (
                    <ReflectionBlock label="What I noticed" text={e.state.reflection} />
                  )}
                  {e.state.challengeText && (
                    <ReflectionBlock label="Biggest challenge" text={e.state.challengeText} />
                  )}
                  {e.state.rememberText && (
                    <ReflectionBlock label="What to remember" text={e.state.rememberText} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-display text-lg font-semibold text-foreground">No reflections yet</p>
            <p className="text-sm font-body text-muted-foreground mt-1">Complete a meditation practice and share your thoughts to begin your journal.</p>
            <Link to="/day/1" className="inline-flex mt-4 px-6 py-2.5 btn-gold rounded-xl text-sm">Start Day 1</Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ReflectionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-secondary/40 rounded-xl p-4">
      <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-body text-foreground leading-relaxed">{text}</p>
    </div>
  );
}
