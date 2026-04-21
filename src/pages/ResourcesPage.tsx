import { useState } from "react";
import type { ReactNode } from "react";
import AppLayout from "@/components/AppLayout";
import {
  FolderOpen, BookOpen, FlaskConical, Wrench, Download, Star, X,
  FileText, ChevronRight
} from "lucide-react";

interface ResourceItem {
  title: string;
  desc: string;
  type: string;
  content: string;
}

interface Section {
  title: string;
  icon: typeof BookOpen;
  items: ResourceItem[];
}

const sections: Section[] = [
  {
    title: "Beginner's Guide",
    icon: BookOpen,
    items: [
      {
        title: "Meditation 101: What, Why, How",
        desc: "Everything you need to know to start",
        type: "Article",
        content: `# Meditation 101: What, Why, and How

## What Is Meditation?

At its simplest, meditation is the practice of training your attention. Just as you would train a muscle through repetition, meditation trains the mind to focus, to notice when it has wandered, and to gently return — again and again.

That's it. No magic. No emptying the mind. No levitating. Just the radical act of paying attention on purpose.

## What Meditation Is NOT

**Common Myths — Debunked:**

❌ Meditation is NOT stopping your thoughts — thoughts are natural. The practice is noticing them.

❌ Meditation is NOT a religious requirement — it is a secular mental skill used worldwide.

❌ Meditation is NOT becoming emotionless — it increases emotional intelligence, not numbness.

❌ Meditation is NOT only for calm people — it is especially powerful for anxious, busy minds.

❌ Meditation is NOT sitting in pain — comfort matters. Use a chair. Adjust your position.

❌ Meditation is NOT instant bliss — benefits build gradually over days and weeks.

## Why Meditate?

The research is clear. After 8 weeks of daily meditation:

- The amygdala (fear center) measurably shrinks
- The prefrontal cortex (decision-making) measurably thickens  
- Cortisol (the stress hormone) drops significantly
- Heart Rate Variability (resilience biomarker) increases
- Sleep quality improves
- Emotional regulation improves

These are structural changes to the brain — visible on MRI scans. Not placebo. Not wishful thinking. Biology.

## How to Meditate: The Core Technique

**Step 1:** Sit comfortably. Chair, cushion, floor — it doesn't matter. Spine upright, not rigid.

**Step 2:** Close your eyes or soften your gaze downward.

**Step 3:** Bring your attention to the sensation of breathing. The feeling of air entering the nostrils, the rise and fall of the chest.

**Step 4:** When your mind wanders (and it will — this is normal), gently notice that it has wandered and bring your attention back to the breath.

**Step 5:** Repeat step 4 for the duration of the session.

That's the entire practice. Every variation and advanced technique builds on this foundation.

## The One Thing to Remember

Every time you notice your mind has wandered and you bring it back — that is one mental rep. That is the moment of training. A session with 100 distractions and 100 returns is not a failure. It's 100 reps.`,
      },
      {
        title: "Setting Up Your Space",
        desc: "Create the perfect meditation environment",
        type: "Guide",
        content: `# Setting Up Your Perfect Meditation Space

You do not need a dedicated meditation room, expensive cushions, or incense. You need a place where you can sit relatively undisturbed for 10–30 minutes. That's it.

## The Essentials

**A Quiet Spot:** A corner of your bedroom, living room, or even your car (parked) will work. Perfect silence is not required — just minimal interruptions.

**Comfortable Seating:** Choose one:
- A straight-backed chair with feet flat on the floor
- The edge of your bed
- A cushion or folded blanket on the floor
- Cross-legged is optional, not required

**Your body should feel supported, not strained.** If your back hurts after 5 minutes, adjust your position.

**Phone on Silent:** This is non-negotiable. Notifications are the enemy of presence. Set a timer if needed, but silence everything else.

## Optional Enhancements

**Soft Lighting:** Natural light or warm lamp light. Avoid harsh overhead fluorescents.

**Consistent Temperature:** Slightly warm is better than cold — your body relaxes more easily.

**A Blanket or Shawl:** Body temperature drops during deep relaxation.

**Headphones:** Recommended for guided sessions. Noise-canceling dramatically improves focus.

**A Candle or Diffuser:** Optional. Scent can become a powerful anchor for your practice — your brain associates the smell with meditation and enters a calmer state faster over time.

## What to Wear

Loose, comfortable clothing. Remove your shoes. Loosen any tight waistbands. You should feel completely unrestricted.

## The "Sacred Space" Mindset

Even if your meditation spot is the corner of your studio apartment, you can create a psychological sacred space:

1. Return to the same spot every day — consistency builds the anchor
2. Begin each session with one deep breath as a signal to begin
3. Keep the space clean and uncluttered — a tidy environment settles the mind

Your meditation space doesn't need to be beautiful. It needs to be consistent.`,
      },
      {
        title: "Common Mistakes to Avoid",
        desc: "Don't fall into these traps",
        type: "Checklist",
        content: `# 12 Common Meditation Mistakes (And How to Fix Them)

## ❌ Mistake 1: Trying to Stop Your Thoughts
**The fix:** The goal is to observe thoughts without engaging them. When a thought appears, notice it ("thinking") and return your attention. No thought should be fought — only witnessed.

## ❌ Mistake 2: Quitting When the Mind Wanders
**The fix:** Mind wandering is the practice, not a failure. Each return is one rep of mental training. A wandering mind during meditation is like a muscle during a workout — it's the resistance that makes you stronger.

## ❌ Mistake 3: Meditating in an Uncomfortable Position
**The fix:** Comfort is essential. If physical discomfort is pulling your attention away, adjust immediately. The body should be as settled as possible so the mind can be the focus.

## ❌ Mistake 4: Skipping Sessions Then Trying to "Catch Up"
**The fix:** Missed one day? Pick up where you left off. Don't try to do two sessions to compensate. Consistency over perfection — always.

## ❌ Mistake 5: Expecting Immediate Results
**The fix:** Think of it like a new gym routine. You don't see results after Day 1. Week 3-4 is when most meditators first notice a consistent difference.

## ❌ Mistake 6: Meditating With Your Phone Nearby
**The fix:** Phone on airplane mode. Even the possibility of a notification is enough to prevent deep focus.

## ❌ Mistake 7: Falling Asleep (and Quitting Because of It)
**The fix:** If you repeatedly fall asleep, meditate sitting upright, practice in the morning, or keep sessions shorter. Note: occasional sleep is fine — your body needed it.

## ❌ Mistake 8: Judging Your Sessions as "Good" or "Bad"
**The fix:** There are no bad sessions. Every session is practice. A difficult session where the mind wanders repeatedly is building discipline. A peaceful session is building calm. Both work.

## ❌ Mistake 9: Meditating Inconsistently
**The fix:** Same time, same place, every day. Consistency is more important than duration.

## ❌ Mistake 10: Breathing Too Forcefully
**The fix:** During most meditation, breathing should be natural — not controlled or exaggerated. Just observe the breath as it is.

## ❌ Mistake 11: Giving Up During "The Resistance Phase"
**The fix:** Around Days 8-14, many meditators hit a wall. The novelty has worn off and the habit isn't established yet. This is the most important phase. Push through it.

## ❌ Mistake 12: Meditating Only When You Feel Like It
**The fix:** Meditation is a practice, like brushing your teeth. Do it whether you feel like it or not. Motivation follows action — not the other way around.`,
      },
      {
        title: "What to Expect Week by Week",
        desc: "Your transformation timeline",
        type: "Guide",
        content: `# Your Week-by-Week Transformation Timeline

## Week 1: Foundation (Days 1–7)
**What you'll feel:** Novelty. Curiosity. Perhaps some frustration when the mind wanders.

**What's happening in your brain:** The dorsolateral prefrontal cortex begins strengthening its connections. Your default mode network (the "mind wandering" network) starts showing reduced activity during focused tasks.

**What to expect:** Sessions will feel short one day and long the next. Some days will feel peaceful; others restless. Both are equally valid.

**Key milestone:** Completing 7 consecutive days builds the initial habit foundation.

---

## Week 2: Deepening (Days 8–14)
**What you'll feel:** Many meditators hit "the wall" this week. The novelty has worn off. The habit isn't solid yet. This is the most important week.

**What's happening:** Your amygdala begins responding less dramatically to stressors. That "2-second pause" between trigger and reaction starts appearing.

**What to expect:** You may feel like you're "going backwards." Your mind may seem busier than ever. This is normal — you're simply becoming more aware of what was always there.

**Key milestone:** If you make it through Week 2, you will complete the program. This is the breaking point.

---

## Week 3: Transformation (Days 15–21)
**What you'll feel:** Real changes. Better sleep. Calmer mornings. Moments of unexpected presence.

**What's happening:** Cortisol levels begin measurably dropping. The anterior cingulate cortex (attention regulation) strengthens significantly.

**What to expect:** People around you may notice changes before you do. Your reactivity to small stresses decreases. You might catch yourself pausing before responding in difficult conversations.

**Key milestone:** You now have a genuine practice. You are no longer building — you are deepening.

---

## Week 4: Integration (Days 22–30)
**What you'll feel:** Ownership. This is your practice now, not a challenge you're completing.

**What's happening:** Gray matter density is increasing in the hippocampus. The insula (self-awareness center) has thickened measurably.

**What to expect:** The question shifts from "can I do this?" to "how do I continue this forever?" Planning your post-30-day practice is the natural focus.

**Key milestone:** Completing Day 30. You have joined a small group of people who have done what most people only intend to do.`,
      },
      {
        title: "FAQ for New Meditators",
        desc: "Answers to everything beginners ask",
        type: "FAQ",
        content: `# Frequently Asked Questions for New Meditators

**Q: Do I need to sit cross-legged?**
No. Absolutely not. Sit in whatever position allows your spine to be upright and your body to feel supported. A chair is perfect.

**Q: How do I know if I'm doing it right?**
If you sat down, closed your eyes, directed your attention to your breath, and returned when it wandered — you did it right. There is no other standard.

**Q: My mind is too busy to meditate. Am I hopeless?**
The opposite is true. A busy mind is not an obstacle to meditation — it's the perfect training ground. Every return from distraction is exactly one rep of mental training.

**Q: Should I use music?**
For most practices in this program, silence or very soft ambient music is best. Music with lyrics activates the language centers of the brain and competes with your attention. Nature sounds, binaural beats, or silence work well.

**Q: What if I fall asleep?**
For most sessions, sit upright rather than lying down. If you fall asleep despite this, your body clearly needed the rest. Practice in the morning when you're more alert.

**Q: How long until it starts working?**
Most people notice subtle changes in Week 2. Significant, consistent changes by Week 4. Measurable brain changes are visible on MRI after 8 weeks of daily practice.

**Q: Can I meditate more than once per day?**
Yes. The program calls for one session per day, but additional brief sessions (even 3-5 minutes) are beneficial.

**Q: Is it normal to feel emotional during meditation?**
Yes, completely. When we slow down and stop distracting ourselves, emotions that have been suppressed sometimes rise to the surface. This is healthy processing, not a problem.

**Q: What if I miss a day?**
Simply pick up where you left off. No guilt. No starting over. Missing a day is human. Quitting because you missed a day is the only failure.

**Q: Do I need a teacher?**
Not to get significant benefits from this program. The 30-day structured sequence gives you everything you need for a foundational practice.`,
      },
    ],
  },
  {
    title: "Technique Deep-Dives",
    icon: FlaskConical,
    items: [
      {
        title: "Mastering Breath Awareness",
        desc: "Complete guide to breath meditation",
        type: "PDF",
        content: `# Mastering Breath Awareness Meditation

## Why the Breath?

Of all possible meditation anchors — sounds, sensations, visualizations — the breath is the most powerful for one reason: it is always with you. You can practice anywhere, anytime, without any equipment.

Additionally, the breath is the only automatic function of the body you can consciously regulate. When you influence your breath, you directly communicate with your autonomic nervous system — signaling safety to your nervous system when you slow it down.

## The Anatomy of Breath Awareness

**What you're noticing:**

1. **The nostrils:** Cool air entering, warm air leaving. The slight touch of air on the upper lip.
2. **The chest:** The gentle rise and expansion on inhale. The settling on exhale.
3. **The belly:** The softer rise of the diaphragm breathing. The fall on exhale.
4. **The pause:** The brief, natural pause between inhale and exhale.

Choose one location and stay with it. Consistency within a session matters more than which location you choose.

## Common Breath Awareness Techniques

### 1. Simple Observation
Just watch the breath without altering it. No forced deep breathing. Let the breath breathe itself. You are the observer, not the controller.

### 2. Counting
Inhale: 1. Exhale: 2. Inhale: 3. Exhale: 4. Count to 10, then restart. When you lose count, start again at 1. This is not failure — it's the practice.

### 3. Noting
As you breathe, gently note "rising" on the inhale and "falling" on the exhale. This occupies just enough of the verbal mind to reduce random thinking.

### 4. Body-Breath Connection
Feel where the breath touches your body — the movement of your ribcage, the shift in your belly. Keep your attention in the physical sensation rather than the concept of breathing.

## Troubleshooting

**Problem:** I keep forgetting to breathe naturally and start controlling it.
**Solution:** This is extremely common. When you notice you've taken over the breath, simply let it go again. Imagine the breath like a wave — you can observe it without pushing it.

**Problem:** I can't feel the breath at all.
**Solution:** Try placing one hand on your belly and one on your chest. Feel the movement under your hands. Start there.

**Problem:** I become anxious when focusing on breath.
**Solution:** Shift your anchor to sounds or to the feeling of your hands in your lap. Return to breath practice gradually.`,
      },
      {
        title: "Body Scan Complete Guide",
        desc: "Head-to-toe progressive awareness",
        type: "PDF",
        content: `# The Complete Body Scan Guide

## What Is Body Scan Meditation?

Body scan meditation is the practice of systematically moving your attention through each part of your body — noticing sensations without judgment or the need to change anything.

It is one of the most well-researched meditation practices. A 2019 meta-analysis of 30 studies found body scan meditation reduces:
- Chronic pain perception by 27%
- Physical symptoms of stress by 40%
- Psychological distress by 33%

## How to Do a Complete Body Scan

**Duration:** 20–45 minutes for a full scan. 10 minutes for an abbreviated version.

**Position:** Lying on your back with arms slightly away from your body, palms facing upward. You may also do this seated.

### The Sequence

1. **Start at the toes of your left foot.** Simply notice any sensations — warmth, coolness, pressure, tingling, or numbness. Don't try to relax the area. Just notice.

2. **Move to the sole of the foot**, the heel, the top of the foot, the ankle.

3. **Move up the left leg:** calf, shin, knee, thigh, hip.

4. **Repeat on the right side:** toes, foot, ankle, lower leg, knee, thigh, hip.

5. **Lower back and pelvis:** notice contact with the surface, any tension or ease.

6. **Belly:** rising and falling with breath.

7. **Chest and ribcage:** expansion on inhale, settling on exhale.

8. **Left arm:** hand, fingers, palm, wrist, forearm, elbow, upper arm, shoulder.

9. **Right arm:** same sequence.

10. **Neck and throat:** notice any held tension.

11. **Face:** jaw (often tightly held), cheeks, eyes, forehead. Let everything soften.

12. **Top of the head:** imagine breathing through the crown.

## What to Do With Uncomfortable Sensations

When you find discomfort — tension, pain, restriction — breathe into it rather than away from it. Imagine your breath flowing directly to that area. Often, this alone releases significant tension. If pain is severe, simply move past it.

## Abbreviated 10-Minute Body Scan

Divide the body into five zones: feet/legs, pelvis/lower back, belly/chest, arms/shoulders, head/neck. Spend 2 minutes with each zone.`,
      },
      {
        title: "Loving-Kindness Practice Manual",
        desc: "Cultivating compassion step by step",
        type: "PDF",
        content: `# Loving-Kindness (Metta) Practice Manual

## What Is Loving-Kindness Meditation?

Loving-kindness (Metta in Pali) is a practice of deliberately cultivating warm, caring feelings toward yourself and others — beginning with yourself and gradually expanding to include all beings.

## The Science

This is one of the most researched contemplative practices. Documented benefits include:

- **Increased positive emotions** that persist beyond the session (Fredrickson et al., 2008)
- **Reduced implicit bias** — measurable decreases in unconscious prejudice
- **Decreased symptoms of depression and PTSD**
- **Increased feelings of social connection and reduced loneliness**
- **Reduced self-criticism** and improvements in self-compassion
- **Activation of the brain's empathy circuits** (insula and cingulate cortex)

## The Traditional Phrases

The practice uses simple phrases directed first to yourself, then outward:

*"May I be happy.*
*May I be healthy.*
*May I be safe.*
*May I live with ease."*

## The Practice: Step by Step

### Phase 1: Self (5 minutes)
Begin with yourself. This is often the most difficult phase — many people find it harder to send kindness to themselves than to others.

Sit comfortably. Close your eyes. Place your hand on your heart. Imagine yourself as you are right now — struggling, imperfect, doing your best. Say the phrases slowly:

"May I be happy. May I be healthy. May I be safe. May I live with ease."

Feel any warmth this generates. If you feel nothing at first, that's fine. The practice is the intention, not the feeling.

### Phase 2: A Beloved Person (5 minutes)
Think of someone you love easily — a close friend, a pet, a grandparent. Visualize their face. Feel the warmth you have for them naturally. Direct the phrases to them:

"May you be happy. May you be healthy. May you be safe. May you live with ease."

### Phase 3: A Neutral Person (5 minutes)
Think of someone you neither like nor dislike — perhaps a cashier, a neighbor, someone you see regularly but don't know. Extend the same phrases to them.

### Phase 4: A Difficult Person (5 minutes)
This is the most challenging phase. Think of someone with whom you have difficulty. You are not condoning their behavior. You are choosing to include them in your circle of care — which ultimately frees you from resentment.

### Phase 5: All Beings (5 minutes)
Expand your awareness to include all living beings — in your city, your country, the world:

"May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease."`,
      },
      {
        title: "Visualization Techniques",
        desc: "Using mental imagery for healing",
        type: "PDF",
        content: `# Visualization Meditation Techniques

## The Power of Mental Imagery

The brain cannot fully distinguish between a vividly imagined experience and a real one. When you visualize yourself in a peaceful mountain meadow, many of the same neural circuits activate as if you were actually there.

This is not mysticism. It's neuroscience.

Research from Cleveland Clinic found that people who vividly imagined performing physical exercises increased muscle strength by 13.5% — without moving. Mental rehearsal activates the motor cortex. Visualization activates the visual and emotional centers.

## Core Techniques

### 1. Safe Place Visualization

Create a mental sanctuary — a place (real or imagined) where you feel completely safe, peaceful, and at ease. It might be a childhood home, a beach, a forest clearing, or a completely invented world.

**The practice:** Close your eyes. Begin to construct this place slowly. What do you see? What do you hear? What do you smell? What does the air feel like? Ground the visualization in all five senses. Return here whenever you need peace.

### 2. Healing Light Visualization

With eyes closed, imagine a warm, golden light above your head. With each inhale, this light flows into your body — starting at the crown, moving through your face, neck, chest, arms, belly, legs. With each exhale, grey or dark energy flows out through your feet.

Continue until your entire body feels filled with golden warmth.

### 3. Future Self Visualization

Imagine yourself 5 years from now — having completed this program, having maintained a consistent practice, living with the calm, presence, and resilience you're cultivating now.

See this future self in detail. What do they look like? How do they carry themselves? How do they respond to stress? Step into this future self and inhabit their body. Feel what it feels like to already be this person.

### 4. Mountain Meditation

Visualize a great mountain. Solid. Unmovable. Ancient. Seasons change around it — storms, blizzards, heat waves. The mountain remains. Identify with the mountain. You are not the weather of your emotions. You are the mountain beneath them.`,
      },
      {
        title: "Movement Meditation Guide",
        desc: "Walking and mindful movement practices",
        type: "PDF",
        content: `# Movement Meditation: Walking & Mindful Movement

## Why Movement Meditation Matters

Not all meditation is still. For many people — especially those with anxiety, ADHD, or difficulty sitting — movement meditation is more accessible and equally powerful.

The key distinction: in movement meditation, the movement itself becomes the object of attention. You are not exercising. You are meditating while moving.

## Walking Meditation

### The Basic Practice

Find a stretch of path 10–30 steps long. Indoors or outdoors both work.

**Step 1:** Stand still. Feel your feet on the ground. Notice the distribution of weight.

**Step 2:** Begin walking very slowly — much slower than normal. With each step, notice:
- The lifting of the heel
- The swing of the leg
- The placement of the foot
- The shifting of weight

**Step 3:** You may use labels: "lifting... moving... placing... shifting..."

**Step 4:** When you reach the end of your path, pause. Turn around slowly. Pause again. Continue.

**Duration:** 10–20 minutes.

### Outdoor Walking Meditation
Walk at normal pace but direct attention outward rather than inward. Notice five things you can see, four things you can feel (wind, ground, air temperature, clothing), three things you can hear. Cycling through the senses prevents mind-wandering.

## Body-Based Movements

### Mindful Stretching
Move through gentle stretches very slowly. At each position, pause and breathe for 3-5 breaths. Notice the exact sensation in the muscles being stretched. No rushing, no destination.

### Mindful Yoga
Any yoga practice done with complete attention to sensation — rather than achievement of positions — is meditation. The breath is the anchor; the movement is the object.

## The Principle: Any Activity Can Be Meditation

Washing dishes, cooking, showering — any repetitive activity can become a meditation practice when done with complete present-moment attention. This is how meditation eventually permeates your entire life.`,
      },
    ],
  },
  {
    title: "Science of Meditation",
    icon: FlaskConical,
    items: [
      {
        title: "How Meditation Changes Your Brain",
        desc: "Neuroscience explained simply",
        type: "Article",
        content: `# How Meditation Physically Changes Your Brain

## The Landmark Harvard Study

In 2011, a team at Harvard Medical School led by Dr. Sara Lazar published a study that changed the scientific understanding of meditation forever.

They recruited 16 healthy adults to participate in an 8-week Mindfulness-Based Stress Reduction (MBSR) program. Participants meditated an average of 27 minutes per day. MRI scans were taken before and after.

**The results:**

Measurable, structural brain changes. Not reported subjective experiences — actual changes in gray matter density visible on brain scans.

## The Key Brain Changes

### 1. Hippocampus: Gets Bigger
The hippocampus is critical for learning, memory, and spatial navigation. Chronic stress and cortisol actually shrink the hippocampus over time. Meditation reverses this — increasing gray matter density in this critical region.

**What this means for you:** Better memory. Better learning. More emotional resilience.

### 2. Amygdala: Gets Smaller
The amygdala is your brain's alarm system — the source of fear, anxiety, and the fight-or-flight response. Chronic stress enlarges it, making it more reactive.

Meditation measurably shrinks the amygdala.

**What this means for you:** Smaller reactions to the same stressors. More time between trigger and response. Less anxiety.

### 3. Prefrontal Cortex: Gets Thicker
The prefrontal cortex handles executive function — decision-making, planning, emotional regulation, and impulse control. It literally thickens with meditation practice.

**What this means for you:** Better decisions. More self-control. Clearer thinking under pressure.

### 4. Default Mode Network: Quiets Down
The Default Mode Network (DMN) is the brain's "idle" network — active when you're daydreaming, ruminating, or mind-wandering. In people with depression and anxiety, the DMN is overactive.

Meditation reduces DMN activity.

**What this means for you:** Less rumination. Less obsessive thinking. More present-moment awareness.

## Timeline of Changes

- **1 session:** Reduced cortisol response, temporary mood lift
- **1 week:** Initial improvements in attention and focus
- **4 weeks:** Measurable changes in emotional reactivity
- **8 weeks:** Structural brain changes visible on MRI

The brain changes. The science is clear. You just have to show up.`,
      },
      {
        title: "30 Research Studies Explained",
        desc: "The evidence behind every practice",
        type: "PDF",
        content: `# 30 Foundational Research Studies on Meditation

## Landmark Studies

### 1. Hölzel et al. (2011) — Harvard
*"Mindfulness practice leads to increases in regional brain gray matter density"*

16 participants, 8-week MBSR program. MRI before and after. Measurable increases in gray matter in hippocampus, posterior cingulate, temporoparietal junction. Decrease in amygdala gray matter correlated with reduced stress.

**Finding:** 8 weeks of meditation structurally changes the brain.

---

### 2. Lazar et al. (2005) — Harvard
*"Meditation experience is associated with increased cortical thickness"*

Experienced meditators showed significantly greater cortical thickness in prefrontal cortex and right anterior insula compared to non-meditators.

**Finding:** Long-term meditators have physically different, thicker brains in attention and interoception regions.

---

### 3. Fredrickson et al. (2008) — UNC Chapel Hill
*"Open hearts build lives: positive emotions, induced through loving-kindness meditation, build consequential personal resources"*

202 employees randomized to loving-kindness meditation or waitlist. 7-week study. Meditators showed greater increases in positive emotions, mindfulness, purpose, social support, and decreased illness symptoms.

**Finding:** Loving-kindness meditation creates an upward spiral of positive outcomes.

---

### 4. Goyal et al. (2014) — Johns Hopkins
*"Meditation programs for psychological stress and well-being: a systematic review and meta-analysis"*

47 trials, 3,515 participants. Mindfulness meditation showed moderate evidence for improvement in anxiety, depression, and pain.

**Finding:** The most rigorous meta-analysis confirms meditation's effectiveness for mental health.

---

### 5. Davidson et al. (2003) — UW-Madison
*"Alterations in brain and immune function produced by mindfulness meditation"*

25 meditators vs. 16 controls. After 8 weeks, meditators showed significantly greater left-sided anterior brain activity (linked to positive affect), and stronger antibody response to influenza vaccine.

**Finding:** Meditation improves both psychological state AND immune function.

---

### 6. Pace et al. (2009) — Emory
*Compassion meditation reduces stress-induced immune and behavioral responses*

Loving-kindness meditation reduced neuroendocrine and immune responses to stress.

**Finding:** Compassion practices have measurable physiological anti-stress effects.

---

*Plus 24 additional peer-reviewed studies on: sleep quality, attention span, chronic pain, emotional regulation, blood pressure, telomere length, gut health, creativity, and more — all demonstrating consistent, replicable benefits of regular meditation practice.*`,
      },
      {
        title: "Benefits Timeline",
        desc: "What happens at 1 week, 1 month, 3 months, 1 year",
        type: "Infographic",
        content: `# The Meditation Benefits Timeline

## After 1 Session
- Temporary reduction in cortisol (stress hormone)
- Slight mood lift from dopamine and serotonin release
- 15–22% reduction in self-reported anxiety (measured immediately post-session)
- Temporary improvement in focus and attention span

## After 1 Week (Days 1–7)
- Beginning improvements in sleep onset time
- Reduced response to minor irritants
- Slight improvements in working memory
- Initial formation of the meditation habit pathway in basal ganglia
- Increased awareness of automatic thoughts and patterns

## After 1 Month (Days 8–30)
- Measurable decrease in cortisol levels throughout the day
- Significant improvements in sleep quality (REM duration and sleep efficiency)
- Clear improvements in emotional regulation — longer pause between stimulus and response
- Reduced symptoms of anxiety and depression
- Increased Heart Rate Variability (resilience marker)
- Family and colleagues may notice changes before you do

## After 3 Months
- Amygdala gray matter measurably reduced on MRI
- Hippocampal gray matter measurably increased
- Cortisol levels consistently lower
- Significant reduction in inflammatory markers (CRP, IL-6)
- Substantial improvements in attention span and sustained focus
- Increased compassion and prosocial behavior

## After 1 Year
- Prefrontal cortex measurably thicker
- Long-term reduction in trait anxiety (not just state anxiety)
- Telomere preservation — markers of biological aging slowing
- Substantially reduced reactivity to major stressors
- Meditation becomes as automatic as brushing teeth
- The practice begins to permeate everyday life — not just formal sessions

## After 10+ Years
Long-term meditators studied at Harvard show:
- Significantly younger brain age than non-meditators of same chronological age
- Far less age-related thinning of the cortex
- Exceptional attention stability even into older age`,
      },
      {
        title: "Meditation & Sleep Research",
        desc: "What the science says about sleep",
        type: "Article",
        content: `# Meditation & Sleep: What the Research Actually Shows

## The Sleep Crisis

More than 70 million Americans suffer from chronic sleep disorders. Sleep deprivation costs the US economy $411 billion annually (Rand Corporation, 2016). It is one of the most pervasive health crises of our time.

Meditation is not a cure — but the research on its effects on sleep is genuinely impressive.

## Key Research Findings

### Mindfulness Reduces Insomnia Severity
A 2015 JAMA Internal Medicine study (Ong et al.) randomized 49 adults with chronic insomnia to either mindfulness-based therapy or sleep hygiene education.

The mindfulness group showed:
- Significantly greater reductions in insomnia severity
- Better sleep quality scores
- Less daytime fatigue
- Reduced depression symptoms

### Meditation Increases Melatonin
A study by Harinath et al. (2004) found that regular meditation practice increases circulating melatonin levels — the hormone that regulates your sleep-wake cycle.

This is a direct physiological mechanism: meditation influences your body's hormone production in ways that support sleep.

### Reduces Pre-Sleep Arousal
One of the primary causes of insomnia is "pre-sleep cognitive arousal" — the racing thoughts and worry that prevent sleep onset. Meditation directly targets this mechanism by training the mind to disengage from thought.

After 8 weeks of mindfulness practice, participants showed significantly lower pre-sleep cognitive arousal (Harvey et al., 2015).

## Practical Application

The most effective meditation practices for sleep (in this program):
- **Day 2:** Body Scan Meditation (excellent for releasing physical tension)
- **Day 9:** Progressive Muscle Relaxation
- **Day 25:** Yoga Nidra for Deep Rest
- **Sleep Section:** 8 dedicated sleep practices

**The protocol:** Practice 20–30 minutes before your target sleep time. No screens for 30 minutes after. Use the same practice every night to build a strong neural anchor.`,
      },
    ],
  },
  {
    title: "Practical Guides",
    icon: Wrench,
    items: [
      {
        title: "Meditation for Busy People",
        desc: "Fit practice into any schedule",
        type: "PDF",
        content: `# Meditation for Busy People: A No-Excuses Guide

## The Core Truth

You have time. You're spending it on something else.

The average American adult spends 4.5 hours per day on their smartphone. This 30-day program asks for 15–25 minutes per day. That's not a time problem — it's a priority problem. And this guide is here to help you solve it.

## The Three-Minute Principle

Never say "I don't have time to meditate." Instead, say "I'm going to meditate for 3 minutes right now."

Here's why 3 minutes works:
1. You can always find 3 minutes
2. Once you start, you almost always continue longer
3. 3 minutes still activates the neurological benefits, just with a shorter duration
4. 21 days of 3-minute meditations beats 0 sessions of 30 minutes

## Micro-Meditation Opportunities (Hidden in Your Day)

**Morning:** 5 minutes before checking your phone. This single habit changes the trajectory of your day.

**Commute:** Eyes closed (if passenger) or awareness meditation while driving (eyes open, attending to the present moment, not listening to podcasts).

**Lunch break:** 10 minutes in your car, a conference room, a park bench. A genuine reset for your afternoon.

**Elevator/waiting:** 1–2 minutes of breath awareness. Nobody needs to know.

**Bathroom:** No judgment. 3 minutes of breath focus.

**Before important calls or meetings:** 5 minutes of box breathing transforms your state.

**Evening wind-down:** Replace 15 minutes of phone time with a sleep meditation.

## Habit Stacking: The Most Powerful Approach

Attach your meditation to something you already do without thinking:

- "After my morning coffee → I meditate for 15 minutes"
- "When I sit at my desk → I do 5 minutes of breath awareness"
- "After I brush my teeth at night → I do the sleep meditation"

You never decide to meditate. It just happens as part of a chain that's already automatic.

## Protecting Your Practice

The world will conspire to fill your meditation time. Protect it:

1. Tell people close to you that this is non-negotiable time
2. Set a recurring alarm labeled "Non-Negotiable"
3. Have a "minimum viable session" of 3 minutes for bad days
4. Never negotiate with yourself. Just sit down.`,
      },
      {
        title: "Overcoming Common Obstacles",
        desc: "Solutions for every challenge",
        type: "Guide",
        content: `# Overcoming Every Common Meditation Obstacle

## Obstacle 1: "I Don't Have Time"
**Solution:** See "Meditation for Busy People." The real issue is rarely time — it's priority. Start with 5 minutes attached to an existing habit. When you feel the benefits, time appears.

## Obstacle 2: "My Mind Is Too Busy"
**Solution:** This is a misunderstanding of the practice. A busy mind is not an obstacle. A busy mind gives you more opportunities to practice returning your attention. You're not behind — you're getting more reps.

## Obstacle 3: "I Fall Asleep Every Time"
**Solution:** Meditate sitting upright. Meditate in the morning. Meditate with eyes slightly open. If you still fall asleep, your sleep debt is the priority — address that first.

## Obstacle 4: "I Don't Feel Anything"
**Solution:** Many benefits of meditation are invisible in the moment but show up in your day. You'll notice later that a stressful situation didn't derail you. Or you slept better. Or you snapped less at someone. The practice works even when it doesn't feel like it.

## Obstacle 5: "I Keep Forgetting"
**Solution:** Habit stacking. Put your meditation time on your calendar as a non-negotiable appointment. Use the same cue every day (alarm, specific location, specific time after an existing habit).

## Obstacle 6: "Some Days Feel Worse Than Others"
**Solution:** This is completely normal. Progress in meditation is not linear. A "bad" session where the mind wanders repeatedly is still building the muscle of attention. Consistency matters far more than the quality of individual sessions.

## Obstacle 7: "I Feel Restless or Anxious During Meditation"
**Solution:** Start with shorter sessions (5–10 minutes). Try movement meditation before sitting practice. Use breath counting to give the mind a task. Note: feeling restless during meditation is extremely common and usually passes by Week 2.

## Obstacle 8: "I'm Not Sure If I'm Doing It Right"
**Solution:** If you sat down, directed your attention to your breath, and gently returned when it wandered — you did it right. There is no other standard. Doubt is a normal part of the practice.

## Obstacle 9: "I Missed Several Days"
**Solution:** Pick up where you left off today. Do not restart. Do not try to catch up. Do not punish yourself. Just sit down and do today's practice. The neural pathways you built don't disappear in a few days.

## Obstacle 10: "The Benefits Seem to Disappear"
**Solution:** The "honeymoon phase" (Weeks 1–2) often feels more dramatic than the integration phase (Weeks 3-4). As the calm becomes your baseline, it feels less extraordinary. This is not regression — it's integration.`,
      },
      {
        title: "Building a Lifelong Practice",
        desc: "From 30 days to forever",
        type: "Workbook",
        content: `# Building a Lifelong Meditation Practice

## The Milestone You've Reached

If you've completed 30 days, you belong to a small group of people who have done what most people only intend to do. Research suggests fewer than 5% of people who start a meditation program complete 30 consecutive days.

You are not the same person who started Day 1. Your brain has measurably changed. The question now is: what comes next?

## The Post-30 Day Options

### Option A: Continue the 30-Day Program
Simply repeat it. The second time through, your attention is different. You'll notice things you missed the first time. Many practitioners do this for 90 days, 180 days, or indefinitely.

### Option B: Select Your Core Practices
After 30 days, you know which practices resonate most. Build a personal rotation of 3–5 favorites and cycle through them.

### Option C: Extend and Deepen
Choose 2–3 practices from the program and spend more time with each — 25–45 minutes per session instead of 15–20.

## Designing Your Ongoing Practice

**Answer these questions:**

1. What time of day works best for me consistently?
2. What duration is sustainable daily (even on hard days)?
3. Which 3 practices from the 30 days resonated most deeply?
4. What will I use as my daily anchor (habit stack)?
5. How will I track my ongoing practice?

## The 1-3-10 Framework

**Daily:** 1 session minimum. Non-negotiable.
**Weekly:** 1 longer session (30–60 minutes). Your "deep practice" day.
**Monthly:** 1 review. What's working? What needs adjustment?

## Signs Your Practice Is Working (Beyond How You Feel)

- You pause before reacting in difficult situations
- Sleep quality has stabilized at a higher level
- You notice when you're getting stressed before it overwhelms you
- People in your life comment on changes without you saying anything
- You recover faster from setbacks
- Your inner critic has softened
- You feel more genuine compassion for others

These are the signs. They matter more than how any individual session feels.`,
      },
      {
        title: "Teaching Meditation to Kids",
        desc: "Share the gift with your family",
        type: "Guide",
        content: `# Teaching Meditation to Children

## Why Children Benefit

Children are not too young for meditation. In fact, research from the University of California found that children who practice mindfulness show:
- Improved attention span and academic performance
- Better emotional regulation
- Reduced anxiety and depression symptoms
- Increased prosocial behavior

The earlier a child learns to work with their mind, the more resilient they become.

## Key Differences: Children vs. Adults

**Shorter sessions:** Children need much shorter practice times. Ages 5–7: 1–3 minutes. Ages 8–10: 5 minutes. Ages 11+: 10 minutes.

**More engaging approaches:** Pure breath watching is often too abstract. Use imagery, movement, and stories.

**Language:** Never force or pressure. Frame it as a superpower or a game, not a chore.

**Consistency over perfection:** Even 2 minutes every morning, done consistently, builds real benefits.

## Child-Friendly Techniques

### The Belly Breathing Buddy
Have the child lie down and place a stuffed animal on their belly. "Watch your buddy rise when you breathe in. Watch them sink when you breathe out. Can you make your buddy go as high as possible?"

### Starfish Breathing
Trace the outline of one hand with one finger. Breathe in as the finger goes up each finger. Breathe out as it goes down. Complete the starfish = 5 breaths.

### The Glitter Jar
Fill a jar with water, glitter glue, and glitter. Shake it. "Your mind when you're upset looks like this. Sit quietly and watch what happens." (The glitter settles.) "That's what meditation does — it gives your thoughts time to settle."

### Body Scan for Kids
"Squeeze your toes as hard as you can... and let go. Do they feel different? Now your whole foot..."

## Creating a Family Practice

Practice together. Children model adult behavior. If they see you meditating daily, it becomes normal.
Even 5 minutes of family mindfulness before dinner builds a powerful family ritual.`,
      },
    ],
  },
  {
    title: "Worksheets & Tools",
    icon: Download,
    items: [
      {
        title: "Personal Meditation Plan Template",
        desc: "Design your ongoing practice",
        type: "Template",
        content: `# Personal Meditation Plan Template

## My Practice Profile

**My primary motivation for meditating:**
(e.g., reduce anxiety, sleep better, feel more present with my family)
→ ________________________________

**My current stress level (1-10):** ___
**My current sleep quality (1-10):** ___
**My current focus/attention quality (1-10):** ___

## My Commitment

**I will meditate:** □ Daily □ 5x/week □ Weekdays only

**My practice time:** _______________ (write the exact time)

**My practice location:** _______________

**My anchor habit (what comes before):** _______________

## My Core Practices

**Primary practice (what I'll do most days):**
→ _______________

**Secondary practice (for variety/mood):**
→ _______________

**Emergency practice (when time is short):**
→ Box Breathing — 5 minutes (always available)

## My Minimum Viable Session

When life gets in the way, I commit to at least:
□ 3 minutes □ 5 minutes □ 10 minutes

## My Success Metrics

After 30 more days, I want to notice:

1. _______________
2. _______________
3. _______________

## My Accountability System

**I will track my practice by:** _______________

**My accountability partner (optional):** _______________

**I will review my practice monthly on:** the ___ of each month

## My Personalized Toolkit

From the 30-day program, these practices resonated most:

1. Day ___: _______________ (reason: _______________)
2. Day ___: _______________ (reason: _______________)
3. Day ___: _______________ (reason: _______________)

These are now YOUR practices. Return to them whenever you need to.`,
      },
      {
        title: "Weekly Review Worksheet",
        desc: "Structured weekly reflection",
        type: "Worksheet",
        content: `# Weekly Meditation Review Worksheet

Complete this at the end of each week — ideally Sunday evening.

---

## Week ___: Dates: _______________ to _______________

### Practice Log

| Day | Practiced? | Duration | Practice Used | How It Felt (1-5) |
|-----|-----------|----------|---------------|-------------------|
| Mon | □ Yes □ No | ___ min | ___________ | ___ |
| Tue | □ Yes □ No | ___ min | ___________ | ___ |
| Wed | □ Yes □ No | ___ min | ___________ | ___ |
| Thu | □ Yes □ No | ___ min | ___________ | ___ |
| Fri | □ Yes □ No | ___ min | ___________ | ___ |
| Sat | □ Yes □ No | ___ min | ___________ | ___ |
| Sun | □ Yes □ No | ___ min | ___________ | ___ |

**Total sessions this week:** ___ / 7
**Total minutes:** ___
**Average session feeling:** ___

---

### Reflection Questions

**1. What did I notice most in my practice this week?**

_______________________________________________

**2. What was my biggest obstacle this week?**

_______________________________________________

**3. Where in my life did I notice the effects of my practice?**

_______________________________________________

**4. Which practice resonated most this week?**

_______________________________________________

**5. What do I want to explore or adjust next week?**

_______________________________________________

---

### Life Quality Check-In

Rate each area (1-10) compared to last week:

Sleep quality: ___ → ___ (change: ___)
Stress level: ___ → ___ (change: ___)
Emotional stability: ___ → ___ (change: ___)
Focus and concentration: ___ → ___ (change: ___)
Relationship quality: ___ → ___ (change: ___)

**Overall life satisfaction this week:** ___ / 10

---

### Next Week's Intention

One thing I want to focus on in my practice next week:

_______________________________________________`,
      },
      {
        title: "Goal Setting Guide",
        desc: "Set meaningful meditation goals",
        type: "PDF",
        content: `# Meaningful Goal Setting for Your Meditation Practice

## Why Goals Matter in Meditation

Meditation is paradoxical: you cannot force the benefits, but having clear intention significantly increases the likelihood that you'll practice consistently — which is where the benefits come from.

Effective meditation goals focus on the practice itself (showing up), not outcomes (feeling calm). The outcomes follow inevitably from the practice. The practice is what you can control.

## The Right Kind of Goals

### Process Goals (Effective)
✓ "I will meditate for 15 minutes every morning before checking my phone."
✓ "I will complete all 30 days of the challenge."
✓ "I will do at least 5 minutes on days when I'm too busy for more."

### Outcome Goals (Less Useful)
✗ "I will feel less anxious."
✗ "I will sleep better."
✗ "I will be more patient."

The outcomes will happen. But chasing them directly leads to frustration and assessment during sessions that interfere with the practice.

## The SMART Framework for Meditation Goals

**Specific:** "I will meditate every morning for 15 minutes" — not "I will meditate more."

**Measurable:** Track it. Use the app's tracking features. The visual representation of your streak is powerful.

**Achievable:** Start where you are. If 15 minutes feels impossible, start with 7. Build from there.

**Relevant:** Connect your practice to what matters most to you. Why do you actually want this?

**Time-bound:** The 30-day program provides the perfect time-bound structure. Use it.

## Setting Intention at the Start of Each Session

Before each session, spend 30 seconds setting an intention — not a goal, but a quality of attention:

- "Today I approach my practice with patience."
- "Today I notice sensations without judgment."
- "Today I stay present even when it's uncomfortable."

This intention guides your attention without creating pressure.

## Quarterly Review

Every 90 days, ask yourself:

1. What has changed in my life because of this practice?
2. What has remained challenging?
3. What do I want to explore in the next 90 days?
4. What is my minimum non-negotiable daily practice?`,
      },
      {
        title: "Progress Tracking Sheet",
        desc: "Manual tracking alternative",
        type: "Template",
        content: `# 30-Day Progress Tracking Sheet

Print this and place it somewhere visible — on your refrigerator, bathroom mirror, or desk.

---

## My 30-Day Challenge

**Start Date:** _______________
**End Date:** _______________
**My Daily Practice Time:** _______________

---

## Day-by-Day Tracker

| Day | Date | ✓ Done | Duration | Mood Before (1-5) | Mood After (1-5) | Notes |
|-----|------|--------|----------|-------------------|-----------------|-------|
| 1 | | □ | | | | |
| 2 | | □ | | | | |
| 3 | | □ | | | | |
| 4 | | □ | | | | |
| 5 | | □ | | | | |
| 6 | | □ | | | | |
| 7 | | □ | | | | |
| **WEEK 1 DONE!** | | | Total: ___ min | Avg: | Avg: | |
| 8 | | □ | | | | |
| 9 | | □ | | | | |
| 10 | | □ | | | | |
| 11 | | □ | | | | |
| 12 | | □ | | | | |
| 13 | | □ | | | | |
| 14 | | □ | | | | |
| **WEEK 2 DONE!** | | | Total: ___ min | Avg: | Avg: | |
| 15 | | □ | | | | |
| 16 | | □ | | | | |
| 17 | | □ | | | | |
| 18 | | □ | | | | |
| 19 | | □ | | | | |
| 20 | | □ | | | | |
| 21 | | □ | | | | |
| **WEEK 3 DONE!** | | | Total: ___ min | Avg: | Avg: | |
| 22-30 | | □□□□□□□□□ | | | | |
| **COMPLETE!** 🎉 | | | **TOTAL: ___ min** | | | |

---

## My Transformation Notes

**Beginning (Day 1):** How I feel right now:
_______________

**Midpoint (Day 15):** What I've noticed:
_______________

**Completion (Day 30):** How I've changed:
_______________`,
      },
    ],
  },
  {
    title: "Bonus Content",
    icon: Star,
    items: [
      {
        title: "Advanced Meditation Techniques",
        desc: "Beyond the basics — for after Day 30",
        type: "PDF",
        content: `# Advanced Meditation Techniques

*Recommended after completing the 30-day program.*

## 1. Choiceless Awareness (Open Monitoring)

Unlike focused attention meditation (where you hold attention on one object), choiceless awareness involves resting as an open field of awareness — noticing whatever arises without choosing where to focus.

**The practice:** Sit with eyes softly open or closed. Instead of directing attention, open it. Allow sounds, sensations, thoughts, and feelings to arise and pass through awareness like clouds through a clear sky. You are the sky, not the clouds.

This is a more advanced practice because it requires a stable foundation of focused attention first.

## 2. Non-Dual Awareness (Pure Presence)

This technique asks: "Who is meditating?" Rather than the meditator observing an object of meditation, you inquire into the nature of awareness itself.

Sit quietly. After settling, ask internally: "What is aware right now?" Don't look for an answer — just notice the quality of awareness itself. This points to what some traditions call "pure consciousness" — awareness that is aware of itself.

## 3. Jhana States

In the Theravada Buddhist tradition, deep concentration leads to distinct meditative absorptions called jhanas — states of profound focus, joy, and equanimity that arise when the mind becomes unified.

The path to jhana requires extended, intensive practice (typically 5+ hours daily on retreat). But elements of jhanic quality — a gathering sense of peace and clarity — can appear in shorter sessions with a strong foundation.

## 4. Open Awareness in Daily Life

The ultimate advanced practice is bringing meditative awareness into ordinary activity — not just on the cushion. This is sometimes called "practice off the cushion":

- **Walking:** Full presence in each footfall
- **Conversation:** Listening completely, without planning your response
- **Eating:** Tasting each bite as if for the first time
- **Difficult emotions:** Turning toward rather than away from discomfort

## 5. Retreat Practice

Even one day of intensive practice (6–8 hours of meditation) transforms your relationship with your mind in ways that weeks of daily practice cannot. Consider:
- A local one-day silent retreat
- A weekend at a meditation center
- A self-directed at-home retreat day`,
      },
      {
        title: "Starting a Meditation Group",
        desc: "Build community around practice",
        type: "Guide",
        content: `# How to Start a Meditation Group

## Why Group Practice Matters

Research consistently shows that group meditation has benefits beyond solo practice:
- Social accountability dramatically increases consistency
- The collective energy of a group supports deeper focus
- Shared experience normalizes struggles
- Teaching others deepens your own understanding

## Starting Small

Begin with 3–5 people. Larger groups have more scheduling challenges.

**Who to invite:**
- People already interested in meditation
- People dealing with stress, anxiety, or sleep issues
- Friends or colleagues who've expressed curiosity about mindfulness
- Family members

## The Basic Format (60 minutes)

**0–10 min:** Arrival, brief check-in (one word about how each person is feeling)

**10–35 min:** Guided meditation (25 minutes). One person guides, following a script from the 30-day program.

**35–55 min:** Sharing circle. Each person shares one observation from the session — not what they "should" have experienced, but what they actually noticed.

**55–60 min:** Close with a collective breath. Same time next week.

## Rotating Leadership

After the first few weeks, rotate who guides the meditation. Guidelines:
- Use the scripts from the program verbatim at first
- Speak slowly. Pause often. Silence is valuable.
- You don't need to be an expert to guide a group — you just need to have done the practice

## Online Groups

Video call groups work beautifully. All participants mute themselves during the meditation. Timer shared by the host. Breakout rooms for smaller sharing circles.

## The Long View

A meditation group, once established, becomes one of the most valuable resources in your life. Monthly or weekly — whatever is sustainable. Even two people practicing together consistently is a community.`,
      },
      {
        title: "Recommended Reading List",
        desc: "Curated books and resources",
        type: "PDF",
        content: `# Willow Vibes™ Recommended Reading & Resources

## Foundational Books

### For Beginners
**"Wherever You Go, There You Are"** — Jon Kabat-Zinn
The classic introduction to mindfulness. Accessible, warm, and deeply practical. Start here.

**"The Miracle of Mindfulness"** — Thich Nhat Hanh
A small, beautiful book. Less technique-focused, more philosophy. Perfect companion to the 30-day practice.

**"10% Happier"** — Dan Harris
A skeptic's journey into meditation. Funny, relatable, and honest about the challenges.

### For the Scientifically Curious
**"Why Buddhism Is True"** — Robert Wright
A rigorous examination of what evolutionary psychology and neuroscience tell us about meditation. Exceptional.

**"Altered Traits"** — Daniel Goleman & Richard Davidson
The definitive scientific review of meditation research. Separates hype from hard evidence. Essential reading.

**"The Mindful Brain"** — Daniel Siegel
The neuroscience of mindfulness for serious readers. Dense but rewarding.

### For Advanced Practitioners
**"The Mind Illuminated"** — Culadasa (John Yates)
The most comprehensive secular meditation manual ever written. Maps all stages of practice. For serious practitioners.

**"Waking Up"** — Sam Harris
A secular exploration of consciousness, self, and the deepest insights that meditation can reveal.

## Apps (Complement to Your Practice)

**Insight Timer:** The world's largest free meditation library. 100,000+ guided practices.

**Oak:** Simple, elegant. Best free breathwork timer.

## Scientific Resources

**PubMed.gov:** Search "mindfulness meditation" for the latest research.

**Greater Good Science Center** (greatergood.berkeley.edu): Science-based resources on mindfulness, compassion, and well-being.

**Center for Healthy Minds** (centerhealthyminds.org): Richard Davidson's research center at UW-Madison.`,
      },
    ],
  },
];

const typeColors: Record<string, string> = {
  PDF: "bg-destructive/10 text-destructive border-destructive/20",
  Article: "bg-primary/10 text-primary border-primary/20",
  Guide: "bg-gold/10 text-gold border-gold/20",
  Checklist: "bg-accent text-accent-foreground border-border",
  FAQ: "bg-secondary text-foreground border-border",
  Infographic: "bg-sage/20 text-foreground border-sage/30",
  Workbook: "bg-gold/10 text-gold border-gold/20",
  Template: "bg-primary/10 text-primary border-primary/20",
  Worksheet: "bg-accent text-accent-foreground border-border",
};

function parseMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="font-display text-2xl font-bold text-foreground mt-2 mb-4">{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="font-display text-lg font-semibold text-foreground mt-6 mb-2 text-primary">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="font-display text-base font-semibold text-foreground mt-4 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-border my-4" />);
    } else if (line.startsWith("- ") || line.startsWith("✓ ") || line.startsWith("✗ ") || line.startsWith("❌ ") || (line.startsWith("**") && line.includes(":**"))) {
      elements.push(
        <div key={i} className="flex gap-2 items-start mb-1">
          <span className="text-primary mt-1 flex-shrink-0 text-xs">•</span>
          <p className="font-body text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/^[-✓✗❌]\s/, "").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") }} />
        </div>
      );
    } else if (line.match(/^\*\s/)) {
      elements.push(
        <div key={i} className="flex gap-2 items-start mb-1">
          <span className="text-primary mt-1 flex-shrink-0">•</span>
          <p className="font-body text-sm text-foreground leading-relaxed">{line.slice(2)}</p>
        </div>
      );
    } else if (line.startsWith("|")) {
      // Table - just render as code block
      elements.push(<p key={i} className="font-mono text-xs text-muted-foreground">{line}</p>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="font-body text-sm text-foreground leading-relaxed mb-2"
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>") }}
        />
      );
    }
    i++;
  }
  return elements;
}

const sectionGradients: Record<string, { card: string; icon: string; iconColor: string }> = {
  "Beginner's Guide": { card: "from-[hsl(var(--sage))]/15 to-[hsl(var(--sage-light))]/30", icon: "from-[hsl(var(--forest))]/15 to-[hsl(var(--sage-dark))]/20", iconColor: "text-[hsl(var(--forest))]" },
  "Technique Deep-Dives": { card: "from-[hsl(var(--forest-mid))]/10 to-[hsl(var(--sage-light))]/30", icon: "from-[hsl(var(--forest-mid))]/20 to-[hsl(var(--forest))]/15", iconColor: "text-[hsl(var(--forest-mid))]" },
  "The Science of Mind": { card: "from-[hsl(var(--forest-deep))]/10 to-[hsl(var(--sage-light))]/30", icon: "from-[hsl(var(--forest-deep))]/20 to-[hsl(var(--forest))]/15", iconColor: "text-[hsl(var(--forest-deep))]" },
  "Tools & Worksheets": { card: "from-[hsl(var(--gold))]/10 to-[hsl(var(--gold-light))]/20", icon: "from-[hsl(var(--gold))]/20 to-[hsl(var(--gold-dark))]/15", iconColor: "text-[hsl(var(--gold-dark))]" },
};

export default function ResourcesPage() {
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Editorial hero */}
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-10 sm:px-10">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            background: "radial-gradient(circle at 80% 20%, hsl(var(--gold) / 0.4) 0%, transparent 50%)"
          }} />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
                <FolderOpen className="w-3 h-3" /> Resources
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[hsl(var(--cream))] leading-[1.05]">The reading room</h1>
              <p className="mt-2 font-body text-sm text-[hsl(var(--cream))]/70 max-w-md">Click any card to read the full guide, article, or worksheet.</p>
            </div>
          </div>
        </div>

        {sections.map(section => {
          const sg = sectionGradients[section.title] || sectionGradients["Beginner's Guide"];
          return (
          <div key={section.title}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sg.icon} flex items-center justify-center`}>
                <section.icon className={`w-4 h-4 ${sg.iconColor}`} />
              </div>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.items.map(item => (
                <button
                  key={item.title}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-gradient-to-br ${sg.card} rounded-2xl border border-border/50 p-5 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left group`}
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <p className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${typeColors[item.type] || "bg-secondary text-muted-foreground border-border"}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground">{item.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-body text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Read now</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          );
        })}
      </div>

      {/* Content Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setSelectedItem(null)}
        >
          <div className="bg-card rounded-3xl border border-border shadow-elevated w-full max-w-2xl my-8 flex flex-col max-h-[85vh]">
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-border flex-shrink-0">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border ${typeColors[selectedItem.type] || "bg-secondary border-border"}`}>
                    {selectedItem.type}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">{selectedItem.title}</h2>
                <p className="text-sm font-body text-muted-foreground mt-0.5">{selectedItem.desc}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-9 h-9 rounded-xl bg-secondary hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose-sm max-w-none">
                {parseMarkdown(selectedItem.content)}
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-border flex-shrink-0 flex justify-between items-center">
              <p className="text-xs font-body text-muted-foreground">Willow Vibes™ Premium Content</p>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-body font-medium hover:bg-primary/90 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
