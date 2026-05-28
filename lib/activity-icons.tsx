import {
  Waves, Mountain, Wine, Music, UtensilsCrossed, Camera, Dumbbell,
  Coffee, Theater, Sun, Car, Dices, Calendar,
} from "@/lib/icons";

export const ACTIVITY_ICON = {
  surf_water: Waves,
  hiking: Mountain,
  bars_nightlife: Wine,
  live_music: Music,
  food_dining: UtensilsCrossed,
  photography: Camera,
  fitness: Dumbbell,
  coffee_chill: Coffee,
  arts_culture: Theater,
  beach: Sun,
  road_trip: Car,
  games_leisure: Dices,
};

export const ACTIVITY_LABEL: Record<string, string> = {
  surf_water: "Surf & Water",
  hiking: "Hiking",
  bars_nightlife: "Bars & Nightlife",
  live_music: "Live Music",
  food_dining: "Food & Dining",
  photography: "Photography",
  fitness: "Fitness",
  coffee_chill: "Coffee & Chill",
  arts_culture: "Arts & Culture",
  beach: "Beach Days",
  road_trip: "Road Trips",
  games_leisure: "Games & Leisure",
};

export function ActivityIcon({ type, size = 22, className }: { type: string; size?: number; className?: string }) {
  const Icon = (ACTIVITY_ICON as Record<string, typeof Calendar>)[type] ?? Calendar;
  return <Icon size={size} className={className} />;
}
