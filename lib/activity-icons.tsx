import {
  Waves, Mountain, Wine, Music, UtensilsCrossed, Camera, Dumbbell,
  Coffee, Theater, Sun, Car, Dices, Calendar,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const ACTIVITY_ICON: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
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

export function ActivityIcon({ type, ...rest }: { type: string } & SVGProps<SVGSVGElement>) {
  const Icon = ACTIVITY_ICON[type] ?? Calendar;
  return <Icon {...rest} />;
}
