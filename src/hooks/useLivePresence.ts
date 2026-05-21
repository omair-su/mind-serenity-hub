// Live presence — joins a Supabase Realtime presence channel so every visitor
// counts toward the global "people meditating right now" pulse on the dashboard.
// Lightweight: no DB writes, just ephemeral channel state.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CHANNEL_NAME = "willow:live-now";

/**
 * Returns the current number of online users on the global "live now" channel,
 * plus a stable baseline so the count never looks empty during the first paint.
 */
export function useLivePresence(baseline = 0) {
  const [count, setCount] = useState<number>(baseline);

  useEffect(() => {
    const channel = supabase.channel(CHANNEL_NAME, {
      config: { presence: { key: crypto.randomUUID() } },
    });

    const updateCount = () => {
      try {
        const state = channel.presenceState();
        const total = Object.keys(state).length;
        setCount(Math.max(baseline, total));
      } catch {
        // ignore — presenceState may throw if channel isn't ready
      }
    };

    channel
      .on("presence", { event: "sync" }, updateCount)
      .on("presence", { event: "join" }, updateCount)
      .on("presence", { event: "leave" }, updateCount)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: new Date().toISOString() });
          updateCount();
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [baseline]);

  return count;
}
