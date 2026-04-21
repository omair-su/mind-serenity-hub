import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import HowToUsePage from "./pages/HowToUsePage";
import SciencePage from "./pages/SciencePage";
import ExpectationsPage from "./pages/ExpectationsPage";
import AssessmentPage from "./pages/AssessmentPage";
import WeekPage from "./pages/WeekPage";
import DayPage from "./pages/DayPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import JournalPage from "./pages/JournalPage";
import LibraryPage from "./pages/LibraryPage";
import AchievementsPage from "./pages/AchievementsPage";
import SOSPage from "./pages/SOSPage";
import BreathingPage from "./pages/BreathingPage";
import SleepPage from "./pages/SleepPage";
import TimerPage from "./pages/TimerPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import ResourcesPage from "./pages/ResourcesPage";
import AffirmationPage from "./pages/AffirmationPage";
import CoachPage from "./pages/CoachPage";
import HelpPage from "./pages/HelpPage";
import OnboardingPage from "./pages/OnboardingPage";
import WeekReviewPage from "./pages/WeekReviewPage";
import CertificatePage from "./pages/CertificatePage";
import SleepStoriesPage from "./pages/SleepStoriesPage";
import SoundBathPage from "./pages/SoundBathPage";
import ChallengesPage from "./pages/ChallengesPage";
import RitualsPage from "./pages/RitualsPage";
import FocusModePage from "./pages/FocusModePage";
import BodyScanPage from "./pages/BodyScanPage";
import GratitudePage from "./pages/GratitudePage";
import WalkingMeditationPage from "./pages/WalkingMeditationPage";
import SoundscapeBuilderPage from "./pages/SoundscapeBuilderPage";
import AIRecommendationsPage from "./pages/AIRecommendationsPage";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import AboutPage from "./pages/AboutPage";
import OfflineDownloadsPage from "./pages/OfflineDownloadsPage";
import ExplorePage from "./pages/ExplorePage";
import PricingPage from "./pages/PricingPage";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import RefundPage from "./pages/legal/RefundPage";
import NotFound from "./pages/NotFound";
import { useApplySettings } from "./components/ThemeProvider";
import PaymentTestModeBanner from "./components/PaymentTestModeBanner";
import ProtectedRoute from "./components/ProtectedRoute";

// Wrap a page in the auth guard so unauthenticated users are redirected to sign-in.
const Guarded = (el: React.ReactNode) => <ProtectedRoute>{el}</ProtectedRoute>;

function AppInner() {
  useApplySettings();
  return (
    <BrowserRouter>
      <PaymentTestModeBanner />
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
