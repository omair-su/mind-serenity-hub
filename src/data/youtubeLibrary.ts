// Curated YouTube video library for the Willow Vibes Video Library page.
// 50+ hand-picked sessions across 8 categories. Thumbnails come from YouTube's
// public image CDN; iframes are only injected when the user presses play.

export type VideoLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type VideoMood = "Calm me down" | "Energize me" | "Help me sleep" | "Heal & restore" | "Focus";

export interface LibraryVideo {
  id: string;
  categoryId: CategoryId;
  title: string;
  instructor: string;
  youtubeId: string;
  minutes: number;
  level: VideoLevel;
  description: string;
  tags: string[];
  moods: VideoMood[];
}

export type CategoryId =
  | "guided"
  | "sleep"
  | "morning"
  | "yoga"
  | "breathwork"
  | "healing"
  | "focus"
  | "quick";

export interface LibraryCategory {
  id: CategoryId;
  emoji: string;
  label: string;
  eyebrow: string;
  headline: string;
  sub: string;
}

export const VIDEO_CATEGORIES_META: LibraryCategory[] = [
  {
    id: "guided",
    emoji: "🧘",
    label: "Guided Meditation",
    eyebrow: "Guided Meditation",
    headline: "Be Led Into Stillness",
    sub: "Expert-guided sessions from the world's most trusted teachers — from 5 minutes to 30.",
  },
  {
    id: "sleep",
    emoji: "😴",
    label: "Sleep",
    eyebrow: "Sleep Meditations",
    headline: "Drift Into Deep, Restorative Sleep",
    sub: "From 10-minute wind-downs to hour-long sleep stories — let your mind finally rest.",
  },
  {
    id: "morning",
    emoji: "🌅",
    label: "Morning",
    eyebrow: "Morning Practices",
    headline: "Begin Your Day With Intention",
    sub: "Wake your body and mind gently — morning practices that take 5 to 35 minutes.",
  },
  {
    id: "yoga",
    emoji: "🌿",
    label: "Yoga & Movement",
    eyebrow: "Yoga & Movement",
    headline: "Move, Breathe, Release",
    sub: "From yin to vinyasa, gentle to powerful — yoga for every level and every need.",
  },
  {
    id: "breathwork",
    emoji: "🌬️",
    label: "Breathwork",
    eyebrow: "Breathwork",
    headline: "The Breath Is the Bridge",
    sub: "Pranayama, box breathing, 4-7-8, and nervous system resets — breathe your way back to calm.",
  },
  {
    id: "healing",
    emoji: "💚",
    label: "Healing & Emotional",
    eyebrow: "Healing & Emotional Wellness",
    headline: "A Safe Space for Every Feeling",
    sub: "Meditations for grief, trauma, depression, and emotional healing — because you deserve gentleness.",
  },
  {
    id: "focus",
    emoji: "🎯",
    label: "Focus & Clarity",
    eyebrow: "Focus & Clarity",
    headline: "Sharpen Your Mind, Clear the Noise",
    sub: "Meditations designed to boost focus, reduce mental clutter, and help you enter flow state.",
  },
  {
    id: "quick",
    emoji: "⭐",
    label: "Quick & Beginner",
    eyebrow: "Quick & Beginner Sessions",
    headline: "Start Here. 5 Minutes Is Enough.",
    sub: "No experience required. No special equipment. Just press play.",
  },
];

export const LIBRARY_VIDEOS: LibraryVideo[] = [
  // 1 — Guided Meditation
  { id: "1.1", categoryId: "guided", title: "Body Scan — The Gold Standard", instructor: "Jon Kabat-Zinn • MBSR Founder", youtubeId: "_DTmGtznab4", minutes: 30, level: "All Levels", description: "The most clinically studied mindfulness technique. Dr. Kabat-Zinn's signature body scan dissolves tension and brings profound awareness.", tags: ["MBSR", "BodyScan", "Stress"], moods: ["Calm me down", "Heal & restore"] },
  { id: "1.2", categoryId: "guided", title: "Meditation for Anxiety Relief — 10 Minutes", instructor: "Declutter The Mind", youtubeId: "tuPW7oOudVc", minutes: 10, level: "Beginner", description: "Turn inward and focus on the breath to discover one of the most powerful tools for alleviating stress and anxiety.", tags: ["Anxiety", "Beginners", "Breath"], moods: ["Calm me down"] },
  { id: "1.3", categoryId: "guided", title: "Guided Meditation for Inner Peace", instructor: "Great Meditation", youtubeId: "IPDtrQZThAs", minutes: 10, level: "Beginner", description: "Lie back and let this gentle lying-down meditation dissolve anxiety and stress — perfect for absolute beginners.", tags: ["Peace", "Beginners", "Relaxation"], moods: ["Calm me down"] },
  { id: "1.4", categoryId: "guided", title: "Meditation for Anxiety — Yoga With Adriene", instructor: "Adriene Mishler", youtubeId: "4pLUleLdwY4", minutes: 15, level: "Beginner", description: "Adriene's signature meditation for anxiety — a simple, at-home practice to provide relief from stress and energetic imbalance.", tags: ["Anxiety", "Adriene", "Mindfulness"], moods: ["Calm me down"] },
  { id: "1.5", categoryId: "guided", title: "Guided Inner Refuge of Calm", instructor: "Tara Brach, PhD", youtubeId: "dmprAiDCtVw", minutes: 18, level: "All Levels", description: "Buddhist teacher and clinical psychologist Tara Brach guides you to your inner sanctuary — a timeless presence beyond fear.", tags: ["TaraBrach", "Presence", "Buddhist"], moods: ["Calm me down", "Heal & restore"] },
  { id: "1.6", categoryId: "guided", title: "Release All Negative Energy — Short Practice", instructor: "Jason Stephenson", youtubeId: "G1TD2uVdotM", minutes: 10, level: "All Levels", description: "4M subscribers trust Jason Stephenson. This short practice clears negative energy and returns you to inner calm in just 10 minutes.", tags: ["Energy", "Release", "Jason"], moods: ["Calm me down", "Heal & restore"] },
  { id: "1.7", categoryId: "guided", title: "Loving-Kindness Meditation (Metta)", instructor: "Kristin Neff, PhD", youtubeId: "9cxtdiXBQDk", minutes: 15, level: "All Levels", description: "Self-compassion researcher Dr. Kristin Neff leads this classic loving-kindness practice — generating goodwill for yourself and all beings.", tags: ["LovingKindness", "Compassion", "Metta"], moods: ["Heal & restore"] },
  { id: "1.8", categoryId: "guided", title: "Self-Love & Self-Care Guided Meditation", instructor: "The Mindful Movement", youtubeId: "yJ3SzoZ4QUI", minutes: 25, level: "All Levels", description: "\"How you love yourself is how you teach others to love you.\" A 25-minute session that strengthens your relationship with yourself.", tags: ["SelfLove", "SelfCare", "Healing"], moods: ["Heal & restore"] },

  // 2 — Sleep
  { id: "2.1", categoryId: "sleep", title: "Guided Meditation for Sleep & Anxiety Release", instructor: "Jason Stephenson", youtubeId: "acLUWBuAvms", minutes: 45, level: "All Levels", description: "Let go of anxiety, fear, and worry before sleep. A soothing visualization that dissolves the tension of the day.", tags: ["Sleep", "Anxiety", "NightTime"], moods: ["Help me sleep"] },
  { id: "2.2", categoryId: "sleep", title: "Deep Sleep Meditation — Calm an Overactive Mind", instructor: "The Mindful Movement", youtubeId: "jcprGTfC4vc", minutes: 50, level: "All Levels", description: "Let go of the overthinking, overactive mind and enjoy healing, restful sleep — perfect when thoughts are spinning.", tags: ["Sleep", "Overthinking", "Rest"], moods: ["Help me sleep"] },
  { id: "2.3", categoryId: "sleep", title: "Guided Meditation for Anxiety & Sleep", instructor: "Declutter The Mind", youtubeId: "Ar1WRzIsrO4", minutes: 20, level: "Beginner", description: "If anxiety is keeping you from sleep, this meditation talks you down and manages the thoughts keeping you awake.", tags: ["Sleep", "Anxiety", "Beginners"], moods: ["Help me sleep", "Calm me down"] },
  { id: "2.4", categoryId: "sleep", title: "Fall Asleep Fast — 10 Minute Deep Sleep", instructor: "Great Meditation", youtubeId: "DALgnIwogq4", minutes: 10, level: "Beginner", description: "Designed to have you asleep before it finishes. A progressive full-body relaxation guided at the perfect pace.", tags: ["Sleep", "Fast", "Insomnia"], moods: ["Help me sleep"] },
  { id: "2.5", categoryId: "sleep", title: "Sleep — 10 Minute Body Scan for Sleep", instructor: "The Honest Guys", youtubeId: "mcirj0OmRHE", minutes: 10, level: "All Levels", description: "A gentle guided body scan that feels like peace and ease settling over you. Designed to guide you into sleep before it ends.", tags: ["Sleep", "BodyScan", "Insomnia"], moods: ["Help me sleep"] },
  { id: "2.6", categoryId: "sleep", title: "Yoga Nidra for Sleep — Deep Yogic Sleep", instructor: "Lizzy Hill", youtubeId: "jSlK7xQKb8M", minutes: 30, level: "All Levels", description: "12M+ views. The most-loved Yoga Nidra on YouTube. Prepare to surrender completely.", tags: ["YogaNidra", "Sleep", "Restoration"], moods: ["Help me sleep", "Heal & restore"] },
  { id: "2.7", categoryId: "sleep", title: "Guided Sleep Meditation to Release Anxiety", instructor: "The Mindful Movement", youtubeId: "uaeaKlnBVH0", minutes: 45, level: "All Levels", description: "A soothing sleep meditation designed to release anxiety and quiet your mind, gently guiding you into deep, restorative rest.", tags: ["Sleep", "AnxietyRelease", "Gentle"], moods: ["Help me sleep"] },
  { id: "2.8", categoryId: "sleep", title: "10 Minutes Before You Sleep — Guided Meditation", instructor: "Goodful", youtubeId: "be3O5in2XpQ", minutes: 10, level: "Beginner", description: "A soothing pre-sleep practice with soft cues to dissolve the weight of the day in just 10 minutes.", tags: ["Sleep", "Beginner", "NightRoutine"], moods: ["Help me sleep"] },

  // 3 — Morning
  { id: "3.1", categoryId: "morning", title: "Morning Yoga Flow — Wake Up & Energize", instructor: "Yoga With Adriene", youtubeId: "oBu-pQG6sTY", minutes: 20, level: "All Levels", description: "Adriene's beloved morning routine — a moving meditation that lovingly wakes up the mind and body.", tags: ["Morning", "Yoga", "Energy"], moods: ["Energize me"] },
  { id: "3.2", categoryId: "morning", title: "5-Minute Morning Meditation (Body Scan)", instructor: "Adriene Mishler", youtubeId: "OD5JfUVnCMU", minutes: 5, level: "Beginner", description: "An easy-paced morning body scan — releasing tension in fingers, jaw, and forehead, then carrying that calm into your day.", tags: ["Morning", "5Min", "BodyScan"], moods: ["Energize me", "Calm me down"] },
  { id: "3.3", categoryId: "morning", title: "Guided Meditation for Anxiety & Stress — 10 Min Reset", instructor: "The Mindful Movement", youtubeId: "xBs32ZlipHo", minutes: 10, level: "All Levels", description: "Pause, breathe, and completely reset. Designed to release morning stress and set a clear intention for the day.", tags: ["Morning", "Reset", "Stress"], moods: ["Calm me down", "Focus"] },
  { id: "3.4", categoryId: "morning", title: "Morning Yoga for Beginners", instructor: "SarahBethYoga", youtubeId: "VaoV1PrYft4", minutes: 10, level: "Beginner", description: "27.8M views. One of YouTube's most loved morning yoga videos — gentle, effective, and perfect for beginners.", tags: ["Morning", "Beginner", "Yoga"], moods: ["Energize me"] },
  { id: "3.5", categoryId: "morning", title: "Morning Yin Yoga — Gentle Full Body Stretch", instructor: "Yoga With Kassandra", youtubeId: "sTANio_2E0Q", minutes: 20, level: "Beginner", description: "A gentle morning yin practice to ease into the day — deep, slow stretches that open the body and settle the mind.", tags: ["Morning", "Yin", "Stretch"], moods: ["Energize me", "Heal & restore"] },
  { id: "3.6", categoryId: "morning", title: "Boho Morning Flow — Yoga in Stunning Nature", instructor: "Boho Beautiful", youtubeId: "KSXhNYABBDk", minutes: 15, level: "All Levels", description: "Start your morning in a breathtaking outdoor setting — a flowing vinyasa sequence filmed in stunning natural beauty.", tags: ["Morning", "Flow", "Nature"], moods: ["Energize me"] },

  // 4 — Yoga
  { id: "4.1", categoryId: "yoga", title: "Yoga for Anxiety & Stress", instructor: "Yoga With Adriene", youtubeId: "hJbRpHZr_d0", minutes: 27, level: "All Levels", description: "One of Adriene's most beloved practices — calming breathwork and soothing poses that move you from darkness into light.", tags: ["Yoga", "Anxiety", "Stress"], moods: ["Calm me down"] },
  { id: "4.2", categoryId: "yoga", title: "20 Minute Yoga for Anxiety", instructor: "Yoga With Adriene", youtubeId: "bJJWArRfKa0", minutes: 20, level: "Beginner", description: "Hands-free and low to the ground — a simple, accessible practice to find peace and support from within.", tags: ["Yoga", "Anxiety", "Gentle"], moods: ["Calm me down"] },
  { id: "4.3", categoryId: "yoga", title: "Yoga For Complete Beginners", instructor: "Yoga With Adriene", youtubeId: "v7AYKMP6rOE", minutes: 20, level: "Beginner", description: "51M+ views. The most watched beginners yoga video on YouTube. Start here if you're new to yoga.", tags: ["Yoga", "Beginner", "Foundation"], moods: ["Energize me"] },
  { id: "4.4", categoryId: "yoga", title: "Yin Yoga for Deep Relaxation", instructor: "Yoga With Kassandra", youtubeId: "bLW5EBZGcgM", minutes: 30, level: "All Levels", description: "Slow, deep, restorative. Held postures that release fascia, open the hips, and calm the nervous system completely.", tags: ["Yin", "Deep", "Restorative"], moods: ["Heal & restore", "Calm me down"] },
  { id: "4.5", categoryId: "yoga", title: "Yoga for Healing & Meditation", instructor: "Yoga With Adriene", youtubeId: "3Vy-GZ-MjEQ", minutes: 28, level: "All Levels", description: "Slow down, cultivate balance, and connect. A juicy session that opens the hips and uses breath to find release.", tags: ["Healing", "Yoga", "Hips"], moods: ["Heal & restore"] },
  { id: "4.6", categoryId: "yoga", title: "Restorative Yoga for Stress Relief", instructor: "Boho Beautiful", youtubeId: "5d6TriLBQmE", minutes: 10, level: "Beginner", description: "Ten minutes of heaven. A guided meditation woven into a gentle yoga flow, filmed in breathtaking natural surroundings.", tags: ["Restorative", "Stress", "Nature"], moods: ["Calm me down", "Heal & restore"] },
  { id: "4.7", categoryId: "yoga", title: "10 Minute Body Scan Meditation", instructor: "Yoga With Kassandra", youtubeId: "uqtIqCKjkuc", minutes: 10, level: "Beginner", description: "A complete body scan for tuning in, releasing tension, and arriving fully in your body.", tags: ["BodyScan", "Yoga", "Movement"], moods: ["Calm me down"] },
  { id: "4.8", categoryId: "yoga", title: "Yoga for Bedtime — Wind Down & Release", instructor: "Yoga With Adriene", youtubeId: "BiWDGFPMDkk", minutes: 12, level: "Beginner", description: "Simple, slow, and easy — this bedtime practice releases tension and prepares body and mind for deep rest.", tags: ["Bedtime", "Yoga", "Sleep"], moods: ["Help me sleep"] },

  // 5 — Breathwork
  { id: "5.1", categoryId: "breathwork", title: "How To Reset Your Vagus Nerve — 5 Min Guided Breathing", instructor: "The Breath Effect", youtubeId: "QtltKD73vfI", minutes: 5, level: "Beginner", description: "Reset your nervous system and find calmness in just 5 minutes. Use this when feeling stressed or anxious.", tags: ["Vagus", "Breathwork", "NervousSystem"], moods: ["Calm me down"] },
  { id: "5.2", categoryId: "breathwork", title: "5-Minute Humming Meditation — Vagus Nerve Reset", instructor: "Soothe & Sound", youtubeId: "2fYcbJ4IOn8", minutes: 5, level: "Beginner", description: "Humming directly activates vagal tone through internal vibration — the most accessible vagus nerve reset.", tags: ["Humming", "Vagus", "Anxiety"], moods: ["Calm me down"] },
  { id: "5.3", categoryId: "breathwork", title: "4-7-8 Breathing Method — 5 Min Nervous System Regulation", instructor: "Breathe With Sandy", youtubeId: "m7d2s0CEFPI", minutes: 5, level: "Beginner", description: "Dr. Andrew Weil's 4-7-8 technique, one of the most powerful natural tranquilizers for the nervous system.", tags: ["478", "Breathwork", "Sleep"], moods: ["Help me sleep", "Calm me down"] },
  { id: "5.4", categoryId: "breathwork", title: "Vagus Nerve Reset — 432Hz Singing Bowl Sound Bath", instructor: "Jonathan Berger", youtubeId: "PBBjjimtxpo", minutes: 20, level: "All Levels", description: "A 432Hz quartz singing bowl sound bath for deep vagal regulation and parasympathetic activation.", tags: ["432Hz", "SoundBath", "Vagus"], moods: ["Heal & restore"] },
  { id: "5.5", categoryId: "breathwork", title: "5 Ways to Stimulate Your Vagus Nerve", instructor: "Cleveland Clinic", youtubeId: "Y_8mR_SsUnw", minutes: 7, level: "All Levels", description: "Cleveland Clinic's official guide to activating your vagus nerve — science-backed techniques for regulation.", tags: ["Vagus", "Science", "ClevelandClinic"], moods: ["Focus", "Calm me down"] },
  { id: "5.6", categoryId: "breathwork", title: "10-Minute Vagus Nerve Daily Activation", instructor: "Body & Mind Wellness", youtubeId: "zUx5kLFyx-M", minutes: 10, level: "All Levels", description: "A 10-minute daily activation routine supporting digestion, heart rate, and mood regulation.", tags: ["Vagus", "Daily", "Nervous"], moods: ["Heal & restore"] },

  // 6 — Healing
  { id: "6.1", categoryId: "healing", title: "Vagus Nerve Reset — Release Stored Trauma", instructor: "The Embody Lab", youtubeId: "eFV0FfMc_uo", minutes: 21, level: "All Levels", description: "A somatic vagus nerve reset that restores the social engagement state — based on Polyvagal Theory.", tags: ["Trauma", "Somatic", "Healing"], moods: ["Heal & restore"] },
  { id: "6.2", categoryId: "healing", title: "10-Minute Loving Kindness for Self-Love", instructor: "Declutter The Mind", youtubeId: "DmsDBC036z8", minutes: 10, level: "All Levels", description: "We often send loving-kindness to others but rarely to ourselves. This practice sends compassion inward first.", tags: ["SelfLove", "Metta", "Compassion"], moods: ["Heal & restore"] },
  { id: "6.3", categoryId: "healing", title: "Guided Body Scan for Healing", instructor: "Michael Sealey", youtubeId: "i7xGF8F28zo", minutes: 22, level: "All Levels", description: "A full-body scan for positive mind and body healing, promoting cellular healing and emotional restoration.", tags: ["Healing", "BodyScan", "Restoration"], moods: ["Heal & restore"] },
  { id: "6.4", categoryId: "healing", title: "Meditation for Depression & Inner Peace", instructor: "Great Meditation", youtubeId: "tuPW7oOudVc", minutes: 10, level: "Beginner", description: "A gentle, supportive practice for days when you're feeling low. No effort required — just rest here.", tags: ["Depression", "Healing", "Peace"], moods: ["Heal & restore", "Calm me down"] },
  { id: "6.5", categoryId: "healing", title: "Compassionate Body Scan — Self-Compassion", instructor: "Ruttenberg Center", youtubeId: "OS_iqfGjL78", minutes: 20, level: "All Levels", description: "A compassionate, therapeutic body scan guided with warmth — helping you inhabit your body with kindness.", tags: ["Compassion", "Healing", "BodyScan"], moods: ["Heal & restore"] },
  { id: "6.6", categoryId: "healing", title: "Yoga Nidra — Deep Emotional Healing", instructor: "Jason Stephenson", youtubeId: "4vzqmcuVgTc", minutes: 60, level: "All Levels", description: "A complete yogic sleep session for deep relaxation and emotional restoration — perfect for weekends.", tags: ["YogaNidra", "Healing", "Deep"], moods: ["Heal & restore", "Help me sleep"] },
  { id: "6.7", categoryId: "healing", title: "Mindfulness Presence Practice", instructor: "Tara Brach, PhD", youtubeId: "dmprAiDCtVw", minutes: 18, level: "All Levels", description: "A deeply healing presence practice drawing on Buddhist wisdom and psychology to connect you with what's alive now.", tags: ["TaraBrach", "Presence", "Healing"], moods: ["Heal & restore", "Calm me down"] },

  // 7 — Focus
  { id: "7.1", categoryId: "focus", title: "10-Min Mindfulness Meditation for Focus", instructor: "Declutter The Mind", youtubeId: "xBs32ZlipHo", minutes: 10, level: "All Levels", description: "A clean, practical mindfulness session for anchoring attention and entering a state of clear, productive focus.", tags: ["Focus", "Mindfulness", "Clarity"], moods: ["Focus"] },
  { id: "7.2", categoryId: "focus", title: "Yoga for Brain & Body — Complete Integration", instructor: "Yoga With Adriene", youtubeId: "3Vy-GZ-MjEQ", minutes: 21, level: "All Levels", description: "The ultimate brain-and-body yoga practice — a gentle, integrative session through intentional breath and movement.", tags: ["Focus", "Brain", "Yoga"], moods: ["Focus", "Energize me"] },
  { id: "7.3", categoryId: "focus", title: "Vagus Nerve Science — Why It's Crucial for Focus", instructor: "Science of Wellbeing", youtubeId: "WmhCqjc6-Mo", minutes: 12, level: "All Levels", description: "Science-backed techniques for immediate nervous system and focus regulation through vagal stimulation.", tags: ["Focus", "Science", "Vagus"], moods: ["Focus"] },
  { id: "7.4", categoryId: "focus", title: "Mindful Body Scan — Integrative Health", instructor: "UMN Integrative Health", youtubeId: "t2UFYXYQHjA", minutes: 15, level: "All Levels", description: "A clinical mindfulness body scan — research-backed practice for building sustained attention and mental clarity.", tags: ["Focus", "Clinical", "MBSR"], moods: ["Focus"] },
  { id: "7.5", categoryId: "focus", title: "Release All Stress — Mental Reset in 10 Minutes", instructor: "Jason Stephenson", youtubeId: "G1TD2uVdotM", minutes: 10, level: "All Levels", description: "A mental reset between tasks — transform your energy and prepare your mind for clear, focused work.", tags: ["Reset", "Focus", "Clarity"], moods: ["Focus", "Calm me down"] },

  // 8 — Quick & Beginner
  { id: "8.1", categoryId: "quick", title: "5-Minute Meditation for Beginners", instructor: "Headspace", youtubeId: "inpok4MKVLM", minutes: 5, level: "Beginner", description: "Headspace's most popular beginner meditation — a calm voice and proven technique for a perfect daily anchor.", tags: ["Beginner", "5Min", "Headspace"], moods: ["Calm me down"] },
  { id: "8.2", categoryId: "quick", title: "Yoga for Anxiety — Low to the Ground", instructor: "Yoga With Adriene", youtubeId: "bJJWArRfKa0", minutes: 20, level: "Beginner", description: "Hands-free and low to the ground — easy enough for complete beginners. The perfect first yoga class for anxiety.", tags: ["Beginner", "Yoga", "Anxiety"], moods: ["Calm me down"] },
  { id: "8.3", categoryId: "quick", title: "5-Minute Vagus Nerve Reset — Breathing", instructor: "The Breath Effect", youtubeId: "QtltKD73vfI", minutes: 5, level: "Beginner", description: "Feeling overwhelmed? This 5-minute nervous system reset requires nothing but breath.", tags: ["Beginner", "5Min", "QuickCalm"], moods: ["Calm me down"] },
  { id: "8.4", categoryId: "quick", title: "10-Minute Loving Kindness for Self", instructor: "Declutter The Mind", youtubeId: "DmsDBC036z8", minutes: 10, level: "Beginner", description: "The perfect introduction to self-compassion — short, accessible, and remarkably effective.", tags: ["Beginner", "SelfLove", "Quick"], moods: ["Heal & restore"] },
  { id: "8.5", categoryId: "quick", title: "Morning 5-Min Meditation — Wake Up Right", instructor: "Goodful", youtubeId: "OD5JfUVnCMU", minutes: 5, level: "Beginner", description: "A quick morning meditation with soft visuals, gentle voice, and a clean breathing practice.", tags: ["Beginner", "Morning", "5Min"], moods: ["Energize me"] },
  { id: "8.6", categoryId: "quick", title: "10-Min Beginner Body Scan Before Sleep", instructor: "The Honest Guys", youtubeId: "mcirj0OmRHE", minutes: 10, level: "Beginner", description: "The simplest and most effective sleep practice — ideal for anyone trying sleep meditation for the first time.", tags: ["Beginner", "Sleep", "BodyScan"], moods: ["Help me sleep"] },
];

export const FEATURED_VIDEO_ID = "1.1";

export const DURATION_FILTERS = ["All", "Under 10 min", "10–20 min", "20–45 min", "45+ min"] as const;
export type DurationFilter = (typeof DURATION_FILTERS)[number];

export const LEVEL_FILTERS: (VideoLevel | "All Levels")[] = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export const MOOD_FILTERS: VideoMood[] = ["Calm me down", "Energize me", "Help me sleep", "Heal & restore", "Focus"];

export const INSTRUCTORS = [
  { name: "Yoga With Adriene", subs: "13M", specialty: "Yoga for Mental Health" },
  { name: "The Mindful Movement", subs: "800K", specialty: "Embodied Meditation" },
  { name: "Jason Stephenson", subs: "4.9M", specialty: "Sleep & Relaxation" },
  { name: "Tara Brach", subs: "1M", specialty: "Buddhist Mindfulness" },
  { name: "Yoga With Kassandra", subs: "2.6M", specialty: "Yin & Restorative" },
  { name: "Declutter The Mind", subs: "356K", specialty: "Practical Mindfulness" },
  { name: "Cleveland Clinic", subs: "Official", specialty: "Science-Backed Wellness" },
  { name: "Boho Beautiful", subs: "2.3M", specialty: "Yoga in Nature" },
];

export const thumbUrl = (id: string, quality: "maxresdefault" | "hqdefault" = "maxresdefault") =>
  `https://img.youtube.com/vi/${id}/${quality}.jpg`;

export const embedUrl = (id: string, autoplay = true) =>
  `https://www.youtube.com/embed/${id}?${autoplay ? "autoplay=1&" : ""}rel=0&modestbranding=1&iv_load_policy=3&color=white`;

export function matchesDuration(v: LibraryVideo, f: DurationFilter) {
  switch (f) {
    case "Under 10 min": return v.minutes < 10;
    case "10–20 min": return v.minutes >= 10 && v.minutes <= 20;
    case "20–45 min": return v.minutes > 20 && v.minutes <= 45;
    case "45+ min": return v.minutes > 45;
    default: return true;
  }
}
