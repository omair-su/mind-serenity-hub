// Morning & Evening Ritual Pack — 7 days of habit-stacking templates.
import type { MiniProgram } from "./types";

const HERO_FALLBACK = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const POSTER_FALLBACK = "/src/assets/video-library-hero-poster.jpg";

export const RITUAL_PACK: MiniProgram = {
  id: "ritual-pack",
  title: "Morning & Evening Ritual Pack",
  tagline: "Seven days of habit-stacking templates",
  description:
    "Bookend your day with two short, sacred rituals. Each day teaches a five-minute morning anchor and a five-minute evening close, with habit-stacking templates you can keep for life.",
  category: "Habits · Daily Rituals",
  heroVideoSlot: "ritual-pack-hero",
  videoBackdrop: HERO_FALLBACK,
  posterUrl: POSTER_FALLBACK,
  freeDays: 1,
  voice: "sarah",
  days: [
    {
      day: 1,
      title: "The Two Anchors",
      duration: "6 min",
      technique: "Morning + evening pairing",
      whyItWorks:
        "Habit research shows that bookending the day with two short anchors trains the brain to organize the in-between hours around them, raising overall consistency.",
      practice: `Welcome. The whole program rests on one idea. Two anchors. One in the morning. One in the evening. Five minutes each. Every day.

The morning anchor declares the day open. The evening anchor declares it closed.

Your morning anchor this week: sunlight, water, three breaths, one intention.

Within thirty minutes of waking, step outside or to a bright window for one minute. Drink a glass of water. Take three slow breaths. Say one sentence about the kind of day you want.

Your evening anchor this week: dim lights, gratitude, three breaths, one release.

Within ninety minutes of bed, dim every light in your space. Say one thing you are grateful for. Take three slow breaths. Say one thing you are setting down before sleep.

Practice the morning anchor right now if it is morning. The evening anchor if it is evening. Either way, you have already begun.`,
    },
    {
      day: 2,
      title: "Habit-Stacking the Morning",
      duration: "7 min",
      technique: "Anchor + small stack",
      whyItWorks:
        "Stacking a new habit immediately after an existing one uses the existing habit's neural cue as a free trigger, raising follow-through dramatically.",
      practice: `Day two. Today we stack.

Your existing morning habit is the anchor. Brushing teeth. Making coffee. Feeding the pet. Whichever happens reliably already.

Today, stack one new small habit immediately after the anchor. Just one.

The formula: after I [anchor], I will [new habit] for [tiny duration].

Examples. After I brush my teeth, I will stretch for sixty seconds. After I pour coffee, I will name one intention for the day out loud. After I feed the dog, I will write three things I am grateful for.

Choose one stack right now. Say it out loud three times.

After I ___, I will ___.

After I ___, I will ___.

After I ___, I will ___.

That is the stack. Tomorrow morning, run it. Notice how the anchor pulls the new habit along.`,
    },
    {
      day: 3,
      title: "Evening Wind-Down Stack",
      duration: "7 min",
      technique: "Sleep-aligned stacking",
      whyItWorks:
        "Pre-sleep habits stacked onto a reliable evening cue gently train the circadian system to expect sleep, shortening sleep-onset time.",
      practice: `Day three. Today, the evening stack.

Your evening anchor might be turning off the last work device. Putting children to bed. Locking the front door. Brushing teeth.

Stack a small wind-down habit immediately after it.

Examples. After I lock the door, I will dim every light. After I brush my teeth, I will write tomorrow's three priorities. After I put down my phone, I will read one paragraph of a paper book.

Choose one stack right now. Say it three times.

After I ___, I will ___.

Then add one second mini-habit on top, only after the first becomes automatic.

A good evening stack is the difference between sleep that restores and sleep that surrenders to a tired body. Build it carefully.`,
    },
    {
      day: 4,
      title: "The Sacred Five Minutes",
      duration: "5 min",
      technique: "Pure ritual",
      whyItWorks:
        "Designating five minutes a day as untouchable creates psychological permission to fully arrive, instead of squeezing self-care between obligations.",
      practice: `Day four. Today, five minutes that belong to no one but you.

Choose the time. Morning, evening, or middle of the day. Five minutes. Same time each day. Sacred.

In those five minutes, you do not produce. You do not respond. You do not solve.

You may sit. Walk. Stretch. Pray. Stare out a window. Breathe. Drink tea.

You may not scroll. You may not check messages. You may not multitask.

Today, take the five minutes now. Set a timer. Sit. Do nothing useful.

When the timer ends, notice what happened. Five minutes is a short time. It is also enough to rebuild a relationship with yourself.`,
    },
    {
      day: 5,
      title: "Transitions as Rituals",
      duration: "6 min",
      technique: "Threshold practices",
      whyItWorks:
        "Marking transitions between roles — work to home, parent to partner, public to private — with a brief ritual sharply reduces emotional bleed-over and burnout.",
      practice: `Day five. Today we turn transitions into rituals.

A transition is any moment you change roles. Closing the laptop. Pulling into the driveway. Stepping into a meeting. Picking up the child.

Without ritual, the previous role bleeds into the next. With ritual, it does not.

The threshold practice. At every transition this week, do three things.

One. One slow breath.

Two. One word for what you are leaving.

Three. One word for what you are entering.

Example. At the front door coming home. Breath. Word: work. Word: home.

Practice it now. Imagine a transition you will face today. Breath. Leaving word. Entering word.

Do this at every threshold this week. Watch how cleanly the roles separate. Watch how your presence sharpens.`,
    },
    {
      day: 6,
      title: "Weekly Review Ritual",
      duration: "10 min",
      technique: "Sunday-evening anchor",
      whyItWorks:
        "A short weekly review smooths the Sunday-anxiety curve and gives the brain a clear container for the coming week's intentions.",
      practice: `Day six. Today, the weekly review. Best done Sunday evening, but any consistent day works.

Sit with a notebook. Light a candle if you like. Three slow breaths.

Answer these in writing, briefly.

What went well this week? Three things.

What did not go well? One or two things, without drama.

What did I learn?

What is the single most important thing for the coming week?

Where do I need rest, support, or help?

Close the notebook. Three more slow breaths. Say: the week is closed. The week is honored. The next week is open.

This ten minutes is the most powerful productivity practice you will ever build. It costs almost nothing. It saves hours of weekday confusion.`,
    },
    {
      day: 7,
      title: "Your Custom Ritual Pack",
      duration: "10 min",
      technique: "Design your own",
      whyItWorks:
        "Rituals that are self-designed have higher long-term adherence than borrowed templates, because they fit the texture of your real life.",
      practice: `Day seven. Today you design your custom pack.

Take a notebook. Three slow breaths.

Write three short ritual templates, in this format.

Morning anchor. After I ___, I will ___, and ___. Five minutes total.

Evening anchor. After I ___, I will ___, and ___. Five minutes total.

Sacred five. At ___ o'clock each day, I will give myself five minutes of nothing useful.

Also write your transition ritual, in one sentence. At every threshold, I will: one breath, one leaving word, one entering word.

And your weekly review day. Every ___, I will sit for ten minutes and review.

That is your pack. Pin it somewhere visible.

The point of rituals is not to make life perfect. The point is to make life yours. Welcome to a more deliberate week, every week, for the rest of your life.`,
    },
  ],
};
