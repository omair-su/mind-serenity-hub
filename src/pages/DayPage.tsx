import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { weeks } from "@/data/courseData";
import {
  ChevronLeft, ChevronRight, Clock, Gauge, Sun, Target, Sparkles,
  Heart, FlaskConical, Play, Pause, Volume2, Check, Bookmark, BookmarkCheck,
  LayoutDashboard, Timer, Leaf, Loader2, Square, Music, Lightbulb, X
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import AmbientMusicPlayer from "@/components/AmbientMusicPlayer";
import { pickTrackForDay } from "@/lib/realAmbientTracks";
import logoImg from "@/assets/willow-logo.png";
import DayHeroCinema from "@/components/day/DayHeroCinema";
import IntentionRitual from "@/components/day/IntentionRitual";
import PracticeMode from "@/components/day/PracticeMode";
import SoundBedDesigner from "@/components/day/SoundBedDesigner";
import AIDailyInsight from "@/components/day/AIDailyInsight";
import MoodDeltaChart from "@/components/day/MoodDeltaChart";
import HeartCoherenceRing from "@/components/day/HeartCoherenceRing";
import { getDayHero } from "@/data/dayHeroImages";
import { loadDayState, saveDayState, type DayState } from "@/lib/cloudSync";
import { useIsPremium } from "@/hooks/useIsPremium";
import PremiumLockModal from "@/components/PremiumLockModal";
import { Crown, Lock } from "lucide-react";

type VoiceKey = "sarah" | "george" | "matilda" | "charlie";
const FREE_VOICES: VoiceKey[] = ["sarah", "matilda"];
const PREMIUM_VOICES: { key: VoiceKey; label: string; tier: "free" | "premium" }[] = [
  { key: "sarah", label: "Sarah · Warm", tier: "free" },
  { key: "matilda", label: "Matilda · Soft", tier: "free" },
  { key: "george", label: "George · Deep", tier: "premium" },
  { key: "charlie", label: "Aria · Ethereal", tier: "premium" },
];

/* ─── Day emoji mapping ─── */
const dayEmojis: Record<number, string> = {
  1: "🌬️", 2: "💆‍♀️", 3: "🔢", 4: "👁️", 5: "💗", 6: "🚶", 7: "🙏",
  8: "🌊", 9: "🏷️", 10: "🕉️", 11: "🍇", 12: "🔔", 13: "✨", 14: "🌀",
  15: "🌄", 16: "🦴", 17: "💚", 18: "🎯", 19: "🤝", 20: "🧘", 21: "🌟",
  22: "☁️", 23: "🪞", 24: "🕊️", 25: "🔥", 26: "🌍", 27: "💝", 28: "🤫", 29: "🛤️", 30: "🎉",
};

/* ─── Premium Wisdom Cards ─── */
const WISDOM_CARDS = [
  { title: "The Power of Presence", insight: "Your mind can only be in one place at a time. When you're here, you're not there.", icon: "🎯" },
  { title: "Breath = Life", insight: "Every breath connects you to the present moment. The breath is always now.", icon: "🌬️" },
  { title: "Consistency Over Perfection", insight: "A imperfect practice done daily beats a perfect practice done rarely.", icon: "🔥" },
  { title: "The Observer Effect", insight: "Simply noticing your thoughts changes them. Awareness is the first step to freedom.", icon: "👁️" },
  { title: "Neuroplasticity", insight: "Every meditation rewires your brain. You're literally building new neural pathways for peace.", icon: "🧠" },
];

/* ─── Binaural Frequency Presets ─── */
const BINAURAL_PRESETS = [
  { name: "Delta (Sleep)", freq: 2, color: "from-indigo-600 to-blue-600", description: "Deep sleep & restoration" },
  { name: "Theta (Deep Meditation)", freq: 5, color: "from-purple-600 to-violet-600", description: "Subconscious access & creativity" },
  { name: "Alpha (Relaxation)", freq: 10, color: "from-emerald-600 to-teal-600", description: "Calm awareness & flow" },
  { name: "Beta (Focus)", freq: 20, color: "from-amber-600 to-orange-600", description: "Concentration & alertness" },
  { name: "Gamma (Peak Performance)", freq: 40, color: "from-rose-600 to-pink-600", description: "Insight & cognitive enhancement" },
];

/* ─── localStorage helpers (sync mirror — async cloud sync below) ─── */
function loadState(dayNum: number) {
  try {
    const raw = localStorage.getItem(`wv-day-${dayNum}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ─── Timer Hook ─── */
function useTimer(initialMinutes: number) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  const toggle = () => setRunning(r => !r);
  const reset = (mins: number) => { setRunning(false); setSeconds(mins * 60); };
  const extend = () => setSeconds(s => s + 5 * 60);
  const fmt = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return { seconds, running, toggle, reset, extend, display: fmt };
}

/* ─── Parse duration string to minutes ─── */
function parseDuration(dur: string): number {
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1]) : 15;
}

export default function DayPage() {
  const { dayNum } = useParams();
  const navigate = useNavigate();
  const dayNumber = parseInt(dayNum || "1");

  const allDays = weeks.flatMap(w => w.days);
  const day = allDays.find(d => d.day === dayNumber);
  const weekData = weeks.find(w => w.days.some(d => d.day === dayNumber));
  const weekIndex = weekData ? weekData.week - 1 : 0;

  // Saved state
  const saved = loadState(dayNumber);
  const [reflection, setReflection] = useState(saved?.reflection || "");
  const [calmRating, setCalmRating] = useState<number[]>([saved?.calmRating || 5]);
  const [moodBefore, setMoodBefore] = useState<number[]>([saved?.moodBefore || 5]);
  const [moodAfter, setMoodAfter] = useState<number[]>([saved?.moodAfter || 7]);
  const [challengeText, setChallengeText] = useState(saved?.challengeText || "");
  const [rememberText, setRememberText] = useState(saved?.rememberText || "");
  const [checklist, setChecklist] = useState<boolean[]>(saved?.checklist || [false, false, false, false]);
  const [bookmarked, setBookmarked] = useState(saved?.bookmarked || false);
  const [scrolled, setScrolled] = useState(false);
  const [showWisdomDialog, setShowWisdomDialog] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState(WISDOM_CARDS[dayNumber % WISDOM_CARDS.length]);
  const [showBinauralPanel, setShowBinauralPanel] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(BINAURAL_PRESETS[2]); // Alpha by default
  const [binauralActive, setBinauralActive] = useState(false);
  const [binauralVolume, setBinauralVolume] = useState(0.3);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [intentionWord, setIntentionWord] = useState<string>(saved?.intentionWord || "");
  const [showIntention, setShowIntention] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceKey>("sarah");
  const [premiumGate, setPremiumGate] = useState<{ feature: string; description?: string } | null>(null);
  const tts = useTextToSpeech();
  const { isPremium } = useIsPremium();
  const isLockedDay = dayNumber >= 8 && !isPremium;

  // Reset TTS when navigating to a different day
  useEffect(() => {
    tts.stop();
  }, [dayNumber]);

  // Hydrate from cloud on mount / day change
  useEffect(() => {
    let cancelled = false;
    loadDayState(dayNumber).then((s) => {
      if (cancelled || !s) return;
      if (typeof s.reflection === "string") setReflection(s.reflection);
      if (typeof s.calmRating === "number") setCalmRating([s.calmRating]);
      if (typeof s.moodBefore === "number") setMoodBefore([s.moodBefore]);
      if (typeof s.moodAfter === "number") setMoodAfter([s.moodAfter]);
      if (typeof s.challengeText === "string") setChallengeText(s.challengeText);
      if (typeof s.rememberText === "string") setRememberText(s.rememberText);
      if (Array.isArray(s.checklist)) setChecklist(s.checklist);
      if (typeof s.bookmarked === "boolean") setBookmarked(s.bookmarked);
      if (typeof s.intention === "string") setIntentionWord(s.intention);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [dayNumber]);

  const durationMins = day ? parseDuration(day.duration) : 15;
  const timer = useTimer(durationMins);

  // Auto-save
  const autoSave = useCallback(() => {
    const state: DayState = {
      reflection,
      calmRating: calmRating[0],
      moodBefore: moodBefore[0],
      moodAfter: moodAfter[0],
      challengeText,
      rememberText,
      checklist,
      bookmarked,
      intention: intentionWord,
    };
    try { localStorage.setItem(`wv-day-${dayNumber}`, JSON.stringify(state)); } catch {}
    saveDayState(dayNumber, state).catch(() => {});
  }, [dayNumber, reflection, calmRating, moodBefore, moodAfter, challengeText, rememberText, checklist, bookmarked, intentionWord]);

  useEffect(() => {
    const t = setTimeout(autoSave, 2000);
    return () => clearTimeout(t);
  }, [autoSave]);

  // Scroll to top on day change
  useEffect(() => { window.scrollTo(0, 0); tts.stop(); }, [dayNumber]);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && dayNumber > 1) navigate(`/day/${dayNumber - 1}`);
      if (e.key === "ArrowRight" && dayNumber < 30) navigate(`/day/${dayNumber + 1}`);
      if (e.key === "Escape") navigate("/course");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dayNumber, navigate]);

  if (!day || !weekData) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground font-body">Day not found.</p></div>;
  }

  const completedCount = checklist.filter(Boolean).length;
  const allComplete = completedCount === 4;
  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < 30 ? dayNumber + 1 : null;
  const heroImage = getDayHero(dayNumber).image;
  const completedDays = Array.from({ length: 30 }, (_, i) => {
    const s = loadState(i + 1);
    return s?.checklist?.every(Boolean) || false;
  });
  const percentage = Math.round((dayNumber / 30) * 100);

  const toggleCheck = (idx: number) => {
    const next = [...checklist];
    next[idx] = !next[idx];
    setChecklist(next);
  };

  const startSession = () => {
    if (isLockedDay) {
      setPremiumGate({
        feature: `Day ${dayNumber} is a Plus chapter`,
        description: "The first 7 days are free. Days 8–30 unlock with Willow Plus — the full 30-day transformation, premium voices, and AI Daily Insight.",
      });
      return;
    }
    setShowIntention(true);
  };

  const requestPremiumVoice = (key: VoiceKey) => {
    if (FREE_VOICES.includes(key) || isPremium) {
      setSelectedVoice(key);
      return;
    }
    setPremiumGate({
      feature: "Premium narration voices",
      description: "Aria & George are studio-mastered ElevenLabs voices reserved for Willow Plus. Sarah and Matilda stay free for everyone.",
    });
  };

  const handleIntentionComplete = (data: { intention: string; moodBefore: number }) => {
    setIntentionWord(data.intention);
    setMoodBefore([data.moodBefore]);
    setShowIntention(false);
    setSessionStarted(true);
    setShowPractice(true);
  };

  const completeSession = () => {
    setMoodAfter(calmRating);
    timer.reset(durationMins);
    toggleCheck(0); // Mark meditation as complete
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── STICKY NAVBAR ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImg} alt="Willow Vibes" className="h-7 w-7" />
              <span className={`font-display text-lg font-bold ${scrolled ? "text-primary" : "text-card"}`}>Willow Vibes™</span>
            </Link>
            <span className={`hidden sm:inline text-xs font-body ${scrolled ? "text-muted-foreground" : "text-card/70"}`}>Day {dayNumber} of 30</span>
          </div>
          <div className={`hidden md:block text-sm font-body font-medium ${scrolled ? "text-foreground" : "text-card/90"}`}>
            Week {weekData.week}: {weekData.title}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/course" className={`flex items-center gap-1.5 text-sm font-body transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-card/70 hover:text-card"}`}>
              <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button onClick={() => { setBookmarked(!bookmarked); }} className={`p-2 rounded-lg transition-colors ${scrolled ? "hover:bg-secondary" : "hover:bg-card/10"}`}>
              {bookmarked
                ? <BookmarkCheck className={`w-5 h-5 ${scrolled ? "text-primary" : "text-card"}`} />
                : <Bookmark className={`w-5 h-5 ${scrolled ? "text-muted-foreground" : "text-card/70"}`} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── CINEMATIC HERO (Ken Burns + parallax + particles) ─── */}
      <DayHeroCinema
        dayNumber={dayNumber}
        weekNumber={weekData.week}
        title={day.title}
        duration={day.duration}
        difficulty={day.difficulty}
        onBegin={startSession}
        onListenOnly={() => {
          if (isLockedDay) {
            setPremiumGate({
              feature: `Day ${dayNumber} is a Plus chapter`,
              description: "Unlock Days 8–30 with Willow Plus to listen to the full guided narration.",
            });
            return;
          }
          if (tts.hasAudio) tts.togglePlayPause();
          else tts.generateAndPlay(day.guidedPractice.join("\n\n"), {
            trackKey: `day-${dayNumber}-listen-${selectedVoice}`,
            category: "daily_meditation",
            title: `Day ${dayNumber} · ${day.title}`,
            voice: selectedVoice,
            ambientBed: null,
            isPremium: !FREE_VOICES.includes(selectedVoice),
          });
        }}
        onReadFirst={() => {
          document.getElementById("guided-practice")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[800px] mx-auto px-6 py-12 space-y-12">

        {/* ─── AI DAILY INSIGHT (personalized framing) ─── */}
        {isPremium ? (
          <AIDailyInsight dayNumber={dayNumber} practice={day.practice} focus={day.focus} />
        ) : (
          <button
            onClick={() => setPremiumGate({
              feature: "AI Daily Insight",
              description: "A personalized AI-crafted framing for today's practice — written for your week, your streak, and your patterns. Plus members get a fresh insight every day.",
            })}
            className="relative w-full overflow-hidden rounded-2xl text-left bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--charcoal))] p-6 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] border border-[hsl(var(--gold))]/25 hover:scale-[1.01] transition-transform"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[hsl(var(--gold))]/15 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-[hsl(var(--gold))]" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold))] mb-1.5">
                  Today, for you · Plus
                </p>
                <p className="font-display text-base text-white/90 leading-relaxed italic">
                  "Unlock a personalized AI reflection written for your week and your patterns…"
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-body font-semibold text-[hsl(var(--gold))]">
                  <Crown className="w-3 h-3" /> Unlock with Willow Plus
                </span>
              </div>
            </div>
          </button>
        )}

        {/* ─── PROGRESS INDICATOR ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100/50 via-teal-50/30 to-sage-light/20 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-primary/5 rounded-2xl p-5 shadow-soft border border-primary/15">
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-bl from-primary/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Your Progress</span>
              <span className="text-xs font-body text-muted-foreground">Day {dayNumber} of 30 ({percentage}% Complete)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 30 }, (_, i) => {
                const num = i + 1;
                const isComplete = completedDays[i];
                const isCurrent = num === dayNumber;
                const locked = num >= 8 && !isPremium;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      if (locked) {
                        setPremiumGate({
                          feature: `Day ${num} is a Plus chapter`,
                          description: "Days 1–7 are free. Unlock the full 30-day program with Willow Plus.",
                        });
                        return;
                      }
                      navigate(`/day/${num}`);
                    }}
                    className={`relative w-7 h-7 rounded-full text-[10px] font-body font-semibold transition-all duration-200 flex items-center justify-center
                      ${isCurrent ? "bg-gradient-to-r from-gold to-gold-dark text-card ring-2 ring-gold/30 scale-110 shadow-gold" : isComplete ? "bg-gradient-to-r from-primary to-primary/80 text-card shadow-sm" : locked ? "bg-card/40 text-muted-foreground/50" : "bg-card/60 text-muted-foreground hover:bg-card/80"}`}
                    title={locked ? `Day ${num} · Plus` : `Day ${num}`}
                  >
                    {locked ? <Lock className="w-3 h-3" /> : isComplete && !isCurrent ? <Check className="w-3 h-3" /> : num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── PREMIUM WISDOM CARD ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-100/60 via-purple-50/40 to-indigo-50/30 dark:from-violet-900/20 dark:via-purple-900/10 dark:to-indigo-900/5 rounded-2xl border border-violet-500/20 p-8 shadow-soft cursor-pointer hover:shadow-md transition-all" onClick={() => setShowWisdomDialog(true)}>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-violet-200/20 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{selectedWisdom.icon}</span>
              <Lightbulb className="w-5 h-5 text-violet-500/60" />
            </div>
            <p className="text-xs font-body font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-2">Daily Wisdom</p>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">{selectedWisdom.title}</h3>
            <p className="font-body text-base text-foreground/80 italic leading-relaxed">{selectedWisdom.insight}</p>
            <p className="text-xs font-body text-muted-foreground mt-4 pt-4 border-t border-violet-500/10">✨ Click to explore more wisdom</p>
          </div>
        </div>

        {/* ─── QUOTE ─── */}
        <blockquote className="relative pl-6 border-l-[3px] border-primary/30">
          <p className="font-display text-xl md:text-2xl italic text-accent-foreground leading-relaxed">"{day.quote}"</p>
          <footer className="text-sm font-body text-muted-foreground mt-2">— {day.quoteAuthor}</footer>
        </blockquote>

        {/* ─── TODAY'S FOCUS CARD ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/60 via-yellow-50/40 to-orange-50/30 dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-gold/5 rounded-2xl border border-gold/20 p-8 shadow-soft">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-gold/15 to-transparent" />
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-amber-200/15 to-transparent rounded-tr-full" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">{dayEmojis[dayNumber] || "🧘"}</div>
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-gold">Today's Focus</span>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-2 mb-3">{day.focus}</h2>
            <p className="text-base font-body text-muted-foreground leading-relaxed">{day.benefits}</p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Target, label: "Practice", value: day.practice },
                { icon: Clock, label: "Duration", value: day.duration },
                { icon: Gauge, label: "Level", value: day.difficulty },
                { icon: Sun, label: "Best Time", value: day.bestTime },
                { icon: Sparkles, label: "Focus", value: day.focus },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 shadow-sm">
                  <item.icon className="w-3.5 h-3.5 text-gold mb-1" />
                  <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-body text-foreground mt-0.5 line-clamp-2">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SOUND BED DESIGNER (ambient + binaural + bowls) ─── */}
        <SoundBedDesigner defaultBed={getDayHero(dayNumber).ambientBed} />

        {/* ─── SCIENCE BOX ─── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100/70 via-orange-50/50 to-yellow-50/40 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-gold/10 border border-gold/25 p-8 shadow-soft">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-gold/15 to-transparent" />
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-amber-200/20 to-transparent rounded-tr-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/25 to-amber-500/20 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-gold" />
              </div>
              <div>
                <span className="text-xs font-body font-bold tracking-widest uppercase text-gold">The Science</span>
                <p className="text-sm font-display font-semibold text-foreground">Why This Works</p>
              </div>
            </div>
            <p className="text-base font-body leading-[2] text-foreground/85">{day.scienceText}</p>
            <p className="text-xs font-body text-muted-foreground mt-4 italic border-t border-gold/15 pt-3">📚 {day.scienceSource}</p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* ─── PREPARATION ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-100/50 via-sky-50/30 to-blue-50/20 dark:from-cyan-900/15 dark:via-sky-900/10 dark:to-blue-900/5 rounded-2xl p-8 border border-cyan-500/15 shadow-soft">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-bl from-sky-200/20 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🧘‍♀️</span>
              <h2 className="font-display text-xl font-semibold text-foreground">Before You Begin</h2>
            </div>
            <p className="font-body text-base leading-[2] text-foreground/80">{day.preparation}</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" /> Find a quiet, comfortable space</li>
              <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" /> Set timer for {day.duration}</li>
              <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" /> Turn off notifications</li>
              <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" /> Have your journal nearby</li>
            </ul>
          </div>
        </div>

        {/* ─── REAL AMBIENT MUSIC (curated per day) ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-4 h-4 text-[hsl(var(--gold))]" />
            <h3 className="font-display text-sm font-semibold text-foreground">Today's ambient soundscape</h3>
          </div>
          <AmbientMusicPlayer defaultTrack={pickTrackForDay(day.day)} />
          <p className="text-[11px] font-body text-muted-foreground mt-2 text-center">
            Press play, then start your guided practice below for the full experience.
          </p>
        </div>

        {/* ─── GUIDED PRACTICE ─── */}
        <div id="guided-practice">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-6">Your Guided Practice</h2>
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100/40 via-teal-50/25 to-sage-light/15 dark:from-emerald-900/15 dark:via-teal-900/10 dark:to-primary/5 rounded-2xl border border-primary/15 p-6 md:p-10 space-y-5 shadow-soft">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-primary/8 to-transparent" />
            <div className="absolute bottom-0 right-0 w-32 h-16 bg-gradient-to-tl from-sage/10 to-transparent rounded-tl-full" />
            {day.guidedPractice.map((para, i) => {
              const isPause = para.startsWith("[");
              return (
                <p
                  key={i}
                  className={`font-body leading-[2.2] relative z-10 ${
                    isPause
                      ? "text-primary/60 italic text-sm pl-4 border-l-2 border-primary/20"
                      : "text-foreground/85 text-[17px]"
                  }`}
                >
                  {para}
                </p>
              );
            })}
          </div>
        </div>

        {/* ─── AUDIO PLAYER ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-purple-50/20 dark:from-indigo-900/15 dark:via-violet-900/10 dark:to-purple-900/5 rounded-2xl border border-indigo-500/15 p-6 shadow-soft">
          <div className="text-center mb-4">
            <p className="text-xs font-body text-muted-foreground">🎙️ Narrated by Willow Vibes Coach · AI-Generated Voice</p>
            {tts.error && <p className="text-xs text-destructive mt-1">{tts.error}</p>}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (tts.hasAudio) {
                  tts.togglePlayPause();
                } else {
                  const fullScript = day.guidedPractice.join("\n\n");
                  tts.generateAndPlay(fullScript);
                }
              }}
              disabled={tts.isLoading}
              className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg hover:scale-105 transition-transform flex-shrink-0 disabled:opacity-60"
            >
              {tts.isLoading ? (
                <Loader2 className="w-6 h-6 text-card animate-spin" />
              ) : tts.isPlaying ? (
                <Pause className="w-6 h-6 text-card" />
              ) : (
                <Play className="w-6 h-6 text-card ml-0.5" />
              )}
            </button>
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${tts.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-body text-muted-foreground">
                <span>{tts.formatTime(tts.currentTime)}</span>
                <span>{tts.duration > 0 ? tts.formatTime(tts.duration) : day.duration}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {tts.isPlaying && (
                <button onClick={tts.stop} className="text-muted-foreground hover:text-foreground p-1" title="Stop">
                  <Square className="w-4 h-4" />
                </button>
              )}
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          {tts.isLoading && (
            <p className="text-center text-xs font-body text-muted-foreground mt-3 animate-pulse">
              ✨ Generating calming narration for you...
            </p>
          )}
        </div>

        {/* ─── TIMER ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-100/50 via-pink-50/30 to-fuchsia-50/20 dark:from-rose-900/15 dark:via-pink-900/10 dark:to-fuchsia-900/5 rounded-2xl border border-gold/20 p-8 text-center shadow-soft">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-bl from-gold/10 to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <Timer className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">Practice Timer · 6 BPM Coherence</p>
            <HeartCoherenceRing size={220} bpm={6}>
              <p className="font-display text-5xl font-bold text-foreground">{timer.display}</p>
            </HeartCoherenceRing>
            <div className="h-6" />
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => timer.reset(durationMins)}
                className="px-4 py-2.5 rounded-xl text-sm font-body font-medium bg-card/70 backdrop-blur-sm text-muted-foreground hover:bg-card/90 transition-colors border border-border/30"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  if (!sessionStarted) startSession();
                  timer.toggle();
                }}
                className={`px-8 py-3 rounded-xl text-sm font-body font-semibold transition-all shadow-md ${
                  timer.running
                    ? "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground hover:from-destructive/90"
                    : "bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-gold shadow-gold"
                }`}
              >
                {timer.running ? "Pause" : timer.seconds === durationMins * 60 ? "Begin Timer" : "Resume"}
              </button>
              <button
                onClick={timer.extend}
                className="px-4 py-2.5 rounded-xl text-sm font-body font-medium bg-card/70 backdrop-blur-sm text-muted-foreground hover:bg-card/90 transition-colors border border-border/30"
              >
                +5 min
              </button>
            </div>
            {timer.seconds === 0 && (
              <p className="mt-4 text-sm font-body text-primary font-medium animate-fade-in">✨ Timer complete! Well done.</p>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* ─── COACH'S NOTE ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100/60 via-teal-50/40 to-sage-light/30 dark:from-emerald-900/20 dark:via-teal-900/10 dark:to-primary/5 rounded-2xl border border-primary/15 p-8 shadow-soft">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-primary/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-sage/10 to-transparent rounded-tr-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-sage/30 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-body font-bold tracking-widest uppercase text-primary">Coach's Note</span>
            </div>
            <p className="font-body text-base leading-[2] text-foreground/80 italic">{day.coachNote}</p>
            <p className="text-sm font-body text-primary mt-4 font-medium">— Your Willow Vibes Coach 💚</p>
          </div>
        </div>

        {/* ─── REFLECTION PROMPTS ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-100/50 via-purple-50/30 to-indigo-50/20 dark:from-violet-900/15 dark:via-purple-900/10 dark:to-indigo-900/5 rounded-2xl border border-violet-500/15 p-8 shadow-soft">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-violet-200/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-purple-200/15 to-transparent rounded-tr-full" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Today's Reflection</h2>
            <p className="text-xs font-body text-muted-foreground mb-6">🔒 Your reflections are private and saved locally.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-display font-semibold text-foreground mb-2">
                  {day.reflectionPrompt}
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full h-36 p-4 rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm font-body text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-base font-display font-semibold text-foreground mb-3">
                  On a scale of 1-10, how calm do you feel now compared to before?
                </label>
                <div className="px-2">
                  <Slider value={calmRating} onValueChange={setCalmRating} min={1} max={10} step={1} className="mb-2" />
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>1 — Restless</span>
                    <span className="text-lg font-display font-bold text-primary">{calmRating[0]}</span>
                    <span>10 — Deeply Calm</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-base font-display font-semibold text-foreground mb-2">
                  What was the biggest challenge you faced today?
                </label>
                <textarea
                  value={challengeText}
                  onChange={(e) => setChallengeText(e.target.value)}
                  placeholder="Describe any challenges..."
                  className="w-full h-24 p-4 rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm font-body text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-base font-display font-semibold text-foreground mb-2">
                  What's one thing you want to remember from today?
                </label>
                <textarea
                  value={rememberText}
                  onChange={(e) => setRememberText(e.target.value)}
                  placeholder="One key takeaway..."
                  className="w-full h-20 p-4 rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm font-body text-base text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={autoSave}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white font-body font-semibold text-base shadow-gold hover:shadow-lg transition-all"
            >
              Save Reflections
            </button>
            {(reflection || challengeText || rememberText) && (
              <p className="text-center text-xs font-body text-primary mt-2">💾 Auto-saved</p>
            )}
          </div>
        </div>

        {/* ─── MOOD DELTA (before vs after) ─── */}
        <MoodDeltaChart moodBefore={moodBefore[0]} moodAfter={moodAfter[0]} />

        {/* ─── DAILY TRACKER ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-100/50 via-teal-50/30 to-green-50/20 dark:from-emerald-900/15 dark:via-teal-900/10 dark:to-green-900/5 rounded-2xl border border-primary/15 p-8 shadow-soft">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-bl from-primary/10 to-transparent" />
          <div className="relative z-10">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">Mark Your Progress</h3>
            <div className="space-y-4">
              {[
                "I completed today's guided meditation",
                "I listened to the audio OR read the script",
                "I reflected on my experience",
                "I'm ready for tomorrow's practice",
              ].map((label, idx) => (
                <label key={idx} className="flex items-center gap-4 cursor-pointer group p-2 rounded-xl hover:bg-card/40 transition-colors">
                  <div className="relative">
                    <Checkbox
                      checked={checklist[idx]}
                      onCheckedChange={() => toggleCheck(idx)}
                      className="w-7 h-7 rounded-lg border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                    />
                  </div>
                  <span className={`font-body text-base transition-colors ${checklist[idx] ? "text-primary font-medium line-through" : "text-foreground"}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {allComplete && (
              <div className="mt-6 p-4 rounded-xl bg-primary/10 text-center animate-fade-in">
                <p className="text-lg font-display font-semibold text-primary">🌟 Day {dayNumber} Complete!</p>
                <p className="text-sm font-body text-foreground/70 mt-1">
                  You're building something powerful. {nextDay ? `See you tomorrow for Day ${nextDay}.` : "You completed the entire challenge! 🎉"}
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-4 text-sm font-body text-muted-foreground">
              <span>🔥 Current streak: {completedDays.filter(Boolean).length} day{completedDays.filter(Boolean).length !== 1 ? "s" : ""}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Total: {completedDays.filter(Boolean).length}/30</span>
            </div>
          </div>
        </div>

        {/* ─── WEEK OVERVIEW ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-100/50 via-cyan-50/30 to-blue-50/20 dark:from-sky-900/15 dark:via-cyan-900/10 dark:to-blue-900/5 rounded-2xl border border-sky-500/15 p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">This Week's Journey</h3>
          <div className="space-y-2">
            {weekData.days.map(d => {
              const dc = completedDays[d.day - 1];
              const isCurrent = d.day === dayNumber;
              return (
                <button
                  key={d.day}
                  onClick={() => navigate(`/day/${d.day}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isCurrent ? "bg-gold/10 border border-gold/30" : dc ? "hover:bg-secondary/60" : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-body font-bold ${
                    dc && !isCurrent ? "bg-primary text-card" : isCurrent ? "bg-gold text-card" : "bg-secondary text-muted-foreground"
                  }`}>
                    {dc && !isCurrent ? <Check className="w-3 h-3" /> : d.day}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-body truncate ${isCurrent ? "font-semibold text-foreground" : "text-foreground/70"}`}>
                      Day {d.day}: {d.title}
                    </p>
                  </div>
                  {isCurrent && <span className="text-xs font-body text-gold font-medium">Current →</span>}
                  {dc && !isCurrent && <span className="text-xs text-primary">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── NAVIGATION ─── */}
        <div className="flex items-center justify-between gap-4 pt-4 pb-8">
          {prevDay ? (
            <button
              onClick={() => navigate(`/day/${prevDay}`)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary/10 text-primary font-body font-medium text-sm hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Day {prevDay}
            </button>
          ) : <div />}

          <Link
            to="/course"
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-card text-foreground font-body text-sm hover:bg-secondary/60 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>

          {nextDay ? (
            <button
              onClick={() => navigate(`/day/${nextDay}`)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-card font-body font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md"
            >
              Day {nextDay} <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/course")}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-card font-body font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md"
            >
              Complete! 🎉 <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* ─── WISDOM DIALOG ─── */}
      {showWisdomDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border/50">
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{selectedWisdom.icon}</span>
              <button onClick={() => setShowWisdomDialog(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{selectedWisdom.title}</h2>
            <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6 italic">{selectedWisdom.insight}</p>
            <div className="space-y-2">
              {WISDOM_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWisdom(card)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedWisdom.title === card.title ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary/60"
                  }`}
                >
                  <p className="text-sm font-body font-semibold text-foreground">{card.icon} {card.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── INTENTION RITUAL (pre-session 3-step flow) ─── */}
      <IntentionRitual
        open={showIntention}
        initialIntention={intentionWord}
        initialMoodBefore={moodBefore[0]}
        onClose={() => setShowIntention(false)}
        onComplete={handleIntentionComplete}
      />

      {/* ─── PRACTICE MODE (full-screen cinema) ─── */}
      <PracticeMode
        open={showPractice}
        dayNumber={dayNumber}
        title={day.title}
        paragraphs={day.guidedPractice}
        tts={tts}
        onClose={() => {
          setShowPractice(false);
          tts.stop();
          // Capture mood-after via the calmRating slider state
          setMoodAfter(calmRating);
          toggleCheck(0);
        }}
      />
    </div>
  );
}
