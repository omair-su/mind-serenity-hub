import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Trash2, WifiOff, HardDrive, Moon, Wind, ScanEye, Headphones, Brain, Footprints, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import PremiumGate from "@/components/PremiumGate";

// Real app content available for offline caching
const offlineContent = [
  {
    id: "breathing-exercises",
    title: "Breathing Exercises",
    type: "practice",
    icon: Wind,
    description: "4-7-8 Relaxation, Box Breathing, Diaphragmatic & Energizing techniques",
    fileSize: 8,
    color: "from-sky-400 to-blue-500",
    items: ["4-7-8 Relaxation", "Box Breathing", "Diaphragmatic", "Energizing Breath"],
  },
  {
    id: "sleep-stories",
    title: "Sleep Stories",
    type: "stories",
    icon: Moon,
    description: "Lavender Fields, Enchanted Library, Mountain Train & more bedtime stories",
    fileSize: 32,
    color: "from-indigo-400 to-purple-500",
    items: ["Lavender Fields of Provence", "The Enchanted Library", "Mountain Train Journey", "Rainy Day Café"],
  },
  {
    id: "body-scan",
    title: "Body Scan Scripts",
    type: "practice",
    icon: ScanEye,
    description: "Complete guided body scan sessions for head, shoulders, chest, hands & feet",
    fileSize: 12,
    color: "from-violet-400 to-purple-500",
    items: ["Head & Crown", "Shoulders & Neck", "Chest & Heart", "Hands", "Feet & Grounding"],
  },
  {
    id: "sound-bath",
    title: "Sound Bath Sessions",
    type: "audio",
    icon: Headphones,
    description: "Tibetan bowls, crystal singing bowls, ocean waves & forest ambient soundscapes",
    fileSize: 45,
    color: "from-emerald-400 to-teal-500",
    items: ["Tibetan Bowls", "Crystal Singing Bowls", "Ocean Waves", "Forest Ambience"],
  },
  {
    id: "focus-sessions",
    title: "Focus Mode Sessions",
    type: "practice",
    icon: Brain,
    description: "25-minute Pomodoro, deep work timers with binaural beats & ambient sounds",
    fileSize: 18,
    color: "from-amber-400 to-orange-500",
    items: ["25-min Focus Sprint", "Deep Work Timer", "Study Session", "Creative Flow"],
  },
  {
    id: "walking-meditation",
    title: "Walking Meditations",
    type: "practice",
    icon: Footprints,
    description: "Guided walking sessions for parks, indoor spaces & nature trails",
    fileSize: 22,
    color: "from-green-400 to-emerald-500",
    items: ["Park Walk", "Indoor Walking", "Nature Trail", "Mindful Stroll"],
  },
  {
    id: "daily-affirmations",
    title: "Daily Affirmations",
    type: "text",
    icon: Sparkles,
    description: "Morning confidence, gratitude, self-love & evening wind-down affirmation sets",
    fileSize: 4,
    color: "from-pink-400 to-rose-500",
    items: ["Morning Confidence", "Gratitude Set", "Self-Love", "Evening Wind-Down"],
  },
  {
    id: "course-content",
    title: "30-Day Course",
    type: "course",
    icon: BookOpen,
    description: "Complete 30-day meditation course — all 4 weeks of guided practices & lessons",
    fileSize: 56,
    color: "from-primary to-sage",
    items: ["Week 1: Foundations", "Week 2: Deepening", "Week 3: Expansion", "Week 4: Integration"],
  },
];

interface DownloadedItem {
  id: string;
  contentId: string;
  title: string;
  fileSize: number;
  downloadedAt: string;
}

function OfflineDownloadsPageInner() {
  const [downloads, setDownloads] = useState<DownloadedItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("willow_offline_downloads") || "[]"); } catch { return []; }
  });
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const persist = (items: DownloadedItem[]) => {
    setDownloads(items);
    localStorage.setItem("willow_offline_downloads", JSON.stringify(items));
  };

  const totalMB = downloads.reduce((s, d) => s + d.fileSize, 0);

  const handleDownload = async (content: typeof offlineContent[0]) => {
    setDownloadingIds((prev) => new Set(prev).add(content.id));
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
    const item: DownloadedItem = {
      id: crypto.randomUUID(),
      contentId: content.id,
      title: content.title,
      fileSize: content.fileSize,
      downloadedAt: new Date().toISOString(),
    };
    persist([...downloads, item]);
    toast.success(`${content.title} saved for offline use!`);
    setDownloadingIds((prev) => { const n = new Set(prev); n.delete(content.id); return n; });
  };

  const handleDelete = (contentId: string) => {
    persist(downloads.filter((d) => d.contentId !== contentId));
    toast.success("Removed from offline storage");
  };

  const isDownloaded = (id: string) => downloads.some((d) => d.contentId === id);

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Offline Downloads</h1>
          <p className="text-muted-foreground font-body">Save your favourite Willow content for practice without internet</p>
        </motion.div>

        {/* Storage card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          <Card className="bg-gradient-to-r from-primary to-sage text-white p-8 border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="w-6 h-6" />
                  <h2 className="text-2xl font-heading font-bold">Storage</h2>
                </div>
                <p className="opacity-80 font-body">{downloads.length} content pack{downloads.length !== 1 ? "s" : ""} saved</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-heading font-bold">{totalMB}</div>
                <div className="opacity-80 font-body text-sm">MB used</div>
              </div>
            </div>
            <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div className="bg-white/70 h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min((totalMB / 500) * 100, 100)}%` }} transition={{ duration: 1, ease: "easeOut" }} />
            </div>
            <p className="opacity-70 text-sm mt-2 font-body">500 MB available</p>
          </Card>
        </motion.div>

        {/* Content grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Available Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offlineContent.map((content, index) => {
              const downloaded = isDownloaded(content.id);
              const isDownloading = downloadingIds.has(content.id);
              const Icon = content.icon;
              return (
                <motion.div key={content.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.04 }}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className={`h-24 bg-gradient-to-br ${content.color} relative overflow-hidden flex items-center justify-center`}>
                      <Icon className="w-10 h-10 text-white/80" />
                      {downloaded && (
                        <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                          <WifiOff className="w-3 h-3 text-white" />
                          <span className="text-[10px] font-body font-bold text-white">SAVED</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-heading font-bold text-foreground mb-1">{content.title}</h3>
                      <p className="text-sm text-muted-foreground font-body mb-3 flex-1">{content.description}</p>

                      {/* Content items preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {content.items.map((item) => (
                          <span key={item} className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 font-body">
                        <span>{content.items.length} items</span>
                        <span>{content.fileSize} MB</span>
                      </div>

                      <div className="flex gap-2">
                        {downloaded ? (
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(content.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />Remove
                          </Button>
                        ) : (
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-sage hover:opacity-90 text-white" onClick={() => handleDownload(content)} disabled={isDownloading}>
                            {isDownloading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>) : (<><Download className="w-4 h-4 mr-2" />Save Offline</>)}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

export default function OfflineDownloadsPage() {
  return (
    <PremiumGate
      feature="Offline Downloads"
      description="Download premium sessions to your device — meditate on flights, in the mountains or anywhere with zero connection. Your library, always with you."
      icon={Download}
      gradient="from-gold/30 to-gold-dark/20"
      previewItems={[
        "Breathing Exercises bundle (8 MB)",
        "Sleep Stories collection (32 MB)",
        "Body Scan Scripts (12 MB)",
        "Sound Bath Sessions (45 MB)",
        "Focus Mode Sessions (18 MB)",
        "Walking Meditations (15 MB)",
      ]}
    >
      <OfflineDownloadsPageInner />
    </PremiumGate>
  );
}
