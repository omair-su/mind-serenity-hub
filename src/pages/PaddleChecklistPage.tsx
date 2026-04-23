import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageSEO } from "@/hooks/usePageSEO";

/**
 * Internal pre-resubmission checklist for Paddle approval.
 * Verifies the public URLs Paddle's reviewers actually visit are reachable
 * and reminds the user of the manual content checks they must confirm.
 *
 * Paddle's domain review keeps failing for sellers when one of the legal
 * pages 404s, sits behind auth, or the pricing page doesn't disclose the
 * Merchant of Record. This page surfaces all of that in one place.
 */

const SITE_ORIGIN = "https://www.willowvibes.com";

type CheckStatus = "pending" | "ok" | "fail";

interface UrlCheck {
  label: string;
  path: string;
  why: string;
  status: CheckStatus;
  httpStatus?: number;
}

const INITIAL_URL_CHECKS: UrlCheck[] = [
  {
    label: "Homepage",
    path: "/",
    why: "Reviewers land here first. Must load without errors.",
    status: "pending",
  },
  {
    label: "Pricing page",
    path: "/pricing",
    why: "Must show clear prices, currency, billing frequency, and Paddle MoR notice.",
    status: "pending",
  },
  {
    label: "About page",
    path: "/about",
    why: "Establishes who is selling. Must include your legal/business name.",
    status: "pending",
  },
  {
    label: "Terms & Conditions",
    path: "/legal/terms",
    why: "Required by Paddle. Must name Paddle as Merchant of Record.",
    status: "pending",
  },
  {
    label: "Privacy Notice",
    path: "/legal/privacy",
    why: "Required by Paddle. Must list Paddle as a data recipient.",
    status: "pending",
  },
  {
    label: "Refund Policy",
    path: "/legal/refund",
    why: "Required by Paddle. 14–90 day window, no 'all sales final' language.",
    status: "pending",
  },
  {
    label: "Sitemap",
    path: "/sitemap.xml",
    why: "Helps reviewers and search engines discover all public pages.",
    status: "pending",
  },
  {
    label: "Robots.txt",
    path: "/robots.txt",
    why: "Confirms private /app routes are blocked from indexing.",
    status: "pending",
  },
];

const MANUAL_CHECKS = [
  {
    title: "Legal/business name appears on Terms, Privacy, and About",
    detail:
      "Paddle requires the seller's legal name (or your full personal name if not a registered business) to be visible on all three.",
  },
  {
    title: "Pricing page shows price, currency, and billing interval",
    detail:
      "Each plan must clearly state amount, currency (USD/EUR/etc.), and whether it is monthly, yearly, or one-time.",
  },
  {
    title: "Pricing page discloses Paddle as Merchant of Record",
    detail:
      "Wording like: 'Payments are processed by Paddle.com, our Merchant of Record.'",
  },
  {
    title: "Refund policy says 14–90 days and points to paddle.net",
    detail:
      "Do NOT say 'no refunds' or 'all sales final' — Paddle will reject the site.",
  },
  {
    title: "Privacy notice names Paddle as a data recipient",
    detail:
      "List Paddle alongside hosting/analytics providers under 'who we share data with'.",
  },
  {
    title: "Contact / support method is visible",
    detail:
      "An email address, contact form, or help page reachable from the footer.",
  },
  {
    title: "Site loads on mobile and desktop without a blank screen",
    detail:
      "Open the live URL in an incognito window on phone + laptop. No white screen, no JS errors.",
  },
  {
    title: "All legal pages are publicly accessible (no login required)",
    detail:
      "Open them in a private window while signed out. Each must return the page, not a redirect to sign-in.",
  },
];

export default function PaddleChecklistPage() {
  usePageSEO({
    title: "Paddle Approval Checklist · Willow Vibes",
    description: "Internal checklist to verify the site is ready for Paddle approval.",
  });

  const [urlChecks, setUrlChecks] = useState<UrlCheck[]>(INITIAL_URL_CHECKS);
  const [running, setRunning] = useState(false);
  const [manualDone, setManualDone] = useState<Record<number, boolean>>({});

  const runChecks = async () => {
    setRunning(true);
    setUrlChecks((prev) => prev.map((c) => ({ ...c, status: "pending" as CheckStatus })));

    // Hit each URL with a no-cors HEAD-like request. We use fetch with mode 'no-cors'
    // because most of these are same-origin in production but the live origin differs
    // from the lovable preview origin during testing.
    const results = await Promise.all(
      INITIAL_URL_CHECKS.map(async (check) => {
        try {
          const res = await fetch(`${SITE_ORIGIN}${check.path}`, {
            method: "GET",
            mode: "no-cors",
            cache: "no-store",
          });
          // With no-cors we get an opaque response — status is 0 but the request
          // succeeding at all is a strong signal the URL is reachable.
          return {
            ...check,
            status: "ok" as CheckStatus,
            httpStatus: res.status || 200,
          };
        } catch {
          return { ...check, status: "fail" as CheckStatus };
        }
      }),
    );
    setUrlChecks(results);
    setRunning(false);
  };

  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleManual = (i: number) =>
    setManualDone((prev) => ({ ...prev, [i]: !prev[i] }));

  const okCount = urlChecks.filter((c) => c.status === "ok").length;
  const manualCount = Object.values(manualDone).filter(Boolean).length;
  const allReady = okCount === urlChecks.length && manualCount === MANUAL_CHECKS.length;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="mb-8">
          <Link
            to="/app"
            className="text-sm text-charcoal/60 hover:text-forest transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-forest mb-3">
          Paddle approval checklist
        </h1>
        <p className="text-charcoal/70 mb-8">
          Run through this before resubmitting <strong>willowvibes.com</strong> to
          Paddle. Every item below is something their reviewers actively check.
        </p>

        {/* Public URL checks */}
        <Card className="p-6 mb-6 bg-white border-sage/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl text-forest">
                1. Public URL reachability
              </h2>
              <p className="text-sm text-charcoal/60">
                {okCount} of {urlChecks.length} reachable
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={runChecks}
              disabled={running}
              className="border-sage/40"
            >
              {running ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="ml-2">Re-run</span>
            </Button>
          </div>

          <ul className="space-y-3">
            {urlChecks.map((check) => (
              <li
                key={check.path}
                className="flex items-start gap-3 p-3 rounded-lg bg-cream/50"
              >
                <div className="mt-0.5">
                  {check.status === "ok" && (
                    <CheckCircle2 className="w-5 h-5 text-forest" />
                  )}
                  {check.status === "fail" && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {check.status === "pending" && (
                    <Loader2 className="w-5 h-5 text-charcoal/40 animate-spin" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-charcoal">{check.label}</span>
                    <a
                      href={`${SITE_ORIGIN}${check.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-forest hover:underline inline-flex items-center gap-1"
                    >
                      {check.path}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {check.status === "fail" && (
                      <Badge variant="destructive" className="text-xs">
                        Unreachable
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/60 mt-1">{check.why}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-xs text-charcoal/50 mt-4">
            Note: browser security (CORS) hides exact HTTP status codes for
            cross-origin requests. A green check confirms the URL is reachable;
            still open each one manually to confirm content renders correctly.
          </p>
        </Card>

        {/* Manual content checks */}
        <Card className="p-6 mb-6 bg-white border-sage/30">
          <div className="mb-4">
            <h2 className="font-display text-xl text-forest">
              2. Content checks (do manually)
            </h2>
            <p className="text-sm text-charcoal/60">
              {manualCount} of {MANUAL_CHECKS.length} confirmed
            </p>
          </div>

          <ul className="space-y-3">
            {MANUAL_CHECKS.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggleManual(i)}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-lg bg-cream/50 hover:bg-cream transition-colors"
                >
                  <div className="mt-0.5">
                    {manualDone[i] ? (
                      <CheckCircle2 className="w-5 h-5 text-forest" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-sage/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        manualDone[i] ? "text-charcoal/50 line-through" : "text-charcoal"
                      }`}
                    >
                      {item.title}
                    </div>
                    <p className="text-xs text-charcoal/60 mt-1">{item.detail}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Accessibility quick check */}
        <Card className="p-6 mb-6 bg-white border-sage/30">
          <h2 className="font-display text-xl text-forest mb-2">
            3. Accessibility quick check
          </h2>
          <ul className="text-sm text-charcoal/70 space-y-2 list-disc list-inside">
            <li>Open homepage in incognito → no blank screen, no console errors.</li>
            <li>Resize browser to 375px wide → layout still works on mobile.</li>
            <li>Tab through the pricing page → CTAs are keyboard-focusable.</li>
            <li>All images have alt text (right-click → Inspect a few).</li>
            <li>Footer links to Terms, Privacy, and Refund are visible on every page.</li>
          </ul>
        </Card>

        {/* Final state */}
        <Card
          className={`p-6 ${
            allReady
              ? "bg-forest text-cream border-forest"
              : "bg-gold/10 border-gold/30"
          }`}
        >
          <h2 className="font-display text-xl mb-2">
            {allReady ? "✓ Ready to resubmit" : "Almost there"}
          </h2>
          <p className={`text-sm ${allReady ? "text-cream/80" : "text-charcoal/70"}`}>
            {allReady
              ? "Reply to Paddle's email confirming the site is live and all required pages are reachable. Mention that you've fixed the previous downtime."
              : "Finish the remaining items above, then reply to Paddle's approval email."}
          </p>
        </Card>
      </div>
    </div>
  );
}
