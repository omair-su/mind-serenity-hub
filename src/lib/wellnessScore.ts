import { getCompletedDays, getCurrentStreak, getTotalMinutes, getMoods, getAllDayStates } from "./userStore";
import { getRitualStreak } from "@/data/rituals";
import { getChallengeProgress } from "@/data/challenges";

export interface WellnessBreakdown {
  total: number;
  consistency: number;
  depth: number;
  engagement: number;
  mood: number;
  growth: number;
}

export function getWellnessScore(): WellnessBreakdown {
  const completed = getCompletedDays();
  const streak = getCurrentStreak();
  const totalMinutes = getTotalMinutes();
  const moods = getMoods();
  const allStates = getAllDayStates();
  const ritualStreak = getRitualStreak();
  const challengeProgress = getChallengeProgress();

  const consistency = Math.min(100, Math.round(
    (streak / 30) * 40 +
    (completed.length / 30) * 40 +
    (ritualStreak / 7) * 20
  ));

  const depth = Math.min(100, Math.round(
    (totalMinutes / 450) * 60 +
    (completed.filter(d => {
      const s = allStates[d];
      return s && s.duration && s.duration >= 15;
    }).length / 30) * 40
  ));

  const reflections = Object.values(allStates).filter(s => s.reflection && s.reflection.length > 20).length;
  const challengesDone = Object.values(challengeProgress).reduce((sum, cp) => sum + cp.completedDays.length, 0);
  const engagement = Math.min(100, Math.round(
    (reflections / 30) * 50 +
    (challengesDone / 20) * 30 +
    (moods.length / 15) * 20
  ));

  let moodScore = 50;
  if (moods.length >= 3) {
    const recent = moods.slice(-7);
    const avgImprovement = recent.reduce((sum, m) => sum + (m.after - m.before), 0) / recent.length;
    const avgMood = recent.reduce((sum, m) => sum + m.after, 0) / recent.length;
    moodScore = Math.min(100, Math.max(0, Math.round(
      (avgMood / 10) * 60 +
      (Math.max(0, avgImprovement) / 5) * 40
    )));
  }

  const growth = Math.min(100, Math.round(
    (completed.length / 30) * 50 +
    (Object.keys(challengeProgress).length / 6) * 25 +
    (streak >= 7 ? 25 : (streak / 7) * 25)
  ));

  const total = Math.round(
    consistency * 0.25 +
    depth * 0.2 +
    engagement * 0.2 +
    moodScore * 0.2 +
    growth * 0.15
  );

  return { total, consistency, depth, engagement, mood: moodScore, growth };
}

export function getWellnessLevel(score: number): { label: string; color: string; description: string } {
  if (score >= 80) return { label: "Flourishing", color: "text-forest", description: "You're thriving in your mindfulness practice" };
  if (score >= 60) return { label: "Growing", color: "text-primary", description: "Strong progress — keep building momentum" };
  if (score >= 40) return { label: "Developing", color: "text-gold", description: "You're building good foundations" };
  if (score >= 20) return { label: "Awakening", color: "text-gold-dark", description: "Every practice counts — you're on your way" };
  return { label: "Beginning", color: "text-muted-foreground", description: "Start your journey — your first session awaits" };
}
