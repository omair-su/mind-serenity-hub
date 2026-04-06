import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, Sparkles, Leaf } from "lucide-react";
import WillowLogo from "@/components/WillowLogo";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleOAuthSignIn = () => {
    window.location.href = "/api/oauth/login";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(139,37%,17%)] via-[hsl(160,30%,22%)] to-[hsl(200,35%,15%)]" />

      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[hsl(145,40%,30%/0.25)] blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(30,54%,65%/0.15)] blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] right-[15%] w-[300px] h-[300px] rounded-full bg-[hsl(200,50%,40%/0.12)] blur-[80px] animate-pulse" style={{ animationDelay: "4s" }} />
      <div className="absolute bottom-[30%] left-[10%] w-[250px] h-[250px] rounded-full bg-[hsl(280,40%,35%/0.1)] blur-[70px] animate-pulse" style={{ animationDelay: "3s" }} />

      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <WillowLogo variant="vertical" size="lg" colorScheme="mono-white" className="mx-auto" />
        </div>

        <div className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-white text-xl font-semibold mb-2">Welcome back</h2>
            <p className="text-white/50 text-sm">Sign in to continue your mindfulness journey</p>
          </div>

          <Button
            onClick={handleOAuthSignIn}
            className="w-full h-13 rounded-xl text-base font-semibold bg-gradient-to-r from-[hsl(30,54%,65%)] to-[hsl(43,86%,38%)] hover:from-[hsl(30,54%,60%)] hover:to-[hsl(43,86%,33%)] text-white border-0 shadow-lg shadow-[hsl(30,54%,65%/0.3)] transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(30,54%,65%/0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Button>
        </div>

        <div className="flex justify-center gap-6 mt-8 text-white/40 text-xs">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(30,54%,65%)]" />
            <span>Premium Content</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[hsl(145,20%,71%)]" />
            <span>Science-Backed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
