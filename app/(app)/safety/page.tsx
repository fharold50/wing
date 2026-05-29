import { Cpu, BadgeCheck, MapPin, Flag, Star, Shield } from "@/lib/icons";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import TrustedContactForm from "@/components/safety/TrustedContactForm";
import ShieldStats from "@/components/safety/ShieldStats";

export const metadata = { title: "Safety Center · Wing" };

const ITEMS = [
  { Icon: Shield,     title: "Safe Meetup Check-in", body: "Every Wing meetup is shadowed by a quiet check-in cycle. If you don't tap “I'm good” after 2 hours, your trusted contact gets a plain-language email — never a generic alert." },
  { Icon: Cpu,        title: "Anti-Hookup AI Shield", body: "Every profile, every message, every plan title is read by a moderation layer before it ships. Romantic intent is removed before it reaches anyone. We log the block count — visible below — but never the user or the content." },
  { Icon: BadgeCheck, title: "Photo Verification",   body: "Request the badge from your profile. Once approved, you appear higher in Discover and other verified Wings can opt into a “verified-only” filter." },
  { Icon: MapPin,     title: "Approximate Location", body: "Wings see your neighborhood and a distance phrase — never your exact GPS. No pin, no precise coords sent to the client." },
  { Icon: Flag,       title: "Report & Block",       body: "One tap removes someone across every surface. Reports go to moderation within the hour. Below 2.0 reputation → automatic suspension." },
  { Icon: Star,       title: "Reputation System",    body: "Both sides rate after every meetup. Bad actors lose their score fast. Above 4.8 earns the Super Wing badge — the only thing on Wing that actually feels like a flex." },
];

export default async function SafetyPage() {
  const session = await getSession();

  let contact: { name?: string; email?: string; phone?: string } | null = null;
  if (session && !isDemoMode()) {
    const supabase = await createClient();
    const { data } = await supabase.from("trusted_contacts").select("name, email, phone").eq("user_id", session.user.id).maybeSingle();
    contact = data ?? null;
  } else if (session) {
    contact = { name: "Maya", email: "maya@example.com", phone: "" };
  }

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Built for trust</div>
        <h1 className="page-title">Safety center</h1>
        <p className="page-sub">
          Wing was designed by listening to what made women uninstall every other meetup app. Then we built the opposite.
        </p>
      </div>

      <section className="safety-block">
        <h2 className="safety-h">Your trusted contact</h2>
        <p className="safety-sub">Required before you can schedule a meetup. One person. Real one.</p>
        <TrustedContactForm initial={contact} />
      </section>

      <section className="safety-block">
        <h2 className="safety-h">The Shield, transparent</h2>
        <p className="safety-sub">A public count of the dating-style intent we&apos;ve removed. No content, no users — just the fact.</p>
        <ShieldStats />
      </section>

      <section className="safety-block">
        <h2 className="safety-h">Every layer, in one place</h2>
        <div className="safety-list" style={{ marginTop: 16 }}>
          {ITEMS.map((s) => (
            <div key={s.title} className="safety-item">
              <div className="safety-icon"><s.Icon size={20} /></div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
