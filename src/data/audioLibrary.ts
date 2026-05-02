// Premium Audio Library data — preserved verbatim from product spec.
// Provides SLEEP_STORIES, COURSES, SESSIONS plus shared types used by the
// Audio Library page and AudioPlayer component.

export type SessionCategory = 'Sleep' | 'Focus' | 'Anxiety' | 'Basics' | 'Nature' | 'Stories';

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: SessionCategory;
  thumbnail: string;
  audioUrl: string;
  author: string;
}

export interface CourseStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
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
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        id: 'c1-2',
        title: 'The Horizon Sweep',
        description: 'Expanding awareness to the periphery. Visualizing the mind as a vast, unobstructed landscape where intrusive thoughts are observed as passing weather.',
        duration: '15 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        id: 'c1-3',
        title: 'Circular Resonance',
        description: 'Advanced rhythmic breathing. Harmonizing Heart Rate Variability (HRV) with the natural cadence of the environment through 4-7-8 pacing.',
        duration: '20 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
    ]
  },
  {
    id: 'c2',
    title: 'Precision Focus Protocol',
    goal: 'Performance',
    author: 'Marcus Thorne',
    description: 'Developed for high-stakes environments, this protocol uses neurological sharpening techniques to eliminate alpha-wave interference and optimize executive function.',
    thumbnail: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1200',
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
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      {
        id: 'c2-2',
        title: 'Sustained Flow State',
        description: 'Bypassing the Default Mode Network. Learn to trigger neurochemical shifts that allow for hours of deep work with minimal cognitive load.',
        duration: '25 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
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
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
      },
      {
        id: 'c3-2',
        title: 'The Void Journey (NSDR)',
        description: 'An abstract narrative into sensory deprivation. This step mimics the deepest phases of REM sleep while maintaining a thread of consciousness.',
        duration: '45 min',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
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
    author: 'Elena Vance'
  },
  {
    id: 's-prem-2',
    title: 'Deep Lunar Drift',
    description: 'Surrender to the architectural weight of stillness. A guided narrative designed to target the parasympathetic nervous system for restorative sleep.',
    duration: '25 min',
    category: 'Sleep',
    thumbnail: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    author: 'Dr. Sarah Chen'
  },
  {
    id: 's-prem-3',
    title: 'Pulse of Intent',
    description: 'A rapid cognitive calibration protocol. Establish your non-negotiable objective for the day through rhythmic focus and visualization.',
    duration: '8 min',
    category: 'Focus',
    thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    author: 'Marcus Thorne'
  },
  {
    id: 's-prem-4',
    title: 'Atmospheric Dissolution',
    description: 'Dissolve the boundaries between self and environment. A technical awareness session focused on peripheral auditory and spatial resonance.',
    duration: '15 min',
    category: 'Basics',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    author: 'Elena Vance'
  },
  {
    id: 's-prem-5',
    title: 'Anxiety Architecture',
    description: 'Systematically deconstruct the physical manifestation of stress. This protocol uses somatic grounding to rebuild emotional stability.',
    duration: '12 min',
    category: 'Anxiety',
    thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    author: 'Dr. Alistair Gray'
  }
];
