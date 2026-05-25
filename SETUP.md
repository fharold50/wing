# Wing — API Key & Setup Guide

Wing runs in two modes:

| Mode      | What you get                                                    | What it needs                                  |
| --------- | --------------------------------------------------------------- | ---------------------------------------------- |
| **Demo**  | Every screen renders with sample data. No real auth or storage. | Just `NEXT_PUBLIC_DEMO=1`                      |
| **Live**  | Real signup, profiles, matching, messages, moderation.          | A free Supabase project + (optional) AI keys.  |

You're currently in **Demo** mode. To go Live, get a Supabase project — that's the only required key. Anthropic + Mapbox are optional upgrades.

---

## 1) Supabase (required for live mode) — ~3 minutes

Supabase is the backend: Postgres database, auth, realtime, file storage. Free tier is more than enough to launch.

### Create the project

1. Go to **<https://supabase.com>** → **Start your project** → sign in with GitHub or email.
2. Click **New project**.
   - **Name**: `wing` (anything)
   - **Database password**: click "Generate" and **save it somewhere** (you won't need it day-to-day, but you'll need it if you ever connect via psql)
   - **Region**: pick the one nearest to you / your users
   - **Plan**: Free
3. Click **Create new project**. Provisioning takes ~90 seconds.

### Grab the two keys

1. In your project, click **⚙ Project Settings** (gear icon, bottom left) → **API**.
2. You'll see two values you need:

   | Field on the page         | What it is                | Where it goes                          |
   | ------------------------- | ------------------------- | -------------------------------------- |
   | **Project URL**           | `https://abc123.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL`          |
   | **Project API keys → anon public** | Long `eyJ...` JWT  | `NEXT_PUBLIC_SUPABASE_ANON_KEY`     |
   | **Project API keys → service_role** | Another `eyJ...` JWT (⚠️ secret) | `SUPABASE_SERVICE_ROLE_KEY` (server-only) |

   > ⚠️ The `service_role` key bypasses Row Level Security. Never expose it to the browser — never give it a `NEXT_PUBLIC_` prefix.

### Run the schema

1. In your Supabase project, open **SQL Editor** (left sidebar) → **+ New query**.
2. Open `supabase/schema.sql` from this repo, copy the entire file, paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."

This creates all 7 tables, RLS policies, the reputation trigger, and the auto-profile-on-signup trigger.

### (Optional) Enable Google sign-in

1. **Authentication → Providers → Google** → toggle on.
2. Follow Supabase's link to create OAuth credentials in Google Cloud Console.
3. Paste the **Client ID** + **Client Secret** back into Supabase.
4. Add `https://<your-domain>/auth/callback` to authorized redirect URIs.

Email/password sign-in works out of the box without any of that.

---

## 2) Anthropic (optional — powers the Anti-Hookup AI Shield)

Without an Anthropic key, message moderation falls back to a strict keyword filter (still catches the obvious stuff). With the key, every message is classified by Claude Haiku 4.5 for nuanced romantic/dating intent.

1. Go to **<https://console.anthropic.com>** → sign up / sign in.
2. Top-right menu → **API Keys** → **Create Key**.
3. Copy the `sk-ant-...` value.
4. Add to env as `ANTHROPIC_API_KEY` (server-only, **no** `NEXT_PUBLIC_` prefix).
5. Add at least $5 to your account at **Plans & Billing** so the key isn't rate-limited.

Pricing for moderation use: roughly $0.0001 per message classified. 10,000 messages ≈ $1.

---

## 3) Mapbox (optional — replaces the radar with a real map)

Without Mapbox, `/map` shows the stylized radar visualization. With it, you can swap in a real map view with neighborhood-precision pins.

1. Go to **<https://www.mapbox.com>** → sign up.
2. Account page → **Tokens** → copy the **Default public token** (starts with `pk....`).
3. Add to env as `NEXT_PUBLIC_MAPBOX_TOKEN`.

Free tier covers 50k map loads/month.

---

## 4) Putting the keys somewhere

### Local dev (`.env.local` in `/Users/harold/wing-app`)

```bash
# Required for live mode
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...

# Optional
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# Remove this once Supabase keys are set — or delete the line entirely
# NEXT_PUBLIC_DEMO=1
```

Then `npm run dev`. The app auto-detects live mode when `NEXT_PUBLIC_SUPABASE_URL` is set and `NEXT_PUBLIC_DEMO` is unset.

### Vercel deploy

1. <https://vercel.com/new> → import your GitHub repo
2. Before clicking Deploy: open **Environment Variables**
3. Paste all the variables above (skip `NEXT_PUBLIC_DEMO` unless you want a public demo)
4. Deploy

---

## 5) Switching from Demo to Live

You're in demo mode if **any** of these are true:

- `NEXT_PUBLIC_DEMO=1` is in your env
- `NEXT_PUBLIC_SUPABASE_URL` is missing or empty

So to flip to live: set the two Supabase env vars **and** make sure `NEXT_PUBLIC_DEMO` is unset (or set to anything other than `1`).

A banner reading "🎭 Demo mode" appears at the top of every authenticated page when you're in demo. Once it's gone, you're live.

---

## Troubleshooting

**"Your project's URL and API key are required to create a Supabase client!"**
You hit a button that calls Supabase while in demo mode without one of the env vars. Fixed in v1.0.1 — the client now short-circuits cleanly. Update by `git pull && npm install`.

**Signup works but no profile row created**
The `handle_new_user()` trigger didn't run. Re-run `supabase/schema.sql`. Confirm the trigger exists:
```sql
select tgname from pg_trigger where tgname = 'trg_handle_new_user';
```

**OAuth redirect URL mismatch**
Make sure `https://<your-vercel-domain>/auth/callback` is in **Supabase → Authentication → URL Configuration → Redirect URLs**, and in your Google OAuth client's allowed redirects.

**Messages get blocked unexpectedly**
The keyword filter is intentionally aggressive on dating language. If you have `ANTHROPIC_API_KEY` set, the AI gets the final say. Tweak `lib/moderation.ts` if you want it gentler.

---

## What's stored where

| Data                 | Storage                           | RLS policy                            |
| -------------------- | --------------------------------- | ------------------------------------- |
| User auth            | `auth.users` (managed)            | —                                     |
| Profiles             | `public.profiles`                 | Browse active; only owner writes      |
| Activity plans       | `public.activity_plans`           | Browse open; only host writes         |
| Wing connections     | `public.wing_connections`         | Only the two parties                  |
| Messages             | `public.messages`                 | Only sender/receiver; blocks enforced |
| Ratings              | `public.wing_ratings`             | Only rater inserts; both read         |
| Reports              | `public.user_reports`             | Reporter sees own; mods see all       |
| Blocks               | `public.blocks`                   | Owner only                            |
