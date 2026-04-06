import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  {
    title: "Getting Started",
    items: [
      { q: "How do I start Day 1?", a: "Navigate to the Dashboard and click 'Continue Day 1' — or go to the Meditation Library and select Day 1. The practice includes preparation instructions, a guided script, and reflection prompts." },
      { q: "What if I miss a day?", a: "That's completely okay! This program is self-paced. Pick up where you left off. Your progress is saved and your streak will show your consistency. Missing a day doesn't erase what you've built." },
      { q: "Can I go at my own pace?", a: "Absolutely. While the program is designed for 30 consecutive days, you can take breaks, repeat days, or slow down. The key is consistent practice, not rigid scheduling." },
      { q: "Do I need special equipment?", a: "No. Just a quiet space and 10-30 minutes. A cushion or chair is helpful but not required. No special clothing, mats, or apps needed beyond this platform." },
    ],
  },
  {
    title: "Meditation Help",
    items: [
      { q: "I can't stop thinking — am I doing it wrong?", a: "No! This is the #1 concern and it's completely normal. The practice isn't about stopping thoughts — it's about noticing them and gently returning attention. Each time you notice your mind wandered, that IS the practice. You're succeeding every time you notice." },
      { q: "I keep falling asleep during meditation", a: "This is very common, especially with body scans and evening practices. Try meditating sitting upright, earlier in the day, or with eyes slightly open. If you fall asleep, your body needed rest — that's okay too." },
      { q: "How do I know if meditation is working?", a: "Changes are often subtle and noticed by others first. Look for: slightly better sleep, a half-second pause before reacting, feeling slightly calmer in traffic, noticing your breath during the day. These small shifts are big wins." },
      { q: "What if I can't sit still?", a: "Try Day 6 (Walking Meditation) or Day 11 (Movement Meditation). Not all meditation requires sitting still. Movement-based practices are equally valid and effective." },
    ],
  },
  {
    title: "Technical Support",
    items: [
      { q: "Audio isn't playing", a: "Check your device volume and ensure your browser allows audio playback. Try refreshing the page. If issues persist, you can read the guided practice script instead." },
      { q: "My progress isn't saving", a: "Progress is saved to your browser's local storage. Make sure you're using the same browser and device. Clearing browser data will reset progress. We recommend checking the Settings page for data export options." },
      { q: "Can I access this on my phone?", a: "Yes! The entire platform is fully responsive and works on phones, tablets, and computers. Just open the website in your mobile browser." },
    ],
  },
  {
    title: "Account & Billing",
    items: [
      { q: "Is this a subscription or one-time payment?", a: "One-time payment. $147 gives you lifetime access to all content, updates, and future additions. No recurring charges, no hidden fees." },
      { q: "What's the refund policy?", a: "30-day money-back guarantee. Try the full program. If you don't feel calmer, sleep better, and handle stress more effectively, email hello@willowvibes.com within 30 days for a full refund. No questions asked." },
      { q: "Can I share my account?", a: "Each purchase is for individual use. Progress, reflections, and personalization are designed for one person's journey. Consider gifting a separate account to loved ones." },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (q: string) => {
    const next = new Set(openItems);
    if (next.has(q)) next.delete(q);
    else next.add(q);
    setOpenItems(next);
  };

  const filtered = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Help Center</h1>
            <p className="text-sm font-body text-muted-foreground">Find answers to common questions.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for answers..." className="pl-12 h-12 text-base font-body rounded-xl" />
        </div>

        {/* FAQ categories */}
        {filtered.map(cat => (
          <div key={cat.title}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">{cat.title}</h2>
            <div className="space-y-2">
              {cat.items.map(item => (
                <div key={item.q} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button onClick={() => toggleItem(item.q)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors">
                    <span className="font-body text-sm font-medium text-foreground pr-4">{item.q}</span>
                    {openItems.has(item.q) ? <ChevronDown className="w-4 h-4 text-gold flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {openItems.has(item.q) && (
                    <div className="px-4 pb-4 border-t border-border">
                      <p className="text-sm font-body text-muted-foreground leading-relaxed pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Still need help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-body text-sm font-medium text-foreground">Email Support</p>
                <p className="text-xs font-body text-muted-foreground">hello@willowvibes.com</p>
                <p className="text-xs font-body text-muted-foreground">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40">
              <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-body text-sm font-medium text-foreground">Community</p>
                <p className="text-xs font-body text-muted-foreground">Connect with fellow meditators</p>
                <p className="text-xs font-body text-muted-foreground">Share experiences & tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
