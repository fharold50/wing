export type Gender = "man" | "woman" | "nonbinary" | "prefer_not_to_say";

export type TripPurpose = "solo_traveler" | "local_guide" | "group_trip" | "business";

export type VerificationLevel = "phone" | "social" | "id";

export type LookingFor = "wingmen" | "wingwomen" | "any";

export type ActivityType =
  | "surf_water"
  | "hiking"
  | "bars_nightlife"
  | "live_music"
  | "food_dining"
  | "photography"
  | "fitness"
  | "coffee_chill"
  | "arts_culture"
  | "beach"
  | "road_trip"
  | "games_leisure";

export interface WingUser {
  id: string;
  name: string;
  age?: number;
  location: string;
  /** approximate lat for distance scoring, never exposed precisely to other users */
  approxLat?: number;
  approxLng?: number;
  destination?: string;
  tripPurpose: TripPurpose;
  bio: string;
  interests: string[];
  activitiesWanted: string[];
  wingPreference: string;
  isLocalGuide: boolean;
  verificationLevel: VerificationLevel;
  reputationScore: number;
  matchPercentage?: number;
  distanceMiles?: number;
  isActive: boolean;
  gender: Gender;
  lookingFor: LookingFor[];
  createdAt: string;
  lastActive: string;
  photos?: string[];
  primaryVideo?: string;
}

export interface ActivityPlan {
  id: string;
  hostId: string;
  host?: WingUser;
  activityType: ActivityType;
  title: string;
  description: string;
  location: string;
  city: string;
  datetime: string;
  maxParticipants: number;
  currentParticipants: number;
  isOpen: boolean;
  tags: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
  /** Filled in by moderation pipeline; null while pending, true if allowed. */
  moderationPassed?: boolean | null;
}

export interface WingConnection {
  id: string;
  userId: string;
  wingId: string;
  status: "pending" | "connected" | "declined";
  createdAt: string;
  activity?: ActivityPlan;
}

export interface WingRating {
  id: string;
  raterId: string;
  ratedId: string;
  connectionId: string;
  score: number;
  tags: string[];
  createdAt: string;
}
