import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, updated, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-3xl mx-auto px-6 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </header>
      <article className="max-w-3xl mx-auto px-6 pb-20 pt-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-xs font-body text-muted-foreground mb-8">Last updated: {updated}</p>
        <div className="prose prose-sm sm:prose-base max-w-none font-body text-foreground/90 [&_h2]:font-display [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:mb-4 [&_a]:text-[hsl(var(--forest))] [&_a]:underline">
          {children}
        </div>
        <div className="mt-12 pt-6 border-t border-border flex flex-wrap gap-x-6 gap-y-2 text-xs font-body text-muted-foreground">
          <Link to="/legal/terms" className="hover:text-foreground">Terms</Link>
          <Link to="/legal/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/legal/refund" className="hover:text-foreground">Refund</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
        </div>
      </article>
    </div>
  );
}
