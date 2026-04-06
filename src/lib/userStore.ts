// Central user data persistence layer using localStorage

export interface UserProfile {
  name: string;
  email: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  dailyMinutes: number;
  reminderTime: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  onboardingComplete: boolean;
  joinDate: string;
  avatarEmoji: string;
  stressLevel: string;
  stressManagement: string;
  desiredFeeling: string;
}

export interface MoodEntry {
  date: string;
  dayNum: number;
  before: number;
  after: number;
  energy: number;
  focus: number;
  note: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'consistency' | 'completion' | 'time' | 'engagement' | 'mastery';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
  progress: number;
  target: number;
}

export interface DayState {
  reflection: string;
  calmRating: number;
  challengeText: string;
  rememberText: string;
  checklist: boolean[];
  bookmarked: boolean;
  completedAt?: string;
  moodBefore?: number;
  moodAfter?: number;
  duration?: number;
}

const PROFILE_KEY = 'wv-profile';
const MOOD_KEY = 'wv-moods';
const STREAK_KEY = 'wv-streak';
const TIMER_SESSIONS_KEY = 'wv-timer-sessions';

export function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    name: '',
    email: '',
    experience: 'beginner',
    goals: [],
    preferredTime: 'morning',
    dailyMinutes: 15,
    reminderTime: '07:00',
    theme: 'light',
    fontSize: 'medium',
    reduceMotion: false,
    onboardingComplete: false,
    joinDate: new Date().toISOString(),
    avatarEmoji: '🧘',
    stressLevel: '',
    stressManagement: '',
    desiredFeeling: '',
  };
}

export function saveProfile(profile: UserProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
  window.dispatchEvent(new Event("wv-settings-changed"));
}

export function getDayState(dayNum: number): DayState | null {
  try {
    const raw = localStorage.getItem(`wv-day-${dayNum}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveDayState(dayNum: number, state: DayState) {
  try { localStorage.setItem(`wv-day-${dayNum}`, JSON.stringify(state)); } catch {}
}

export function getAllDayStates(): Record<number, DayState> {
  const states: Record<number, DayState> = {};
  for (let i = 1; i <= 30; i++) {
    const s = getDayState(i);
    if (s) states[i] = s;
  }
  return states;
}

export function getCompletedDays(): number[] {
  const completed: number[] = [];
  for (let i = 1; i <= 30; i++) {
    const s = getDayState(i);
    if (s?.checklist?.every(Boolean)) completed.push(i);
  }
  return completed;
}

export function getTotalMinutes(): number {
  let total = 0;
  for (let i = 1; i <= 30; i++) {
    const s = getDayState(i);
    if (s?.checklist?.every(Boolean)) {
      total += s.duration || 15;
    }
  }
  return total;
}

export function getCurrentStreak(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    let foundForDate = false;
    for (let d = 1; d <= 30; d++) {
      const s = getDayState(d);
      if (s?.completedAt && s.completedAt.startsWith(dateStr) && s.checklist?.every(Boolean)) {
        foundForDate = true;
        break;
      }
    }
    
    if (foundForDate) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function getLongestStreak(): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return data.longest || 0;
    }
  } catch {}
  return getCurrentStreak();
}

export function saveLongestStreak(streak: number) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify({ longest: streak })); } catch {}
}

export function getMoods(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(MOOD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveMood(entry: MoodEntry) {
  const moods = getMoods();
  moods.push(entry);
  try { localStorage.setItem(MOOD_KEY, JSON.stringify(moods)); } catch {}
}

export function getTimerSessions(): { date: string; duration: number; type: string }[] {
  try {
    const raw = localStorage.getItem(TIMER_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveTimerSession(session: { date: string; duration: number; type: string }) {
  const sessions = getTimerSessions();
  sessions.push(session);
  try { localStorage.setItem(TIMER_SESSIONS_KEY, JSON.stringify(sessions)); } catch {}
}

// Achievement definitions
export function getAchievementDefinitions(): Achievement[] {
  return [
    { id: 'first-steps', name: 'First Steps', description: 'Complete your first meditation', category: 'consistency', icon: '🌱', rarity: 'common', progress: 0, target: 1 },
    { id: 'week-warrior', name: 'Week Warrior', description: '7-day practice streak', category: 'consistency', icon: '🔥', rarity: 'common', progress: 0, target: 7 },
    { id: 'fortnight-focus', name: 'Fortnight Focus', description: '14-day practice streak', category: 'consistency', icon: '💪', rarity: 'rare', progress: 0, target: 14 },
    { id: 'dedication', name: 'Dedication', description: '21-day streak — habit formed', category: 'consistency', icon: '🏆', rarity: 'epic', progress: 0, target: 21 },
    { id: 'unstoppable', name: 'Unstoppable', description: '30-day streak', category: 'consistency', icon: '👑', rarity: 'legendary', progress: 0, target: 30 },
    { id: 'week-one', name: 'Week One Complete', description: 'Finish all 7 days of Week 1', category: 'completion', icon: '⭐', rarity: 'common', progress: 0, target: 7 },
    { id: 'halfway', name: 'Halfway Hero', description: 'Complete Day 15', category: 'completion', icon: '🎯', rarity: 'rare', progress: 0, target: 15 },
    { id: 'graduate', name: 'Program Graduate', description: 'Complete all 30 days', category: 'completion', icon: '🎓', rarity: 'legendary', progress: 0, target: 30 },
    { id: 'first-hour', name: 'First Hour', description: '60 cumulative minutes of meditation', category: 'time', icon: '⏱️', rarity: 'common', progress: 0, target: 60 },
    { id: 'five-hours', name: 'Five Hours', description: '300 cumulative minutes', category: 'time', icon: '🕐', rarity: 'rare', progress: 0, target: 300 },
    { id: 'ten-hours', name: 'Ten Hours', description: '600 cumulative minutes', category: 'time', icon: '🕰️', rarity: 'epic', progress: 0, target: 600 },
    { id: 'reflective', name: 'Reflective Soul', description: 'Complete 10 reflections', category: 'engagement', icon: '📖', rarity: 'common', progress: 0, target: 10 },
    { id: 'journaler', name: 'Journaler', description: 'Complete all 30 reflections', category: 'engagement', icon: '📝', rarity: 'epic', progress: 0, target: 30 },
    { id: 'breath-master', name: 'Breath Master', description: 'Complete all Week 1 practices', category: 'mastery', icon: '🌬️', rarity: 'rare', progress: 0, target: 7 },
    { id: 'body-expert', name: 'Body Expert', description: 'Complete all Week 2 practices', category: 'mastery', icon: '🧘', rarity: 'rare', progress: 0, target: 7 },
    { id: 'heart-opener', name: 'Heart Opener', description: 'Complete all Week 3 practices', category: 'mastery', icon: '💚', rarity: 'rare', progress: 0, target: 7 },
    { id: 'integration', name: 'Integration Ninja', description: 'Complete Week 4', category: 'mastery', icon: '⚡', rarity: 'epic', progress: 0, target: 9 },
  ];
}

export function getEarnedAchievements(): Achievement[] {
  const defs = getAchievementDefinitions();
  const completed = getCompletedDays();
  const totalMinutes = getTotalMinutes();
  const streak = getCurrentStreak();
  const reflections = Object.values(getAllDayStates()).filter(s => s.reflection && s.reflection.length > 0).length;

  return defs.map(a => {
    let progress = 0;
    switch (a.id) {
      case 'first-steps': progress = Math.min(completed.length, 1); break;
      case 'week-warrior': progress = Math.min(streak, 7); break;
      case 'fortnight-focus': progress = Math.min(streak, 14); break;
      case 'dedication': progress = Math.min(streak, 21); break;
      case 'unstoppable': progress = Math.min(streak, 30); break;
      case 'week-one': progress = completed.filter(d => d <= 7).length; break;
      case 'halfway': progress = Math.min(completed.length, 15); break;
      case 'graduate': progress = completed.length; break;
      case 'first-hour': progress = Math.min(totalMinutes, 60); break;
      case 'five-hours': progress = Math.min(totalMinutes, 300); break;
      case 'ten-hours': progress = Math.min(totalMinutes, 600); break;
      case 'reflective': progress = Math.min(reflections, 10); break;
      case 'journaler': progress = Math.min(reflections, 30); break;
      case 'breath-master': progress = completed.filter(d => d <= 7).length; break;
      case 'body-expert': progress = completed.filter(d => d >= 8 && d <= 14).length; break;
      case 'heart-opener': progress = completed.filter(d => d >= 15 && d <= 21).length; break;
      case 'integration': progress = completed.filter(d => d >= 22 && d <= 30).length; break;
    }
    return {
      ...a,
      progress,
      earnedDate: progress >= a.target ? new Date().toISOString().split('T')[0] : undefined,
    };
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  const profile = getProfile();
  const name = profile.name || 'Beautiful Soul';
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export function getNextDay(): number {
  for (let i = 1; i <= 30; i++) {
    const s = getDayState(i);
    if (!s?.checklist?.every(Boolean)) return i;
  }
  return 30;
}
