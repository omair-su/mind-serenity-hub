// Friends & accountability — invite a friend by email, see who has accepted,
// and view streaks of accepted friends who opted in to share.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Flame, Clock, Loader2, X, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { supabase } from "@/integrations/supabase/client";

interface FriendRow {
  id: string;
  user_id: string;
  friend_user_id: string | null;
  invited_email: string | null;
  status: "pending" | "accepted" | "declined";
  share_streak: boolean;
  /** True when current user is the inviter (outgoing); false = incoming. */
  outgoing: boolean;
}

interface FriendStats {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  streak_days: number;
  total_minutes: number;
  last_session_date: string | null;
}

export default function FriendsPage() {
  usePageSEO({
    title: "Friends & Accountability | Willow Vibes",
    description:
      "Invite a friend, see their streak, and stay accountable together.",
  });

  const [me, setMe] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [stats, setStats] = useState<Record<string, FriendStats>>({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id ?? null;
    setMe(uid);
    if (!uid) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("friendships_safe")
      .select("*")
      .or(`user_id.eq.${uid},friend_user_id.eq.${uid}`)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Couldn't load your friends.");
      setLoading(false);
      return;
    }
    const rows: FriendRow[] = (data ?? []).map((r: any) => ({
      ...r,
      outgoing: r.user_id === uid,
    }));
    setFriends(rows);

    // Pull stats for every accepted friend that has shared
    const acceptedIds = rows
      .filter((r) => r.status === "accepted")
      .map((r) => (r.outgoing ? r.friend_user_id : r.user_id))
      .filter((x): x is string => !!x);
    const nextStats: Record<string, FriendStats> = {};
    await Promise.all(
      acceptedIds.map(async (fid) => {
        const { data } = await supabase.rpc("get_friend_stats", { _friend_user_id: fid });
        if (Array.isArray(data) && data[0]) nextStats[fid] = data[0] as FriendStats;
      }),
    );
    setStats(nextStats);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const sendInvite = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!me) return;
    setInviting(true);
    // Try to match the email to an existing profile so the invite is linked
    const { data: match } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", trimmed)
      .maybeSingle();
    const { error } = await supabase.from("friendships").insert({
      user_id: me,
      friend_user_id: match?.user_id ?? null,
      invited_email: trimmed,
    });
    if (error) {
      console.error(error);
      toast.error("Couldn't send invite. Try again?");
    } else {
      toast.success(match ? "Invite sent — they'll see it when they sign in." : "Invite saved. They'll be linked when they join.");
      setEmail("");
      loadAll();
    }
    setInviting(false);
  };

  const respond = async (row: FriendRow, status: "accepted" | "declined") => {
    const { error } = await supabase
      .from("friendships")
      .update({ status })
      .eq("id", row.id);
    if (error) {
      toast.error("Couldn't update. Try again?");
    } else {
      toast.success(status === "accepted" ? "Friend added!" : "Invite declined.");
      loadAll();
    }
  };

  const remove = async (row: FriendRow) => {
    if (!window.confirm("Remove this friend?")) return;
    const { error } = await supabase.from("friendships").delete().eq("id", row.id);
    if (error) toast.error("Couldn't remove.");
    else {
      toast.success("Removed.");
      loadAll();
    }
  };

  const toggleShare = async (row: FriendRow) => {
    const { error } = await supabase
      .from("friendships")
      .update({ share_streak: !row.share_streak })
      .eq("id", row.id);
    if (error) toast.error("Couldn't update.");
    else loadAll();
  };

  const pending = friends.filter((f) => f.status === "pending");
  const incoming = pending.filter((f) => !f.outgoing);
  const outgoing = pending.filter((f) => f.outgoing);
  const accepted = friends.filter((f) => f.status === "accepted");

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-3xl mx-auto"
      >
        <header>
          <p className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))]">
            Friends · Accountability
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Practice together
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg">
            Invite a friend by email. When they accept, you'll see each other's
            streak — opt-in, private, never public.
          </p>
        </header>

        {/* Invite */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <label className="text-xs font-body font-semibold text-foreground">
            Invite a friend
          </label>
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="flex-1 px-4 py-2.5 rounded-full border border-border bg-background text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
            />
            <button
              onClick={sendInvite}
              disabled={inviting}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[hsl(var(--sage-dark))] to-[hsl(var(--primary))] text-cream font-body font-semibold text-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
            >
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Send invite
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10 text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          </div>
        )}

        {/* Incoming invites */}
        {incoming.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Incoming invites
            </h2>
            <div className="space-y-2">
              {incoming.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-body text-foreground">
                    Someone invited you to be accountability friends.
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => respond(r, "accepted")} aria-label="Accept" className="p-2 rounded-full bg-[hsl(var(--primary))] text-cream">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => respond(r, "declined")} aria-label="Decline" className="p-2 rounded-full border border-border text-muted-foreground">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Accepted friends */}
        <section>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">
            Your circle ({accepted.length})
          </h2>
          {accepted.length === 0 && !loading ? (
            <p className="font-body text-sm text-muted-foreground">
              No friends yet. Send an invite above to get started.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {accepted.map((r) => {
                const fid = (r.outgoing ? r.friend_user_id : r.user_id) ?? "";
                const s = stats[fid];
                return (
                  <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--sage))] to-[hsl(var(--primary))] text-cream flex items-center justify-center font-display font-bold flex-shrink-0">
                          {(s?.display_name?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body font-semibold text-sm text-foreground truncate">
                            {s?.display_name ?? "Friend"}
                          </p>
                          <p className="font-body text-[11px] text-muted-foreground">
                            {s?.last_session_date ? `Last session ${s.last_session_date}` : "Hasn't shared stats"}
                          </p>
                        </div>
                      </div>
                      <button onClick={() => remove(r)} aria-label="Remove friend" className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {s ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-secondary/40 p-2.5">
                          <p className="text-[9px] font-body uppercase tracking-wider text-muted-foreground">Streak</p>
                          <p className="font-display font-bold text-lg text-foreground tabular-nums flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-[hsl(var(--gold-dark))]" /> {s.streak_days}
                          </p>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-2.5">
                          <p className="text-[9px] font-body uppercase tracking-wider text-muted-foreground">Minutes</p>
                          <p className="font-display font-bold text-lg text-foreground tabular-nums flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[hsl(var(--primary))]" /> {s.total_minutes}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="font-body text-xs text-muted-foreground italic">
                        Stats hidden — your friend hasn't opted in to share.
                      </p>
                    )}
                    {r.outgoing && (
                      <button
                        onClick={() => toggleShare(r)}
                        className="mt-3 text-[11px] font-body text-muted-foreground hover:text-foreground"
                      >
                        {r.share_streak ? "✓ Sharing my streak" : "✗ Not sharing my streak"} · toggle
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Outgoing pending */}
        {outgoing.length > 0 && (
          <section>
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Pending invites
            </h2>
            <div className="space-y-2">
              {outgoing.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                  <div className="text-sm font-body text-foreground truncate">
                    {r.invited_email ?? "Invite sent"}
                  </div>
                  <button onClick={() => remove(r)} aria-label="Cancel invite" className="p-2 rounded-full border border-border text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </AppLayout>
  );
}
