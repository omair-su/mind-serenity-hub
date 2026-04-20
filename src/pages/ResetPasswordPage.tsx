import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import WillowLogo from "@/components/WillowLogo";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  // Detect recovery flow — Supabase places type=recovery in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery") || hash.includes("access_token");

    // Listen for the PASSWORD_RECOVERY event triggered by the magic link
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecoverySession(true);
    });

    // Also check if a session already exists (link already processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && isRecovery) setHasRecoverySession(true);
      else if (data.session) setHasRecoverySession(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSuccess(true);
    // Sign out so user must log in with new password
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate("/sign-in?reset=1", { replace: true });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[hsl(var(--forest-deep))]">
      {/* Luxury background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at top left, hsl(var(--forest-mid)) 0%, transparent 55%), radial-gradient(ellipse at bottom right, hsl(var(--gold) / 0.25) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10c-5 15-15 25-30 30 15 5 25 15 30 30 5-15 15-25 30-30-15-5-25-15-30-30z' fill='%23D4A574' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: "120px 120px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-card/95 backdrop-blur-xl rounded-[2rem] p-10 shadow-elevated border border-gold/20"
      >
        <div className="flex justify-center mb-8">
          <WillowLogo variant="vertical" size="md" colorScheme="mono-navy" />
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
              Password updated
            </h1>
            <p className="font-body text-muted-foreground">
              Redirecting you to sign in…
            </p>
          </div>
        ) : !hasRecoverySession ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
              Invalid or expired link
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Please request a new password reset email from the sign-in page.
            </p>
            <button
              onClick={() => navigate("/sign-in", { replace: true })}
              className="w-full h-[52px] rounded-2xl bg-primary text-primary-foreground font-body font-semibold hover:opacity-90 transition"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gold/15 mx-auto flex items-center justify-center mb-5">
                <Lock className="w-6 h-6 text-gold-dark" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                Set a new password
              </h1>
              <p className="font-body text-muted-foreground">
                Choose a strong password to secure your account.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block font-body text-sm font-medium text-foreground ml-1">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    className="w-full h-[56px] px-5 pr-12 rounded-2xl bg-background border-[1.5px] border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-body text-sm font-medium text-foreground ml-1">
                  Confirm new password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-type password"
                  autoComplete="new-password"
                  className="w-full h-[56px] px-5 rounded-2xl bg-background border-[1.5px] border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-primary to-[hsl(var(--forest-mid))] text-primary-foreground font-body font-semibold text-lg shadow-[0_4px_12px_hsl(var(--forest)/0.25)] hover:shadow-[0_8px_24px_hsl(var(--forest)/0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update password</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
