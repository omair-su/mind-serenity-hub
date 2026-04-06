/**
 * AI-Powered Meditation Recommendation Engine
 * Provides intelligent recommendations based on user mood, history, and goals
 */

import { weeks } from '@/data/courseData';

export interface UserMeditationProfile {
  userId: string;
  currentMood: 'anxious' | 'stressed' | 'neutral' | 'happy' | 'sad' | 'focused' | 'tired';
  goals: string[];
  preferredDuration: number; // in minutes
  practiceHistory: {
    dayId: number;
    completedAt: Date;
    duration: number;
    moodBefore: string;
    moodAfter: string;
    notes: string;
  }[];
  meditationPreferences: {
    guidedVsUnguided: 'guided' | 'unguided' | 'both';
    audioPreference: 'silence' | 'nature' | 'binaural' | 'music' | 'mixed';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface MeditationRecommendation {
  dayId: number;
  title: string;
  reason: string;
  matchScore: number; // 0-100
  estimatedBenefit: string;
  difficulty: string;
  duration: string;
}

export interface AdaptiveGuidanceScript {
  id: string;
  title: string;
  baseScript: string;
  adaptations: {
    moodAdaptation: { [key: string]: string };
    durationAdaptation: { [key: string]: string };
    difficultyAdaptation: { [key: string]: string };
  };
}

// Mood-to-meditation mapping
const moodMeditationMap: { [key: string]: string[] } = {
  anxious: ['Breath Awareness Meditation', 'Counting Breaths Meditation', 'SOS Calm'],
  stressed: ['Body Scan Meditation', 'Progressive Relaxation', 'Loving-Kindness'],
  neutral: ['Mindfulness Meditation', 'Breath Awareness Meditation', 'Open Awareness'],
  happy: ['Gratitude Meditation', 'Loving-Kindness', 'Celebration Ritual'],
  sad: ['Loving-Kindness', 'Compassion Meditation', 'Journaling'],
  focused: ['Counting Breaths Meditation', 'Focus Mode', 'Concentration Practice'],
  tired: ['Body Scan Meditation', 'Sleep Stories', 'Restorative Yoga'],
};

// Goal-to-meditation mapping
const goalMeditationMap: { [key: string]: string[] } = {
  'stress relief': ['Body Scan Meditation', 'Progressive Relaxation', 'Loving-Kindness'],
  'better sleep': ['Sleep Stories', 'Body Scan Meditation', 'Restorative Yoga'],
  'focus': ['Counting Breaths Meditation', 'Focus Mode', 'Concentration Practice'],
  'emotional balance': ['Loving-Kindness', 'Compassion Meditation', 'Journaling'],
  'spiritual growth': ['Open Awareness', 'Loving-Kindness', 'Meditation'],
  'anxiety management': ['Breath Awareness Meditation', 'SOS Calm', 'Grounding'],
  'self-awareness': ['Body Scan Meditation', 'Mindfulness Meditation', 'Journaling'],
};

/**
 * Generate personalized meditation recommendations
 */
export function generateRecommendations(profile: UserMeditationProfile): MeditationRecommendation[] {
  const allDays = weeks.flatMap(w => w.days);
  const recommendations: MeditationRecommendation[] = [];
  
  // Get meditations matching current mood
  const moodMatches = moodMeditationMap[profile.currentMood] || [];
  
  // Get meditations matching user goals
  const goalMatches = new Set<string>();
  profile.goals.forEach(goal => {
    const matches = goalMeditationMap[goal.toLowerCase()] || [];
    matches.forEach(m => goalMatches.add(m));
  });
  
  // Score each day based on multiple factors
  allDays.forEach(day => {
    let score = 0;
    let reasons: string[] = [];
    
    // Mood match (40% weight)
    if (moodMatches.includes(day.title)) {
      score += 40;
      reasons.push(`Recommended for ${profile.currentMood} mood`);
    }
    
    // Goal match (30% weight)
    if (goalMatches.has(day.title)) {
      score += 30;
      reasons.push(`Aligns with your goals`);
    }
    
    // Duration match (20% weight)
    const durationMinutes = parseInt(day.duration);
    if (Math.abs(durationMinutes - profile.preferredDuration) <= 5) {
      score += 20;
      reasons.push(`Perfect duration (${day.duration})`);
    }
    
    // Difficulty match (10% weight)
    if (day.difficulty.toLowerCase().includes(profile.meditationPreferences.difficulty)) {
      score += 10;
      reasons.push(`Matches your skill level`);
    }
    
    // Variety bonus (avoid repeating same meditation)
    const recentPractices = profile.practiceHistory.slice(-5).map(p => p.dayId);
    if (!recentPractices.includes(day.day)) {
      score += 5;
    }
    
    if (score > 0) {
      recommendations.push({
        dayId: day.day,
        title: day.title,
        reason: reasons.join(' • '),
        matchScore: Math.min(100, score),
        estimatedBenefit: day.benefits,
        difficulty: day.difficulty,
        duration: day.duration,
      });
    }
  });
  
  // Sort by match score and return top 5
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

/**
 * Get adaptive guidance based on user profile
 */
export function getAdaptiveGuidance(baseScript: string, profile: UserMeditationProfile): string {
  let adaptedScript = baseScript;
  
  // Adapt for mood
  if (profile.currentMood === 'anxious' || profile.currentMood === 'stressed') {
    adaptedScript = adaptedScript.replace(
      /\[Pause.*?\]/g,
      '[Longer pause - take your time, there is no rush]'
    );
    adaptedScript += '\n\nRemember: You are safe. Your breath is your anchor.';
  }
  
  // Adapt for duration
  const targetDuration = profile.preferredDuration;
  if (targetDuration < 10) {
    // Shorten the script
    adaptedScript = adaptedScript.split('\n').slice(0, Math.floor(adaptedScript.split('\n').length * 0.6)).join('\n');
  } else if (targetDuration > 30) {
    // Extend with additional practices
    adaptedScript += '\n\n[Extended practice - continue with deeper awareness]';
  }
  
  // Adapt for difficulty
  if (profile.meditationPreferences.difficulty === 'beginner') {
    adaptedScript = adaptedScript.replace(/advanced/gi, 'foundational');
    adaptedScript += '\n\nYou are building a strong foundation. Every moment of practice counts.';
  } else if (profile.meditationPreferences.difficulty === 'advanced') {
    adaptedScript += '\n\n[Advanced: Explore subtle shifts in awareness and energy flow]';
  }
  
  return adaptedScript;
}

/**
 * Analyze practice patterns and suggest improvements
 */
export function analyzePracticePatterns(profile: UserMeditationProfile): {
  consistency: number;
  averageDuration: number;
  moodImprovement: number;
  suggestions: string[];
} {
  const history = profile.practiceHistory;
  
  if (history.length === 0) {
    return {
      consistency: 0,
      averageDuration: 0,
      moodImprovement: 0,
      suggestions: ['Start your meditation practice today to build consistency!'],
    };
  }
  
  // Calculate consistency (practices per week)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentPractices = history.filter(p => new Date(p.completedAt) > weekAgo);
  const consistency = (recentPractices.length / 7) * 100;
  
  // Calculate average duration
  const averageDuration = history.reduce((sum, p) => sum + p.duration, 0) / history.length;
  
  // Calculate mood improvement
  let moodImprovement = 0;
  history.forEach(p => {
    const beforeScore = getMoodScore(p.moodBefore);
    const afterScore = getMoodScore(p.moodAfter);
    moodImprovement += (afterScore - beforeScore);
  });
  moodImprovement = (moodImprovement / history.length) * 10; // Scale to percentage
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (consistency < 50) {
    suggestions.push('Try to practice at least 4 times per week for optimal benefits');
  }
  
  if (averageDuration < 10) {
    suggestions.push('Consider extending your sessions to 15-20 minutes for deeper benefits');
  }
  
  if (moodImprovement < 5) {
    suggestions.push('Experiment with different meditation types to find what works best for you');
  }
  
  if (recentPractices.length === 0) {
    suggestions.push('You haven\'t practiced this week. Start with a short 5-minute session today!');
  }
  
  return {
    consistency: Math.min(100, consistency),
    averageDuration,
    moodImprovement: Math.max(-100, Math.min(100, moodImprovement)),
    suggestions,
  };
}

/**
 * Get mood score for comparison (higher is better)
 */
function getMoodScore(mood: string): number {
  const scores: { [key: string]: number } = {
    'anxious': 1,
    'stressed': 2,
    'sad': 2,
    'tired': 3,
    'neutral': 5,
    'focused': 7,
    'happy': 9,
  };
  return scores[mood.toLowerCase()] || 5;
}

/**
 * Create a personalized meditation plan for the week
 */
export function createWeeklyPlan(profile: UserMeditationProfile): { [key: string]: MeditationRecommendation } {
  const recommendations = generateRecommendations(profile);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan: { [key: string]: MeditationRecommendation } = {};
  
  days.forEach((day, index) => {
    const rec = recommendations[index % recommendations.length];
    if (rec) {
      plan[day] = rec;
    }
  });
  
  return plan;
}

/**
 * Get meditation suggestions for specific situations
 */
export function getSituationSpecificMeditation(situation: string): MeditationRecommendation | null {
  const situationMap: { [key: string]: string } = {
    'before meeting': 'Counting Breaths Meditation',
    'before presentation': 'Confidence Building Meditation',
    'after work': 'Progressive Relaxation',
    'before sleep': 'Sleep Stories',
    'morning routine': 'Breath Awareness Meditation',
    'lunch break': 'Quick Focus Session',
    'feeling overwhelmed': 'SOS Calm',
    'need energy': 'Energizing Breath Work',
  };
  
  const meditationTitle = situationMap[situation.toLowerCase()];
  if (!meditationTitle) return null;
  
  const allDays = weeks.flatMap(w => w.days);
  const day = allDays.find(d => d.title === meditationTitle);
  
  if (!day) return null;
  
  return {
    dayId: day.day,
    title: day.title,
    reason: `Perfect for: ${situation}`,
    matchScore: 95,
    estimatedBenefit: day.benefits,
    difficulty: day.difficulty,
    duration: day.duration,
  };
}
