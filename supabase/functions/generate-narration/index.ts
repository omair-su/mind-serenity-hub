// Generates studio-quality meditation narration via Lovable AI text-to-speech.
// Caches results so the same script is never billed twice.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TTS_MODEL = 'openai/gpt-4o-mini-tts';
const TTS_ENDPOINT = 'https://ai.gateway.lovable.dev/v1/audio/speech';

// Curated voice palette — each matches a category for brand consistency.
const VOICE_LIBRARY = {
  // Calming, warm — perfect for body scans and daily meditation
  sarah: { id: 'sage', name: 'Sarah', tone: 'calm-feminine' },
  // Deep, grounding — perfect for sleep stories
  george: { id: 'onyx', name: 'George', tone: 'deep-masculine' },
  // Gentle, ethereal — perfect for affirmations
  matilda: { id: 'shimmer', name: 'Matilda', tone: 'gentle-feminine' },
  // Soft-spoken — perfect for sound bath intros
  charlie: { id: 'ash', name: 'Charlie', tone: 'soft-masculine' },
} as const;


type VoiceKey = keyof typeof VOICE_LIBRARY;

interface GenerateRequest {
  trackKey: string;          // unique identifier — used for caching
  category: string;
  title: string;
  description?: string;
  script: string;            // the meditation text
  voice?: VoiceKey;          // defaults based on category
  ambientBed?: string | null;
  isPremium?: boolean;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function defaultVoiceFor(category: string): VoiceKey {
  switch (category) {
    case 'sleep_story': return 'george';
    case 'affirmation': return 'matilda';
    case 'sound_bath': return 'charlie';
    default: return 'sarah';
  }
}

// Meditation scripts routinely exceed the model's single-request input limit.
// Split at sentence boundaries into conservative chunks so nothing is truncated.
function chunkForTTS(text: string, maxWords = 350): string[] {
  const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };
  for (const sentence of sentences) {
    if (wordCount(sentence) > maxWords) {
      flush();
      const words = sentence.match(/\S+/g) ?? [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
      }
      continue;
    }
    if (current && wordCount(current) + wordCount(sentence) > maxWords) flush();
    current += sentence;
  }
  flush();
  return chunks.length ? chunks : [text];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');


    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Require authenticated caller for ALL narrations — prevents ElevenLabs credit drain.
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const authClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: userData, error: userErr } = await authClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body: GenerateRequest = await req.json();
    const {
      trackKey: rawTrackKey, category, title, description,
      script, voice, ambientBed = null,
    } = body;

    if (!rawTrackKey || !script || !category || !title) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Hard cap script length to bound ElevenLabs cost per call.
    const MAX_SCRIPT_CHARS = 8000;
    if (typeof script !== 'string' || script.length > MAX_SCRIPT_CHARS) {
      return new Response(JSON.stringify({
        error: `Script too long (max ${MAX_SCRIPT_CHARS} characters)`,
      }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Restrict category to known values to reduce attack surface.
    const ALLOWED_CATEGORIES = new Set([
      'meditation', 'daily_meditation', 'sleep_story', 'affirmation', 'sound_bath', 'body_scan', 'breathing', 'walking',
    ]);
    if (!ALLOWED_CATEGORIES.has(category)) {
      return new Response(JSON.stringify({ error: 'Invalid category' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SECURITY: Namespace every catalog write per-user. This prevents authenticated
    // users from overwriting shared catalog rows or injecting arbitrary entries
    // that other users would consume. Each user effectively maintains their own
    // private cache of generated narrations.
    const safeRawKey = String(rawTrackKey).replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 120);
    const trackKey = `u_${userId}__${safeRawKey}`;

    // Determine premium status SERVER-SIDE (never trust the request body).
    // First, look up whether the requested track is premium based on existing catalog row,
    // and resolve the user's premium status from the profiles table.
    const { data: existingTrackMeta } = await admin
      .from('audio_tracks')
      .select('is_premium')
      .eq('track_key', rawTrackKey)
      .maybeSingle();

    const { data: profile } = await admin
      .from('profiles')
      .select('is_premium')
      .eq('user_id', userId)
      .maybeSingle();

    // If the track is registered as premium in the catalog, require an active subscription.
    // For brand-new tracks (not yet in catalog), default to non-premium so the request body
    // cannot escalate to free generation of premium-only content.
    const isPremium = !!existingTrackMeta?.is_premium;
    if (isPremium && !profile?.is_premium) {
      return new Response(JSON.stringify({ error: 'Premium subscription required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const voiceKey: VoiceKey = voice ?? defaultVoiceFor(category);
    const voiceMeta = VOICE_LIBRARY[voiceKey];
    const scriptHash = await sha256(script + voiceKey);

    // Helper: build a fresh signed URL (1 hour) for a given storage path
    const signUrl = async (storagePath: string): Promise<string> => {
      const { data, error } = await admin.storage
        .from('meditation-audio')
        .createSignedUrl(storagePath, 60 * 60);
      if (error || !data?.signedUrl) throw new Error('Failed to sign URL');
      return data.signedUrl;
    };

    // 1. Check cache
    const { data: existing } = await admin
      .from('audio_tracks')
      .select('*')
      .eq('track_key', trackKey)
      .maybeSingle();

    if (existing && existing.script_hash === scriptHash) {
      const signed = await signUrl(existing.storage_path);
      return new Response(JSON.stringify({
        cached: true,
        track: { ...existing, public_url: signed },
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Generate via ElevenLabs
    console.log(`[narration] generating ${trackKey} with voice ${voiceMeta.name}`);
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceMeta.id}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.8,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.92,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      console.error('[narration] ElevenLabs error:', err);
      // Detect free-tier abuse block / quota — signal client to use browser TTS fallback (return 200 so UI doesn't crash)
      const isAbuseBlock = err.includes('detected_unusual_activity') || err.includes('Free Tier usage disabled');
      const isQuota = ttsResponse.status === 401 || ttsResponse.status === 429 || err.includes('quota');
      return new Response(JSON.stringify({
        fallback: true,
        reason: isAbuseBlock ? 'TTS_UNUSABLE' : isQuota ? 'TTS_QUOTA' : 'TTS_ERROR',
        message: 'Premium narration temporarily unavailable. Using browser voice instead.',
      }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const storagePath = `${category}/${trackKey}.mp3`;

    // 3. Upload to private storage (overwrite if existed)
    const { error: uploadError } = await admin.storage
      .from('meditation-audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
        cacheControl: '31536000',
      });

    if (uploadError) throw uploadError;

    // Estimate duration
    const wordCount = script.split(/\s+/).length;
    const durationSeconds = Math.round((wordCount / 138) * 60);

    // 4. Upsert catalog row — store empty public_url (legacy column kept for compatibility)
    const { data: track, error: upsertError } = await admin
      .from('audio_tracks')
      .upsert({
        track_key: trackKey,
        category,
        title,
        description: description ?? null,
        duration_seconds: durationSeconds,
        voice_id: voiceMeta.id,
        voice_name: voiceMeta.name,
        storage_path: storagePath,
        public_url: '', // no longer used — signed URLs returned per-request
        ambient_bed: ambientBed,
        is_premium: isPremium,
        script_hash: scriptHash,
      }, { onConflict: 'track_key' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    const signed = await signUrl(storagePath);

    return new Response(JSON.stringify({
      cached: false,
      track: { ...track, public_url: signed },
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[narration] fatal:', msg);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
