// Cycle Sync — meditations tuned to the menstrual phase.
import type { MiniProgram } from "./types";

const HERO_FALLBACK = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const POSTER_FALLBACK = "/src/assets/video-library-hero-poster.jpg";

export const CYCLE_SYNC: MiniProgram = {
  id: "cycle-sync",
  title: "Cycle Sync",
  tagline: "Meditations tuned to your phase",
  description:
    "Your nervous system runs on a monthly rhythm, not a daily one. Seven days of meditations that match the four phases of the menstrual cycle, so your practice works with your body, not against it.",
  category: "Women's Wellness · Cyclical",
  heroVideoSlot: "cycle-sync-hero",
  videoBackdrop: HERO_FALLBACK,
  posterUrl: POSTER_FALLBACK,
  freeDays: 1,
  voice: "sarah",
  days: [
    {
      day: 1,
      title: "Menstrual Phase — Inner Winter",
      duration: "10 min",
      technique: "Deep rest + warm-belly meditation",
      whyItWorks:
        "Estrogen and progesterone are at their lowest in the menstrual phase, signaling a true biological need for rest. Honoring it accelerates restoration for the rest of the cycle.",
      practice: `Welcome. This is your inner winter. The bleed. The first day of your cycle.

Lie down if you can. Place a hand on the belly, low, just above the pubic bone. The other hand on the heart.

Three slow breaths into the lower hand. Feel warmth gather there.

Today is not for output. Today is for the underworld of rest.

Imagine the warmth of the hand spreading into the womb space. Like a fire in the hearth on a snowy night. Slow. Steady. Kind.

If there is pain, breathe into it without trying to fix it. Soften around it. Say to the body: I am not at war with you. I am here.

If there is heaviness or sadness, let it be welcome. The bleed often brings emotional clearing. This is healthy. This is wise.

Stay here for as long as you need. There is nothing to achieve today. Resting is the practice.

Honor the winter. Spring is coming.`,
    },
    {
      day: 2,
      title: "Menstrual Phase — Releasing What Is Done",
      duration: "8 min",
      technique: "Letting go ritual",
      whyItWorks:
        "The menstrual phase is the brain's natural review window — neural connections prune and consolidate, making it the ideal moment for intentional release.",
      practice: `Day two. Still in the inner winter. Today we release what is done.

Sit or lie down. Hand on the belly. Three slow breaths.

Bring to mind one thing from the past cycle that is complete. A project. A worry. A grudge. A version of yourself.

Picture it as a small object in your hands. Look at it without judgment. Thank it for what it taught you.

Now imagine setting it down. On the ground. In a river. On a fire. Wherever feels right.

Breathe out long and slow. Three times. Letting it go.

The womb is shedding what is no longer needed. The mind can do the same.

End with a hand on the heart. Whisper: I release what is done. I make space for what is becoming.`,
    },
    {
      day: 3,
      title: "Follicular Phase — Inner Spring",
      duration: "8 min",
      technique: "Energy-building visualization",
      whyItWorks:
        "Rising estrogen in the follicular phase lifts mood, creativity, and learning capacity. Channeling it with intention compounds the natural energy.",
      practice: `Day three. Inner spring. The follicular phase. Estrogen is rising. The body is greening up.

Sit upright. Open the chest. Three slow breaths.

Feel the energy returning. Notice it. Curiosity. Lightness. The urge to begin.

Picture yourself as a seedling pushing up through soft earth. The light above is warm. The roots below are strong.

Bring to mind one new thing you want to begin this cycle. A project. A practice. A conversation. A relationship.

See it as a small green shoot inside you. Breathe energy into it for the next minute. Slow inhales. Slow exhales. Watch it grow.

Open your eyes. Write down what you saw in one sentence. The follicular phase is the planting season. What you tend now will bloom in the weeks ahead.`,
    },
    {
      day: 4,
      title: "Follicular Phase — Curiosity Walk",
      duration: "6 min",
      technique: "Open-awareness practice",
      whyItWorks:
        "The high-estrogen brain is wired for exploration and new connections. Open awareness practices match and amplify this state.",
      practice: `Day four. Still in spring. Today we practice curiosity.

Stand up. Walk slowly, indoors or outdoors. If you cannot walk, sit and look around the room.

For the next five minutes, the only practice is noticing one new thing every few seconds.

A color. A sound. A texture. A smell.

Say silently: oh, look at that. And then: oh, look at that. And then: oh, look at that.

There is no goal. There is no judgment. There is only the play of fresh attention.

When the mind wanders into to-do lists, smile, and return to: oh, look at that.

This is how the spring brain wants to be used. Light. Curious. Open. Bring it to a meeting later. Bring it to a difficult conversation. Curiosity is your superpower this week.`,
    },
    {
      day: 5,
      title: "Ovulation — Inner Summer",
      duration: "7 min",
      technique: "Heart-opening + voice",
      whyItWorks:
        "At ovulation, peak estrogen and testosterone heighten verbal fluency, magnetism, and confidence. Embodied practices anchor these gifts so they can be used at will.",
      practice: `Day five. Inner summer. Ovulation. The peak of your cycle.

Stand or sit tall. Arms relaxed. Three full breaths.

This is your most magnetic week. The week the body is most ready to connect. The week the voice is most clear.

Place a hand on the heart. Inhale, expanding the chest. Exhale, soften.

Five rounds of long inhales into the heart space.

Now, the voice. Out loud, say: I am here. I have something to say. I will say it.

Say it again, a little louder. I am here. I have something to say. I will say it.

One more time, with full breath. I am here. I have something to say. I will say it.

Bring to mind one conversation, ask, or boldness that is waiting. This is the week to do it. The body will support you.`,
    },
    {
      day: 6,
      title: "Early Luteal — Inner Late Summer",
      duration: "8 min",
      technique: "Grounding + completion",
      whyItWorks:
        "Progesterone rises in the luteal phase, encouraging steadiness, focus, and the completion of unfinished work.",
      practice: `Day six. Early luteal. The energy is beginning to settle. The body wants steadiness now.

Sit on the floor or in a chair. Feet flat. Three deep breaths.

Feel the ground beneath you. Imagine roots growing from the base of your spine, down into rich earth. Slow. Strong. Unshakeable.

This is the season of completion. The body is preparing to tidy and tend.

Bring to mind one thing you started in your spring or summer that needs finishing this week. One thing.

Picture yourself completing it, calmly, without rushing. See the satisfied breath at the end.

Three more deep breaths into the roots.

This week, decline the new. Honor the in-progress. Your nervous system will thank you.`,
    },
    {
      day: 7,
      title: "Late Luteal — Inner Autumn",
      duration: "10 min",
      technique: "Compassion + sensitivity care",
      whyItWorks:
        "Falling estrogen and progesterone in the late luteal phase increase emotional sensitivity. Compassionate self-talk and reduced stimulation protect mental health.",
      practice: `Day seven. Inner autumn. The late luteal phase. The week before the bleed.

This is the most tender week. The most truthful week. The week the body lets you know what is no longer working.

Sit or lie down. Hand on the heart. Three slow breaths.

Whatever feelings have been rising — irritation, sadness, restlessness, weariness — they are not flaws. They are messengers. The autumn self is your most honest self.

Say silently, to yourself: I am allowed to be tender. I am allowed to say no. I am allowed to slow down.

Say it again. I am allowed to be tender. I am allowed to say no. I am allowed to slow down.

This week, protect your time. Dim the lights earlier. Say no to one optional thing. Eat warm food. Sleep more.

Then the bleed will come, and we begin again. Welcome to a life in rhythm with yourself.`,
    },
  ],
};
