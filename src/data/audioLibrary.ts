// Premium Audio Library data — preserved verbatim from product spec.
// Provides SLEEP_STORIES, COURSES, SESSIONS plus shared types used by the
// Audio Library page and AudioPlayer component.
//
// Phase 2: every session now carries a real `script` (narrated by ElevenLabs
// at playback time via useTextToSpeech) and a per-author `voice` key so that
// each composer has a distinct studio voice instead of all four sounding the
// same. `audioUrl` is retained only as a legacy/offline fallback.
import precisionFocusImg from "@/assets/audio-library/precision-focus.jpg";
import atmosphericDissolutionImg from "@/assets/audio-library/atmospheric-dissolution.jpg";
export { default as AUDIO_LIBRARY_FALLBACK_IMG } from "@/assets/audio-library/fallback.jpg";

export type SessionCategory = 'Sleep' | 'Focus' | 'Anxiety' | 'Basics' | 'Nature' | 'Stories';

/** Narration voice keys understood by the generate-narration edge function. */
export type LibraryVoice = "sarah" | "george" | "matilda" | "charlie";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: SessionCategory;
  thumbnail: string;
  /** Legacy placeholder URL — only used if narration generation fails. */
  audioUrl: string;
  author: string;
  /** Full meditation/story script — narrated by ElevenLabs at playback. */
  script?: string;
  /** ElevenLabs voice for this track. Defaults to category default. */
  voice?: LibraryVoice;
}

export interface CourseStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
  script?: string;
  voice?: LibraryVoice;
}

export interface MeditationCourse {
  id: string;
  title: string;
  goal: string;
  description: string;
  steps: CourseStep[];
  thumbnail: string;
  author: string;
  expertInsight?: string;
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
}

export interface Reminder {
  id: string;
  sessionId: string;
  sessionTitle: string;
  date: string;
  time: string;
  frequency: 'Once' | 'Daily' | 'Weekly';
}

export interface MoodEntry {
  id: string;
  mood: 'Deep' | 'Balanced' | 'Fluid' | 'Sharp' | 'Heavy';
  timestamp: string;
  note?: string;
}

/** Map the visible SessionCategory to the narration edge-function category. */
export function sessionCategoryToNarration(
  c: SessionCategory
): "sleep_story" | "daily_meditation" | "sound_bath" {
  if (c === "Sleep" || c === "Stories") return "sleep_story";
  if (c === "Nature") return "sound_bath";
  return "daily_meditation";
}

export const SLEEP_STORIES: MeditationSession[] = [
  {
    id: 's1',
    title: 'The Midnight Express',
    description: 'A gentle train journey through the snow-capped mountains of the north.',
    duration: '35 min',
    category: 'Stories',
    thumbnail: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    author: 'Thomas Rains',
    voice: 'george',
    script: `Welcome aboard the midnight express. Take a slow, deep breath, and let your shoulders fall away from your ears. The carriage is warm, the lamps are low, and the world outside is wrapped in a quilt of fresh snow. ... You feel the gentle rocking of the train as it follows the long, curving track north. The rhythm of the wheels is soft and steady... like a heartbeat... like the breath you are taking now. ... Outside the window, tall pines drift past, their branches heavy with white. A single deer lifts its head from the meadow, watches, and is gone. ... There is nothing to do here, nowhere to be, no message you must answer. The train is carrying you. The night is carrying you. Let your body sink into the seat. Let your eyelids grow heavy. Let the slow rhythm of the rails carry you all the way... into sleep.`,
  },
  {
    id: 's2',
    title: 'Velvet Heavens',
    description: 'Floating through a cosmic nebula of purple and gold light.',
    duration: '40 min',
    category: 'Stories',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    author: 'Luna Star',
    voice: 'matilda',
    script: `Close your eyes, and imagine yourself drifting upward... gently... weightlessly... beyond the rooftops, beyond the clouds, beyond the last blinking light of the city below. ... There is no effort here. No gravity. Only velvet darkness, soft as silk, holding you. ... Slowly, the stars begin to arrive. First one... then a thousand... then galaxies of light unfurling around you in slow, glittering ribbons of violet and gold. ... You breathe in, and a warm purple light fills your chest. You breathe out, and a soft golden light streams from your fingertips into the universe. ... There is no thought you must finish. No tomorrow you must solve. You are simply a small, glowing presence floating through the velvet heavens... safe, vast, and unhurried. ... Let yourself drift here, between the stars, all the way into a deep and beautiful sleep.`,
  },
  {
    id: 's3',
    title: 'Library of Whispers',
    description: 'The comforting sound of old parchment and falling rain in an ancient study.',
    duration: '28 min',
    category: 'Stories',
    thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    author: 'Arthur Penhaligon',
    voice: 'george',
    script: `You find yourself standing in the doorway of an old library, deep in the heart of a stone manor. Rain is falling softly on the leaded windows... a slow, steady whisper against the glass. ... A single green lamp glows on the long oak table. The smell of old paper and beeswax and a quiet fire drifts through the room. ... You step inside. The carpet is thick. The world goes quiet. ... You take a leather-bound book from the shelf, and you settle into a deep velvet chair. The book is heavy. The chair is kind. Outside, the rain keeps whispering. ... Your eyes move slowly across the page, and the words begin to blur, and your breath begins to slow. ... The library is keeping watch. The rain is keeping time. There is nothing you need to remember tonight. Let the pages close. Let your head rest. Let sleep arrive like a quiet old friend.`,
  }
];

export const COURSES: MeditationCourse[] = [
  {
    id: 'c1',
    title: 'The Architecture of Mind',
    goal: 'Foundations',
    author: 'Elena Vance',
    description: 'A structural approach to mindfulness. This masterclass rebuilds your relationship with internal silence through geometric visualization and rhythmic breathwork designed for cognitive restoration.',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200',
    expertInsight: 'Mental stillness is not the absence of thought, but the creation of a symmetrical space where thoughts can exist without friction.',
    testimonial: {
      text: "This course transformed my morning routine into a high-performance ritual.",
      author: "Julian Thorne",
      role: "Venture Partner"
    },
    steps: [
      {
        id: 'c1-1',
        title: 'The Vertical Axis',
        description: 'Establishing the core plumb line of your spine. Learn to ground yourself amidst external chaos using gravitational awareness and skeletal alignment.',
        duration: '12 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        voice: 'sarah',
        script: `Begin by sitting tall. Imagine a fine silver thread, drawn from the crown of your head, lifting you gently upward. Your shoulders soften. Your jaw releases. ... Feel the floor beneath you, holding you completely. And feel that silver thread, holding you completely from above. You are suspended between earth and sky. ... Slowly, draw your attention to the long vertical line of your spine. One vertebra at a time, from the base, all the way up. This is your plumb line. Your true axis. ... With each inhale, the line grows taller, lighter. With each exhale, it grows rooted, calm. ... The world will tilt today. Meetings, messages, the unexpected. But this axis remains. Steady. Quiet. Yours. ... Take three more breaths along this line. And when you are ready, gently open your eyes, carrying the axis with you.`,
      },
      {
        id: 'c1-2',
        title: 'The Horizon Sweep',
        description: 'Expanding awareness to the periphery. Visualizing the mind as a vast, unobstructed landscape where intrusive thoughts are observed as passing weather.',
        duration: '15 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        voice: 'sarah',
        script: `Settle into your seat, and let your breath find its natural rhythm. There is nothing to chase. Nothing to fix. ... Now, picture yourself standing on a wide, open plain. The grass is soft. The sky stretches in every direction... vast, unhurried, complete. ... This sky is your mind. Spacious. Untouched. Old as light. ... Thoughts will arrive today, like weather. A cloud of worry. A passing gust of memory. A bright flare of an idea. ... Notice them. Watch them move across the horizon. Do not chase. Do not hold. The sky does not chase its clouds. ... Sweep your attention slowly from left, across the wide horizon, to right. From past, across the present, to the future yet to come. All of it, contained inside this calm, open sky. ... Breathe with the horizon. Wide. Slow. Unbothered. ... When you are ready, return to the room. The sky stays with you.`,
      },
      {
        id: 'c1-3',
        title: 'Circular Resonance',
        description: 'Advanced rhythmic breathing. Harmonizing Heart Rate Variability (HRV) with the natural cadence of the environment through 4-7-8 pacing.',
        duration: '20 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        voice: 'sarah',
        script: `Close your eyes, and place one hand softly on your chest. Feel the quiet drum beneath your palm. ... We will breathe in a simple circle. Inhale through the nose for a count of four. Hold for seven. Exhale through the mouth for eight. ... Inhale, two, three, four. Hold, two, three, four, five, six, seven. Exhale, two, three, four, five, six, seven, eight. ... Again. Inhale, draw in light. Hold, let it settle. Exhale, release everything you no longer need. ... Notice how the heart begins to fall in line with the breath. The drum slows. The body listens. ... This is circular resonance. The breath, the heart, and the quiet, all turning together. ... Stay here for several more rounds. Each circle, softer than the last. Each circle, returning you home.`,
      },
    ]
  },
  {
    id: 'c2',
    title: 'Precision Focus Protocol',
    goal: 'Performance',
    author: 'Marcus Thorne',
    description: 'Developed for high-stakes environments, this protocol uses neurological sharpening techniques to eliminate alpha-wave interference and optimize executive function.',
    thumbnail: precisionFocusImg,
    expertInsight: 'Focus is a muscle that requires both isometric tension and rhythmic release. We train the attention to hit a target and hold with zero drift.',
    testimonial: {
      text: "The singular focus point technique is now my go-to before board meetings.",
      author: "Sarah Jenkins",
      role: "CEO, NexaGrowth"
    },
    steps: [
      {
        id: 'c2-1',
        title: 'Singular Focus Point',
        description: 'Hyper-fixation training. We use point-geometry visualization to converge the attention onto a single mental coordinate, discarding all background static.',
        duration: '10 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        voice: 'charlie',
        script: `Sit upright. Feet planted. Hands resting. ... Picture a single point of white light, floating an arm's length in front of your eyes. It is small. Precise. Unmoving. ... All of your attention belongs to this point. Nothing else exists in the field. ... A thought arrives. Notice it. Return to the point. ... A sound from the room. Notice it. Return to the point. ... There is no struggle here. There is only the gentle, repeated act of returning. Each return is a rep. Each rep makes the attention stronger. ... Breathe slowly. The point grows brighter as you breathe in. Steadier as you breathe out. ... Stay with the point for the next several breaths. When the mind wanders, simply, kindly, bring it home. ... This is precision. Not force. Just return.`,
      },
      {
        id: 'c2-2',
        title: 'Sustained Flow State',
        description: 'Bypassing the Default Mode Network. Learn to trigger neurochemical shifts that allow for hours of deep work with minimal cognitive load.',
        duration: '25 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        voice: 'charlie',
        script: `Close your eyes. Let the breath drop low, into the belly. Slow. Even. Unhurried. ... In a moment you will return to your work. But first, we set the conditions. ... Imagine a clear glass corridor, stretching out in front of you. At the end of the corridor is the one task that matters today. Only that. ... All other tabs, all other people, all other obligations... they remain outside the glass. Visible, but not present. ... You step into the corridor. The air is cool. The walls are quiet. The task waits, patient and bright. ... Your breath grows long. Your thoughts grow narrow. Your hands grow ready. ... When you open your eyes, do not check your phone. Do not check your inbox. Walk directly into the corridor and begin. The flow will meet you there.`,
      }
    ]
  },
  {
    id: 'c3',
    title: 'Neuro-Lunar Restoration',
    goal: 'Recovery',
    author: 'Dr. Sarah Chen',
    description: 'A clinical-grade approach to deep rest. This course utilizes Non-Sleep Deep Rest (NSDR) and Vagus Nerve stimulation to force the nervous system into a parasympathetic state.',
    thumbnail: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?auto=format&fit=crop&q=80&w=1200',
    expertInsight: 'Strategic recovery is the only sustainable competitive advantage. We teach the brain how to drop into delta-wave sleep instantly.',
    testimonial: {
      text: "The Voids journey is the most effective solution for my chronic insomnia.",
      author: "David Molnar",
      role: "Software Architect"
    },
    steps: [
      {
        id: 'c3-1',
        title: 'Vagus Nerve Regulation',
        description: 'Scientific decompression. Targeted breathwork and vocal resonance to signal safety to the brain and lower cortisol levels immediately.',
        duration: '30 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        voice: 'matilda',
        script: `Lie down, or sit comfortably, with your spine supported. Place one hand on your chest, and one hand on your belly. ... Take a slow breath in through the nose, all the way down into the belly. Feel the lower hand rise. ... Now exhale, slow and long, through gently pursed lips. Twice as long as the inhale. Feel the lower hand fall. ... This long exhale is a message. A signal sent along the vagus nerve, from heart to brainstem, that says: you are safe. ... Again. Inhale, four counts, into the belly. Exhale, eight counts, through soft lips. ... With each long exhale, cortisol drops. The shoulders melt. The jaw releases. The breath itself becomes the medicine. ... Continue this rhythm. There is nowhere else to be. The nervous system is coming home.`,
      },
      {
        id: 'c3-2',
        title: 'The Void Journey (NSDR)',
        description: 'An abstract narrative into sensory deprivation. This step mimics the deepest phases of REM sleep while maintaining a thread of consciousness.',
        duration: '45 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        voice: 'matilda',
        script: `Lie flat on your back. Arms beside you. Palms open to the ceiling. Eyes closed. ... Begin a long, slow scan from the soles of your feet. Feel the feet. Soften the feet. ... Move to the calves... the thighs... the hips. Each region noticed. Each region released. ... Continue upward. Belly. Chest. Shoulders. Arms. Hands. Each region noticed. Each region released. ... Now the throat. The jaw. The eyes. The forehead. The crown. All quiet. All soft. ... You are now floating in a wide, warm darkness. A void. There is no edge to your body. No urgency in your mind. ... Your breath continues without your help. Your heart continues without your help. There is nothing you must do. ... Remain here, suspended in the void, for as long as you like. When you are ready, wiggle your fingers, and slowly return.`,
      }
    ]
  }
];

export const SESSIONS: MeditationSession[] = [
  {
    id: 's-prem-1',
    title: 'The Equilibrium State',
    description: 'A structural alignment session focusing on the geometric balance of mind and body. Ideal for recalibrating after high-output deep work.',
    duration: '10 min',
    category: 'Focus',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    author: 'Elena Vance',
    voice: 'sarah',
    script: `Pause. Wherever you are. Whatever the day has asked of you. Pause. ... Settle into your seat, and feel both feet meet the floor at the same time. Feel both sit-bones meet the chair at the same time. Feel both shoulders fall away from your ears at the same time. ... This is the beginning of equilibrium. Left, equal to right. Front, equal to back. Effort, equal to ease. ... Inhale through the nose, slow and even. Exhale through the nose, slow and even. The breath in, equal to the breath out. ... Imagine a fine, level line drawn from one shoulder to the other. Steady. True. Now another, hip to hip. Now another, ear to ear. ... You are a quiet structure of balanced lines. The day cannot tilt you. ... Take three more even breaths here. And when you are ready, return to the world, carrying the equilibrium with you.`,
  },
  {
    id: 's-prem-2',
    title: 'Deep Lunar Drift',
    description: 'Surrender to the architectural weight of stillness. A guided narrative designed to target the parasympathetic nervous system for restorative sleep.',
    duration: '25 min',
    category: 'Sleep',
    thumbnail: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    author: 'Dr. Sarah Chen',
    voice: 'matilda',
    script: `Let your body sink into the surface beneath you. The mattress is rising up to meet you, holding every part of you with quiet patience. ... Above you, a pale silver moon is rising. Its light is cool, and soft, and asks nothing of you. ... Begin to breathe slowly with the moon. Inhale as it rises. Exhale as it drifts. ... Feel your body grow heavy. The arms, heavy. The legs, heavy. The eyelids, beautifully heavy. ... You are drifting now, on a wide dark sea, beneath that silver moon. There are no decisions on this sea. No notifications. No tomorrow yet. ... With each slow breath, you drift further from the shore. Further from the noise. Further from the day that has ended. ... The moon watches kindly. The sea carries you. Let go of the oars. Let go of the day. Let yourself drift... all the way... into sleep.`,
  },
  {
    id: 's-prem-3',
    title: 'Pulse of Intent',
    description: 'A rapid cognitive calibration protocol. Establish your non-negotiable objective for the day through rhythmic focus and visualization.',
    duration: '8 min',
    category: 'Focus',
    thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    author: 'Marcus Thorne',
    voice: 'charlie',
    script: `Sit upright. Take one deep breath in through the nose. And release it, slow, through the mouth. ... Now, quietly, ask yourself: what is the one thing that matters today? Not the list. Not the inbox. The one thing. ... Let it surface. Don't force it. The answer is already in the body. ... When it arrives, picture it as a single, steady pulse of light in the center of your chest. Soft. Warm. Unmistakable. ... Breathe into the pulse. With each inhale, it grows brighter. With each exhale, it grows steadier. ... This pulse is your intent. Every decision today returns here. Every distraction is measured against this light. ... Take three more breaths with the pulse. Memorize its warmth. ... When you open your eyes, the first action you take belongs to this pulse. Begin there.`,
  },
  {
    id: 's-prem-4',
    title: 'Atmospheric Dissolution',
    description: 'Dissolve the boundaries between self and environment. A technical awareness session focused on peripheral auditory and spatial resonance.',
    duration: '15 min',
    category: 'Basics',
    thumbnail: atmosphericDissolutionImg,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    author: 'Elena Vance',
    voice: 'sarah',
    script: `Close your eyes, and begin to listen, not for any sound in particular, but for the whole field of sound around you. ... The hum of the room. A distant car. The soft, ever-present rush of your own breath. ... Notice that the sounds are not happening to you. They are happening around you, through you, all at once. ... Now, soften the edges of your body. The outline you usually call yourself. Let it blur, just a little, into the air. ... Where does your skin end? Where does the room begin? In this quiet listening, the line is no longer so certain. ... You are not a small, separate thing inside the room. You are the room, listening to itself. ... Stay here, dissolved, for several slow breaths. There is nothing to defend. Nothing to hold together. ... When you are ready, draw your edges gently back, and open your eyes. The room remembers you.`,
  },
  {
    id: 's-prem-5',
    title: 'Anxiety Architecture',
    description: 'Systematically deconstruct the physical manifestation of stress. This protocol uses somatic grounding to rebuild emotional stability.',
    duration: '12 min',
    category: 'Anxiety',
    thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    author: 'Dr. Alistair Gray',
    voice: 'george',
    script: `If you are feeling tight, or fast, or shaky inside — you are welcome here. We will move slowly, and we will move together. ... Begin by naming five things you can see in the room. Just notice them. The shape, the color, the edge of each one. ... Now four things you can physically feel. The chair. Your clothes. The floor. The breath at your nostrils. ... Three things you can hear. Two things you can smell, or imagine smelling. One slow, deep breath in. And out. ... You have just told your nervous system: I am here. I am safe. The room is real. The body is real. ... Place a hand on your chest. Feel the heart, working hard for you. Whisper to it, silently: thank you. I've got you. ... Take three more slow breaths. The wave does not last forever. You are larger than this moment. And the floor, the breath, the room — all of it — is holding you.`,
  }
];
