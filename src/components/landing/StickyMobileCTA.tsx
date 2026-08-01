import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Persistent conversion bar on small screens.
 * Appears after the hero, hides once the footer is in view.
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = y + window.innerHeight > doc.scrollHeight - 420;
      setVisible(y > 620 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pt-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(245,240,232,0) 0%, rgba(245,240,232,0.96) 45%)",
          }}
        >
          <div
            className="flex items-center gap-3 rounded-full pl-5 pr-2 py-2"
            style={{
              background: "rgba(245,240,232,0.96)",
              border: "1px solid rgba(125,155,118,0.28)",
              boxShadow: "0 18px 40px -22px rgba(31,35,29,0.5)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="leading-tight">
              <p
                className="ff-body text-[12px] font-semibold"
                style={{ color: "#1f231d" }}
              >
                7 days free
              </p>
              <p className="ff-body text-[10px]" style={{ color: "#6b7268" }}>
                Cancel anytime
              </p>
            </div>
            <Link to="/sign-in?redirect=/app" className="ml-auto">
              <button
                className="ff-body inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold"
                style={{ background: "#3a4d36", color: "#f5f0e8" }}
              >
                Start now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
