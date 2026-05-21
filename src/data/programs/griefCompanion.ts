// Grief Companion — 7 days of guided letters and meditations.
import type { MiniProgram } from "./types";

const HERO_FALLBACK = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const POSTER_FALLBACK = "/src/assets/video-library-hero-poster.jpg";

export const GRIEF_COMPANION: MiniProgram = {
  id: "grief-companion",
  title: "Grief Companion",
  tagline: "Seven days of letters and meditation",
  description:
    "Grief is not a problem to solve. It is a presence to befriend. Seven days of guided letters and gentle meditations to help you turn toward loss with compassion, in your own time, at your own pace.",
  category: "Emotional · Grief",
  heroVideoSlot: "grief-companion-hero",
  videoBackdrop: HERO_FALLBACK,
  posterUrl: POSTER_FALLBACK,
  freeDays: 1,
  voice: "matilda",
  days: [
    {
      day: 1,
      title: "A Letter to Your Grief",
      duration: "8 min",
      technique: "Guided letter + soft breath",
      whyItWorks:
        "Naming grief on the page externalizes the weight, while gentle breath signals safety so the nervous system can stay present with hard feelings.",
      practice: `Welcome. There is no agenda here. No fixing. Only company, for whatever you are carrying.

Begin by placing one hand over your heart. Take three slow breaths. Inhale. Long exhale. Inhale. Long exhale. Inhale. Long exhale.

In a moment, you will write a short letter. Not to the person you lost, but to your grief itself. As if it were a guest who has moved into your home. You might begin with: Dear Grief, I see you have arrived. I do not know how long you will stay.

Pause this audio. Write for five minutes, or speak it aloud if writing is too much. Say whatever is true.

When you return, take three more breaths. Place a hand on your heart. Whisper: I am still here. Grief is here too. We are not enemies.

That is enough for today.`,
    },
    {
      day: 2,
      title: "The Body Remembers",
      duration: "10 min",
      technique: "Soft body scan",
      whyItWorks:
        "Grief lives in the body as much as the mind. A slow, permission-based scan releases held tension without demanding emotional expression.",
      practice: `Day two. Today we listen to the body.

Lie down or sit comfortably. Close your eyes. Three slow breaths.

We will move through the body, slowly. Not searching for anything. Just visiting.

The crown of the head. The forehead. The eyes, soft. The jaw. Notice if grief lives here. You do not need to move it.

The throat. The chest. Many people hold grief here, like a small stone. Just notice. Breathe around it.

The arms. The hands.

The belly. The lower back.

The hips. The thighs. The knees. The feet.

Now scan the whole body at once. If there is a place that wants attention, place a hand there. Breathe.

You do not need to release anything. You only need to be with what is there. That is the whole practice.`,
    },
    {
      day: 3,
      title: "A Letter to Who You Lost",
      duration: "12 min",
      technique: "Guided letter",
      whyItWorks:
        "Continuing-bonds research shows that addressing the lost person directly supports integration of grief, not avoidance of it.",
      practice: `Day three. Today, a letter to the one you lost.

Find a quiet place. Pen and paper, or your phone. Three slow breaths.

Begin the letter: Dear ____, there are things I have not said.

Tell them what you would tell them now. What you wish they knew. What you miss. What you are grateful for. What is hard. What you are doing without them.

There are no rules. The letter does not need to be coherent. It does not need to end well. It only needs to be true.

Pause this audio. Write for as long as you need. Ten minutes, or one.

When you return, hold the letter to your heart for three breaths. You may keep it, burn it, bury it, send it. Whatever feels right.

You spoke. They heard you. The bond continues.`,
    },
    {
      day: 4,
      title: "Permission to Laugh",
      duration: "7 min",
      technique: "Memory + breath",
      whyItWorks:
        "Recalling joyful memories alongside grief integrates the full relationship and dissolves the guilt of fleeting happiness.",
      practice: `Day four. Today is for the joy that lived alongside the loss.

Three slow breaths. Soft eyes.

Bring to mind a moment with the person, or in the time, you are grieving. Not a goodbye. A laugh. A meal. A small ordinary moment of love.

See the colors of that moment. Hear the sounds. Smell the smells. Notice what they were wearing. Notice your own body in that moment.

Stay in the memory for as long as feels good. Smile if a smile arrives. Cry if tears arrive. Both are welcome.

Now place a hand on your heart and say: Joy and grief can sit together. I am allowed both.

Take three closing breaths.

You do not betray the loss by smiling. You honor it.`,
    },
    {
      day: 5,
      title: "The Things They Would Want You to Have",
      duration: "9 min",
      technique: "Compassionate imagination",
      whyItWorks:
        "Imagining the loved one's wishes for you reframes the relationship from absence to ongoing blessing, easing self-judgment.",
      practice: `Day five. Today we listen for what they would want for you.

Three slow breaths. Imagine the person you lost sitting across from you, or beside you, in a place that feels safe.

They are well. They are at peace. They look at you with the kind of love only they could give.

In your mind, ask them: What do you wish for me now?

Listen. The answer may come as a word. An image. A feeling. There are no wrong answers.

It may be: Rest. Or: Live fully. Or: Forgive yourself. Or: Eat. Or: Call your friend.

Whatever you hear, write it down when this practice ends, or simply repeat it three times silently.

Three closing breaths. Their love does not end with their absence. It continues, through you.`,
    },
    {
      day: 6,
      title: "A Letter to Your Future Self",
      duration: "10 min",
      technique: "Guided letter forward",
      whyItWorks:
        "Writing to your future self builds a thread of hope and continuity, which research links to lower rates of complicated grief.",
      practice: `Day six. Today we write forward.

Three slow breaths. Place your hands on your heart.

You will write a letter to yourself, one year from today.

Tell that future self what you are carrying right now. What is hard. What is heavy. What you cannot yet imagine surviving.

Then tell them: I made it. I am the one writing to you because I lived through this season. Here is what I learned. Here is what I hope you remember.

Write whatever comes. Pause this audio. Take fifteen minutes.

When you return, fold the letter. Put it somewhere you will find it again, or set a reminder to reread it in one year.

You have just sent a thread across time. Grief is not the end of your story. You are still writing it.`,
    },
    {
      day: 7,
      title: "A Closing Ritual",
      duration: "12 min",
      technique: "Candle ritual + meditation",
      whyItWorks:
        "Rituals create a container for transition, signaling to the deeper mind that one chapter has been honored, even as grief continues.",
      practice: `Day seven. The last day of this short companionship. Grief does not end. But this seven days can have a beautiful close.

If you can, light a candle. If not, imagine one.

Sit before it. Three slow breaths.

Bring to mind everything you have written and felt this week. Let it gather, like fog around the flame.

Say aloud, or in your heart: This week, I let grief walk with me. I did not push it away. I did not let it consume me. I made room.

Say their name, if it feels right. Once. Twice. Three times.

Take three slow breaths with the candle.

When you are ready, blow out the candle, or close the imagined one. Say: The light continues. So do I.

You are not alone. Whenever you need this companion, return. The letters are still here. The practice is still here. So is your heart.`,
    },
  ],
};
