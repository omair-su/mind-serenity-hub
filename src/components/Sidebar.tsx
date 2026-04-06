import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { weeks } from "@/data/courseData";
import { getProfile } from "@/lib/userStore";
import {
  ChevronDown, ChevronRight, Menu, X, Leaf, BookOpen, FlaskConical, Brain, Heart, Home,
  LayoutDashboard, Library, BarChart3, Trophy, Smile, Zap, Wind, Moon, Timer,
  Settings, HelpCircle, FolderOpen, Award, Sparkles, MessageCircle,
  Headphones, Target, Sun, Footprints, Flower2, Users, GraduationCap, ScanEye
} from "lucide-react";
import WillowLogo from "@/components/WillowLogo";

const foundationItems = [
  { id: "welcome", label: "Welcome", icon: Home, path: "/course" },
  { id: "how-to-use", label: "How to Use", icon: BookOpen, path: "/course/how-to-use" },
  { id: "science", label: "The Science", icon: FlaskConical, path: "/course/science" },
  { id: "expectations", label: "What to Expect", icon: Brain, path: "/course/expectations" },
  { id: "assessment", label: "Assessment", icon: Heart, path: "/course/assessment" },
];

const coreItems = [
  { label: "Library", path: "/app/library", icon: Library },
  { label: "Analytics", path: "/app/analytics", icon: BarChart3 },
  { label: "Journal", path: "/app/journal", icon: BookOpen },
  { label: "Achievements", path: "/app/achievements", icon: Trophy },
  { label: "Mood Tracker", path: "/app/mood", icon: Smile },
  { label: "SOS Relief", path: "/app/sos", icon: Zap },
  { label: "Breathing", path: "/app/breathing", icon: Wind },
  { label: "Sleep", path: "/app/sleep", icon: Moon },
  { label: "Timer", path: "/app/timer", icon: Timer },
];

const premiumItems = [
  { label: "Affirmations", path: "/app/affirmations", icon: Sparkles },
  { label: "Coach", path: "/app/coach", icon: MessageCircle },
  { label: "Sleep Stories", path: "/app/sleep-stories", icon: BookOpen },
  { label: "Sound Bath", path: "/app/sound-bath", icon: Headphones },
  { label: "Challenges", path: "/app/challenges", icon: Target },
  { label: "Daily Rituals", path: "/app/rituals", icon: Sun },
  { label: "Focus Mode", path: "/app/focus", icon: Brain },
  { label: "Body Scan", path: "/app/body-scan", icon: ScanEye },
  { label: "Gratitude Garden", path: "/app/gratitude", icon: Flower2 },
  { label: "Masterclass", path: "/app/masterclass", icon: GraduationCap },
  { label: "Community", path: "/app/community", icon: Users },
  { label: "Walking Meditation", path: "/app/walking", icon: Footprints },
];

const utilityItems = [
  { label: "Resources", path: "/app/resources", icon: FolderOpen },
  { label: "Certificate", path: "/app/certificate", icon: Award },
  { label: "Help", path: "/app/help", icon: HelpCircle },
  { label: "Settings", path: "/app/profile", icon: Settings },
];

export default function Sidebar() {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(getProfile());
  const navigate = useNavigate();
  const location = useLocation();

  const refreshProfile = useCallback(() => setProfile(getProfile()), []);
  useEffect(() => {
    window.addEventListener("wv-settings-changed", refreshProfile);
    return () => window.removeEventListener("wv-settings-changed", refreshProfile);
  }, [refreshProfile]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev =>
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ path, icon: Icon, label, isPremium }: { path: string; icon: any; label: string; isPremium?: boolean }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => handleNav(path)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-body transition-all ${
          active
            ? "bg-gradient-to-r from-primary/12 to-sage/15 text-primary font-medium shadow-sm"
            : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
        }`}
      >
        <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : isPremium ? "text-gold/70" : ""}`} />
        <span className="flex-1 text-left">{label}</span>
        {isPremium && (
          <span className="text-[8px] font-body font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-gold/15 to-amber-500/10 text-gold border border-gold/20 flex-shrink-0 tracking-wider">
            PRO
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-card shadow-soft border border-border"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-card via-card to-card/95 border-r border-border/70 z-40 overflow-y-auto transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-5 border-b border-border/70">
          <div className="cursor-pointer group" onClick={() => handleNav("/")}>
            <WillowLogo variant="horizontal" size="sm" className="group-hover:opacity-90 transition-opacity" />
          </div>
        </div>

        <div className="p-3">
          <NavButton path="/app" icon={LayoutDashboard} label="Dashboard" />
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="p-3">
          <p className="text-[10px] font-body font-semibold text-muted-foreground tracking-widest uppercase mb-2 px-3">Foundation</p>
          {foundationItems.map(section => (
            <NavButton key={section.path} path={section.path} icon={section.icon} label={section.label} />
          ))}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="p-3">
          <p className="text-[10px] font-body font-semibold text-muted-foreground tracking-widest uppercase mb-2 px-3">30-Day Practices</p>
          {weeks.map(week => (
            <div key={week.week} className="mb-1">
              <button
                onClick={() => toggleWeek(week.week)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-body font-medium text-foreground hover:bg-secondary/80 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Week {week.week}</span>
                </div>
                {expandedWeeks.includes(week.week)
                  ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                }
              </button>
              {expandedWeeks.includes(week.week) && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  <button
                    onClick={() => handleNav(`/week/${week.week}`)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-body transition-all ${
                      isActive(`/week/${week.week}`)
                        ? "bg-gradient-to-r from-primary/10 to-sage/15 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    Week {week.week} Overview
                  </button>
                  {week.days.map(day => (
                    <button
                      key={day.day}
                      onClick={() => handleNav(`/day/${day.day}`)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-body transition-all ${
                        isActive(`/day/${day.day}`)
                          ? "bg-gradient-to-r from-primary/10 to-sage/15 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      Day {day.day}: {day.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="p-3">
          <p className="text-[10px] font-body font-semibold text-muted-foreground tracking-widest uppercase mb-2 px-3">Platform</p>
          {coreItems.map(item => (
            <NavButton key={item.path} {...item} />
          ))}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div className="p-3">
          <p className="text-[10px] font-body font-semibold text-gold/70 tracking-widest uppercase mb-2 px-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Premium
          </p>
          {premiumItems.map(item => (
            <NavButton key={item.path} {...item} isPremium />
          ))}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="p-3">
          <p className="text-[10px] font-body font-semibold text-muted-foreground tracking-widest uppercase mb-2 px-3">Utilities</p>
          {utilityItems.map(item => (
            <NavButton key={item.path} {...item} />
          ))}
        </div>

        <div className="p-3 mt-2 border-t border-border/50">
          <button
            onClick={() => handleNav("/app/profile")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              isActive("/app/profile")
                ? "bg-gradient-to-r from-primary/12 to-sage/15 shadow-sm"
                : "hover:bg-secondary/80"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-sage/25 flex items-center justify-center text-lg flex-shrink-0 ring-2 ring-primary/20">
              {profile.avatarEmoji || "🧘"}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-body font-medium text-foreground truncate">
                {profile.name || "Meditator"}
              </p>
              <p className="text-[10px] font-body text-muted-foreground capitalize">
                {profile.experience || "beginner"}
              </p>
            </div>
          </button>
          <p className="text-[9px] text-muted-foreground/60 font-body mt-2 text-center">
            © 2025 Willow Vibes™
          </p>
        </div>
      </aside>
    </>
  );
}
