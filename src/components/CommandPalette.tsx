// Global command palette — Cmd/Ctrl+K. Premium fast-nav across every feature.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home, Compass, BookOpen, Library, Trophy, LifeBuoy, Wind, Moon, Timer,
  Heart, Sparkles, MessageCircle, HelpCircle, Headphones, Music, Flame,
  Leaf, Focus, Footprints, Activity, Brain, Download, User, BarChart3,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
  group: "Today" | "Practices" | "Library" | "You";
}

const ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/app", icon: Home, group: "Today", keywords: "home today" },
  { label: "Explore", path: "/app/explore", icon: Compass, group: "Today" },
  { label: "Mood Tracker", path: "/app/mood", icon: Heart, group: "Today", keywords: "feelings emotion checkin" },
  { label: "Journal", path: "/app/journal", icon: BookOpen, group: "Today", keywords: "reflection notes" },
  { label: "AI Coach", path: "/app/coach", icon: MessageCircle, group: "Today", keywords: "chat assistant" },

  { label: "Breathing", path: "/app/breathing", icon: Wind, group: "Practices", keywords: "box pranayama" },
  { label: "Timer", path: "/app/timer", icon: Timer, group: "Practices", keywords: "meditation custom session" },
  { label: "Body Scan", path: "/app/body-scan", icon: Brain, group: "Practices" },
  { label: "Walking Meditation", path: "/app/walking", icon: Footprints, group: "Practices" },
  { label: "Focus Mode", path: "/app/focus", icon: Focus, group: "Practices", keywords: "deep work pomodoro" },
  { label: "SOS / Calm Now", path: "/app/sos", icon: LifeBuoy, group: "Practices", keywords: "panic anxiety emergency" },
  { label: "Gratitude", path: "/app/gratitude", icon: Leaf, group: "Practices" },
  { label: "Affirmations", path: "/app/affirmations", icon: Sparkles, group: "Practices" },
  { label: "Rituals", path: "/app/rituals", icon: Flame, group: "Practices" },
  { label: "Challenges", path: "/app/challenges", icon: Trophy, group: "Practices" },

  { label: "Library", path: "/app/library", icon: Library, group: "Library" },
  { label: "Sleep", path: "/app/sleep", icon: Moon, group: "Library" },
  { label: "Sleep Stories", path: "/app/sleep-stories", icon: Headphones, group: "Library" },
  { label: "Sound Bath", path: "/app/sound-bath", icon: Music, group: "Library" },
  { label: "Soundscape Builder", path: "/app/soundscape-builder", icon: Music, group: "Library", keywords: "mix nature" },
  { label: "Offline Downloads", path: "/app/offline-downloads", icon: Download, group: "Library" },
  { label: "Resources", path: "/app/resources", icon: BookOpen, group: "Library" },

  { label: "Achievements", path: "/app/achievements", icon: Trophy, group: "You" },
  { label: "Analytics", path: "/app/analytics", icon: Activity, group: "You" },
  { label: "Advanced Analytics", path: "/app/advanced-analytics", icon: BarChart3, group: "You", keywords: "insights stats" },
  { label: "AI Recommendations", path: "/app/ai-recommendations", icon: Sparkles, group: "You" },
  { label: "Profile", path: "/app/profile", icon: User, group: "You", keywords: "settings account" },
  { label: "Help", path: "/app/help", icon: HelpCircle, group: "You", keywords: "support faq" },
];

const GROUPS: NavItem["group"][] = ["Today", "Practices", "Library", "You"];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search practices, pages, tools…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {GROUPS.map((g, gi) => (
          <div key={g}>
            {gi > 0 && <CommandSeparator />}
            <CommandGroup heading={g}>
              {ITEMS.filter((i) => i.group === g).map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.path}
                    value={`${item.label} ${item.keywords ?? ""}`}
                    onSelect={() => go(item.path)}
                  >
                    <Icon className="mr-2 h-4 w-4 text-[hsl(var(--gold))]" />
                    <span>{item.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
