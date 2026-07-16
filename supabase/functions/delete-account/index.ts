// Deletes the calling user's auth row and cascades cloud data.
// Requires a valid Supabase JWT in the Authorization header.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: claimsErr } = await userClient.auth.getUser(token);
    if (claimsErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = userData.user.id;

    const admin = createClient(supabaseUrl, serviceKey);

    // Best-effort cleanup of user-owned rows (FKs may already cascade)
    const tables = [
      "audio_history",
      "gratitude_entries",
      "mood_entries",
      "ritual_completions",
      "user_progress",
      "subscriptions",
      "lifetime_purchases",
      "sos_contacts",
      "push_subscriptions",
      "coach_usage",
      "user_streaks",
      "profiles",
    ];
    for (const t of tables) {
      await admin.from(t).delete().eq("user_id", userId);
    }

    // Friendships reference the user on either side
    await admin
      .from("friendships")
      .delete()
      .or(`user_id.eq.${userId},friend_user_id.eq.${userId}`);

    // Best-effort: remove avatar files
    try {
      const { data: list } = await admin.storage.from("avatars").list(userId);
      if (list?.length) {
        await admin.storage.from("avatars").remove(list.map((o) => `${userId}/${o.name}`));
      }
    } catch {
      /* ignore */
    }

    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  } catch (err) {
    console.error("[delete-account] error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
