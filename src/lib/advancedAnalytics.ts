/**
 * Advanced Analytics & Wellness Tracking
 * Provides in-depth insights into meditation practice and wellness metrics
 */

export interface WellnessMetrics {
  date: Date;
  moodScore: number; // 1-10
  stressLevel: number; // 1-10
  energyLevel: number; // 1-10
  focusLevel: number; // 1-10
  sleepQuality: number; // 1-10
  practiceMinutes: number;
  practiceType: string;
  notes: string;
}

export interface AnalyticsReport {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;
  totalPracticeMinutes: number;
  averageDailyPractice: number;
  consistencyScore: number; // 0-100
  moodTrend: number; // -100 to 100
  stressTrend: number; // -100 to 100
  energyTrend: number; // -100 to 100
  focusTrend: number; // -100 to 100
  sleepTrend: number; // -100 to 100
  topPracticeTypes: { type: string; minutes: number }[];
  keyInsights: string[];
  recommendations: string[];
}

export interface DailySnapshot {
  date: Date;
  moodBefore: number;
  moodAfter: number;
  stressBefore: number;
  stressAfter: number;
  energyBefore: number;
  energyAfter: number;
  focusBefore: number;
  focusAfter: number;
  practiceMinutes: number;
  practiceType: string;
}

let metricsHistory: WellnessMetrics[] = [];
let dailySnapshots: DailySnapshot[] = [];

/**
 * Record a wellness metric
 */
export function recordMetric(metric: WellnessMetrics): void {
  metricsHistory.push(metric);
  // Keep only last 365 days
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  metricsHistory = metricsHistory.filter(m => m.date > oneYearAgo);
}

/**
 * Record a daily snapshot (before and after meditation)
 */
export function recordDailySnapshot(snapshot: DailySnapshot): void {
  dailySnapshots.push(snapshot);
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
  dailySnapshots = dailySnapshots.filter(s => s.date > oneYearAgo);
}

/**
 * Generate comprehensive analytics report
 */
export function generateAnalyticsReport(period: 'week' | 'month' | 'quarter' | 'year'): AnalyticsReport {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
  }
  
  const periodMetrics = metricsHistory.filter(m => m.date >= startDate && m.date <= now);
  const periodSnapshots = dailySnapshots.filter(s => s.date >= startDate && s.date <= now);
  
  // Calculate totals
  const totalPracticeMinutes = periodMetrics.reduce((sum, m) => sum + m.practiceMinutes, 0);
  const daysInPeriod = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  const averageDailyPractice = totalPracticeMinutes / daysInPeriod;
  
  // Calculate consistency (days with practice / total days)
  const daysWithPractice = new Set(periodMetrics.map(m => m.date.toDateString())).size;
  const consistencyScore = (daysWithPractice / daysInPeriod) * 100;
  
  // Calculate trends
  const moodTrend = calculateTrend(periodMetrics.map(m => m.moodScore));
  const stressTrend = calculateTrend(periodMetrics.map(m => 11 - m.stressLevel)); // Inverse
  const energyTrend = calculateTrend(periodMetrics.map(m => m.energyLevel));
  const focusTrend = calculateTrend(periodMetrics.map(m => m.focusLevel));
  const sleepTrend = calculateTrend(periodMetrics.map(m => m.sleepQuality));
  
  // Top practice types
  const practiceTypeMap = new Map<string, number>();
  periodMetrics.forEach(m => {
    const current = practiceTypeMap.get(m.practiceType) || 0;
    practiceTypeMap.set(m.practiceType, current + m.practiceMinutes);
  });
  
  const topPracticeTypes = Array.from(practiceTypeMap.entries())
    .map(([type, minutes]) => ({ type, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5);
  
  // Calculate impact metrics
  const avgMoodImprovement = periodSnapshots.length > 0
    ? periodSnapshots.reduce((sum, s) => sum + (s.moodAfter - s.moodBefore), 0) / periodSnapshots.length
    : 0;
  
  const avgStressReduction = periodSnapshots.length > 0
    ? periodSnapshots.reduce((sum, s) => sum + (s.stressBefore - s.stressAfter), 0) / periodSnapshots.length
    : 0;
  
  // Generate insights
  const keyInsights = generateInsights(
    totalPracticeMinutes,
    consistencyScore,
    moodTrend,
    stressTrend,
    avgMoodImprovement,
    avgStressReduction,
    topPracticeTypes
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    consistencyScore,
    averageDailyPractice,
    moodTrend,
    stressTrend,
    topPracticeTypes
  );
  
  return {
    period,
    startDate,
    endDate: now,
    totalPracticeMinutes,
    averageDailyPractice,
    consistencyScore,
    moodTrend,
    stressTrend,
    energyTrend,
    focusTrend,
    sleepTrend,
    topPracticeTypes,
    keyInsights,
    recommendations,
  };
}

/**
 * Calculate trend from a series of values (-100 to 100)
 */
function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  // Normalize to -100 to 100
  return Math.max(-100, Math.min(100, (avgSecond - avgFirst) * 10));
}

/**
 * Generate insights from analytics data
 */
function generateInsights(
  totalMinutes: number,
  consistency: number,
  moodTrend: number,
  stressTrend: number,
  moodImprovement: number,
  stressReduction: number,
  topPractices: { type: string; minutes: number }[]
): string[] {
  const insights: string[] = [];
  
  if (totalMinutes > 300) {
    insights.push(`🏆 Impressive commitment! You've practiced for ${Math.round(totalMinutes)} minutes this period.`);
  }
  
  if (consistency > 70) {
    insights.push(`✨ Outstanding consistency at ${Math.round(consistency)}%! You're building a strong habit.`);
  } else if (consistency > 40) {
    insights.push(`📈 Good progress! Try to aim for 4-5 sessions per week for maximum benefits.`);
  }
  
  if (moodTrend > 20) {
    insights.push(`😊 Your mood has improved significantly. Meditation is working!`);
  }
  
  if (stressTrend > 20) {
    insights.push(`🧘 Stress levels are decreasing. Keep up the practice!`);
  }
  
  if (moodImprovement > 1.5) {
    insights.push(`💫 Average mood improvement of ${moodImprovement.toFixed(1)} points per session.`);
  }
  
  if (stressReduction > 1.5) {
    insights.push(`🌿 Average stress reduction of ${stressReduction.toFixed(1)} points per session.`);
  }
  
  if (topPractices.length > 0) {
    insights.push(`🎯 Your favorite practice: ${topPractices[0].type} (${topPractices[0].minutes} minutes total)`);
  }
  
  return insights;
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  consistency: number,
  averageDailyPractice: number,
  moodTrend: number,
  stressTrend: number,
  topPractices: { type: string; minutes: number }[]
): string[] {
  const recommendations: string[] = [];
  
  if (consistency < 40) {
    recommendations.push('Set a daily meditation reminder to build consistency');
  }
  
  if (averageDailyPractice < 10) {
    recommendations.push('Try extending your sessions to 15-20 minutes for deeper benefits');
  }
  
  if (moodTrend < 0) {
    recommendations.push('Experiment with different meditation types to find what resonates');
  }
  
  if (stressTrend < 0) {
    recommendations.push('Consider adding body scan or progressive relaxation to your routine');
  }
  
  if (topPractices.length === 1) {
    recommendations.push('Diversify your practice by trying different meditation types');
  }
  
  if (consistency > 70 && averageDailyPractice > 15) {
    recommendations.push('You\'re ready for advanced practices! Explore deeper meditation techniques');
  }
  
  return recommendations;
}

/**
 * Get weekly breakdown of practice
 */
export function getWeeklyBreakdown(): { [key: string]: number } {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekMetrics = metricsHistory.filter(m => m.date >= weekAgo);
  
  const breakdown: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  weekMetrics.forEach(m => {
    const dayName = dayNames[m.date.getDay()];
    breakdown[dayName] += m.practiceMinutes;
  });
  
  return breakdown;
}

/**
 * Get mood progression over time
 */
export function getMoodProgression(days: number = 30): { date: string; mood: number }[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const metrics = metricsHistory.filter(m => m.date >= cutoff);
  
  // Group by day and average
  const dailyMoods = new Map<string, number[]>();
  
  metrics.forEach(m => {
    const dateStr = m.date.toISOString().split('T')[0];
    const moods = dailyMoods.get(dateStr) || [];
    moods.push(m.moodScore);
    dailyMoods.set(dateStr, moods);
  });
  
  return Array.from(dailyMoods.entries())
    .map(([date, moods]) => ({
      date,
      mood: moods.reduce((a, b) => a + b, 0) / moods.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get stress level progression
 */
export function getStressProgression(days: number = 30): { date: string; stress: number }[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const metrics = metricsHistory.filter(m => m.date >= cutoff);
  
  const dailyStress = new Map<string, number[]>();
  
  metrics.forEach(m => {
    const dateStr = m.date.toISOString().split('T')[0];
    const stresses = dailyStress.get(dateStr) || [];
    stresses.push(m.stressLevel);
    dailyStress.set(dateStr, stresses);
  });
  
  return Array.from(dailyStress.entries())
    .map(([date, stresses]) => ({
      date,
      stress: stresses.reduce((a, b) => a + b, 0) / stresses.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get practice type distribution
 */
export function getPracticeDistribution(): { type: string; percentage: number; minutes: number }[] {
  const typeMap = new Map<string, number>();
  let total = 0;
  
  metricsHistory.forEach(m => {
    const current = typeMap.get(m.practiceType) || 0;
    typeMap.set(m.practiceType, current + m.practiceMinutes);
    total += m.practiceMinutes;
  });
  
  return Array.from(typeMap.entries())
    .map(([type, minutes]) => ({
      type,
      percentage: (minutes / total) * 100,
      minutes,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

/**
 * Export analytics data as JSON
 */
export function exportAnalyticsData(): string {
  return JSON.stringify({
    metricsHistory,
    dailySnapshots,
    exportDate: new Date().toISOString(),
  }, null, 2);
}

/**
 * Import analytics data from JSON
 */
export function importAnalyticsData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    metricsHistory = data.metricsHistory.map((m: any) => ({
      ...m,
      date: new Date(m.date),
    }));
    dailySnapshots = data.dailySnapshots.map((s: any) => ({
      ...s,
      date: new Date(s.date),
    }));
    return true;
  } catch (error) {
    console.error('Failed to import analytics data:', error);
    return false;
  }
}
