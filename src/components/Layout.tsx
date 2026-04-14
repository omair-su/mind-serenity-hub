import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-8 pb-24 lg:py-12 lg:pb-12">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
