# Contributing to Wing

Quick reference for the team. Read this once.

## Local setup

```bash
git clone https://github.com/fharold50/wing.git
cd wing
npm install
cp .env.example .env.local   # ask Harold for the live Supabase keys
npm run dev
```

If `.env.local` is empty or missing Supabase keys, Wing runs in **demo mode** with sample data. To work against the real database, ping Harold for the keys.

See [`SETUP.md`](./SETUP.md) for the full env var rundown.

## Branching & PRs

- `main` is protected. **Never push to it directly.** Always go through a PR.
- Branch off `main`:
  ```bash
  git checkout main
  git pull
  git checkout -b feat/short-description
  ```
- Branch name prefixes:
  - `feat/...` — new feature
  - `fix/...` — bug fix
  - `chore/...` — tooling, deps, refactor with no behavior change
  - `db/...` — schema / RLS changes
- Push your branch and open a PR against `main`.
- **Every PR needs at least one approval** from the other partner before merging.
- Use the PR template — screenshots are required for UI changes.

## Commit messages

Imperative present tense. Short subject line, optional body if needed.

```
Add photo upload to profile
```

Not:

```
Added photo upload (also fixed bug)
```

If you touch the schema, mention it: `db: add photos table`.

## Code style

- TypeScript strict mode is on. Don't `any`-out errors — narrow them.
- Server actions live in `app/actions.ts`. Don't import them from server components — call them from client components only.
- Server components fetch via `lib/session.ts` so demo mode keeps working.
- Don't import `lib/supabase/client.ts` outside `"use client"` files.
- Don't import `lib/supabase/server.ts` outside server components / server actions / route handlers.

## Schema changes

Wing's database schema lives in `supabase/schema.sql`. When you change it:

1. Edit `supabase/schema.sql` (the whole truth)
2. Run it in **Supabase SQL Editor** against the live database (additive migrations only — never drop columns without a migration plan)
3. Mention the schema change in your PR description

## Anti-hookup AI Shield

If you touch anywhere that handles user-generated text (messages, bios, plan titles, etc.), make sure the moderation pipeline (`lib/moderation.ts`) still runs **before** the text is persisted or shown. The shield is the platform's main differentiator — never bypass it.

## Deployment

`main` auto-deploys to Vercel on every merge. PR branches get preview deployments at `wing-<branch>.vercel.app`. Check the preview before approving a UI PR.

## Questions

Open a Discussion on the repo or ping Harold.
