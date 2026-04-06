import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Users, Globe, Heart, MessageCircle, Clock, Flame, Star, Trophy, Radio, Sparkles } from "lucide-react";

interface LiveSession {
  id: string;
  title: string;
  host: string;
  participants: number;
  type: string;
  gradient: string;
  startedAgo: string;
  duration: string;
}

const liveSessions: LiveSession[] = [
  { id: "1", title: "Morning Stillness Circle", host: "Maya S.", participants: 127, type: "Group Meditation", gradient: "from-violet-500 to-purple-600", startedAgo: "12 min ago", duration: "30 min" },
  { id: "2", title: "Breathwork Power Hour", host: "Alex K.", participants: 84, type: "Breathwork", gradient: "from-cyan-500 to-teal-600", startedAgo: "5 min ago", duration: "60 min" },
  { id: "3", title: "Loving-Kindness Flow", host: "Sarah L.", participants: 203, type: "Metta", gradient: "from-rose-500 to-pink-600", startedAgo: "18 min ago", duration: "20 min" },
];

const communityStats = [
  { label: "Meditating Now", value: "2,847", icon: Radio, gradient: "from-emerald-500 to-green-600", pulse: true },
  { label: "Global Members", value: "148K", icon: Globe, gradient: "from-violet-500 to-purple-600" },
  { label: "Sessions Today", value: "1,204", icon: Flame, gradient: "from-amber-500 to-orange-600" },
];

const topMembers = [
  { name: "Aria M.", streak: 180, emoji: "🧘‍♀️", badge: "Zen Master" },
  { name: "James P.", streak: 142, emoji: "🌟", badge: "Luminary" },
  { name: "Priya S.", streak: 98, emoji: "💎", badge: "Diamond Mind" },
  { name: "Leo C.", streak: 87, emoji: "🔥", badge: "Fire Keeper" },
  { name: "Nina W.", streak: 75, emoji: "🌸", badge: "Blossom" },
];

const milestones = [
  { title: "First Group Session", desc: "Join your first live circle", icon: "🌱", done: false },
  { title: "Streak Sharer", desc: "Share a 7-day streak", icon: "🔥", done: false },
  { title: "Heart Giver", desc: "Send 10 encouragements", icon: "💝", done: false },
  { title: "Community Pillar", desc: "Meditate with 50+ people", icon: "🏛️", done: false },
];

export default function CommunityPage() {
  const [meditatingNow, setMeditatingNow] = useState(2847);
  
  // Simulate live count
  useEffect(() => {
    const i = setInterval(() => {
      setMeditatingNow(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white">
          <div className="absolute inset-0">
            <div className="absolute top-6 right-10 w-32 h-32 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="absolute bottom-2 left-6 w-24 h-24 rounded-full bg-cyan-400/20 blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"><Users className="w-5 h-5" /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Global Community</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Community Circle</h1>
            <p className="text-sm text-white/80">Meditate together with thousands of souls worldwide. You're never alone on this journey.</p>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-3">
          {communityStats.map(s => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.gradient} p-3 text-white text-center relative overflow-hidden`}>
              {s.pulse && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />}
              <s.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{s.label === "Meditating Now" ? meditatingNow.toLocaleString() : s.value}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live Sessions */}
        <div>
          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Sessions
          </h3>
          <div className="space-y-3">
            {liveSessions.map(session => (
              <div key={session.id} className={`rounded-xl bg-gradient-to-r ${session.gradient} p-4 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider text-white/70">Live · {session.startedAgo}</span>
                    </div>
                    <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">{session.type}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{session.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">Hosted by {session.host} · {session.duration}</span>
                    <div className="flex items-center gap-1 text-xs">
                      <Users className="w-3 h-3" />
                      <span>{session.participants}</span>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3 w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 text-white text-xs">
                    Join Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/40 p-5">
          <h3 className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" /> Community Leaders
          </h3>
          <div className="space-y-2.5">
            {topMembers.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/80 border border-amber-100">
                <span className={`text-sm font-bold w-5 text-center ${i === 0 ? "text-amber-600" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-800" : "text-slate-500"}`}>
                  {i + 1}
                </span>
                <span className="text-lg">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 block truncate">{m.name}</span>
                  <span className="text-[10px] text-amber-600">{m.badge}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-700">{m.streak}</span>
                  <span className="text-[10px] text-slate-500 block">days</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Milestones */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/40 p-5">
          <h3 className="font-bold text-sm text-violet-900 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-violet-600" /> Community Milestones
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {milestones.map(m => (
              <div key={m.title} className="rounded-xl bg-white/80 border border-violet-100 p-3 text-center">
                <div className="text-2xl mb-1">{m.icon}</div>
                <p className="text-xs font-semibold text-slate-800">{m.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 p-5 text-white text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium">Send love to someone meditating right now</p>
          <Button size="sm" className="mt-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 text-white">
            <Sparkles className="w-3 h-3 mr-1" /> Send Encouragement
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
