import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Sparkles, Leaf, ShieldCheck, Globe, Star, Info } from "lucide-react";
import WillowLogo from "@/components/WillowLogo";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleOAuthSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/api/oauth/login";
    }, 800);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    setIsLoading(true);
    // Logic for email sign in would go here
  };

  // Animation variants
  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F5F0] overflow-hidden selection:bg-[#7A9B76]/20">
      {/* Import Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Lora:wght@400;500;600;700&display=swap');
        .font-luxury-display { font-family: 'Cormorant Garamond', serif; }
        .font-luxury-body { font-family: 'Lora', serif; }
      `}} />

      {/* ─── LEFT SIDE: BRAND SHOWCASE (50%) ─── */}
      <div className="relative hidden md:flex md:w-1/2 h-screen overflow-hidden bg-gradient-to-br from-[#F5F5F0] via-[#E8E8E0] to-[#A8C4A0]/20 items-center justify-center p-12 lg:p-20">
        {/* Botanical Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10c-5 15-15 25-30 30 15 5 25 15 30 30 5-15 15-25 30-30-15-5-25-15-30-30z' fill='%235A7556' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }} />
        
        <div className="relative z-10 max-w-lg text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <WillowLogo variant="vertical" size="lg" colorScheme="mono-black" className="scale-125 origin-left" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-luxury-display text-5xl lg:text-6xl font-normal text-[#2C3E50] leading-[1.1] tracking-tight mb-6"
          >
            Welcome Back to <br />Your Practice
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-luxury-body text-xl text-[#4A5568] leading-relaxed mb-12 opacity-80"
          >
            Your journey to calm continues here. Reconnect with your inner peace and elevate your daily mindfulness.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-wrap gap-8 pt-8 border-t border-[#2C3E50]/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A9B76]/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#7A9B76]" />
              </div>
              <div>
                <p className="font-luxury-body text-sm font-bold text-[#2C3E50]">10,000+</p>
                <p className="font-luxury-body text-[11px] uppercase tracking-widest text-[#718096]">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A87C]/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#C9A87C]" />
              </div>
              <div>
                <p className="font-luxury-body text-sm font-bold text-[#2C3E50]">Science-Backed</p>
                <p className="font-luxury-body text-[11px] uppercase tracking-widest text-[#718096]">Practices</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      {/* ─── RIGHT SIDE: SIGN-IN FORM (50%) ─── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-[#F5F5F0]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <div className="md:hidden mb-10 text-center">
            <WillowLogo variant="vertical" size="md" colorScheme="mono-black" className="mx-auto" />
          </div>

          <div className="bg-[#FDFDFB] rounded-[2rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(44,62,80,0.06),0_16px_48px_rgba(44,62,80,0.04)] border border-[#E8E8E0]/50 relative overflow-hidden">
            {/* Subtle Noise Texture for Card */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            
            <div className="relative z-10">
              <motion.div variants={itemVariants} className="mb-10">
                <h2 className="font-luxury-display text-4xl font-semibold text-[#2C3E50] mb-3">Sign In</h2>
                <p className="font-luxury-body text-[#718096] text-base leading-relaxed">Enter your details to access your meditation program</p>
              </motion.div>

              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block font-luxury-body text-sm font-medium text-[#2C3E50] ml-1">Email</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full h-[56px] px-5 rounded-2xl bg-white border-[1.5px] ${error && !email ? 'border-[#E57373] animate-shake' : 'border-[#E8E8E0]'} font-luxury-body text-[#2C3E50] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#7A9B76] focus:ring-4 focus:ring-[#7A9B76]/5 transition-all duration-300 group-hover:border-[#7A9B76]/40`}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block font-luxury-body text-sm font-medium text-[#2C3E50]">Password</label>
                    <button type="button" className="text-xs font-luxury-body font-medium text-[#7A9B76] hover:text-[#5A7556] transition-colors">Forgot password?</button>
                  </div>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full h-[56px] px-5 pr-12 rounded-2xl bg-white border-[1.5px] ${error && !password ? 'border-[#E57373] animate-shake' : 'border-[#E8E8E0]'} font-luxury-body text-[#2C3E50] placeholder:text-[#A0AEC0] focus:outline-none focus:border-[#7A9B76] focus:ring-4 focus:ring-[#7A9B76]/5 transition-all duration-300 group-hover:border-[#7A9B76]/40`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] hover:text-[#7A9B76] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-[#7A9B76] to-[#6A8B66] text-white font-luxury-body font-semibold text-lg shadow-[0_4px_12px_rgba(122,155,118,0.25)] hover:shadow-[0_8px_24px_rgba(122,155,118,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E8E8E0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#FDFDFB] text-[#A0AEC0] font-luxury-body">or</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button 
                  onClick={handleOAuthSignIn}
                  disabled={isLoading}
                  className="w-full h-[56px] rounded-2xl bg-white border-[1.5px] border-[#E8E8E0] text-[#2C3E50] font-luxury-body font-medium text-base hover:bg-[#FAFAFA] hover:border-[#D4D4D0] active:bg-[#F5F5F0] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>

              <motion.p variants={itemVariants} className="mt-10 text-center font-luxury-body text-sm text-[#718096]">
                Don't have an account? <button className="text-[#7A9B76] font-semibold hover:underline decoration-2 underline-offset-4">Sign up</button>
              </motion.p>
            </div>
          </div>

          {/* Luxury Footer Badges */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-luxury-body uppercase tracking-[0.2em]">Global Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-luxury-body uppercase tracking-[0.2em]">Secure Access</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  );
}
