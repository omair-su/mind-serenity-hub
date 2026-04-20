import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Globe,
  Star,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import WillowLogo from "@/components/WillowLogo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // If already signed in, bounce to /app
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app", { replace: true });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/app", { replace: true });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // Surface email-confirmation success/errors arriving via the redirect
  useEffect(() => {
    if (searchParams.get("confirmed") === "1") {
      setInfoMsg("Email confirmed — you can sign in now.");
    }
    const errDesc = searchParams.get("error_description");
    if (errDesc) setErrorMsg(errDesc);
  }, [searchParams]);

  const resetMessages = () => {
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleGoogleSignIn = async () => {
    resetMessages();
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/app`,
    });
    if (result.error) {
      setGoogleLoading(false);
      setErrorMsg(result.error.message ?? "Google sign-in failed.");
      return;
    }
    if (result.redirected) {
      // Browser is redirecting to Google — leave loader on.
      return;
    }
    // Tokens received; auth listener will redirect to /app.
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password || (mode === "signup" && !name)) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/sign-in?confirmed=1`,
          data: { display_name: name },
        },
      });
      setIsLoading(false);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // If email confirmation is required, no session is returned.
      if (!data.session) {
        setConfirmationSent(true);
        toast({
          title: "Check your inbox",
          description: `We sent a confirmation link to ${email}.`,
        });
      } else {
        navigate("/app", { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoading(false);

      if (error) {
        setErrorMsg(error.message);
        return;
      }
      navigate("/app", { replace: true });
    }
  };

  const handleForgotPassword = async () => {
    resetMessages();
    if (!email) {
      setErrorMsg("Enter your email above first, then tap Forgot password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setInfoMsg(`Password reset link sent to ${email}.`);
    }
  };

  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // ────────────────────────────────────────────────────────────────────
  // Email-sent confirmation screen
  // ────────────────────────────────────────────────────────────────────
  if (confirmationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card rounded-[2rem] p-10 text-center shadow-[var(--shadow-card-val)] border border-border"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-3">
            Check your inbox
          </h1>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            We've sent a confirmation link to{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Click it to activate your Willow Vibes account.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false);
              setMode("signin");
            }}
            className="w-full h-[52px] rounded-2xl bg-primary text-primary-foreground font-body font-semibold hover:opacity-90 transition"
          >
            Back to sign in
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden selection:bg-gold/30 relative bg-[hsl(var(--forest-deep))]">
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Lora:wght@400;500;600;700&display=swap');
          .font-luxury-display { font-family: 'Cormorant Garamond', serif; letter-spacing: -0.01em; }
          .font-luxury-body { font-family: 'Lora', serif; }
          @keyframes float-orb {
            0%, 100% { transform: translate(0,0) scale(1); }
            50% { transform: translate(30px,-20px) scale(1.05); }
          }
          .animate-float-orb { animation: float-orb 14s ease-in-out infinite; }
          @keyframes shimmer-gold {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .gold-shimmer-text {
            background: linear-gradient(90deg, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold)), hsl(var(--gold-light)));
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer-gold 6s linear infinite;
          }
        `,
      }} />

      {/* ─── AMBIENT BACKGROUND ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at 15% 20%, hsl(var(--forest-mid)) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, hsl(var(--gold) / 0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, hsl(var(--forest)) 0%, hsl(var(--forest-deep)) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10c-5 15-15 25-30 30 15 5 25 15 30 30 5-15 15-25 30-30-15-5-25-15-30-30z' fill='%23D4A574' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "140px 140px",
          }}
        />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gold/10 blur-[120px] animate-float-orb" />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full bg-sage/15 blur-[140px] animate-float-orb" style={{ animationDelay: "3s" }} />
      </div>

      {/* ─── LEFT: BRAND SHOWCASE ─── */}
      <div className="relative hidden md:flex md:w-1/2 h-screen items-center justify-center p-12 lg:p-20 z-10">
        <div className="relative max-w-lg text-cream">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <WillowLogo variant="vertical" size="lg" colorScheme="mono-white" className="scale-125 origin-left" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="font-luxury-body text-[11px] uppercase tracking-[0.25em] text-gold-light">
              Premium Practice
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-luxury-display text-5xl lg:text-6xl font-light text-cream leading-[1.05] mb-6"
          >
            {mode === "signup" ? (
              <>Begin Your <br /><span className="gold-shimmer-text font-medium italic">Mindful Journey</span></>
            ) : (
              <>Welcome Back to <br /><span className="gold-shimmer-text font-medium italic">Your Practice</span></>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-luxury-body text-xl text-cream/75 leading-relaxed mb-12"
          >
            {mode === "signup"
              ? "Join thousands cultivating calm, focus, and discipline through science-backed daily practice."
              : "Your sanctuary of stillness awaits. Reconnect with your inner peace and elevate your daily mindfulness."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap gap-8 pt-8 border-t border-gold/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-gold-light" />
              </div>
              <div>
                <p className="font-luxury-body text-sm font-bold text-cream">10,000+</p>
                <p className="font-luxury-body text-[10px] uppercase tracking-[0.2em] text-cream/55">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold-light" />
              </div>
              <div>
                <p className="font-luxury-body text-sm font-bold text-cream">Science-Backed</p>
                <p className="font-luxury-body text-[10px] uppercase tracking-[0.2em] text-cream/55">Practices</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT: AUTH FORM ─── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px]"
        >
          <div className="md:hidden mb-8 text-center">
            <WillowLogo variant="vertical" size="md" colorScheme="mono-white" className="mx-auto" />
          </div>

          <div className="bg-cream/95 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-[0_20px_80px_-20px_hsl(0_0%_0%/0.5)] border border-gold/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="font-luxury-display text-4xl font-semibold text-foreground mb-3">
                  {mode === "signup" ? "Create account" : "Sign in"}
                </h2>
                <p className="font-luxury-body text-muted-foreground text-base leading-relaxed">
                  {mode === "signup"
                    ? "Start your practice in under a minute."
                    : "Enter your details to access your meditation program."}
                </p>
              </motion.div>

              {/* Status messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="font-luxury-body">{errorMsg}</span>
                  </motion.div>
                )}
                {infoMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 flex items-start gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="font-luxury-body">{infoMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                {mode === "signup" && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block font-luxury-body text-sm font-medium text-foreground ml-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      className="w-full h-[56px] px-5 rounded-2xl bg-background border-[1.5px] border-border font-luxury-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block font-luxury-body text-sm font-medium text-foreground ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full h-[56px] px-5 rounded-2xl bg-background border-[1.5px] border-border font-luxury-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block font-luxury-body text-sm font-medium text-foreground">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-luxury-body font-medium text-primary hover:opacity-70 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      className="w-full h-[56px] px-5 pr-12 rounded-2xl bg-background border-[1.5px] border-border font-luxury-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-primary to-[hsl(var(--forest-mid))] text-primary-foreground font-luxury-body font-semibold text-lg shadow-[0_4px_12px_hsl(var(--forest)/0.25)] hover:shadow-[0_8px_24px_hsl(var(--forest)/0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-luxury-body">or</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full h-[56px] rounded-2xl bg-background border-[1.5px] border-border text-foreground font-luxury-body font-medium text-base hover:bg-muted/50 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm disabled:opacity-70"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </motion.div>

              <motion.p variants={itemVariants} className="mt-8 text-center font-luxury-body text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode(mode === "signup" ? "signin" : "signup");
                  }}
                  className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
                >
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </button>
              </motion.p>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex justify-center gap-8 opacity-50"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-luxury-body uppercase tracking-[0.2em]">Global Community</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-luxury-body uppercase tracking-[0.2em]">Secure Access</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
