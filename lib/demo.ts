/**
 * Demo data. When NEXT_PUBLIC_DEMO=1 (or no Supabase env vars are configured),
 * the app uses this fixture data so all screens render with realistic content.
 *
 * In real mode, this is unused — the app talks to Supabase.
 */

import type { ActivityPlan, ActivityType, WingUser } from "./types";

export const DEMO_USER: WingUser = {
  id: "demo-me",
  name: "You",
  age: 28,
  location: "Brooklyn, NY",
  approxLat: 40.682,
  approxLng: -73.952,
  destination: "Honolulu, HI",
  tripPurpose: "solo_traveler",
  bio: "Surf in the mornings, jazz at night, espresso in between.",
  interests: ["surfing", "live music", "photography", "coffee", "jazz"],
  activitiesWanted: ["surf_water", "live_music", "coffee_chill", "photography"],
  wingPreference: "Someone who knows the city and isn't precious about the plan.",
  isLocalGuide: false,
  verificationLevel: "id",
  reputationScore: 4.92,
  isActive: true,
  gender: "prefer_not_to_say",
  lookingFor: ["any"],
  createdAt: "2025-01-04T10:00:00Z",
  lastActive: new Date().toISOString(),
};

export const DEMO_WINGS: WingUser[] = [
  {
    id: "u1", name: "Aisha L.", age: 27, location: "New Orleans, LA",
    approxLat: 29.951, approxLng: -90.072,
    tripPurpose: "solo_traveler",
    bio: "Jazz, gumbo, and golden-hour walks. Looking for someone curious.",
    interests: ["jazz", "live music", "food tours", "photography", "books"],
    activitiesWanted: ["live_music", "food_dining", "arts_culture", "coffee_chill"],
    wingPreference: "Curious, talkative, doesn't mind walking 4 miles for dinner.",
    isLocalGuide: true, verificationLevel: "id", reputationScore: 4.95,
    isActive: true, gender: "woman", lookingFor: ["any"],
    createdAt: "", lastActive: new Date().toISOString(),
    photos: ["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=640&q=80&auto=format&fit=crop"],
  },
  {
    id: "u2", name: "Marcus K.", age: 31, location: "Honolulu, HI",
    approxLat: 21.305, approxLng: -157.858,
    tripPurpose: "local_guide",
    bio: "North Shore in the morning, ramen at night. Solo traveler since 2019.",
    interests: ["surfing", "hiking", "coffee", "photography"],
    activitiesWanted: ["surf_water", "hiking", "coffee_chill", "beach"],
    wingPreference: "Up at 6am, doesn't whine about cold water.",
    isLocalGuide: true, verificationLevel: "id", reputationScore: 4.88,
    isActive: true, gender: "man", lookingFor: ["any"],
    createdAt: "", lastActive: new Date().toISOString(),
    photos: ["https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=640&q=80&auto=format&fit=crop"],
  },
  {
    id: "u3", name: "Diego C.", age: 34, location: "Miami, FL",
    approxLat: 25.761, approxLng: -80.191,
    tripPurpose: "local_guide",
    bio: "Born here. Will show you the city the way it actually is — not the postcard.",
    interests: ["food tours", "art", "bars", "rooftops", "beaches"],
    activitiesWanted: ["bars_nightlife", "food_dining", "arts_culture", "beach"],
    wingPreference: "Travelers who want the real Miami, not South Beach.",
    isLocalGuide: true, verificationLevel: "id", reputationScore: 4.91,
    isActive: true, gender: "man", lookingFor: ["any"],
    createdAt: "", lastActive: new Date(Date.now() - 12 * 60_000).toISOString(),
    photos: ["https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=640&q=80&auto=format&fit=crop"],
  },
  {
    id: "u4", name: "Priya S.", age: 26, location: "Brooklyn, NY",
    approxLat: 40.679, approxLng: -73.949,
    tripPurpose: "solo_traveler",
    bio: "Run in Prospect Park, brunch in Fort Greene, repeat.",
    interests: ["running", "coffee", "art", "books", "yoga"],
    activitiesWanted: ["fitness", "coffee_chill", "arts_culture"],
    wingPreference: "Someone who actually shows up at 7am.",
    isLocalGuide: false, verificationLevel: "social", reputationScore: 4.83,
    isActive: true, gender: "woman", lookingFor: ["wingwomen", "any"],
    createdAt: "", lastActive: new Date(Date.now() - 4 * 60_000).toISOString(),
    photos: ["https://images.unsplash.com/photo-1517837125937-53bd402f49d6?w=640&q=80&auto=format&fit=crop"],
  },
  {
    id: "u5", name: "Theo R.", age: 29, location: "Brooklyn, NY",
    approxLat: 40.688, approxLng: -73.961,
    tripPurpose: "solo_traveler",
    bio: "Photographer. Always chasing weird light.",
    interests: ["photography", "live music", "coffee", "bars"],
    activitiesWanted: ["photography", "live_music", "coffee_chill", "bars_nightlife"],
    wingPreference: "Likes wandering. No fixed plans.",
    isLocalGuide: false, verificationLevel: "id", reputationScore: 4.79,
    isActive: true, gender: "man", lookingFor: ["any"],
    createdAt: "", lastActive: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: "u6", name: "Lena F.", age: 30, location: "Lisbon, Portugal",
    approxLat: 38.722, approxLng: -9.139,
    tripPurpose: "local_guide",
    bio: "Surf at Costa da Caparica, fado at night. Hosting travelers since 2022.",
    interests: ["surfing", "live music", "food tours", "hiking"],
    activitiesWanted: ["surf_water", "live_music", "food_dining", "hiking"],
    wingPreference: "Open to anything. No drama.",
    isLocalGuide: true, verificationLevel: "id", reputationScore: 4.97,
    isActive: true, gender: "woman", lookingFor: ["any"],
    createdAt: "", lastActive: new Date(Date.now() - 30 * 60_000).toISOString(),
    photos: ["https://images.unsplash.com/photo-1488161628813-04466f872be2?w=640&q=80&auto=format&fit=crop"],
  },
  {
    id: "u7", name: "Jordan W.", age: 25, location: "Brooklyn, NY",
    approxLat: 40.677, approxLng: -73.972,
    tripPurpose: "solo_traveler",
    bio: "New to NYC. Looking for someone to bar-hop with this weekend.",
    interests: ["bars", "rooftops", "live music", "food tours"],
    activitiesWanted: ["bars_nightlife", "live_music", "food_dining"],
    wingPreference: "Anyone who knows where the good rooftops are.",
    isLocalGuide: false, verificationLevel: "phone", reputationScore: 4.5,
    isActive: true, gender: "nonbinary", lookingFor: ["any"],
    createdAt: "", lastActive: new Date(Date.now() - 6 * 60_000).toISOString(),
  },
  {
    id: "u8", name: "Sofia M.", age: 33, location: "Mexico City, MX",
    approxLat: 19.432, approxLng: -99.133,
    tripPurpose: "local_guide",
    bio: "Food tour guide. Will take you somewhere with no English menu.",
    interests: ["food tours", "art", "museums", "coffee"],
    activitiesWanted: ["food_dining", "arts_culture", "coffee_chill"],
    wingPreference: "Travelers who actually eat the food.",
    isLocalGuide: true, verificationLevel: "id", reputationScore: 4.96,
    isActive: true, gender: "woman", lookingFor: ["any"],
    createdAt: "", lastActive: new Date(Date.now() - 50 * 60_000).toISOString(),
  },
];

export const DEMO_PLANS: ActivityPlan[] = [
  {
    id: "p1", hostId: "u2", host: DEMO_WINGS[1],
    activityType: "surf_water" as ActivityType,
    title: "Sunrise surf at North Shore",
    description: "Easy break, all levels welcome. Bring your own board or rent at Foodland.",
    location: "Sunset Beach", city: "Honolulu, HI",
    datetime: new Date(Date.now() + 36 * 3600_000).toISOString(),
    maxParticipants: 4, currentParticipants: 2, isOpen: true,
    tags: ["surf", "morning", "all-levels"], createdAt: "",
  },
  {
    id: "p2", hostId: "u1", host: DEMO_WINGS[0],
    activityType: "live_music" as ActivityType,
    title: "Jazz crawl through Frenchmen St.",
    description: "Three venues, walking only, ending at the Spotted Cat. I know the bouncers.",
    location: "Frenchmen Street", city: "New Orleans, LA",
    datetime: new Date(Date.now() + 60 * 3600_000).toISOString(),
    maxParticipants: 6, currentParticipants: 3, isOpen: true,
    tags: ["jazz", "nightlife", "walking"], createdAt: "",
  },
  {
    id: "p3", hostId: "u4", host: DEMO_WINGS[3],
    activityType: "fitness" as ActivityType,
    title: "7am Prospect Park loop",
    description: "5.2 miles, conversational pace. Coffee at Lula Bagel after.",
    location: "Grand Army Plaza", city: "Brooklyn, NY",
    datetime: new Date(Date.now() + 18 * 3600_000).toISOString(),
    maxParticipants: 4, currentParticipants: 2, isOpen: true,
    tags: ["running", "morning"], createdAt: "",
  },
  {
    id: "p4", hostId: "u3", host: DEMO_WINGS[2],
    activityType: "food_dining" as ActivityType,
    title: "Cuban food tour — Little Havana",
    description: "Four stops, two hours, ending with cortaditos at Versailles.",
    location: "Calle Ocho", city: "Miami, FL",
    datetime: new Date(Date.now() + 84 * 3600_000).toISOString(),
    maxParticipants: 8, currentParticipants: 5, isOpen: true,
    tags: ["food", "afternoon"], createdAt: "",
  },
  {
    id: "p5", hostId: "u6", host: DEMO_WINGS[5],
    activityType: "hiking" as ActivityType,
    title: "Sintra day-hike",
    description: "Train from Rossio, hike Pena to Moors. Pack water + light layer.",
    location: "Sintra-Cascais Natural Park", city: "Lisbon, Portugal",
    datetime: new Date(Date.now() + 5 * 24 * 3600_000).toISOString(),
    maxParticipants: 5, currentParticipants: 2, isOpen: true,
    tags: ["hiking", "day-trip"], createdAt: "",
  },
];

export const DEMO_CONNECTIONS = [
  { id: "c1", userId: "demo-me", wingId: "u1", status: "connected" as const, createdAt: new Date(Date.now() - 3 * 86400_000).toISOString() },
  { id: "c2", userId: "u3", wingId: "demo-me", status: "pending" as const, createdAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
  { id: "c3", userId: "demo-me", wingId: "u2", status: "connected" as const, createdAt: new Date(Date.now() - 10 * 86400_000).toISOString() },
  { id: "c4", userId: "u5", wingId: "demo-me", status: "pending" as const, createdAt: new Date(Date.now() - 90 * 60_000).toISOString() },
];

export const DEMO_THREADS: Record<string, Array<{ id: string; senderId: string; content: string; createdAt: string }>> = {
  u1: [
    { id: "m1", senderId: "u1", content: "Hey! Saw your match come through. Welcome to NOLA.", createdAt: new Date(Date.now() - 86400_000).toISOString() },
    { id: "m2", senderId: "demo-me", content: "Thanks! Definitely down for the jazz crawl.", createdAt: new Date(Date.now() - 80000_000).toISOString() },
    { id: "m3", senderId: "u1", content: "Cool — let's meet at Spotted Cat 8pm Friday. I'll text when I'm 5 out.", createdAt: new Date(Date.now() - 60000_000).toISOString() },
    { id: "m4", senderId: "demo-me", content: "Perfect. Bringing a friend who plays trumpet — that ok?", createdAt: new Date(Date.now() - 7000_000).toISOString() },
    { id: "m5", senderId: "u1", content: "More the merrier 🎷", createdAt: new Date(Date.now() - 1800_000).toISOString() },
  ],
  u2: [
    { id: "m6", senderId: "u2", content: "Surf at 6am tomorrow if you're up. Sunset Beach.", createdAt: new Date(Date.now() - 30 * 60_000).toISOString() },
  ],
  u3: [
    { id: "m7", senderId: "u3", content: "Got room on the Little Havana food tour Saturday. Want in?", createdAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
  ],
};

export function isDemoMode() {
  if (typeof process !== "undefined") {
    if (process.env.NEXT_PUBLIC_DEMO === "1") return true;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return true;
  }
  return false;
}
