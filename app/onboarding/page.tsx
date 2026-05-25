import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_USER } from "@/lib/demo";
import { redirect } from "next/navigation";

export const metadata = { title: "Welcome to Wing" };

export default async function OnboardingPage() {
  if (isDemoMode()) {
    return (
      <OnboardingFlow
        initial={{
          name: DEMO_USER.name,
          bio: DEMO_USER.bio,
          interests: DEMO_USER.interests,
          activities_wanted: DEMO_USER.activitiesWanted,
          gender: DEMO_USER.gender,
          looking_for: DEMO_USER.lookingFor,
          location: DEMO_USER.location,
          destination: DEMO_USER.destination ?? "",
          trip_purpose: DEMO_USER.tripPurpose,
          is_local_guide: DEMO_USER.isLocalGuide,
          wing_preference: DEMO_USER.wingPreference,
        }}
      />
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, bio, interests, activities_wanted, gender, looking_for, location, destination, trip_purpose, is_local_guide, wing_preference")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <OnboardingFlow
      initial={{
        name: profile?.name ?? "",
        bio: profile?.bio ?? "",
        interests: profile?.interests ?? [],
        activities_wanted: profile?.activities_wanted ?? [],
        gender: profile?.gender ?? "",
        looking_for: profile?.looking_for ?? ["any"],
        location: profile?.location ?? "",
        destination: profile?.destination ?? "",
        trip_purpose: profile?.trip_purpose ?? "solo_traveler",
        is_local_guide: profile?.is_local_guide ?? false,
        wing_preference: profile?.wing_preference ?? "",
      }}
    />
  );
}
