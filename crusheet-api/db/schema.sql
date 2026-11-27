-- db/schema.sql: the units table for the Crusade Sheet API.
-- Run it once in the Supabase dashboard: SQL Editor, New query, paste, Run.
-- Safe to run again: it skips what already exists and recreates the policies.
--
-- Shape matches the Unit type in data/crusade.js.
-- wargear and abilities are jsonb so the nested entries keep their exact keys
-- (Name, BS, AP...) and mixed values ("Melee", "2d6", 12) without extra tables.

create table if not exists public.units (
  id          bigint generated always as identity primary key,
  -- Who made it. null for seeded units, which nobody can delete through the API.
  user_id     uuid references auth.users (id) on delete cascade default auth.uid(),
  name        text    not null check (length(trim(name)) > 0),
  movement    integer not null check (movement >= 0),
  toughness   integer not null check (toughness > 0),
  save        integer not null check (save > 0),
  invuln_save integer          check (invuln_save > 0), -- null means no invulnerable save
  wounds      integer not null check (wounds > 0),
  wargear     jsonb   not null default '[]'::jsonb check (jsonb_typeof(wargear) = 'array'),
  abilities   jsonb   not null default '[]'::jsonb check (jsonb_typeof(abilities) = 'array'),
  created_at  timestamptz not null default now()
);

create index if not exists units_user_id_idx on public.units (user_id);

-- Row Level Security. The API uses the secret key, which skips these rules,
-- but they still protect the table if anyone ever reaches it with the public key.
alter table public.units enable row level security;

drop policy if exists "Anyone can read units" on public.units;
create policy "Anyone can read units"
  on public.units for select
  using (true);

drop policy if exists "Users add their own units" on public.units;
create policy "Users add their own units"
  on public.units for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their own units" on public.units;
create policy "Users update their own units"
  on public.units for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete their own units" on public.units;
create policy "Users delete their own units"
  on public.units for delete to authenticated
  using ((select auth.uid()) = user_id);
