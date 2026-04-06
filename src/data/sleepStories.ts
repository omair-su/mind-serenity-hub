export interface SleepStory {
  id: string;
  title: string;
  icon: string;
  category: string;
  duration: number;
  description: string;
  narrator: string;
  paragraphs: string[];
}

export const sleepStoryCategories = [
  { id: "nature", name: "Nature Journeys", icon: "🌿" },
  { id: "fantasy", name: "Enchanted Worlds", icon: "✨" },
  { id: "travel", name: "Gentle Travels", icon: "🗺️" },
  { id: "cozy", name: "Cozy Comforts", icon: "🛋️" },
];

export const sleepStories: SleepStory[] = [
  {
    id: "lavender-fields",
    title: "The Lavender Fields of Provence",
    icon: "💜",
    category: "nature",
    duration: 15,
    description: "Wander through endless lavender fields in the French countryside as the sun sets golden over rolling hills.",
    narrator: "Willow",
    paragraphs: [
      "You arrive at a small stone cottage on the edge of Provence. The air is warm and fragrant, carrying the unmistakable scent of lavender. Rows upon rows of purple stretch before you, reaching toward the horizon like a violet sea.",
      "You step onto a narrow path between the rows. Each step releases more of that calming fragrance. The lavender bushes reach your waist, and as you walk, your fingers trail through the soft purple flowers.",
      "The sun is beginning its descent, painting the sky in shades of peach and rose. A gentle breeze sweeps across the field, and the lavender sways in unison, creating waves of purple that ripple toward the distant hills.",
      "You find a wooden bench beneath an old olive tree at the field's center. You sit down, and the world grows quieter. The buzzing of bees becomes a soft hum. The breeze whispers through the tree's silver leaves.",
      "From here, you can see the entire valley. A small village with terracotta roofs nestles in the distance. Smoke curls lazily from a chimney. Someone is preparing dinner. The world feels safe and unhurried.",
      "The sky deepens to violet, matching the fields below. The first star appears — Venus, bright and steady. You feel your body growing heavy on the bench, the warmth of the day still radiating from the stone beneath you.",
      "Your eyes grow heavy. The lavender scent wraps around you like a blanket. The gentle hum of the field becomes your lullaby. There is nowhere else you need to be. Nothing else you need to do.",
      "The stars multiply above you. The lavender fields blur into a soft purple mist. You are drifting now, carried by the fragrance and the warmth and the perfect stillness of this place. Sleep comes easily here, in the lavender fields of Provence."
    ]
  },
  {
    id: "northern-lights",
    title: "Under the Northern Lights",
    icon: "🌌",
    category: "nature",
    duration: 18,
    description: "Lie beneath the aurora borealis in a cozy cabin in the Arctic wilderness.",
    narrator: "Willow",
    paragraphs: [
      "The cabin is warm. A fire crackles in the stone hearth, casting dancing shadows on the wooden walls. Outside, the world is white and silent — a vast Arctic landscape under a darkening sky.",
      "You wrap yourself in a thick wool blanket and step onto the cabin's porch. The cold air is crisp and clean, filling your lungs with freshness. Snow covers everything in soft, undulating curves.",
      "And then it begins. A faint green glow appears on the northern horizon. It pulses gently, like the earth is breathing light.",
      "The green deepens and begins to move — slowly at first, then with growing confidence. Ribbons of emerald light dance across the sky, twisting and folding like silk in an invisible wind.",
      "Purple appears next, weaving between the green. Then hints of pink and blue. The entire sky becomes a canvas of light, painting and repainting itself in colors you've never seen before.",
      "You lie back on a pile of fur blankets on the porch, perfectly warm despite the cold. The lights dance directly above you now, as if performing just for you. Silent. Magical. Ancient.",
      "The Sami people called this the fox fire — the tail of a celestial fox brushing across the sky. You can almost see it: a great silver fox, running through the stars, its tail leaving trails of light.",
      "Your eyes follow the lights as they slow and soften. The green becomes a gentle wash, like watercolor on dark paper. The fire inside the cabin crackles steadily. The blankets are warm around you.",
      "The aurora whispers its ancient lullaby in light instead of sound. You feel yourself dissolving into the sky, becoming part of the lights, floating weightlessly among the stars. Sleep takes you gently, wrapped in the aurora's glow."
    ]
  },
  {
    id: "enchanted-library",
    title: "The Enchanted Library",
    icon: "📚",
    category: "fantasy",
    duration: 15,
    description: "Discover a magical library where books come alive and stories whisper from the shelves.",
    narrator: "Willow",
    paragraphs: [
      "You find the door behind a waterfall of ivy on a quiet street. It's old oak, with a brass handle shaped like a sleeping dragon. When you turn it, the door opens with a soft click, and warm amber light spills out.",
      "Inside is the most extraordinary library you have ever seen. Shelves rise from floor to ceiling — but the ceiling is so high it disappears into a soft golden mist. Spiral staircases wind upward between the shelves, and small lanterns float in the air, casting pools of warm light.",
      "The books are alive. Not in a frightening way — in a gentle, breathing way. Their spines shimmer with soft colors. Some hum quietly. Others glow faintly, as if the stories inside them are trying to shine through the covers.",
      "A comfortable armchair waits by a fireplace. It's deep burgundy velvet, with a footrest and a small table bearing a cup of chamomile tea that's somehow still perfectly warm.",
      "You sink into the chair. A book floats down from a high shelf and lands gently in your lap. Its pages are cream-colored and smooth, and the words appear one at a time, at exactly the pace you need. No rushing. No pressure.",
      "The story it tells is your story — not the anxious one, but the peaceful one. The one where everything works out. The one where you are brave and kind and everything is enough.",
      "Other books drift past like leaves on a gentle current. You can hear their stories as whispers — tales of sleeping dragons, of gardens that bloom in moonlight, of ships that sail on clouds.",
      "The fire dims to embers. The floating lanterns soften to the faintest glow. The book in your lap closes itself with a satisfied sigh. The enchanted library holds you in its warm, story-scented embrace as you drift into the deepest, most peaceful sleep."
    ]
  },
  {
    id: "japanese-garden",
    title: "The Japanese Moon Garden",
    icon: "🎋",
    category: "travel",
    duration: 16,
    description: "Walk through a moonlit Japanese garden with koi ponds, stone lanterns, and cherry blossoms.",
    narrator: "Willow",
    paragraphs: [
      "The wooden gate opens onto a gravel path raked in perfect circles. The full moon hangs low, casting silver light across a Japanese garden so beautiful it takes your breath away.",
      "Cherry blossom trees line the path, their pink petals glowing in the moonlight. Some fall softly, drifting in spirals like tiny ballet dancers performing their final bow.",
      "You walk slowly, each step crunching softly on the gravel. The sound is meditative — crunch, pause, crunch, pause. Your breathing naturally slows to match your steps.",
      "A koi pond appears, perfectly still, reflecting the moon like a silver mirror. You kneel beside it and see golden and white koi gliding through the dark water, their movements slow and graceful, like living calligraphy.",
      "A stone lantern glows beside the pond, its candle flickering behind carved stone walls. The light it casts is warm and intimate, creating small pools of gold in the silver moonlight.",
      "Across a curved bridge, you find a tea house. Its paper screens are lit from within, casting geometric shadows. Inside, a tatami mat and silk cushion wait for you.",
      "You sit in seiza, then slowly lie back. Through the open screen, you can see the garden — the cherry blossoms, the koi pond, the moon reflected in still water. A bamboo fountain tips and fills, tips and fills, keeping a gentle rhythm.",
      "The sound of the fountain. The scent of cherry blossoms. The silver moonlight on the tatami. Everything in this garden has been placed with perfect intention — including this moment of rest. Sleep finds you in the moon garden, gentle as falling petals."
    ]
  },
  {
    id: "train-countryside",
    title: "The Sleeper Train Through the Countryside",
    icon: "🚂",
    category: "travel",
    duration: 14,
    description: "Fall asleep on a vintage sleeper train as it winds through rolling countryside at dusk.",
    narrator: "Willow",
    paragraphs: [
      "The train station is quiet. A vintage locomotive waits on the platform, steam curling from its chimney like slow-motion clouds. A porter in a navy uniform opens the door to your private sleeper car with a warm smile.",
      "Inside, everything is mahogany and brass and deep green velvet. A narrow bed with crisp white sheets and a thick duvet. A small window with lace curtains. A reading lamp that casts a warm circle of light.",
      "The train begins to move with a gentle lurch, then settles into a steady rhythm. Click-clack, click-clack. The sound becomes a heartbeat — steady, reliable, soothing.",
      "Through the window, countryside unfolds in the golden light of late afternoon. Rolling green hills dotted with sheep. Stone walls. A river winding through a valley. A village with a church spire catching the last sun.",
      "You change into soft pajamas that were left folded on the bed. You slip between the cool sheets. The train's gentle rocking becomes a cradle — side to side, side to side, so subtle you almost don't notice.",
      "A dining car attendant brings hot chocolate in a china cup. Rich and sweet and warming. You take small sips and watch the landscape scroll past like a living painting.",
      "The sun sets and the countryside becomes silhouettes — dark hills against an orange sky, trees like lace against the fading light. The reading lamp creates a cocoon of warmth.",
      "Click-clack, click-clack. The train carries you through the night. You don't know where you're going, and it doesn't matter. The journey is the destination. The rhythm is the lullaby. The gentle rocking is all you need to let go and sleep."
    ]
  },
  {
    id: "rainy-bookshop",
    title: "The Rainy Day Bookshop",
    icon: "📖",
    category: "cozy",
    duration: 13,
    description: "Spend a rainy afternoon in a cozy independent bookshop with a cat and endless stories.",
    narrator: "Willow",
    paragraphs: [
      "Rain patters against the bookshop window. You pushed through the door moments ago, escaping a sudden downpour, and now you stand dripping slightly on the wooden floor of the most charming shop you've ever entered.",
      "Books are everywhere — not in a chaotic way, but in a loved way. Stacked on tables, filling shelves that reach the ceiling, piled beside a worn leather armchair. The shop smells of paper and coffee and old wood.",
      "A marmalade cat is curled on the armchair. It opens one eye, decides you're acceptable, and goes back to sleep. A small handwritten sign reads: 'This is Hemingway. He has opinions about your reading choices.'",
      "The shop owner — gray-haired, cardigan-wearing, kind-eyed — brings you a mug of tea without you asking. 'Sit anywhere,' she says. 'Stay as long as you like. That's the only rule.'",
      "You settle into a window seat with cushions. The rain streams down the glass, turning the street outside into an impressionist painting. Inside, a radiator hums gently. The tea warms your hands.",
      "You pick up a book at random. The pages are cream and the font is beautiful and the story takes you somewhere warm. Hemingway the cat migrates to your lap. His purring adds a bass note to the rain's symphony.",
      "The afternoon stretches and softens. More tea appears. The rain continues its gentle percussion. The book's words begin to blur as your eyelids grow heavy. The cat's warmth. The rain's rhythm. The tea's comfort.",
      "You are in the coziest place in the world. The rain will stop eventually, but not yet. Not yet. For now, there is nowhere to go and nothing to do but rest. The bookshop holds you like a story holds its reader. Gently. Completely. All the way to sleep."
    ]
  },
  {
    id: "cloud-kingdom",
    title: "The Cloud Kingdom",
    icon: "☁️",
    category: "fantasy",
    duration: 15,
    description: "Float through a kingdom built on clouds, where everything is soft, quiet, and peaceful.",
    narrator: "Willow",
    paragraphs: [
      "You're lying on a cloud. Not a metaphorical cloud — an actual, soft, impossibly comfortable cloud. It holds you like a hammock made of cotton candy and morning mist.",
      "The cloud kingdom stretches around you in every direction. Towers and bridges and gardens, all built from clouds of different textures — some firm like meringue, others wispy like pulled cotton, others dense and cushiony like the finest memory foam.",
      "The light here is perpetual sunset — gold and pink and lavender, coming from everywhere and nowhere. There are no shadows in the cloud kingdom. Everything is bathed in gentle warmth.",
      "Cloud creatures drift past — rabbits with fluffy tails, birds that leave trails of mist, a great whale that moves through the sky in slow motion, its song a deep harmonic that you feel more than hear.",
      "A pathway of stepping-stone clouds leads to a garden where cloud flowers bloom in impossible colors — pearlescent white, sunrise pink, afternoon gold. When you touch them, they release a scent like rain on warm earth.",
      "At the garden's center, the softest cloud of all waits for you. It's been shaped into the perfect bed — not too firm, not too soft. It reads your body and adjusts itself to support every curve and angle.",
      "You lie down and the cloud enfolds you like a gentle embrace. Below, through the translucent cloud floor, you can see the world far beneath — green fields, blue rivers, a patchwork of farmland. Beautiful and distant and peaceful.",
      "The cloud kingdom hums its lullaby — a harmony of wind and warmth and weight-less-ness. You are floating. You are held. You are loved by the sky itself. And in the cloud kingdom, sleep is the most natural thing in all the world."
    ]
  },
  {
    id: "autumn-cottage",
    title: "The Autumn Cottage",
    icon: "🍂",
    category: "cozy",
    duration: 14,
    description: "Settle into a charming stone cottage on a golden autumn evening with a fireplace and warm cider.",
    narrator: "Willow",
    paragraphs: [
      "The cottage sits at the edge of a forest where autumn has reached its peak. Every tree is ablaze — crimson maples, golden oaks, amber birches. Leaves drift down like nature's confetti, covering the ground in a crunchy carpet.",
      "You push open the cottage door. Inside, everything is warm stone and weathered wood. A fire is already burning in the stone hearth, and the room glows with amber light. Hand-knitted blankets drape over every surface.",
      "On the kitchen counter, a pot of apple cider simmers on a woodstove. Cinnamon sticks and star anise float on the surface. You pour yourself a mug and the steam rises, carrying the scent of autumn itself.",
      "Through the window, you watch leaves spiral down in the golden afternoon light. A squirrel is busy collecting acorns. A robin hops along the garden wall. The world outside is unhurried and content.",
      "You curl up on the deep sofa beside the fire. A wool blanket settles over your legs. The cider is sweet and warming, and with each sip you feel the tension of the day dissolving like sugar in warm water.",
      "Rain begins — soft at first, then steady. It taps on the cottage roof like gentle fingers on a drum. The fire crackles in response, as if the two are having a conversation. Rain speaks, fire answers.",
      "The light outside fades to a warm gray. The fire grows brighter. The rain grows steadier. Your mug is empty now, and your hands rest in your lap, warm and heavy.",
      "The autumn cottage wraps around you — its thick stone walls, its warm fire, its gentle rain. You are sheltered from the world. You are held by the season. And as the fire dims to glowing embers and the rain whispers its ancient song, sleep comes as naturally as leaves falling from trees."
    ]
  },
];
