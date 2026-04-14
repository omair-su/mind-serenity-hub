import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
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
import NotFound from "./pages/NotFound";
import { useApplySettings } from "./components/ThemeProvider";

function AppInner() {
  useApplySettings();
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/about" element={<AboutPage />} />
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

        {/* App (premium platform) */}
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/app/explore" element={<ExplorePage />} />
        <Route path="/app/profile" element={<ProfilePage />} />
        <Route path="/app/analytics" element={<AnalyticsPage />} />
        <Route path="/app/journal" element={<JournalPage />} />
        <Route path="/app/library" element={<LibraryPage />} />
        <Route path="/app/achievements" element={<AchievementsPage />} />
        <Route path="/app/sos" element={<SOSPage />} />
        <Route path="/app/breathing" element={<BreathingPage />} />
        <Route path="/app/sleep" element={<SleepPage />} />
        <Route path="/app/timer" element={<TimerPage />} />
        <Route path="/app/mood" element={<MoodTrackerPage />} />
        <Route path="/app/resources" element={<ResourcesPage />} />
        <Route path="/app/affirmations" element={<AffirmationPage />} />
        <Route path="/app/coach" element={<CoachPage />} />
        <Route path="/app/help" element={<HelpPage />} />
        <Route path="/app/review/:weekNum" element={<WeekReviewPage />} />
        <Route path="/app/certificate" element={<CertificatePage />} />
        <Route path="/app/sleep-stories" element={<SleepStoriesPage />} />
        <Route path="/app/sound-bath" element={<SoundBathPage />} />
        <Route path="/app/challenges" element={<ChallengesPage />} />
        <Route path="/app/rituals" element={<RitualsPage />} />
        <Route path="/app/focus" element={<FocusModePage />} />
        <Route path="/app/body-scan" element={<BodyScanPage />} />
        <Route path="/app/gratitude" element={<GratitudePage />} />
        <Route path="/app/walking" element={<WalkingMeditationPage />} />
        <Route path="/app/soundscape-builder" element={<SoundscapeBuilderPage />} />
        <Route path="/app/ai-recommendations" element={<AIRecommendationsPage />} />
        <Route path="/app/advanced-analytics" element={<AdvancedAnalyticsPage />} />
        <Route path="/app/offline-downloads" element={<OfflineDownloadsPage />} />

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
