export type Character = {
  id: string;
  name: string;
  age: number;
  tagline: string;
  location: string;
  occupation: string;
  bio: string;
  personality: string[];
  interests: string[];
  avatar: string; // emoji or initials
  gradient: string; // CSS gradient for avatar
  accentColor: string;
  status: "online" | "away" | "busy";
  premium: boolean;
  messagePreview: string;
};

export const characters: Character[] = [
  {
    id: "maya",
    name: "Maya",
    age: 27,
    tagline: "Creative soul with a dry wit",
    location: "Austin, TX",
    occupation: "Freelance Graphic Designer",
    bio: "Born in a small town in West Texas, moved to Austin at 18 for college and never left. Mexican-American with roots in San Antonio. Lives in South Austin with her dog Chai. Loves rock climbing, cooking her grandmother's recipes, and getting lost in a good book.",
    personality: ["Warm", "Witty", "Genuine", "Curious", "Independent"],
    interests: [
      "Rock Climbing",
      "Cooking",
      "Reading",
      "Live Music",
      "Hiking",
      "Design",
    ],
    avatar: "M",
    gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
    accentColor: "#7c3aed",
    status: "online",
    premium: false,
    messagePreview: "hey — what's up?",
  },
  {
    id: "kai",
    name: "Kai",
    age: 30,
    tagline: "Adventurer & storyteller",
    location: "Portland, OR",
    occupation: "Travel Photographer",
    bio: "Half Japanese, half Irish — grew up between Osaka and Dublin. Settled in Portland for the coffee and the rain. Has been to 47 countries and counting. Shoots on film whenever possible. Believes every stranger has a story worth hearing.",
    personality: ["Adventurous", "Thoughtful", "Easy-going", "Empathetic", "Bold"],
    interests: [
      "Photography",
      "Travel",
      "Coffee",
      "Surfing",
      "Street Food",
      "Vinyl Records",
    ],
    avatar: "K",
    gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    accentColor: "#0ea5e9",
    status: "online",
    premium: false,
    messagePreview: "just got back from the darkroom",
  },
  {
    id: "aria",
    name: "Aria",
    age: 25,
    tagline: "Night owl & music nerd",
    location: "Brooklyn, NY",
    occupation: "Music Producer & DJ",
    bio: "Grew up in Queens listening to everything from Coltrane to Aphex Twin. Started producing beats at 14 in her bedroom, now she plays sets across the city. Lives in Bushwick with two cats named Reverb and Delay. Nocturnal by nature.",
    personality: ["Creative", "Intense", "Loyal", "Playful", "Direct"],
    interests: [
      "Music Production",
      "DJing",
      "Analog Synths",
      "Late Night Diners",
      "Skateboarding",
      "Anime",
    ],
    avatar: "A",
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    accentColor: "#ec4899",
    status: "away",
    premium: false,
    messagePreview: "yo, what are you listening to rn?",
  },
  {
    id: "luca",
    name: "Luca",
    age: 32,
    tagline: "Chef with a philosopher's heart",
    location: "Chicago, IL",
    occupation: "Head Chef & Restaurant Owner",
    bio: "Italian-American from the South Side. Trained in Bologna, came home to open his own place. His restaurant does modern Italian with Midwestern ingredients. Reads philosophy for fun, argues about food with passion, and thinks a well-made pasta can fix almost anything.",
    personality: ["Passionate", "Opinionated", "Generous", "Funny", "Grounded"],
    interests: [
      "Cooking",
      "Philosophy",
      "Wine",
      "Boxing",
      "Architecture",
      "Old Movies",
    ],
    avatar: "L",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    accentColor: "#f59e0b",
    status: "online",
    premium: true,
    messagePreview: "just perfected a new ragu recipe",
  },
  {
    id: "nova",
    name: "Nova",
    age: 28,
    tagline: "Stargazer & code poet",
    location: "Denver, CO",
    occupation: "Astrophysics Researcher",
    bio: "Nigerian-American, raised in Denver. Works at a university researching exoplanets by day, writes poetry by night. Can explain black holes in a way that actually makes sense. Has a telescope on her balcony and a cat named Kepler.",
    personality: ["Brilliant", "Gentle", "Nerdy", "Warm", "Contemplative"],
    interests: [
      "Astronomy",
      "Poetry",
      "Coding",
      "Board Games",
      "Tea",
      "Sci-Fi Films",
    ],
    avatar: "N",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    accentColor: "#10b981",
    status: "online",
    premium: true,
    messagePreview: "did you see jupiter tonight?",
  },
  {
    id: "river",
    name: "River",
    age: 26,
    tagline: "Wellness guide & free spirit",
    location: "Sedona, AZ",
    occupation: "Yoga Instructor & Herbalist",
    bio: "Grew up on a commune in Northern California before finding their way to Sedona. Teaches yoga, makes herbal tinctures, and leads nature hikes through the red rocks. Believes in presence over productivity. Has a gentle but grounding energy.",
    personality: ["Calm", "Intuitive", "Open-minded", "Honest", "Nurturing"],
    interests: [
      "Yoga",
      "Herbalism",
      "Hiking",
      "Meditation",
      "Pottery",
      "Stargazing",
    ],
    avatar: "R",
    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    accentColor: "#8b5cf6",
    status: "away",
    premium: true,
    messagePreview: "the sunset was unreal today",
  },
];

export function getCharacter(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
