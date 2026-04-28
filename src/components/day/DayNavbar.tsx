import { Link } from "react-router-dom";
import { LayoutDashboard, Bookmark, BookmarkCheck } from "lucide-react";
import logoImg from "@/assets/willow-logo.png";

interface DayNavbarProps {
  scrolled: boolean;
  dayNumber: number;
  weekNumber: number;
  weekTitle: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
}

export default function DayNavbar({
  scrolled, dayNumber, weekNumber, weekTitle, bookmarked, onToggleBookmark,
}: DayNavbarProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"}`}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Willow Vibes" className="h-7 w-7" />
            <span className={`font-display text-lg font-bold ${scrolled ? "text-primary" : "text-card"}`}>Willow Vibes™</span>
          </Link>
          <span className={`hidden sm:inline text-xs font-body ${scrolled ? "text-muted-foreground" : "text-card/70"}`}>Day {dayNumber} of 30</span>
        </div>
        <div className={`hidden md:block text-sm font-body font-medium ${scrolled ? "text-foreground" : "text-card/90"}`}>
          Week {weekNumber}: {weekTitle}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/course" className={`flex items-center gap-1.5 text-sm font-body transition-colors ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-card/70 hover:text-card"}`}>
            <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <button onClick={onToggleBookmark} className={`p-2 rounded-lg transition-colors ${scrolled ? "hover:bg-secondary" : "hover:bg-card/10"}`}>
            {bookmarked
              ? <BookmarkCheck className={`w-5 h-5 ${scrolled ? "text-primary" : "text-card"}`} />
              : <Bookmark className={`w-5 h-5 ${scrolled ? "text-muted-foreground" : "text-card/70"}`} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
