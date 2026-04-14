import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import SoundMixer from "@/components/SoundMixer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10 pb-24 lg:pb-10">
          {children}
        </div>
      </main>
      <BottomNav />
      <SoundMixer />
    </div>
  );
}
