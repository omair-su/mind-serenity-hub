import { useNavigate, useLocation } from "react-router-dom";
import { Home, Wind, Moon, Compass, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { label: "Home", icon: Home, path: "/app" },
  { label: "Breathe", icon: Wind, path: "/app/breathing" },
  { label: "Sleep", icon: Moon, path: "/app/sleep" },
  { label: "Explore", icon: Compass, path: "/app/explore" },
  { label: "Profile", icon: User, path: "/app/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Glass backdrop */}
      <div className="relative border-t border-border/50 bg-card/80 backdrop-blur-xl safe-area-bottom">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-0.5 py-1 px-3 min-w-[56px]"
              >
                {active && (
                  <motion.div
                    layoutId="bottomnav-pill"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-[10px] font-body transition-colors duration-200 ${
                    active ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
