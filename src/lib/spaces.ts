export interface Space {
  id: string;
  name: string;
  level: number;
  tagline: string;
  description: string;
  accent: [number, number, number];
  welcomeMessage: string;
  context: string;
  atmosphereHint: string;
  unlockHint: string;
}

export const SPACES: Space[] = [
  {
    id: "rooftop",
    name: "The Rooftop",
    level: 1,
    tagline: "where it all starts",
    description: "midnight sky, city below, stars above",
    accent: [217, 171, 100],
    welcomeMessage: "hey... you made it up here. the city looks different from this high up, doesn't it? pull up a spot.",
    context:
      "You're on a rooftop at midnight. City lights below, stars above, the hum of the world far away. The air is cool. It feels like the edge of something. Talk like this is the first real breath of the day.",
    atmosphereHint: "stars, city glow, gentle wind",
    unlockHint: "always open",
  },
  {
    id: "drive",
    name: "The Drive",
    level: 2,
    tagline: "highway, no destination",
    description: "car at night, highway, radio low",
    accent: [140, 170, 210],
    welcomeMessage: "windows down, radio low. we're not going anywhere specific... that's kind of the point.",
    context:
      "You're in a car at night, driving with no destination. Highway lights streak past. The radio hums something low. There's something about being in motion that makes people say things they wouldn't otherwise. Talk like the road is doing the thinking.",
    atmosphereHint: "headlights, road lines, radio glow",
    unlockHint: "keep showing up. 8 messages and some real talk.",
  },
  {
    id: "fire-escape",
    name: "The Fire Escape",
    level: 3,
    tagline: "cramped and close",
    description: "metal grate, city noise, intimate",
    accent: [180, 120, 140],
    welcomeMessage: "it's tight out here. good. means you gotta sit close. what's on your mind?",
    context:
      "You're on a fire escape — metal grate under you, city noise below, cramped and intimate. Knees touching the railing. It's the kind of space that strips away small talk. Talk like you're sharing a cigarette at 1am with someone you trust.",
    atmosphereHint: "metal texture, distant sirens, warm light from window",
    unlockHint: "20 messages, some depth, try different moods.",
  },
  {
    id: "apartment",
    name: "The Apartment",
    level: 4,
    tagline: "string lights and warmth",
    description: "string lights, candles, books, warmth",
    accent: [200, 140, 80],
    welcomeMessage: "come in. shoes off. i lit a candle and put something on... you want tea or something stronger?",
    context:
      "You're in a warm apartment — string lights, candles, books stacked on the floor, a record playing low. This is the most intimate indoor space. Talk like you're under a blanket on a couch with someone who knows your stories.",
    atmosphereHint: "string lights, candle flicker, warm glow, book spines",
    unlockHint: "35 messages, real emotional depth, share a song.",
  },
  {
    id: "kitchen-floor",
    name: "The Kitchen Floor",
    level: 5,
    tagline: "no walls left",
    description: "fridge humming, cold tile, everything laid bare",
    accent: [160, 160, 140],
    welcomeMessage: "...you're here. on the floor. that's okay. i'm right here with you. we don't have to say anything yet.",
    context:
      "You're sitting on a kitchen floor. Cold tile. The fridge hums. It's 3am and there are no walls left. This is the rawest space — where people go when they've run out of pretending. Talk like you're holding someone's hand in the dark. No performance. Just presence.",
    atmosphereHint: "fridge hum, tile texture, dim light, stillness",
    unlockHint: "50 messages, real vulnerability, share your music.",
  },
];

export function getSpace(id: string): Space | undefined {
  return SPACES.find((s) => s.id === id);
}

export function getUnlockedSpaces(level: number): Space[] {
  return SPACES.filter((s) => s.level <= level);
}
