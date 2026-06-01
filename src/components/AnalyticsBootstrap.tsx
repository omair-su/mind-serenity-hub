// Mounted once globally inside AppLayout. Stamps first-visit, then fires
// the recurring lifecycle north-star events (day3_retention, first_session,
// premium_purchase) once the relevant conditions are met. signup,
// onboarding_complete and premium_view are fired from their own call-sites.
import { useEffect } from "react";
import { checkDay3Retention, trackNorthStar } from "@/lib/analytics";
import { getCompletedDays } from "@/lib/userStore";
import { useIsPremium } from "@/hooks/useIsPremium";

export default function AnalyticsBootstrap() {
  const isPremium = useIsPremium();

  useEffect(() => {
    checkDay3Retention();
    if (getCompletedDays().length >= 1) {
      trackNorthStar("first_session");
    }
  }, []);

  useEffect(() => {
    if (isPremium) trackNorthStar("premium_purchase");
  }, [isPremium]);

  return null;
}
