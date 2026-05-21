// Box Breathing for Athletes — 7-day performance breathwork program.
import type { MiniProgram } from "./types";

const HERO_FALLBACK = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const POSTER_FALLBACK = "/src/assets/video-library-hero-poster.jpg";

export const BOX_BREATHING_ATHLETES: MiniProgram = {
  id: "box-breathing-athletes",
  title: "Box Breathing for Athletes",
  tagline: "Seven days of performance breathwork",
  description:
    "Used by Navy SEALs and Olympic athletes, box breathing trains your nervous system to stay calm under pressure. Seven days to a steadier heart, sharper focus, and faster recovery between efforts.",
  category: "Performance · Breathwork",
  heroVideoSlot: "box-breathing-hero",
  videoBackdrop: HERO_FALLBACK,
  posterUrl: POSTER_FALLBACK,
  freeDays: 1,
  voice: "charlie",
  days: [
    {
      day: 1,
      title: "Meet the Box",
      duration: "5 min",
      technique: "4-4-4-4 cadence",
      whyItWorks:
        "The equal four-count rhythm balances oxygen and CO2, lowering heart rate within minutes and conditioning the vagus nerve.",
      practice: `Welcome to day one. Today you meet the box. Sit tall, feet flat, shoulders soft. Inhale through the nose for a count of four. Hold for four. Exhale through the nose for four. Hold empty for four. That is one box.

We will do five rounds together. Inhale, two, three, four. Hold, two, three, four. Exhale, two, three, four. Hold, two, three, four.

Again. Inhale. Hold. Exhale. Hold. Notice how the chest stays still and the belly does the work.

Three more rounds at your own pace. Keep the count steady. If you feel air-hungry, shorten to a three count. Precision matters more than length.

This box is your baseline. Before every training session this week, run two rounds. Before any high-pressure moment, run one round. Your heart rate will drop by five to ten beats. Your decisions will sharpen. Welcome to the discipline of breath.`,
    },
    {
      day: 2,
      title: "Pre-Performance Reset",
      duration: "4 min",
      technique: "4-4-4-4 with visualization",
      whyItWorks:
        "Pairing the box with a mental rehearsal primes the motor cortex while parasympathetic tone keeps adrenaline in check.",
      practice: `Day two. We add visualization. Close your eyes. Picture the moment you most want to perform well. The start line. The free-throw. The first email of the day.

Begin the box. Inhale four. Hold four. Exhale four. Hold four.

On the next inhale, see yourself stepping into the moment, calm and ready. On the hold, feel the readiness in your chest. On the exhale, see the action unfolding with ease. On the empty hold, feel it complete.

Repeat the cycle four more times, weaving image with breath.

You have just rehearsed under parasympathetic conditions. Your body will remember this calm when the real moment arrives.`,
    },
    {
      day: 3,
      title: "Recovery Box",
      duration: "6 min",
      technique: "Extended exhale 4-4-6-2",
      whyItWorks:
        "Lengthening the exhale tilts the autonomic balance toward recovery, accelerating clearance of lactate and dropping cortisol.",
      practice: `Day three. After hard effort, your body needs to shift gears fast. Today we lengthen the exhale.

The new pattern is inhale four, hold four, exhale six, hold empty two. The longer exhale is the recovery key.

Inhale, two, three, four. Hold, two, three, four. Exhale, two, three, four, five, six. Hold, two.

Five more rounds together. Stay relaxed in the jaw and shoulders.

Use this pattern between sets, between intervals, in the locker room. Sixty seconds is enough to drop heart rate ten to twenty beats. Recovery is a skill. You are training it now.`,
    },
    {
      day: 4,
      title: "Focus Under Load",
      duration: "5 min",
      technique: "Box with cognitive load",
      whyItWorks:
        "Maintaining breath cadence while solving simple math under load builds prefrontal-cortex control over the stress response.",
      practice: `Day four. We add cognitive load. The goal: keep the breath perfectly steady while the mind works.

Begin the box. Four in, four hold, four out, four hold.

On each inhale, count up by sevens starting at seven. Seven. Inhale. Hold.

Fourteen. Exhale. Hold.

Twenty-one. Inhale. Hold.

Keep going. Twenty-eight. Thirty-five. Forty-two. Forty-nine.

If the breath wobbles, restart at seven. The wobble is the data. Each restart trains the link between cognition and breath.

Three more rounds.

You have just trained the same circuit elite snipers use. Under pressure, the breath holds. The mind holds.`,
    },
    {
      day: 5,
      title: "Heart-Rate Variability Box",
      duration: "8 min",
      technique: "5.5 second cadence",
      whyItWorks:
        "Breathing at six breaths per minute (5.5 seconds each direction) maximizes heart rate variability, the gold standard for athletic recovery.",
      practice: `Day five. Today we breathe at the resonance frequency: six breaths per minute. Inhale for five and a half. Exhale for five and a half. No holds.

Follow with me. Inhaaaaaaale, two, three, four, five. Exhaaaaaaale, two, three, four, five.

Inhaaaaaaale. Exhaaaaaaale. Smooth like a wave.

Continue for the next several minutes. Let the count fade. Let the wave carry you.

Inhale. Exhale.

This single pattern, ten minutes a day, has been shown to raise heart rate variability by up to twenty percent in four weeks. That means faster recovery, better sleep, higher pain tolerance. Make this your daily floor.`,
    },
    {
      day: 6,
      title: "Tactical Reset",
      duration: "3 min",
      technique: "Triple box",
      whyItWorks:
        "Three rapid boxes after stress mimic the protocol used by tactical athletes to return to baseline in under sixty seconds.",
      practice: `Day six. The tactical reset. Use this any time the body fires off. Stress. Anger. A near miss. Bad news.

Three boxes. Fast and clean.

Box one. Inhale four. Hold four. Exhale four. Hold four.

Box two. Inhale four. Hold four. Exhale four. Hold four.

Box three. Inhale four. Hold four. Exhale four. Hold four.

Done. Sixty seconds. Heart rate down. Mind back online.

Practice this twice a day this week, in calm moments, so the pattern is automatic when you need it.`,
    },
    {
      day: 7,
      title: "Integration",
      duration: "10 min",
      technique: "Full protocol",
      whyItWorks:
        "Stacking every technique into one ten-minute session encodes the protocol as a single skill you can deploy at will.",
      practice: `Day seven. Integration. We move through every tool you have learned in one sequence.

Two minutes of the classic box. Four in, four hold, four out, four hold.

Two minutes of the recovery box. Four in, four hold, six out, two hold.

Two minutes of resonance breath. Five and a half in, five and a half out.

Two minutes of the cognitive box. Box pattern with counting by sevens.

One minute of the tactical reset. Three fast boxes.

One minute of free breathing. Eyes closed. Notice the floor of calm beneath you. This is your new baseline.

You have built a portable performance system. Carry it everywhere.`,
    },
  ],
};
