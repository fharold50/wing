"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { moderateText } from "@/lib/moderation";

/** Send a Wing-Up request to another user. */
export async function wingUp(wingId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { error } = await supabase.from("wing_connections").insert({
    user_id: user.id,
    wing_id: wingId,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/discover");
  revalidatePath("/wings");
  return { ok: true };
}

/** Recipient accepts or declines an incoming Wing-Up. On accept, also seeds
 *  the new thread with a friendly auto-message so it's never empty. */
export async function respondConnection(id: string, status: "connected" | "declined") {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  // Pull the connection so we know who the requester was.
  const { data: conn } = await supabase
    .from("wing_connections")
    .select("user_id, wing_id")
    .eq("id", id)
    .maybeSingle();
  if (!conn || conn.wing_id !== user.id) {
    return { ok: false, error: "Connection not found or not yours" };
  }

  const { error } = await supabase
    .from("wing_connections")
    .update({ status })
    .eq("id", id)
    .eq("wing_id", user.id);
  if (error) return { ok: false, error: error.message };

  // On accept, seed an opening message from the recipient so the thread isn't empty.
  if (status === "connected") {
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: conn.user_id,
      content: "🪶 We're winged up! What did you have in mind?",
      moderation_passed: true,
    });
  }

  revalidatePath("/wings");
  revalidatePath("/messages");
  revalidatePath(`/messages/${conn.user_id}`);
  return { ok: true };
}

/** Create an activity plan. */
export async function createPlan(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/activities");
    return { ok: true, demo: true };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const activity_type = String(formData.get("activity_type") ?? "").trim();
  const datetime = String(formData.get("datetime") ?? "").trim();
  const max_participants = Math.max(2, Math.min(20, Number(formData.get("max_participants") ?? 4)));

  if (!title || !activity_type || !datetime) return { ok: false, error: "Title, activity, and time are required." };

  // Moderate the title + description.
  const mod = await moderateText(`${title}\n${description}`);
  if (!mod.pass) return { ok: false, error: mod.reason ?? "Content not allowed." };

  const { error } = await supabase.from("activity_plans").insert({
    host_id: user.id,
    title, description, city, location,
    activity_type,
    datetime,
    max_participants,
    current_participants: 1,
    is_open: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/activities");
  return { ok: true };
}

/** Send a message — runs moderation, persists with moderation_passed flag. */
export async function sendMessage(receiverId: string, content: string) {
  const text = content.trim();
  if (!text) return { ok: false, error: "Empty message." };

  const mod = await moderateText(text);
  if (!mod.pass) return { ok: false, error: mod.reason ?? "Message blocked." };

  if (isDemoMode()) {
    revalidatePath(`/messages/${receiverId}`);
    return { ok: true, demo: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: text,
    moderation_passed: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/messages/${receiverId}`);
  return { ok: true };
}

/** Save profile edits (used by /profile inline form). */
export async function saveProfile(formData: FormData) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "");
  const location = String(formData.get("location") ?? "");
  const destination = String(formData.get("destination") ?? "");

  if (!name) return { ok: false, error: "Name required." };

  const mod = await moderateText(`${name}\n${bio}\n${destination}`);
  if (!mod.pass) return { ok: false, error: mod.reason ?? "Content not allowed." };

  const { error } = await supabase.from("profiles").update({
    name, bio, location, destination: destination || null,
  }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/profile");
  redirect("/profile");
}
