import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { getCompletedDays, getDayState } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { Search, Grid3X3, List, Clock, Check, Heart, Filter, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'completed' | 'incomplete' | 'favorites';

const collections = [
  { name: "Quick Calm", desc: "5 short sessions under 15 min", days: [1, 3, 5, 10, 26], gradient: "from-emerald-500/15 via-teal-500/10 to-cyan-500/5", icon: "🧘" },
  { name: "Deep Relaxation", desc: "Body-focused practices", days: [2, 8, 9, 13, 27], gradient: "from-violet-500/15 via-purple-500/10 to-indigo-500/5", icon: "🌿" },
  { name: "Sleep Better", desc: "Evening practices", days: [2, 9, 25, 27, 28], gradient: "from-indigo-500/15 via-blue-500/10 to-slate-500/5", icon: "🌙" },
  { name: "Anxiety Relief", desc: "Stress management", days: [5, 18, 19, 26, 24], gradient: "from-rose-500/12 via-pink-500/8 to-amber-500/5", icon: "🫧" },
  { name: "Energy Boost", desc: "Morning practices", days: [1, 3, 6, 11, 22], gradient: "from-amber-500/15 via-orange-500/10 to-yellow-500/5", icon: "☀️" },
];

const weekGradients = [
  "from-emerald-500/8 to-teal-500/5",
  "from-blue-500/8 to-indigo-500/5",
  "from-amber-500/8 to-orange-500/5",
  "from-violet-500/8 to-purple-500/5",
];

export default function LibraryPage() {
  const [view, setView] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [search, setSearch] = useState("");
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all');
  const completed = getCompletedDays();
  const allDays = weeks.flatMap(w => w.days);

  const filteredDays = allDays
    .filter(d => {
      if (filter === 'completed') return completed.includes(d.day);
      if (filter === 'incomplete') return !completed.includes(d.day);
      if (filter === 'favorites') return getDayState(d.day)?.bookmarked;
      return true;
    })
    .filter(d => {
      if (weekFilter !== 'all') return Math.ceil(d.day / 7) === weekFilter || (weekFilter === 4 && d.day >= 22);
      return true;
    })
    .filter(d => {
      if (!search) return true;
      const s = search.toLowerCase();
      return d.title.toLowerCase().includes(s) || d.focus.toLowerCase().includes(s) || d.practice.toLowerCase().includes(s);
    });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-sage/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Meditation Library</h1>
            <p className="text-sm font-body text-muted-foreground">All 30 guided sessions for your journey</p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {collections.map(c => (
              <div key={c.name} className={`bg-gradient-to-br ${c.gradient} rounded-2xl border border-border/50 p-4 w-56 flex-shrink-0 hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{c.icon}</span>
                  <p className="font-display text-sm font-semibold text-foreground">{c.name}</p>
                </div>
                <p className="text-xs font-body text-muted-foreground mt-0.5">{c.desc}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <p className="text-[11px] font-body font-semibold text-primary">{c.days.length} sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search meditations..." className="pl-9 font-body" />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'completed', 'incomplete', 'favorites'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium capitalize transition-all ${
                  filter === f ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}>{f}</button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {(['all', 1, 2, 3, 4] as const).map(w => (
              <button key={String(w)} onClick={() => setWeekFilter(w)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
                  weekFilter === w ? "bg-gold text-card shadow-sm" : "bg-secondary text-muted-foreground"
                }`}>{w === 'all' ? 'All' : `W${w}`}</button>
            ))}
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-card shadow-sm' : ''}`}>
              <Grid3X3 className="w-4 h-4 text-foreground" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-card shadow-sm' : ''}`}>
              <List className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDays.map(d => {
              const isComplete = completed.includes(d.day);
              const isFav = getDayState(d.day)?.bookmarked;
              const weekNum = d.day <= 7 ? 1 : d.day <= 14 ? 2 : d.day <= 21 ? 3 : 4;
              const gradient = weekGradients[(weekNum - 1) % 4];
              return (
                <Link key={d.day} to={`/day/${d.day}`}
                  className={`bg-gradient-to-br ${gradient} rounded-2xl border border-border/50 p-5 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group ${isComplete ? 'ring-1 ring-primary/20' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      Week {weekNum}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isFav && <Heart className="w-3.5 h-3.5 text-gold fill-gold" />}
                      {isComplete && (
                        <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    Day {d.day}: {d.title}
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1.5 line-clamp-2">{d.focus}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs font-body text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.duration}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-card/60 text-[10px]">{d.difficulty}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDays.map(d => {
              const isComplete = completed.includes(d.day);
              const weekNum = d.day <= 7 ? 1 : d.day <= 14 ? 2 : d.day <= 21 ? 3 : 4;
              const gradient = weekGradients[(weekNum - 1) % 4];
              return (
                <Link key={d.day} to={`/day/${d.day}`}
                  className={`flex items-center gap-4 bg-gradient-to-r ${gradient} rounded-xl border border-border/50 p-4 hover:shadow-sm transition-all`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-body font-bold ${
                    isComplete ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}>{d.day}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">{d.title}</p>
                    <p className="text-xs font-body text-muted-foreground">{d.duration} · {d.difficulty}</p>
                  </div>
                  {isComplete && <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-primary" /></div>}
                </Link>
              );
            })}
          </div>
        )}

        {filteredDays.length === 0 && (
          <div className="bg-gradient-to-br from-primary/5 to-sage/10 rounded-2xl border border-border/50 p-12 text-center">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-display text-lg font-semibold text-foreground">No meditations found</p>
            <p className="text-sm font-body text-muted-foreground mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
