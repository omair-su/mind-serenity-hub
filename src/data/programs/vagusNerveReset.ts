// Vagus Nerve Reset — premium 7-day science-backed program. Each day now ships
// a full ScienceCard + step list + reflection prompt + optional bonus or
// safety note so the player page can render a $100-course experience.
import type { MiniProgram } from "./types";

export const VAGUS_NERVE_RESET: MiniProgram = {
  id: "vagus-nerve",
  title: "Reset Your Nervous System",
  tagline: "A 7-day journey to calm your stress response, improve sleep, and restore inner balance.",
  description:
    "A 7-day journey to calm your stress response, improve sleep, and restore inner balance — built on polyvagal theory and somatic research.",
  category: "Science-backed · 7 Days",
  heroVideoSlot: "vagus-hero",
  videoBackdrop:
    "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4",
  posterUrl: "/src/assets/video-library-hero-poster.jpg",
  freeDays: 1,
  voice: "matilda",
  days: [
    {
      day: 1,
      videoSlot: "vagus-day-01",
      title: "Awaken the Pathway",
      duration: "10 min",
      technique: "Diaphragmatic Breathing",
      whyItWorks:
        "Your vagus nerve is primarily activated during the exhale. Extending the exhale beyond the inhale sends direct safety signals to the brain.",
      scienceCard: {
        title: "Why Breathing Resets Your Nervous System",
        body: "Your vagus nerve is primarily activated during the exhale. When you extend your exhale longer than your inhale, you send direct safety signals to your brain — reducing cortisol and slowing heart rate within minutes. Research shows paced breathing at 5–6 breaths per minute produces the strongest vagal response.",
      },
      steps: [
        "Find a comfortable seated position with spine tall.",
        "Inhale slowly through your nose for 4 counts.",
        "Hold gently for 2 counts.",
        "Exhale slowly through your mouth for 6–8 counts.",
        "Feel your belly soften completely on the exhale.",
        "Repeat for 10 rounds.",
      ],
      bonus: {
        title: "4-7-8 Technique",
        body: "Inhale 4 counts, hold 7 counts, exhale 8 counts. The extended hold and exhale create powerful parasympathetic activation.",
      },
      reflectionPrompt:
        "How does your body feel after this practice? Notice any changes in your shoulders, jaw, or chest.",
      timerMinutes: 5,
      practice: `Welcome to day one of your Vagus Nerve Reset. Today you will learn extended exhale breathing — the simplest, most reliable way to activate your vagus nerve.

Find a comfortable seat with your spine tall. Let your shoulders drop. Let your jaw soften.

Inhale slowly through your nose for four counts. Hold gently for two. Exhale slowly through your mouth for six to eight counts, letting your belly soften completely.

Let us try one together. Inhale, two, three, four. Hold, two. Exhale, two, three, four, five, six, seven, eight.

Beautiful. We will continue this pattern. With every long exhale, you are sending safety signals to your brain.

Inhale four. Hold two. Exhale eight.

Continue at your own pace for the next several minutes. Notice the heart slowing. Notice the shoulders dropping. Notice the world becoming a little quieter.

When you are ready, take one final natural breath. Open your eyes. You have just stimulated your vagus nerve.`,
      posterUrl: "/src/assets/video-library-hero-poster.jpg",
    },
    {
      day: 2,
      videoSlot: "vagus-day-02",
      title: "Sound Healing",
      duration: "12 min",
      technique: "Humming and Vocal Vibration",
      whyItWorks:
        "The vagus nerve runs directly through your vocal cords. Humming creates mechanical vibration that stimulates upward signals to the brainstem.",
      scienceCard: {
        title: "How Your Voice Heals You",
        body: "The vagus nerve runs directly through your vocal cords and throat. When you hum or chant, mechanical vibrations travel along vagal fibers — stimulating upward signals to the brainstem that shift your entire nervous system into calm mode. Heart rate variability (HRV) measurably improves during vocal practices.",
      },
      steps: [
        "Sit comfortably with jaw slightly relaxed.",
        "Take a deep breath in through your nose.",
        "On your exhale, make a gentle 'mmm' or 'om' sound.",
        "Feel vibrations in your throat, chest, and skull.",
        "Continue for 5–10 breaths.",
        "Notice the tingling sensation — that is your vagus nerve activating.",
      ],
      bonus: {
        title: "Gargling Practice",
        body: "Gargle vigorously with water for 30 seconds. The throat muscles activated during gargling directly stimulate vagal fibers. Ideal before breakfast or before bed.",
      },
      reflectionPrompt:
        "Where in your body did you feel the strongest vibration? How does your mind feel now?",
      timerMinutes: 6,
      practice: `Welcome to day two. Today, we use your own voice as medicine. The vagus nerve passes directly through your vocal cords — when you hum, you stimulate it more powerfully than almost any other technique.

Sit comfortably. Take one slow breath in through your nose. On your exhale, make a long, low humming sound. Mmmmm.

Notice the vibration in your lips, jaw, throat, and chest. The lower and slower your hum, the stronger the vagal stimulation.

Inhale. Hum. Inhale. Hum.

If you would like, switch to a soft Voo — like the word voodoo without the doo. Voooo. This is an ancient sound used in trauma therapy to calm the body.

Continue at your own pace. With each hum, you are toning your vagus nerve like a muscle.

When you are ready, return to your natural breath. Notice the after-buzz in your face and throat. That is your vagus nerve waking up.`,
      posterUrl: "/src/assets/willow-demo-poster.jpg",
    },
    {
      day: 3,
      videoSlot: "vagus-day-03",
      title: "The Cold Reset",
      duration: "8 min",
      technique: "Cold Water Exposure",
      whyItWorks:
        "Cold exposure to the face activates the mammalian diving reflex, slowing your heart rate by 10–25% in seconds.",
      safetyNote:
        "Please consult your doctor before cold exposure if you have heart conditions, low blood pressure, are pregnant, or use implanted devices.",
      scienceCard: {
        title: "The Dive Reflex — Your Emergency Calm Button",
        body: "Cold exposure to the face activates the mammalian dive reflex — an ancient survival response that instantly slows heart rate by 10–25%. This is one of the most powerful and immediate vagal activators available to you. No meditation required. No equipment beyond cold water.",
      },
      steps: [
        "Fill a bowl or sink with cold water — as cold as comfortable.",
        "Take 3 deep breaths first to prepare your nervous system.",
        "Submerge your face for 15–30 seconds OR splash cold water on your forehead and cheeks.",
        "Alternatively: end your shower with 20–30 seconds of cool water.",
        "Notice immediate heart rate slowdown and mental clarity.",
      ],
      bonus: {
        title: "Beginner Modification",
        body: "Not ready for full cold exposure? Place a cold pack or frozen vegetables wrapped in cloth on your face and neck for 60 seconds. Same vagal activation, gentler experience.",
      },
      reflectionPrompt:
        "How does your body feel right after the cold? Notice your heart, your breathing, your sense of clarity.",
      timerMinutes: 1,
      practice: `Welcome to day three. Today, we use cold to flip a switch in your nervous system.

When cold water touches the area around your eyes and cheeks, your body activates an ancient survival reflex called the diving response. Your heart slows. Your nervous system shifts into deep calm. It is one of the fastest physical interventions known.

Fill a bowl with cold water. Add a few ice cubes if you have them. Take three slow breaths to prepare.

When you are ready, take a full breath in, hold it, and lower your face into the cold water for fifteen to thirty seconds. Keep your forehead, eyes, and cheeks submerged. If submerging is too intense, press a cold damp washcloth over your eyes and cheeks for thirty seconds instead.

Pause this audio now. Do the practice. Return when you are done.

Welcome back. Notice what has changed. Your heart feels different. Your shoulders feel different. The world feels slower. This is your nervous system in parasympathetic dominance. Welcome home.`,
      posterUrl: "/src/assets/video-library-hero-poster.jpg",
    },
    {
      day: 4,
      videoSlot: "vagus-day-04",
      title: "Gentle Movement",
      duration: "15 min",
      technique: "Yoga and Somatic Movement",
      whyItWorks:
        "Postures that compress the abdomen or lengthen the neck directly massage vagal pathways and raise GABA, the brain's calming neurotransmitter.",
      scienceCard: {
        title: "Movement as Medicine",
        body: "Postures that gently compress the abdomen or lengthen the neck are proven vagal stimulators. The vagus nerve passes through the diaphragm — so any movement that massages or engages the diaphragm directly stimulates vagal tone. Research from Yale confirms that yoga reduces cortisol and increases GABA — the brain's calming neurotransmitter.",
      },
      exercises: [
        {
          title: "Neck Roll Release",
          durationLabel: "2 minutes",
          badge: "Stimulates brainstem and upper vagal fibers",
          body: "Slowly roll head right ear to right shoulder, hold 5 breaths. Center. Left ear to left shoulder, hold 5 breaths. Never roll head fully backward.",
        },
        {
          title: "Supported Child's Pose",
          durationLabel: "3 minutes",
          badge: "Compresses abdomen, massages vagal pathway",
          body: "Kneel and fold forward, arms extended or resting alongside body. Breathe deeply into your back ribs. Let your belly press against your thighs on each exhale.",
        },
        {
          title: "Legs Up the Wall",
          durationLabel: "5 minutes",
          badge: "Strongest yoga posture for vagal tone",
          body: "Lie on your back and rest legs vertically against a wall. Breathe naturally. This posture reverses blood flow and powerfully activates the parasympathetic system.",
        },
      ],
      reflectionPrompt:
        "Which movement felt most restorative? Where in your body do you feel the most softness now?",
      timerMinutes: 15,
      practice: `Welcome to day four. Today we move — gently, intentionally, and in ways proven to stimulate your vagus nerve.

We will move through three postures. Each one targets a different vagal pathway.

First, neck rolls. Slowly drop your right ear toward your right shoulder. Hold for five breaths. Return to center. Now left ear to left shoulder. Hold for five breaths. Never roll the head fully backward.

Second, child's pose. Kneel and fold forward, arms extended in front of you or resting alongside your body. Breathe deeply into your back ribs. Let your belly press against your thighs on each exhale. Stay for three minutes.

Third, legs up the wall. Lie on your back. Rest your legs vertically against a wall, a couch, or a sturdy surface. Breathe naturally. Stay for five minutes. This is the strongest yoga posture for vagal tone.

When you are ready, slowly return to seated. Notice the deep, body-wide calm.`,
      posterUrl: "/src/assets/willow-demo-poster.jpg",
    },
    {
      day: 5,
      videoSlot: "vagus-day-05",
      title: "Deep Restoration",
      duration: "15 min",
      technique: "Guided Meditation + Body Scan",
      whyItWorks:
        "Long-term meditation measurably increases vagal tone and HRV. A single 15-minute session reduces cortisol and activates the prefrontal cortex.",
      scienceCard: {
        title: "Meditation Changes Your Brain",
        body: "Long-term meditation practice measurably increases vagal tone and heart rate variability. A single 15-minute session reduces cortisol and activates the prefrontal cortex — the brain region responsible for calm decision-making. Today's practice combines body scan with progressive muscle release.",
      },
      steps: [
        "0–3 min · Settling In — gentle breath awareness.",
        "3–7 min · Body Scan — head-to-toe awareness sweep.",
        "7–12 min · Progressive Release — tense and release each muscle group.",
        "12–15 min · Resting Presence — complete stillness.",
      ],
      reflectionPrompt:
        "What did you notice during the body scan that you had not noticed before?",
      timerMinutes: 15,
      practice: `Welcome to day five. Today is deep restoration.

Lie down or sit comfortably. Close your eyes. Let your jaw soften. Let your shoulders drop.

Settling in. For the next three minutes, simply notice your breath. There is nothing to fix.

Body scan. We will sweep from the top of your head down to your toes. The forehead. The eyes. The jaw. The throat. The shoulders. The chest. The belly. The hips. The thighs. The knees. The calves. The feet.

Progressive release. We will tense and release each major muscle group. Tense the face. Hold. Release. Tense the shoulders. Hold. Release. Tense the hands into fists. Hold. Release. Tense the belly. Hold. Release. Tense the legs and feet. Hold. Release.

Resting presence. Stay with the deep stillness you have created. For the next few minutes there is nothing to do.

When you are ready, return slowly. Open your eyes. You have just given your nervous system a full reset.`,
      posterUrl: "/src/assets/video-library-hero-poster.jpg",
    },
    {
      day: 6,
      videoSlot: "vagus-day-06",
      title: "Laughter and Joy",
      duration: "10 min",
      technique: "Laughter Therapy",
      whyItWorks:
        "Genuine laughter causes deep belly breathing that directly massages the vagus nerve via the diaphragm — reducing cortisol by up to 39%.",
      scienceCard: {
        title: "Laughter is Serious Medicine",
        body: "Genuine laughter causes deep belly breathing that directly massages the vagus nerve via the diaphragm. Research shows laughter reduces cortisol by 39%, increases immune function, and produces measurable improvements in HRV within minutes. This is one of the most underutilized wellness tools available.",
      },
      exercises: [
        {
          title: "Voluntary Laughter",
          durationLabel: "2 minutes",
          body: "Begin with a forced 'ha ha ha ha' from your belly. Even fake laughter produces the same physiological benefits as genuine laughter within 60 seconds. Your body cannot tell the difference.",
        },
        {
          title: "Belly Breathing Laugh",
          durationLabel: "2 minutes",
          body: "Place both hands on your belly. Take a deep breath in. On the exhale, let out a series of 'ho ho ho' sounds, feeling your diaphragm bounce with each syllable.",
        },
        {
          title: "Joy Memory Recall",
          durationLabel: "3–5 minutes",
          body: "Close your eyes. Recall the funniest or most joyful memory you have. Let yourself smile and laugh naturally as the memory plays.",
        },
      ],
      reflectionPrompt:
        "What was the memory you recalled? How does your body feel right now?",
      timerMinutes: 10,
      practice: `Welcome to day six. Today's practice is the most playful — and it is real medicine.

We begin with voluntary laughter. From your belly, force out a 'ha ha ha ha'. Keep going for two minutes. Your body cannot tell the difference between fake and real laughter — within 60 seconds, the same chemistry kicks in.

Now place both hands on your belly. Inhale deeply. On the exhale, let out a series of 'ho ho ho' sounds, feeling your diaphragm bounce with each syllable. Continue for two more minutes.

Finally, close your eyes. Recall the funniest or most joyful memory you have. Let yourself smile. Let yourself laugh. Stay with the memory for the next several minutes.

When you are ready, return. Notice the lightness in your chest. That is your vagus nerve, fully engaged.`,
      posterUrl: "/src/assets/willow-demo-poster.jpg",
    },
    {
      day: 7,
      videoSlot: "vagus-day-07",
      title: "Integration and Commitment",
      duration: "15 min",
      technique: "Building a Lifelong Practice",
      whyItWorks:
        "Seven days of consistent vagal stimulation creates measurable neuroplastic changes. Today you build a personal protocol you can keep for life.",
      scienceCard: {
        title: "You Have Rewired Your Nervous System",
        body: "Seven days of consistent vagal stimulation creates measurable neuroplastic changes. Your baseline cortisol levels have likely decreased. Your heart rate variability has improved. Your body now has a stronger parasympathetic foundation. Today we build your personal daily vagal reset protocol — a 5-minute morning routine you can maintain for life.",
      },
      steps: [
        "Choose three favorite techniques from your week.",
        "Sequence them into a 5-minute daily routine.",
        "Anchor your routine to an existing habit (morning coffee, brushing teeth).",
        "Commit to 7 days of daily practice to lock in the gains.",
      ],
      reflectionPrompt:
        "Which three techniques will you keep? What time of day will you practice them?",
      timerMinutes: 15,
      practice: `Welcome to day seven, the final day of your Vagus Nerve Reset. Today is integration.

You now have a complete toolkit. Extended exhale for acute stress. Humming for low energy. Cold water on the face for panic. Movement for chronic tension. The body scan for deep restoration. Laughter for joy.

Choose your three favorites. Sequence them into a five-minute morning routine. Anchor that routine to something you already do every day — your first sip of coffee, brushing your teeth, your shower.

You no longer have to wait for your nervous system to calm down. You know exactly how to invite the calm.

Welcome to a more regulated life.`,
      posterUrl: "/src/assets/video-library-hero-poster.jpg",
    },
  ],
};

export const ALL_PROGRAMS: MiniProgram[] = [VAGUS_NERVE_RESET];

export function getProgramById(id: string): MiniProgram | undefined {
  return ALL_PROGRAMS.find((p) => p.id === id);
}
