-- Wing — Supabase schema (Postgres 15+)
-- Run in Supabase SQL Editor or via `supabase db push`.

------------------------------------------------------------
-- Tables
------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  age int check (age >= 18),
  bio text default '',
  location text,
  -- coarse coordinates only (3 decimals ≈ 100m precision)
  approx_lat numeric(7,3),
  approx_lng numeric(7,3),
  destination text,
  trip_purpose text check (trip_purpose in ('solo_traveler','local_guide','group_trip','business')),
  interests text[] default '{}',
  activities_wanted text[] default '{}',
  wing_preference text default '',
  is_local_guide boolean default false,
  verification_level text default 'phone' check (verification_level in ('phone','social','id')),
  reputation_score numeric(3,2) default 5.0 check (reputation_score >= 0 and reputation_score <= 5),
  is_active boolean default true,
  gender text check (gender in ('man','woman','nonbinary','prefer_not_to_say')),
  looking_for text[] default '{any}',
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists public.activity_plans (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null,
  title text not null,
  description text,
  location text,
  city text,
  datetime timestamptz not null,
  max_participants int default 2 check (max_participants between 2 and 20),
  current_participants int default 1,
  is_open boolean default true,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.wing_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  wing_id uuid not null references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending','connected','declined')),
  activity_id uuid references public.activity_plans(id) on delete set null,
  created_at timestamptz default now(),
  unique (user_id, wing_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read boolean default false,
  moderation_passed boolean,            -- null until moderation runs
  moderation_reason text,
  created_at timestamptz default now()
);

create table if not exists public.wing_ratings (
  id uuid primary key default gen_random_uuid(),
  rater_id uuid not null references public.profiles(id) on delete cascade,
  rated_id uuid not null references public.profiles(id) on delete cascade,
  connection_id uuid references public.wing_connections(id) on delete set null,
  score int not null check (score between 1 and 5),
  tags text[] default '{}',
  created_at timestamptz default now(),
  unique (rater_id, connection_id)
);

create table if not exists public.user_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text,
  status text default 'open' check (status in ('open','reviewing','closed')),
  created_at timestamptz default now()
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blocker_id, blocked_id)
);

------------------------------------------------------------
-- Indexes
------------------------------------------------------------

create index if not exists idx_profiles_active     on public.profiles (is_active, last_active desc);
create index if not exists idx_profiles_coords     on public.profiles (approx_lat, approx_lng);
create index if not exists idx_profiles_dest       on public.profiles (destination);
create index if not exists idx_plans_open_dt       on public.activity_plans (is_open, datetime);
create index if not exists idx_plans_host          on public.activity_plans (host_id);
create index if not exists idx_msgs_thread         on public.messages (sender_id, receiver_id, created_at desc);
create index if not exists idx_conn_user           on public.wing_connections (user_id, status);
create index if not exists idx_conn_wing           on public.wing_connections (wing_id, status);

------------------------------------------------------------
-- updated_at-style trigger isn't needed; created_at default is enough.
-- Keep reputation_score fresh when ratings come in.
------------------------------------------------------------

create or replace function public.recalc_reputation()
returns trigger language plpgsql as $$
begin
  update public.profiles
     set reputation_score = (
       select coalesce(round(avg(score)::numeric, 2), 5.0)
         from public.wing_ratings
        where rated_id = new.rated_id
     )
   where id = new.rated_id;
  return new;
end $$;

drop trigger if exists trg_recalc_reputation on public.wing_ratings;
create trigger trg_recalc_reputation
  after insert on public.wing_ratings
  for each row execute function public.recalc_reputation();

------------------------------------------------------------
-- Row Level Security
------------------------------------------------------------

alter table public.profiles         enable row level security;
alter table public.activity_plans   enable row level security;
alter table public.wing_connections enable row level security;
alter table public.messages         enable row level security;
alter table public.wing_ratings     enable row level security;
alter table public.user_reports     enable row level security;
alter table public.blocks           enable row level security;

-- Helper: is the other party blocking the caller (or vice versa)?
create or replace function public.is_blocked_with(other uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.blocks
     where (blocker_id = auth.uid() and blocked_id = other)
        or (blocker_id = other and blocked_id = auth.uid())
  )
$$;

-- profiles: anyone signed-in can browse active profiles; only owner writes.
drop policy if exists "profiles_select_active" on public.profiles;
create policy "profiles_select_active" on public.profiles
  for select to authenticated
  using (is_active = true and not public.is_blocked_with(id) or id = auth.uid());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- activity_plans: open plans visible to all; host fully controls own.
drop policy if exists "plans_select_open" on public.activity_plans;
create policy "plans_select_open" on public.activity_plans
  for select to authenticated using (is_open = true or host_id = auth.uid());

drop policy if exists "plans_insert_self" on public.activity_plans;
create policy "plans_insert_self" on public.activity_plans
  for insert to authenticated with check (host_id = auth.uid());

drop policy if exists "plans_modify_self" on public.activity_plans;
create policy "plans_modify_self" on public.activity_plans
  for update to authenticated using (host_id = auth.uid()) with check (host_id = auth.uid());

drop policy if exists "plans_delete_self" on public.activity_plans;
create policy "plans_delete_self" on public.activity_plans
  for delete to authenticated using (host_id = auth.uid());

-- wing_connections: only the two parties can see/insert/modify.
drop policy if exists "conn_select_party" on public.wing_connections;
create policy "conn_select_party" on public.wing_connections
  for select to authenticated using (user_id = auth.uid() or wing_id = auth.uid());

drop policy if exists "conn_insert_self" on public.wing_connections;
create policy "conn_insert_self" on public.wing_connections
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "conn_update_recipient" on public.wing_connections;
create policy "conn_update_recipient" on public.wing_connections
  for update to authenticated using (wing_id = auth.uid()) with check (wing_id = auth.uid());

-- messages: only sender/receiver read. Only sender inserts. Only receiver can
-- mark as read (update). Blocked pairs cannot insert.
drop policy if exists "msg_select_party" on public.messages;
create policy "msg_select_party" on public.messages
  for select to authenticated using (sender_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists "msg_insert_self" on public.messages;
create policy "msg_insert_self" on public.messages
  for insert to authenticated
  with check (sender_id = auth.uid() and not public.is_blocked_with(receiver_id));

drop policy if exists "msg_mark_read" on public.messages;
create policy "msg_mark_read" on public.messages
  for update to authenticated using (receiver_id = auth.uid()) with check (receiver_id = auth.uid());

-- wing_ratings: only the rater inserts, both parties read their own.
drop policy if exists "rating_select_party" on public.wing_ratings;
create policy "rating_select_party" on public.wing_ratings
  for select to authenticated using (rater_id = auth.uid() or rated_id = auth.uid());

drop policy if exists "rating_insert_self" on public.wing_ratings;
create policy "rating_insert_self" on public.wing_ratings
  for insert to authenticated with check (rater_id = auth.uid());

-- reports: any user can file, only see their own; moderators (service role) see all.
drop policy if exists "report_select_self" on public.user_reports;
create policy "report_select_self" on public.user_reports
  for select to authenticated using (reporter_id = auth.uid());

drop policy if exists "report_insert_self" on public.user_reports;
create policy "report_insert_self" on public.user_reports
  for insert to authenticated with check (reporter_id = auth.uid());

-- blocks: user controls own blocks only.
drop policy if exists "block_all_self" on public.blocks;
create policy "block_all_self" on public.blocks
  for all to authenticated using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

------------------------------------------------------------
-- Auto-create profile row when a new auth.users row is inserted.
-- Pulls name from raw_user_meta_data.name, falls back to email local-part.
------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, gender, trip_purpose)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'prefer_not_to_say',
    'solo_traveler'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists trg_handle_new_user on auth.users;
create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------
-- Realtime
------------------------------------------------------------

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.wing_connections;
alter publication supabase_realtime add table public.activity_plans;
