import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import WillowLogo from "@/components/WillowLogo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";
import signinBg from "@/assets/signin-bg.jpg";

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

  // Honor ?redirect=... so landing-page CTAs can route the user back to a specific page after auth
  const redirectParam = searchParams.get("redirect");
  const safeRedirect = redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
    ? redirectParam
    : "/app";

  // If already signed in, bounce to redirect target (default /app)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(safeRedirect, { replace: true });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate(safeRedirect, { replace: true });
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate, safeRedirect]);

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
      redirect_uri: `${window.location.origin}${safeRedirect}`,
    });
    if (result.error) {
      setGoogleLoading(false);
      setErrorMsg(result.error.message ?? "Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
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

      if (!data.session) {
        setConfirmationSent(true);
        toast({
          title: "Check your inbox",
          description: `We sent a confirmation link to ${email}.`,
        });
      } else {
        navigate(safeRedirect, { replace: true });
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
      navigate(safeRedirect, { replace: true });
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
        staggerChildren: 0.07,
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
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <img
          src={signinBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-10 text-center shadow-2xl border border-white/60"
        >
          <div className="w-16 h-16 rounded-full bg-[hsl(20_70%_60%/0.12)] mx-auto flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[hsl(20_70%_50%)]" />
          </div>
          <h1 className="font-serif-display text-3xl font-medium text-slate-900 mb-3">
            Check your inbox
          </h1>
          <p className="font-sans-body text-slate-600 leading-relaxed mb-8">
            We've sent a confirmation link to{" "}
            <span className="font-semibold text-slate-900">{email}</span>.
            Click it to activate your Willow Vibes account.
          </p>
          <button
            onClick={() => {
              setConfirmationSent(false);
              setMode("signin");
            }}
            className="w-full h-[52px] rounded-2xl bg-slate-900 text-white font-sans-body font-medium hover:bg-slate-800 transition"
          >
            Back to sign in
          </button>
        </motion.div>
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
            .font-serif-display { font-family: 'Fraunces', serif; }
            .font-sans-body { font-family: 'Inter', sans-serif; }
          `,
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap');
          .font-serif-display { font-family: 'Fraunces', serif; letter-spacing: -0.015em; }
          .font-sans-body { font-family: 'Inter', sans-serif; }
        `,
      }} />

      {/* ─── PHOTO BACKGROUND ─── */}
      <div className="absolute inset-0">
        <img
          src={signinBg}
          alt="Misty mountain lake at dawn"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Soft warm wash to keep mountain visible but readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-[hsl(20_60%_85%/0.25)] to-[hsl(280_40%_80%/0.35)]" />
        <div className="absolute inset-0 md:bg-gradient-to-r md:from-transparent md:via-white/10 md:to-white/40" />
      </div>

      {/* ─── LEFT: BRAND COPY (over photo) ─── */}
      <div className="relative hidden md:flex md:w-1/2 h-screen items-end p-12 lg:p-16 z-10">
        <div className="max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <WillowLogo variant="vertical" size="lg" colorScheme="mono-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-white/25 backdrop-blur-md border border-white/40"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="font-sans-body text-[11px] uppercase tracking-[0.2em] text-white font-medium">
              Mindful Practice
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-serif-display text-4xl lg:text-5xl font-light text-white leading-[1.1] mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
          >
            {mode === "signup" ? (
              <>Begin your <em className="font-medium italic">quiet practice</em>.</>
            ) : (
              <>Welcome back to <em className="font-medium italic">stillness</em>.</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-sans-body text-base text-white/90 leading-relaxed max-w-md drop-shadow-[0_1px_8px_rgba(0,0,0,0.25)]"
          >
            {mode === "signup"
              ? "Join thousands cultivating calm and focus through daily practice."
              : "Your sanctuary of stillness awaits. Reconnect with your inner peace."}
          </motion.p>
        </div>
      </div>

      {/* ─── RIGHT: AUTH FORM ─── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-14 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[420px]"
        >
          <div className="md:hidden mb-6 text-center">
            <WillowLogo variant="vertical" size="md" colorScheme="mono-white" className="mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
          </div>

          <div className="bg-white/92 backdrop-blur-xl rounded-3xl p-7 md:p-9 shadow-[0_20px_60px_-15px_rgba(30,41,59,0.25)] border border-white/70">
            <motion.div variants={itemVariants} className="mb-7">
              <h2 className="font-serif-display text-3xl font-medium text-slate-900 mb-2">
                {mode === "signup" ? "Create account" : "Sign in"}
              </h2>
              <p className="font-sans-body text-slate-500 text-sm leading-relaxed">
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
                  className="mb-5 flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-sans-body">{errorMsg}</span>
                </motion.div>
              )}
              {infoMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 flex items-start gap-2 rounded-xl bg-sage-light/30 border border-sage/40 px-4 py-3 text-sm text-forest-deep"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-sans-body">{infoMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {mode === "signup" && (
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="block font-sans-body text-xs font-medium text-slate-700 ml-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full h-[50px] px-4 rounded-xl bg-slate-50 border border-slate-200 font-sans-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="block font-sans-body text-xs font-medium text-slate-700 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full h-[50px] px-4 rounded-xl bg-slate-50 border border-slate-200 font-sans-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="block font-sans-body text-xs font-medium text-slate-700">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-sans-body font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="w-full h-[50px] px-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 font-sans-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[50px] rounded-xl bg-slate-900 text-white font-sans-body font-medium text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-sans-body uppercase tracking-wider">or</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full h-[50px] rounded-xl bg-white border border-slate-200 text-slate-700 font-sans-body font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
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

            <motion.p variants={itemVariants} className="mt-7 text-center font-sans-body text-sm text-slate-500">
              {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode(mode === "signup" ? "signin" : "signup");
                }}
                className="text-slate-900 font-semibold hover:underline decoration-2 underline-offset-4"
              >
                {mode === "signup" ? "Sign in" : "Sign up"}
              </button>
            </motion.p>
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex justify-center gap-2 text-white/85"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-sans-body tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              Secure & private — your practice is yours alone
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
