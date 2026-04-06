import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain, Sparkles, Target, TrendingUp, Calendar, Clock, Zap,
  ChevronRight, Heart, BookOpen, Award, AlertCircle
} from "lucide-react";
import {
  generateRecommendations,
  analyzePracticePatterns,
  createWeeklyPlan,
  getSituationSpecificMeditation,
  UserMeditationProfile,
} from "@/lib/aiRecommendationEngine";
import { weeks } from "@/data/courseData";
import { getProfile, getMoods, getAllDayStates } from "@/lib/userStore";

export default function AIRecommendationsPage() {
  const profile = getProfile();
  const moodsData = getMoods();
  const dayStates = getAllDayStates();

  const userProfile = useMemo<UserMeditationProfile>(() => ({
    userId: profile.email || "anonymous",
    currentMood: (moodsData[moodsData.length - 1]?.after as any) || 'neutral',
    goals: profile.goals || ['stress relief'],
    preferredDuration: profile.dailyMinutes || 15,
    practiceHistory: Object.entries(dayStates).map(([day, state]) => ({
      dayId: parseInt(day),
      completedAt: new Date(),
      duration: state.duration || 15,
      moodBefore: 'neutral',
      moodAfter: String(state.moodAfter || 5),
      notes: '',
    })),
    meditationPreferences: {
      guidedVsUnguided: 'guided',
      audioPreference: 'nature',
      difficulty: profile.experience || 'beginner',
    },
  }), [profile, moodsData, dayStates]);

  const [selectedMood, setSelectedMood] = useState<'anxious' | 'stressed' | 'neutral' | 'happy' | 'sad' | 'focused' | 'tired'>(
    (moodsData[moodsData.length - 1]?.after as any) || 'neutral'
  );
  const [selectedSituation, setSelectedSituation] = useState('');

  const recommendations = generateRecommendations({
    ...userProfile,
    currentMood: selectedMood,
  });

  const patterns = analyzePracticePatterns(userProfile);
  const weeklyPlan = createWeeklyPlan(userProfile);
  const situationMeditation = selectedSituation ? getSituationSpecificMeditation(selectedSituation) : null;

  const allDays = weeks.flatMap(w => w.days);

  const moods = [
    { id: 'anxious', label: 'Anxious', icon: '😰', color: 'from-rose-500/20 to-pink-500/15' },
    { id: 'stressed', label: 'Stressed', icon: '😟', color: 'from-orange-500/20 to-amber-500/15' },
    { id: 'neutral', label: 'Neutral', icon: '😐', color: 'from-slate-500/20 to-gray-500/15' },
    { id: 'happy', label: 'Happy', icon: '😊', color: 'from-yellow-500/20 to-gold/15' },
    { id: 'sad', label: 'Sad', icon: '😢', color: 'from-blue-500/20 to-indigo-500/15' },
    { id: 'focused', label: 'Focused', icon: '🧠', color: 'from-emerald-500/20 to-teal-500/15' },
    { id: 'tired', label: 'Tired', icon: '😴', color: 'from-purple-500/20 to-violet-500/15' },
  ];

  const situations = [
    'before meeting',
    'before presentation',
    'after work',
    'before sleep',
    'morning routine',
    'lunch break',
    'feeling overwhelmed',
    'need energy',
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ── Hero Section ── */}
        <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-violet-500/10 border border-border/50">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/10 blur-3xl" />
          <div className="relative p-8 sm:p-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                  AI-Powered Recommendations
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Get personalized meditation suggestions based on your mood, goals, and practice history. Our AI learns your preferences to optimize your wellness journey.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/15 flex items-center justify-center flex-shrink-0">
                <Brain className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mood Selector ── */}
        <div className="bg-gradient-to-br from-gold/5 via-card to-amber-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            How are you feeling right now?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as any)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedMood === mood.id
                    ? `bg-gradient-to-br ${mood.color} border-2 border-primary shadow-card`
                    : 'bg-card border border-border/50 hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{mood.icon}</div>
                <div className="text-xs font-body font-medium text-foreground">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Situation Selector ── */}
        <div className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            What's your situation?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {situations.map(situation => (
              <button
                key={situation}
                onClick={() => setSelectedSituation(situation)}
                className={`p-3 rounded-xl text-center text-xs font-body font-medium transition-all ${
                  selectedSituation === situation
                    ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/15 border-2 border-emerald-600 shadow-card'
                    : 'bg-card border border-border/50 hover:border-emerald-500/50'
                }`}
              >
                {situation}
              </button>
            ))}
          </div>
        </div>

        {/* ── Situation-Specific Recommendation ── */}
        {situationMeditation && (
          <div className="bg-gradient-to-br from-violet-500/10 via-card to-purple-500/5 rounded-2xl p-6 border border-primary/30 shadow-soft">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Perfect for this moment
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-body font-semibold text-primary">{situationMeditation.matchScore}% match</span>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-border/50 p-5 hover:shadow-card transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-display font-semibold text-foreground">{situationMeditation.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{situationMeditation.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {situationMeditation.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {situationMeditation.difficulty}
                </div>
              </div>
              <Link
                to={`/day/${situationMeditation.dayId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-body font-semibold hover:opacity-90 transition-all"
              >
                Start Now
                <ChevronRight className="w-3 h-3" />
              </Link>
            </Card>
          </div>
        )}

        {/* ── Top Recommendations ── */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recommended for you
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map(rec => {
              const dayData = allDays.find(d => d.day === rec.dayId);
              return (
                <Card
                  key={rec.dayId}
                  className="bg-gradient-to-br from-primary/5 via-card to-sage/5 border border-border/50 p-5 hover:shadow-card transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display font-semibold text-foreground">Day {rec.dayId}</h4>
                      <h5 className="text-sm font-body font-medium text-foreground mt-1">{rec.title}</h5>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/50">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-xs font-body font-semibold text-primary">{rec.matchScore}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{rec.reason}</p>
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {rec.difficulty}
                    </div>
                  </div>
                  <Link
                    to={`/day/${rec.dayId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-sage text-primary-foreground text-xs font-body font-semibold hover:opacity-90 transition-all"
                  >
                    Start Practice
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── Weekly Plan ── */}
        <div className="bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            Your Weekly Plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(weeklyPlan).map(([day, rec]) => (
              <Card
                key={day}
                className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-border/50 p-4 hover:shadow-card transition-all"
              >
                <h4 className="font-display font-semibold text-foreground text-sm mb-2">{day}</h4>
                <p className="text-xs text-foreground font-body mb-3">{rec.title}</p>
                <div className="text-xs text-muted-foreground mb-3">{rec.duration}</div>
                <Link
                  to={`/day/${rec.dayId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-body font-semibold hover:opacity-90 transition-all"
                >
                  Start
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Practice Insights ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-base font-semibold text-foreground mb-4">Your Practice Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/15 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-foreground">Consistency</p>
                  <p className="text-sm font-display font-semibold text-foreground">{Math.round(patterns.consistency)}%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-foreground">Avg. Duration</p>
                  <p className="text-sm font-display font-semibold text-foreground">{patterns.averageDuration.toFixed(0)} min</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/15 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-body font-medium text-foreground">Mood Improvement</p>
                  <p className="text-sm font-display font-semibold text-foreground">{patterns.moodImprovement.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500/5 via-card to-pink-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-base font-semibold text-foreground mb-4">Suggestions</h3>
            <div className="space-y-2">
              {patterns.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-body text-muted-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── All Recommendations ── */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground">All Recommendations</h3>
          <div className="grid grid-cols-1 gap-3">
            {recommendations.map(rec => (
              <Card
                key={rec.dayId}
                className="bg-gradient-to-br from-primary/5 via-card to-sage/5 border border-border/50 p-4 hover:shadow-card transition-all group cursor-pointer flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-display font-semibold text-foreground">Day {rec.dayId}: {rec.title}</h4>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/50">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-xs font-body font-semibold text-primary">{rec.matchScore}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {rec.difficulty}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/day/${rec.dayId}`}
                  className="ml-4 p-2 rounded-lg bg-gradient-to-r from-primary to-sage text-primary-foreground hover:opacity-90 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
