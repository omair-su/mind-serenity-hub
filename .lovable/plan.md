# Replace ElevenLabs voice with Lovable AI voice

Every guided practice, narration, and coach voice reply currently goes through ElevenLabs, which keeps failing (free-tier blocks, quota errors) and silently drops users to the robotic browser voice. We move all of it to Lovable's built-in text-to-speech — no external key, no quota wall, same caching so a script is never paid for twice.

## What changes for you

- Guided practices, body scans, sleep stories, affirmations, sound baths, walking meditations and daily meditations all get the new Lovable studio voices.
- The Willow Coach speaks with the new voice too, and starts talking while the audio is still being generated (faster first sound).
- The four brand voices stay as four voices with the same names/roles (calm feminine, deep masculine, gentle feminine, soft masculine), so nothing in the UI or voice pickers has to change.
- Already-generated audio stays playable; new/changed scripts regenerate with the new voice automatically.
- The browser-voice fallback stays as a last resort but should stop triggering.

## Technical plan

1. `supabase/functions/generate-narration/index.ts`
   - Swap the ElevenLabs call for `POST https://ai.gateway.lovable.dev/v1/audio/speech` with `Authorization: Bearer ${LOVABLE_API_KEY}`, model `openai/gpt-4o-mini-tts`, `response_format: "mp3"`, no `stream_format` (buffered file for storage).
   - Map the voice palette to gateway voices, keeping the same keys: `sarah`, `george`, `matilda`, `charlie` → four distinct OpenAI voices. Keep tone via the `instructions` field (slow, warm, meditative pacing) instead of ElevenLabs `voice_settings`; `speed` ~0.9.
   - Add chunking: split long scripts at sentence boundaries into safe-size pieces, synthesize each, and concatenate the MP3 buffers in order before upload (meditation scripts routinely exceed a single request's input limit — this is the main reason long practices fail today).
   - Keep the existing cache logic, but include the voice/model in `script_hash` so switching providers invalidates stale ElevenLabs audio and regenerates on next play.
   - Store `voice_name` as the friendly name and `voice_id` as the gateway voice id.
   - Keep the `{ fallback: true }` 200 response shape for gateway 402/429/5xx so the client fallback path is untouched.

2. `supabase/functions/coach-tts/index.ts`
   - Replace the ElevenLabs stream with the gateway `/v1/audio/speech` call using `stream_format: "sse"`, `response_format: "mp3"`, voice matching `sarah`.
   - Since the client plays a blob, buffer the SSE deltas into one MP3 in the function and return `audio/mpeg` — the client hook needs no change.
   - Keep the premium check, auth check, markdown stripping and char cap as-is.

3. Client
   - No API changes needed in `src/hooks/useTextToSpeech.ts` or `src/hooks/useCoachVoice.ts`; both keep working against the same contracts.
   - Only cleanup: comment/label updates that name ElevenLabs, and copy in legal/pricing pages that mentions ElevenLabs voices gets reworded to "studio AI voices".

4. Not in scope
   - `supabase/functions/coach-stt` (speech-to-text) — say the word if you want that moved to Lovable too.
   - The `ELEVENLABS_API_KEY` secret is left in place but unused; it can be deleted after we confirm audio works.

## Verification

Deploy both functions, then play one short practice, one long guided practice (chunking path), one sleep story with the deep voice, and one coach reply; confirm real narration plays and no `fallback: true` appears in function logs.
