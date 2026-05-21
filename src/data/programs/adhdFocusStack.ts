// ADHD Focus Stack — Pomodoro + binaural + body scan combo.
import type { MiniProgram } from "./types";

const HERO_FALLBACK = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const POSTER_FALLBACK = "/src/assets/video-library-hero-poster.jpg";

export const ADHD_FOCUS_STACK: MiniProgram = {
  id: "adhd-focus-stack",
  title: "ADHD Focus Stack",
  tagline: "Seven days of stacked focus protocols",
  description:
    "Built for ADHD brains. Each day stacks three proven tools — Pomodoro structure, binaural beats, and a brief body scan — into a single focus protocol you can run before any deep-work block.",
  category: "Focus · Neurodivergent",
  heroVideoSlot: "adhd-focus-hero",
  videoBackdrop: HERO_FALLBACK,
  posterUrl: POSTER_FALLBACK,
  freeDays: 1,
  voice: "charlie",
  days: [
    {
      day: 1,
      title: "The Stack, Explained",
      duration: "6 min",
      technique: "Pomodoro + 14 Hz beta + body scan",
      whyItWorks:
        "ADHD brains often need a multi-sensory ignition: a clear time container (Pomodoro), a brain-state nudge (beta-frequency audio), and a body anchor (scan).",
      practice: `Welcome. This is the stack. Three layers that work better together than alone.

Layer one: the timer. Twenty-five minutes of work, five minutes of rest. The clock is the boss, not the task. The clock is also the safety net.

Layer two: sound. During the work block, you will play a low binaural or focus track at fourteen Hertz beta. We will queue it from the Focus Mode page when this practice ends.

Layer three: the body. Before you start, you scan the body for ninety seconds. This drops you out of the racing thoughts and into the chair.

Right now, try the body part. Sit. Eyes soft.

Notice the feet on the floor. The legs on the chair. The back against the support. The hands. The jaw. The eyes.

Take three slow breaths. Say silently: I am here. The task is here. We begin together.

That is the stack. After this audio, set a twenty-five-minute timer. Play a focus track. Begin one task. We will refine the stack each day this week.`,
    },
    {
      day: 2,
      title: "The Pre-Game Routine",
      duration: "5 min",
      technique: "Five-step ignition",
      whyItWorks:
        "A repeatable pre-game routine bypasses the executive-function bottleneck by automating the entry into focus.",
      practice: `Day two. Today we build a pre-game routine. Five steps, always in this order, before any focus block.

Step one. Hydrate. One full glass of water, right now.

Step two. Move. Thirty seconds. Jumping jacks, push-ups, dance. Anything that raises the heart rate. Pause this audio if you want to do it now.

Step three. Body scan. Sixty seconds. Feet to head. We just did this yesterday.

Step four. Single task. Write down, in one sentence, the one task you will do in the next twenty-five minutes. Not two tasks. One.

Step five. Start the timer. Start the focus sound. Begin.

Repeat after me: Hydrate. Move. Scan. Name. Start.

Hydrate. Move. Scan. Name. Start.

This is your pre-game. Use it every time. The routine itself is the focus aid.`,
    },
    {
      day: 3,
      title: "The Restart Protocol",
      duration: "4 min",
      technique: "Three breaths + new Pomodoro",
      whyItWorks:
        "ADHD focus drifts in waves. A pre-rehearsed restart protocol prevents drift from spiraling into shame and total task abandonment.",
      practice: `Day three. Today, the restart protocol. Because drift will happen. And drift is not failure. Drift is information.

When you notice you have drifted off task, do these three things in order.

One. Do not judge. Say silently: oh, I drifted. That is what brains do.

Two. Take three slow breaths. Inhale long. Exhale longer. Inhale. Exhale. Inhale. Exhale.

Three. Cancel the current Pomodoro. Start a fresh one. Take the five-minute break first if it has been more than ten minutes since the last one.

That is the protocol. Notice. Breathe. Restart. No story, no shame, no analysis.

Practice it now. Pretend you just drifted. Notice. Breathe three times with me. Inhale. Exhale. Inhale. Exhale. Inhale. Exhale.

Restart. You are back.

The brain that restarts the fastest wins. Today, you train the restart muscle.`,
    },
    {
      day: 4,
      title: "Body-Scan Reboot",
      duration: "7 min",
      technique: "Longer scan + grounding",
      whyItWorks:
        "When dopamine is depleted, a longer somatic reboot restores prefrontal access more reliably than another coffee or another tab.",
      practice: `Day four. Today, a longer body scan, for the moment when nothing is working.

Sit or lie down. Close your eyes. Three slow breaths.

Start at the soles of the feet. Wiggle the toes. Feel the surface beneath them.

Move up the legs. Feel the weight of them. The temperature.

Move into the belly. Place a hand there. Feel the rise and fall.

The chest. The heart. The shoulders, dropping.

The arms. The hands. Open and close them slowly, three times.

The neck. The jaw. Unclench it.

The face. The eyes, soft behind the lids.

The top of the head.

Now scan the whole body at once, like a slow wave moving from head to feet. Three waves. Down. Down. Down.

Open your eyes. Look around the room. Name three things you can see. Two things you can hear. One thing you can feel.

You are back. The task is still here. Begin again.`,
    },
    {
      day: 5,
      title: "Hyperfocus Containment",
      duration: "5 min",
      technique: "Forced breaks + hydration alarm",
      whyItWorks:
        "Untamed hyperfocus produces burnout, dehydration, and crash cycles. Scheduled interruption preserves the gift without the cost.",
      practice: `Day five. Hyperfocus is a superpower, until it is not. Today we contain it.

Rules of containment.

One. Every fifty minutes of deep focus, you stand up. Even if you do not want to. Even if you are on a roll. Stand. Stretch the arms overhead. Drink water.

Two. Every two hours, you eat something. A small thing. Protein if possible.

Three. When the focus block ends, you write down where you stopped, in one sentence, before you walk away. Future you will thank present you.

Practice the stand-and-stretch now. Reach the arms overhead. Lean left. Lean right. Roll the shoulders back three times.

Drink water if you have some.

These three rules are the price of admission to safe hyperfocus. Pay the price. Keep the gift.`,
    },
    {
      day: 6,
      title: "Evening Decompression",
      duration: "8 min",
      technique: "Wind-down body scan + offload",
      whyItWorks:
        "ADHD brains often stay wired after deep work. A structured offload at end of day prevents the racing-mind sleep onset problem.",
      practice: `Day six. Today is for the end of the focus day.

Sit. Close the laptop. Three slow breaths.

Open a notes app or a notebook. Write three lists, as fast as you can.

List one: everything you finished today. Even small things. Replied to two emails. Made the call. Got dressed.

List two: everything still open, with a one-line note about the next step.

List three: anything looping in your head that is not work. A worry. A song. A conversation. Get it out.

When the lists are done, close the notebook. Three more slow breaths.

Stand. Stretch. Drink water.

Say to yourself: The day is closed. The brain can rest.

Do this every evening this week. Sleep gets better. Mornings get cleaner.`,
    },
    {
      day: 7,
      title: "Your Personal Stack",
      duration: "10 min",
      technique: "Custom protocol design",
      whyItWorks:
        "Personalized protocols outperform generic ones because they account for the unique sensory and motivational profile of each ADHD brain.",
      practice: `Day seven. Today you design your own stack.

You now know the tools. Pomodoro. Pre-game routine. Restart protocol. Body scan. Hyperfocus containment. Evening offload.

Take a notebook. Three slow breaths.

Answer these in writing.

What time of day do I focus best?

Which sound helps me most? Binaural beats, brown noise, lo-fi, silence?

How long is my real focus block? Twenty-five minutes? Fifty? Ninety?

What is my pre-game routine, in five steps, in my own words?

What is my restart cue when I drift?

What is my non-negotiable evening offload?

Write the answers. Print them or pin them somewhere you will see them.

This is your stack. Not mine. Not anyone else's. Yours.

Run it tomorrow. Refine it next week. The system bends to your brain, not the other way around. Welcome to focus on your own terms.`,
    },
  ],
};
