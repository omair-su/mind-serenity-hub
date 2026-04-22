import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Eagerly load only the public pages that may be hit on first paint (landing/marketing).
// Everything behind /app/* (and the heavier course pages) is lazy-loaded so the initial
// JS bundle stays small for fast First Contentful Paint.
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import NotFound from "./pages/NotFound";
import { useApplySettings } from "./components/ThemeProvider";
import PaymentTestModeBanner from "./components/PaymentTestModeBanner";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded public marketing/legal pages
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const TermsPage = lazy(() => import("./pages/legal/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/legal/PrivacyPage"));
const RefundPage = lazy(() => import("./pages/legal/RefundPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

// Lazy-loaded course content
const WelcomePage = lazy(() => import("./pages/WelcomePage"));
const HowToUsePage = lazy(() => import("./pages/HowToUsePage"));
const SciencePage = lazy(() => import("./pages/SciencePage"));
const ExpectationsPage = lazy(() => import("./pages/ExpectationsPage"));
const AssessmentPage = lazy(() => import("./pages/AssessmentPage"));
const WeekPage = lazy(() => import("./pages/WeekPage"));
const DayPage = lazy(() => import("./pages/DayPage"));

// Lazy-loaded authenticated app pages
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const SOSPage = lazy(() => import("./pages/SOSPage"));
const BreathingPage = lazy(() => import("./pages/BreathingPage"));
const SleepPage = lazy(() => import("./pages/SleepPage"));
const TimerPage = lazy(() => import("./pages/TimerPage"));
const MoodTrackerPage = lazy(() => import("./pages/MoodTrackerPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const AffirmationPage = lazy(() => import("./pages/AffirmationPage"));
const CoachPage = lazy(() => import("./pages/CoachPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const WeekReviewPage = lazy(() => import("./pages/WeekReviewPage"));
const CertificatePage = lazy(() => import("./pages/CertificatePage"));
const SleepStoriesPage = lazy(() => import("./pages/SleepStoriesPage"));
const SoundBathPage = lazy(() => import("./pages/SoundBathPage"));
const ChallengesPage = lazy(() => import("./pages/ChallengesPage"));
const RitualsPage = lazy(() => import("./pages/RitualsPage"));
const FocusModePage = lazy(() => import("./pages/FocusModePage"));
const BodyScanPage = lazy(() => import("./pages/BodyScanPage"));
const GratitudePage = lazy(() => import("./pages/GratitudePage"));
const WalkingMeditationPage = lazy(() => import("./pages/WalkingMeditationPage"));
const SoundscapeBuilderPage = lazy(() => import("./pages/SoundscapeBuilderPage"));
const AIRecommendationsPage = lazy(() => import("./pages/AIRecommendationsPage"));
const AdvancedAnalyticsPage = lazy(() => import("./pages/AdvancedAnalyticsPage"));
const OfflineDownloadsPage = lazy(() => import("./pages/OfflineDownloadsPage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));

// Wrap a page in the auth guard so unauthenticated users are redirected to sign-in.
const Guarded = (el: React.ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>;

// Lightweight fallback shown briefly while route chunks load.
const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
  </div>
);

function AppInner() {
  useApplySettings();
  return (
    <BrowserRouter>
      <PaymentTestModeBanner />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/refund" element={<RefundPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Course foundation */}
          <Route path="/course" element={<WelcomePage />} />
          <Route path="/course/how-to-use" element={<HowToUsePage />} />
          <Route path="/course/science" element={<SciencePage />} />
          <Route path="/course/expectations" element={<ExpectationsPage />} />
          <Route path="/course/assessment" element={<AssessmentPage />} />

          {/* Day & Week content */}
          <Route path="/week/:weekNum" element={<WeekPage />} />
          <Route path="/day/:dayNum" element={<DayPage />} />

          {/* App (premium platform) — all routes require an authenticated session */}
          <Route path="/app" element={Guarded(<DashboardPage />)} />
          <Route path="/app/explore" element={Guarded(<ExplorePage />)} />
          <Route path="/app/profile" element={Guarded(<ProfilePage />)} />
          <Route path="/app/analytics" element={Guarded(<AnalyticsPage />)} />
          <Route path="/app/journal" element={Guarded(<JournalPage />)} />
          <Route path="/app/library" element={Guarded(<LibraryPage />)} />
          <Route path="/app/achievements" element={Guarded(<AchievementsPage />)} />
          <Route path="/app/sos" element={Guarded(<SOSPage />)} />
          <Route path="/app/breathing" element={Guarded(<BreathingPage />)} />
          <Route path="/app/sleep" element={Guarded(<SleepPage />)} />
          <Route path="/app/timer" element={Guarded(<TimerPage />)} />
          <Route path="/app/mood" element={Guarded(<MoodTrackerPage />)} />
          <Route path="/app/resources" element={Guarded(<ResourcesPage />)} />
          <Route path="/app/affirmations" element={Guarded(<AffirmationPage />)} />
          <Route path="/app/coach" element={Guarded(<CoachPage />)} />
          <Route path="/app/help" element={Guarded(<HelpPage />)} />
          <Route path="/app/review/:weekNum" element={Guarded(<WeekReviewPage />)} />
          <Route path="/app/certificate" element={Guarded(<CertificatePage />)} />
          <Route path="/app/sleep-stories" element={Guarded(<SleepStoriesPage />)} />
          <Route path="/app/sound-bath" element={Guarded(<SoundBathPage />)} />
          <Route path="/app/challenges" element={Guarded(<ChallengesPage />)} />
          <Route path="/app/rituals" element={Guarded(<RitualsPage />)} />
          <Route path="/app/focus" element={Guarded(<FocusModePage />)} />
          <Route path="/app/body-scan" element={Guarded(<BodyScanPage />)} />
          <Route path="/app/gratitude" element={Guarded(<GratitudePage />)} />
          <Route path="/app/walking" element={Guarded(<WalkingMeditationPage />)} />
          <Route path="/app/soundscape-builder" element={Guarded(<SoundscapeBuilderPage />)} />
          <Route path="/app/ai-recommendations" element={Guarded(<AIRecommendationsPage />)} />
          <Route path="/app/advanced-analytics" element={Guarded(<AdvancedAnalyticsPage />)} />
          <Route path="/app/offline-downloads" element={Guarded(<OfflineDownloadsPage />)} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AppInner />
  </TooltipProvider>
);

export default App;
