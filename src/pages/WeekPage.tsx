import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { weeks } from "@/data/courseData";
import weekNatureImg from "@/assets/week-nature.jpg";
import { ArrowRight } from "lucide-react";

export default function WeekPage() {
  const { weekNum } = useParams();
  const navigate = useNavigate();
  const weekNumber = parseInt(weekNum || "1");
  const week = weeks.find(w => w.week === weekNumber);

  if (!week) {
    return <Layout><p className="text-muted-foreground">Week not found.</p></Layout>;
  }

  return (
    <Layout>
      <div className="animate-fade-in space-y-10">
        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src={weekNatureImg} alt="Nature" className="w-full h-48 object-cover" loading="lazy" width={800} height={600} />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <span className="willow-badge mb-2 inline-block">Week {week.week}</span>
            <h1 className="font-display text-3xl lg:text-4xl font-medium text-background">{week.title}</h1>
            <p className="font-body text-sm text-background/80 mt-1">{week.subtitle}</p>
          </div>
        </div>

        <p className="willow-body text-lg">{week.description}</p>

        <div className="willow-divider" />

        {/* Days List */}
        <div className="space-y-3">
          {week.days.map(day => (
            <button
              key={day.day}
              onClick={() => navigate(`/day/${day.day}`)}
              className="w-full text-left p-5 rounded-xl bg-card border border-border willow-card-hover group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display text-lg font-medium text-primary">Day {day.day}</span>
                    <span className="text-xs font-body text-muted-foreground">· {day.duration}</span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-foreground">{day.title}</h3>
                  <p className="text-sm font-body text-muted-foreground mt-1 line-clamp-1">{day.focus}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
