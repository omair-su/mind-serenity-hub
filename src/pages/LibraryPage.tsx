import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { getCompletedDays, getDayState } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { Search, Grid3X3, List, Clock, Check, Heart, Filter, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'completed' | 'incomplete' | 'favorites';

const collections = [
  { name: "Quick Calm", desc: "5 short sessions under 15 min", days: [1, 3, 5, 10, 26], gradient: "from-[hsl(var(--sage))]/25 via-[hsl(var(--sage-light))]/40 to-[hsl(var(--cream))]", icon: "🧘" },
  { name: "Deep Relaxation", desc: "Body-focused practices", days: [2, 8, 9, 13, 27], gradient: "from-[hsl(var(--forest))]/15 via-[hsl(var(--sage-light))]/30 to-[hsl(var(--cream))]", icon: "🌿" },
  { name: "Sleep Better", desc: "Evening practices", days: [2, 9, 25, 27, 28], gradient: "from-[hsl(var(--forest-deep))]/20 via-[hsl(var(--forest-mid))]/15 to-[hsl(var(--cream))]", icon: "🌙" },
  { name: "Anxiety Relief", desc: "Stress management", days: [5, 18, 19, 26, 24], gradient: "from-[hsl(var(--gold))]/15 via-[hsl(var(--gold-light))]/20 to-[hsl(var(--cream))]", icon: "🫧" },
  { name: "Energy Boost", desc: "Morning practices", days: [1, 3, 6, 11, 22], gradient: "from-[hsl(var(--gold-dark))]/15 via-[hsl(var(--gold))]/15 to-[hsl(var(--cream))]", icon: "☀️" },
];

const weekGradients = [
  "from-[hsl(var(--sage))]/15 via-[hsl(var(--sage-light))]/30 to-[hsl(var(--cream))]",
  "from-[hsl(var(--forest))]/12 via-[hsl(var(--sage-light))]/30 to-[hsl(var(--cream))]",
  "from-[hsl(var(--gold))]/12 via-[hsl(var(--gold-light))]/20 to-[hsl(var(--cream))]",
  "from-[hsl(var(--forest-deep))]/15 via-[hsl(var(--forest-mid))]/10 to-[hsl(var(--cream))]",
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
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Editorial hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-10 sm:px-10"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            background: "radial-gradient(circle at 20% 30%, hsl(var(--gold) / 0.4) 0%, transparent 50%), radial-gradient(circle at 90% 80%, hsl(var(--sage) / 0.25) 0%, transparent 50%)"
          }} />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
                <BookOpen className="w-3 h-3" /> The Library
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[hsl(var(--cream))] leading-[1.05]">
                Thirty days,<br/>thirty practices
              </h1>
              <p className="mt-3 font-body text-sm text-[hsl(var(--cream))]/75 max-w-md">
                Every guided session in your journey — searchable, sortable, yours.
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-5xl sm:text-6xl font-bold text-[hsl(var(--gold-light))] leading-none tabular-nums">{completed.length}<span className="text-2xl text-[hsl(var(--cream))]/50">/30</span></p>
              <p className="text-[11px] font-body uppercase tracking-[0.2em] text-[hsl(var(--cream))]/60 mt-1">completed</p>
            </div>
          </div>
        </motion.div>

        {/* Curated collections */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display text-[11px] font-bold text-[hsl(var(--forest))] uppercase tracking-[0.25em]">Curated Collections</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[hsl(var(--gold))]/40 to-transparent" />
          </div>
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="flex gap-3 min-w-max">
              {collections.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`bg-gradient-to-br ${c.gradient} rounded-2xl border border-[hsl(var(--gold))]/15 p-4 w-56 flex-shrink-0 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-1 hover:border-[hsl(var(--gold))]/40 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{c.icon}</span>
                    <p className="font-display text-sm font-semibold text-[hsl(var(--charcoal))]">{c.name}</p>
                  </div>
                  <p className="text-xs font-body text-[hsl(var(--charcoal-soft))] mt-0.5">{c.desc}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="w-3 h-3 text-[hsl(var(--gold))]" />
                    <p className="text-[11px] font-body font-semibold text-[hsl(var(--forest))]">{c.days.length} sessions</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[hsl(var(--cream))] border border-[hsl(var(--gold))]/15 shadow-[var(--shadow-soft-val)]">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--charcoal-soft))]" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search meditations..." className="pl-9 font-body bg-[hsl(var(--sage-light))]/30 border-[hsl(var(--sage))]/30" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'completed', 'incomplete', 'favorites'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold capitalize transition-all ${
                  filter === f ? "bg-[hsl(var(--forest))] text-[hsl(var(--cream))] shadow-md" : "bg-[hsl(var(--sage-light))]/40 text-[hsl(var(--charcoal-soft))] hover:bg-[hsl(var(--sage-light))]/70"
                }`}>{f}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 1, 2, 3, 4] as const).map(w => (
              <button key={String(w)} onClick={() => setWeekFilter(w)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-body font-semibold transition-all ${
                  weekFilter === w ? "bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--cream))] shadow-md" : "bg-[hsl(var(--sage-light))]/40 text-[hsl(var(--charcoal-soft))] hover:bg-[hsl(var(--sage-light))]/70"
                }`}>{w === 'all' ? 'All' : `W${w}`}</button>
            ))}
          </div>
          <div className="flex gap-1 bg-[hsl(var(--sage-light))]/40 rounded-lg p-0.5 ml-auto">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[hsl(var(--cream))] shadow-sm' : ''}`}>
              <Grid3X3 className="w-4 h-4 text-[hsl(var(--forest))]" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[hsl(var(--cream))] shadow-sm' : ''}`}>
              <List className="w-4 h-4 text-[hsl(var(--forest))]" />
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDays.map((d, i) => {
              const isComplete = completed.includes(d.day);
              const isFav = getDayState(d.day)?.bookmarked;
              const weekNum = d.day <= 7 ? 1 : d.day <= 14 ? 2 : d.day <= 21 ? 3 : 4;
              const gradient = weekGradients[(weekNum - 1) % 4];
              return (
                <motion.div key={d.day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                  <Link to={`/day/${d.day}`}
                    className={`block bg-gradient-to-br ${gradient} rounded-2xl border border-[hsl(var(--gold))]/15 p-5 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-1 hover:border-[hsl(var(--gold))]/40 transition-all duration-300 group ${isComplete ? 'ring-1 ring-[hsl(var(--forest))]/25' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-display font-bold uppercase tracking-[0.15em] text-[hsl(var(--forest))] bg-[hsl(var(--cream))]/70 px-2.5 py-0.5 rounded-full border border-[hsl(var(--gold))]/15">Week {weekNum}</span>
                      <div className="flex items-center gap-1.5">
                        {isFav && <Heart className="w-3.5 h-3.5 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />}
                        {isComplete && <div className="w-5 h-5 rounded-full bg-[hsl(var(--forest))] flex items-center justify-center"><Check className="w-3 h-3 text-[hsl(var(--cream))]" /></div>}
                      </div>
                    </div>
                    <p className="font-display text-base font-semibold text-[hsl(var(--charcoal))] group-hover:text-[hsl(var(--forest))] transition-colors">Day {d.day}: {d.title}</p>
                    <p className="text-xs font-body text-[hsl(var(--charcoal-soft))] mt-1.5 line-clamp-2">{d.focus}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs font-body text-[hsl(var(--charcoal-soft))]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.duration}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-[hsl(var(--cream))]/70 text-[10px] border border-[hsl(var(--sage))]/20">{d.difficulty}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDays.map((d, i) => {
              const isComplete = completed.includes(d.day);
              const weekNum = d.day <= 7 ? 1 : d.day <= 14 ? 2 : d.day <= 21 ? 3 : 4;
              const gradient = weekGradients[(weekNum - 1) % 4];
              return (
                <motion.div key={d.day} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                  <Link to={`/day/${d.day}`}
                    className={`flex items-center gap-4 bg-gradient-to-r ${gradient} rounded-xl border border-[hsl(var(--gold))]/15 p-4 hover:shadow-[var(--shadow-soft-val)] hover:border-[hsl(var(--gold))]/30 transition-all`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold ${
                      isComplete ? "bg-[hsl(var(--forest))] text-[hsl(var(--cream))]" : "bg-[hsl(var(--cream))] text-[hsl(var(--charcoal-soft))] border border-[hsl(var(--sage))]/30"
                    }`}>{d.day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-[hsl(var(--charcoal))] truncate">{d.title}</p>
                      <p className="text-xs font-body text-[hsl(var(--charcoal-soft))]">{d.duration} · {d.difficulty}</p>
                    </div>
                    {isComplete && <div className="w-6 h-6 rounded-full bg-[hsl(var(--forest))] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-[hsl(var(--cream))]" /></div>}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredDays.length === 0 && (
          <div className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/30 rounded-2xl border border-[hsl(var(--gold))]/15 p-12 text-center">
            <Filter className="w-10 h-10 text-[hsl(var(--charcoal-soft))] mx-auto mb-3" />
            <p className="font-display text-lg font-semibold text-[hsl(var(--forest-deep))]">No meditations found</p>
            <p className="text-sm font-body text-[hsl(var(--charcoal-soft))] mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
