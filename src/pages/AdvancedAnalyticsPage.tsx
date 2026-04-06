import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  TrendingUp, Calendar, Clock, Heart, Brain, Zap, Target,
  Download, Share2, Filter, ChevronRight, Award, Flame
} from "lucide-react";
import {
  generateAnalyticsReport,
  getWeeklyBreakdown,
  getMoodProgression,
  getStressProgression,
  getPracticeDistribution,
  recordMetric,
  recordDailySnapshot,
  WellnessMetrics,
  DailySnapshot,
} from "@/lib/advancedAnalytics";

export default function AdvancedAnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Generate sample data for demonstration
  const report = generateAnalyticsReport(period);
  const weeklyData = getWeeklyBreakdown();
  const moodData = getMoodProgression(30);
  const stressData = getStressProgression(30);
  const practiceDistribution = getPracticeDistribution();

  // Transform data for charts
  const weeklyChartData = Object.entries(weeklyData).map(([day, minutes]) => ({
    day: day.slice(0, 3),
    minutes,
  }));

  const trendChartData = [
    { name: 'Mood', value: Math.max(0, report.moodTrend) },
    { name: 'Stress', value: Math.max(0, report.stressTrend) },
    { name: 'Energy', value: Math.max(0, report.energyTrend) },
    { name: 'Focus', value: Math.max(0, report.focusTrend) },
    { name: 'Sleep', value: Math.max(0, report.sleepTrend) },
  ];

  const COLORS = ['#139A3A', '#A8C4B1', '#D4A574', '#FF6B6B', '#4ECDC4'];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ── Hero Section ── */}
        <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 border border-border/50">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl" />
          <div className="relative p-8 sm:p-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-2">
                  Advanced Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Deep insights into your meditation practice, wellness trends, and personal growth. Track your progress with detailed metrics and visualizations.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Period Selector ── */}
        <div className="flex gap-2 flex-wrap">
          {(['week', 'month', 'quarter', 'year'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-primary to-sage text-primary-foreground shadow-card'
                  : 'bg-card border border-border/50 text-foreground hover:border-primary/50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Practice',
              value: `${Math.round(report.totalPracticeMinutes)}`,
              unit: 'minutes',
              icon: Clock,
              gradient: 'from-blue-500/10 to-cyan-500/5',
              iconGrad: 'from-blue-500/20 to-cyan-500/15',
              iconColor: 'text-blue-600',
            },
            {
              label: 'Consistency',
              value: `${Math.round(report.consistencyScore)}`,
              unit: '%',
              icon: Flame,
              gradient: 'from-rose-500/10 to-pink-500/5',
              iconGrad: 'from-rose-500/20 to-pink-500/15',
              iconColor: 'text-rose-600',
            },
            {
              label: 'Avg Daily',
              value: `${report.averageDailyPractice.toFixed(1)}`,
              unit: 'min',
              icon: Target,
              gradient: 'from-emerald-500/10 to-teal-500/5',
              iconGrad: 'from-emerald-500/20 to-teal-500/15',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Mood Trend',
              value: `${Math.abs(Math.round(report.moodTrend))}`,
              unit: '%',
              icon: Heart,
              gradient: 'from-violet-500/10 to-purple-500/5',
              iconGrad: 'from-violet-500/20 to-purple-500/15',
              iconColor: 'text-violet-600',
            },
          ].map((metric, idx) => (
            <Card
              key={idx}
              className={`bg-gradient-to-br ${metric.gradient} rounded-2xl p-5 border border-border/50 shadow-soft`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.iconGrad} flex items-center justify-center`}>
                  <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
                </div>
              </div>
              <p className="text-xs font-body text-muted-foreground mb-1">{metric.label}</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {metric.value}
                <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
              </p>
            </Card>
          ))}
        </div>

        {/* ── Charts Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Practice */}
          <Card className="bg-gradient-to-br from-blue-500/5 via-card to-cyan-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Weekly Practice</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Wellness Trends */}
          <Card className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Wellness Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--sage))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Practice Distribution */}
          <Card className="bg-gradient-to-br from-gold/5 via-card to-amber-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Practice Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={practiceDistribution.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percentage }: any) => `${(type as string).slice(0, 10)}: ${(percentage as number).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Mood Progression */}
          <Card className="bg-gradient-to-br from-rose-500/5 via-card to-pink-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Mood Progression</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Insights & Recommendations ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-violet-500/5 via-card to-purple-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600" />
              Key Insights
            </h3>
            <div className="space-y-3">
              {report.keyInsights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <Zap className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-body text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/5 via-card to-blue-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-600" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-body text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Top Practice Types ── */}
        <Card className="bg-gradient-to-br from-gold/5 via-card to-amber-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            Top Practice Types
          </h3>
          <div className="space-y-2">
            {report.topPracticeTypes.map((practice, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                <span className="font-body text-sm text-foreground">{practice.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-sage h-2 rounded-full"
                      style={{
                        width: `${(practice.minutes / (report.topPracticeTypes[0]?.minutes || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-body font-semibold text-muted-foreground w-12 text-right">
                    {practice.minutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Export Options ── */}
        <div className="flex gap-3 justify-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-foreground font-body font-medium text-sm hover:border-primary/50 transition-all">
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-sage text-primary-foreground font-body font-medium text-sm hover:opacity-90 transition-all">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
