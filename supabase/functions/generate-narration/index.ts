// Generates studio-quality meditation narration via ElevenLabs.
// Caches results so the same script is never billed twice.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Curated voice palette — each matches a category for brand consistency.
const VOICE_LIBRARY = {
  // Calming, warm — perfect for body scans and daily meditation
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', tone: 'calm-feminine' },
  // Deep, grounding — perfect for sleep stories
  george: { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', tone: 'deep-masculine' },
  // Gentle, ethereal — perfect for affirmations
  matilda: { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', tone: 'gentle-feminine' },
  // Soft-spoken — perfect for sound bath intros
  charlie: { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', tone: 'soft-masculine' },
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) throw new Error('ELEVENLABS_API_KEY missing');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body: GenerateRequest = await req.json();
    const {
      trackKey, category, title, description,
      script, voice, ambientBed = null, isPremium = false,
    } = body;

    if (!trackKey || !script || !category || !title) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const voiceKey: VoiceKey = voice ?? defaultVoiceFor(category);
    const voiceMeta = VOICE_LIBRARY[voiceKey];
    const scriptHash = await sha256(script + voiceKey);

    // 1. Check cache
    const { data: existing } = await admin
      .from('audio_tracks')
      .select('*')
      .eq('track_key', trackKey)
      .maybeSingle();

    if (existing && existing.script_hash === scriptHash) {
      return new Response(JSON.stringify({ cached: true, track: existing }), {
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
            stability: 0.65,        // smooth, consistent meditation tone
            similarity_boost: 0.8,
            style: 0.3,             // subtle expression
            use_speaker_boost: true,
            speed: 0.92,            // slightly slower for meditation pacing
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      console.error('[narration] ElevenLabs error:', err);
      return new Response(JSON.stringify({ error: `TTS failed: ${err}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const storagePath = `${category}/${trackKey}.mp3`;

    // 3. Upload to storage (overwrite if existed)
    const { error: uploadError } = await admin.storage
      .from('meditation-audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
        cacheControl: '31536000', // 1 year — content is immutable per script_hash
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = admin.storage
      .from('meditation-audio')
      .getPublicUrl(storagePath);

    // Estimate duration: ~150 words/min at speed 0.92 → ~138 wpm effective
    const wordCount = script.split(/\s+/).length;
    const durationSeconds = Math.round((wordCount / 138) * 60);

    // 4. Upsert catalog row
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
        public_url: publicUrl,
        ambient_bed: ambientBed,
        is_premium: isPremium,
        script_hash: scriptHash,
      }, { onConflict: 'track_key' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ cached: false, track }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[narration] fatal:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
