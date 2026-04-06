import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Moon, Clock, Play, Pause, Loader2, Square } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const sleepGradients = [
  "from-indigo-100/70 via-blue-50/50 to-violet-50/40",
  "from-amber-100/60 via-yellow-50/40 to-orange-50/30",
  "from-rose-100/60 via-pink-50/40 to-fuchsia-50/30",
  "from-violet-100/60 via-purple-50/40 to-indigo-50/30",
  "from-cyan-100/60 via-sky-50/40 to-blue-50/30",
  "from-emerald-100/60 via-teal-50/40 to-green-50/30",
  "from-pink-100/60 via-rose-50/40 to-red-50/30",
  "from-teal-100/60 via-cyan-50/40 to-sky-50/30",
];

const sleepMeditations = [
  { id: "body-scan", title: "Body Scan for Sleep", duration: 20, icon: "🧘", desc: "Progressive relaxation from head to toe",
    script: ["Lie on your back. Arms at your sides. Close your eyes.", "Starting at the crown of your head, bring gentle awareness to each body part.", "Feel your forehead soften. Your eyes grow heavy. Jaw releases.", "Your neck relaxes into the pillow. Shoulders drop away from your ears.", "Each breath takes you deeper. Chest softens. Belly rises and falls naturally.", "Your legs grow heavy. Feet warm and tingling.", "You are safe. You are held. Let sleep come naturally."] },
  { id: "478-sleep", title: "4-7-8 Sleep Breath", duration: 10, icon: "🌙", desc: "Dr. Weil's technique for sleep onset",
    script: ["Get comfortable in bed. This practice is designed to make you sleep.", "Inhale quietly through your nose for 4 counts.", "Hold your breath for 7 counts.", "Exhale completely through your mouth for 8 counts.", "Repeat. With each cycle, you sink deeper into your bed.", "Your thoughts slow. Your body melts. Sleep approaches."] },
  { id: "pmr-sleep", title: "Progressive Muscle Relaxation", duration: 25, icon: "💆", desc: "Tense and release every muscle group",
    script: ["Starting with your feet — curl your toes tightly. Hold for 5 seconds.", "Release. Feel the difference between tension and relaxation.", "Move to your calves. Tense. Hold. Release.", "Continue through each body part. Thighs. Belly. Chest. Hands. Arms. Shoulders. Face.", "By the time you reach your face, your body is completely relaxed.", "Sleep will find you. Don't chase it. Let it come."] },
  { id: "yoga-nidra", title: "Yoga Nidra for Sleep", duration: 30, icon: "🕉️", desc: "The ancient practice of yogic sleep",
    script: ["Welcome to Yoga Nidra — the sleep of the yogis.", "Set your intention: 'I will relax completely and sleep deeply.'", "Become aware of your whole body lying here. Feel its weight.", "Rotate your awareness: right thumb... index finger... middle finger... ring finger... little finger...", "Right palm... wrist... forearm... upper arm... shoulder... right side of chest...", "Continue through every body part. This systematic rotation quiets the mind completely.", "You are between waking and sleeping. This is the healing space. Rest here."] },
  { id: "beach-imagery", title: "Beach Visualization", duration: 20, icon: "🏖️", desc: "Guided imagery of a peaceful shore",
    script: ["Imagine yourself on a quiet beach at sunset.", "The sand is warm beneath you. A gentle breeze touches your skin.", "Hear the waves... rhythmic... steady... like breathing.", "Watch the sky turn golden, then pink, then purple.", "Each wave that rolls in brings peace. Each wave that pulls out takes tension with it.", "You are completely safe here. This beach exists inside you. Always available.", "Let the sound of waves carry you to sleep."] },
  { id: "forest-walk", title: "Forest Walk", duration: 20, icon: "🌲", desc: "Guided imagery through an ancient forest",
    script: ["You're walking on a soft path through an ancient forest.", "Tall trees tower above, their leaves filtering golden sunlight.", "The air smells of pine and earth. Cool and fresh.", "A gentle stream runs alongside the path. Its sound is calming.", "You find a perfect clearing with soft moss. You lie down.", "The forest holds you. Birds sing softly. Leaves rustle.", "Close your eyes here in the forest. Sleep among the trees."] },
  { id: "sleep-affirmations", title: "Sleep Affirmations", duration: 15, icon: "💭", desc: "Positive statements for restful sleep",
    script: ["As you settle into bed, repeat these words silently.", "I release this day. Whatever happened is done.", "My body knows how to heal while I sleep.", "I deserve this rest. I have done enough today.", "My mind is slowing down. My thoughts are clouds passing.", "Sleep is safe. Sleep is natural. Sleep is coming.", "I am at peace. I am at rest. I am letting go."] },
  { id: "gratitude-sleep", title: "Gratitude for Sleep", duration: 12, icon: "🙏", desc: "End the day with appreciation",
    script: ["Before sleep, let's count our blessings.", "Think of 3 things from today that went well. Big or small.", "Think of someone who showed you kindness. Send them silent thanks.", "Think of something your body did for you today — breathing, walking, feeling.", "Think of one thing you're looking forward to tomorrow.", "Fill your heart with gratitude. Let it warm you like a blanket.", "Sleep now, grateful and at peace."] },
];

export default function SleepPage() {
  const [active, setActive] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const tts = useTextToSpeech();

  const activeSession = sleepMeditations.find(s => s.id === active);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/15 flex items-center justify-center">
            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Sleep Meditations</h1>
            <p className="text-sm font-body text-muted-foreground">Wind down and prepare for deep, restorative sleep.</p>
          </div>
        </div>

        {/* Active session */}
        {activeSession && (
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/60 via-violet-50/40 to-purple-50/30 dark:from-indigo-900/30 dark:via-violet-900/20 dark:to-purple-900/10 rounded-2xl border border-indigo-500/15 p-8 shadow-elevated">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-bl from-indigo-200/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-40 h-20 bg-gradient-to-tr from-violet-200/20 to-transparent rounded-tr-full" />
            <div className="relative z-10">
              <div className="text-center mb-6">
                <span className="text-4xl">{activeSession.icon}</span>
                <h2 className="font-display text-2xl font-bold text-foreground mt-2">{activeSession.title}</h2>
              </div>

              <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-lg mx-auto border border-border/50 shadow-soft">
                <p className="font-body text-lg text-foreground leading-[2] text-center">
                  {activeSession.script[stepIndex]}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => tts.hasAudio ? tts.togglePlayPause() : tts.generateAndPlay(activeSession.script[stepIndex])}
                    disabled={tts.isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-body hover:from-indigo-500/25 hover:to-violet-500/20 transition-all disabled:opacity-50"
                  >
                    {tts.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tts.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {tts.isLoading ? "Generating..." : tts.isPlaying ? "Pause" : "Listen"}
                  </button>
                  {tts.isPlaying && (
                    <button onClick={tts.stop} className="ml-2 p-2 rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80">
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 mb-4">
                {activeSession.script.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i <= stepIndex ? "bg-indigo-500 shadow-sm" : "bg-secondary"}`} />
                ))}
              </div>

              <div className="flex justify-center gap-3">
                {stepIndex > 0 && (
                  <button onClick={() => { tts.stop(); setStepIndex(s => s - 1); }} className="px-4 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl text-sm font-body border border-border/50 shadow-soft">← Back</button>
                )}
                {stepIndex < activeSession.script.length - 1 ? (
                  <button onClick={() => { tts.stop(); setStepIndex(s => s + 1); }} className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all">Next →</button>
                ) : (
                  <button onClick={() => { tts.stop(); setActive(null); setStepIndex(0); }} className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all">
                    Sweet Dreams ✓
                  </button>
                )}
                <button
                  onClick={() => { const fullScript = activeSession.script.join("\n\n"); tts.generateAndPlay(fullScript); }}
                  disabled={tts.isLoading}
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl text-sm font-body text-indigo-600 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-violet-500/20 disabled:opacity-50 transition-all"
                >
                  {tts.isLoading ? "..." : "▶ Play All"}
                </button>
                <button onClick={() => { tts.stop(); setActive(null); setStepIndex(0); }} className="px-4 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl text-sm font-body text-muted-foreground border border-border/50">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {!active && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sleepMeditations.map((s, i) => (
              <button key={s.id} onClick={() => { setActive(s.id); setStepIndex(0); }}
                className={`group text-left relative overflow-hidden bg-gradient-to-br ${sleepGradients[i % sleepGradients.length]} dark:from-indigo-900/20 dark:via-violet-900/10 dark:to-purple-900/5 rounded-2xl border border-border/50 p-5 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300`}>
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-bl from-card/30 to-transparent" />
                <div className="relative z-10 flex items-start gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-body text-muted-foreground mt-2 px-2 py-0.5 rounded-md bg-card/60">
                      <Clock className="w-3 h-3" /> {s.duration} minutes
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bedtime routine */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-purple-50/20 dark:from-indigo-900/20 dark:via-violet-900/10 dark:to-purple-900/5 rounded-2xl p-6 border border-indigo-500/15 shadow-soft">
          <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tl from-violet-200/20 to-transparent" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Suggested Bedtime Routine</h3>
          <div className="space-y-2">
            {[
              { time: "8:00 PM", action: "Dim lights, reduce stimulation" },
              { time: "8:30 PM", action: "No screens — read or journal" },
              { time: "9:00 PM", action: "5-minute breathing exercise" },
              { time: "9:15 PM", action: "Sleep meditation (15-20 min)" },
              { time: "9:35 PM", action: "Lights out — let sleep come" },
            ].map(step => (
              <div key={step.time} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/40 transition-colors">
                <span className="text-xs font-body font-bold text-indigo-600 dark:text-indigo-400 w-16">{step.time}</span>
                <span className="text-sm font-body text-foreground">{step.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
