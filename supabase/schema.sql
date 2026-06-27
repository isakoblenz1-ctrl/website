-- ============================================================================
-- ISAK Koblenz — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ADMINS  (who is allowed to manage the site)
-- A row here = an authenticated user (by Supabase Auth uid) with admin rights.
-- ----------------------------------------------------------------------------
create table if not exists public.admins (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text,
  created_at  timestamptz not null default now()
);

-- Helper: is the current request an admin?  (used by every write policy)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.id = auth.uid());
$$;

-- ----------------------------------------------------------------------------
-- MEMBERS  (membership applications)
-- ----------------------------------------------------------------------------
create sequence if not exists public.member_seq start 1;

create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  member_id   text unique,                 -- friendly id e.g. ISAK-2026-0042
  first_name  text not null,
  last_name   text,
  email       text not null,
  program     text,
  semester    text,
  hometown    text,
  campus      text,
  university  text,
  interests   text,
  status      text not null default 'pending',  -- pending | active | archived
  source      text default 'website',
  created_at  timestamptz not null default now()
);
create unique index if not exists members_email_key on public.members (lower(email));

-- Auto-assign a friendly member_id on insert.
create or replace function public.set_member_id()
returns trigger language plpgsql as $$
begin
  if new.member_id is null then
    new.member_id := 'ISAK-' || to_char(now(), 'YYYY') || '-' ||
                     lpad(nextval('public.member_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;
drop trigger if exists trg_set_member_id on public.members;
create trigger trg_set_member_id before insert on public.members
  for each row execute function public.set_member_id();

-- ----------------------------------------------------------------------------
-- SUBSCRIBERS  (newsletter)
-- ----------------------------------------------------------------------------
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz not null default now()
);
create unique index if not exists subscribers_email_key on public.subscribers (lower(email));

-- ----------------------------------------------------------------------------
-- LEADS  (students in India / pre-arrival outreach)
-- ----------------------------------------------------------------------------
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  email           text not null,
  target_intake   text,
  city_in_india   text,
  course_interest text,
  status          text not null default 'new',  -- new | nurturing | converted
  created_at      timestamptz not null default now()
);
create index if not exists leads_email_idx on public.leads (lower(email));

-- ----------------------------------------------------------------------------
-- EVENTS
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique,
  category    text default 'Community',     -- Cultural | Career | Welcome | Community
  date        date,
  time        text,
  location    text,
  summary     text,
  body        text,
  image_url   text,
  rsvp_url    text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists events_published_date_idx on public.events (published, date);

-- ----------------------------------------------------------------------------
-- EVENT RSVPs
-- ----------------------------------------------------------------------------
create table if not exists public.event_rsvps (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events (id) on delete cascade,
  name        text,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ROADMAP MILESTONES  (public roadmap + automated admin reminders)
-- ----------------------------------------------------------------------------
create table if not exists public.roadmap_milestones (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text,
  year               int,
  due_date           date,
  recipient_emails   text[] default '{}',
  reminder_lead_days int not null default 14,
  is_public          boolean not null default true,   -- show on About roadmap
  notified_at        timestamptz,                      -- set when reminder sent
  created_at         timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.admins             enable row level security;
alter table public.members            enable row level security;
alter table public.subscribers        enable row level security;
alter table public.leads              enable row level security;
alter table public.events             enable row level security;
alter table public.event_rsvps        enable row level security;
alter table public.roadmap_milestones enable row level security;

-- ADMINS: only admins can read the admin list; nobody edits it via the client
drop policy if exists admins_select on public.admins;
create policy admins_select on public.admins for select using (public.is_admin());

-- EVENTS: public can read published rows; admins do everything
drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events
  for select using (published = true or public.is_admin());
drop policy if exists events_admin_write on public.events;
create policy events_admin_write on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- ROADMAP: public can read public rows; admins do everything
drop policy if exists roadmap_public_read on public.roadmap_milestones;
create policy roadmap_public_read on public.roadmap_milestones
  for select using (is_public = true or public.is_admin());
drop policy if exists roadmap_admin_write on public.roadmap_milestones;
create policy roadmap_admin_write on public.roadmap_milestones
  for all using (public.is_admin()) with check (public.is_admin());

-- MEMBERS / SUBSCRIBERS / LEADS / RSVPs:
-- No anonymous access. Inserts happen server-side via the service-role key
-- (which bypasses RLS). Admins can read & manage.
drop policy if exists members_admin_all on public.members;
create policy members_admin_all on public.members
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists subscribers_admin_all on public.subscribers;
create policy subscribers_admin_all on public.subscribers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists leads_admin_all on public.leads;
create policy leads_admin_all on public.leads
  for all using (public.is_admin()) with check (public.is_admin());

-- Allow anyone to RSVP (insert only); admins can read
drop policy if exists rsvps_public_insert on public.event_rsvps;
create policy rsvps_public_insert on public.event_rsvps
  for insert with check (true);
drop policy if exists rsvps_admin_read on public.event_rsvps;
create policy rsvps_admin_read on public.event_rsvps
  for select using (public.is_admin());

-- ============================================================================
-- STORAGE  (event images, photos)
-- Create the bucket in Dashboard → Storage → New bucket named "media" (public),
-- or uncomment the line below if the storage schema is available.
-- ============================================================================
-- insert into storage.buckets (id, name, public) values ('media','media',true)
--   on conflict (id) do nothing;

-- Public read of media; admin upload/update/delete
drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');
drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- ============================================================================
-- SEED: roadmap milestones (edit emails/dates in the admin panel later)
-- Replace 'anchalgupta.chp@gmail.com' recipients as your team grows.
-- ============================================================================
insert into public.roadmap_milestones (title, description, year, due_date, recipient_emails, reminder_lead_days, is_public)
values
  ('Register ISAK as e.V. (Verein)',
   'Draft the Satzung, gather 7+ founding members, hold the Gründungsversammlung, register with the Vereinsregister (Amtsgericht) and apply for Gemeinnützigkeit at the Finanzamt.',
   2026, '2026-09-15', array['anchalgupta.chp@gmail.com'], 30, true),
  ('First Winter-Semester Welcome programme',
   'Plan and run the welcome programme for new arrivals: Anmeldung help, SIM cards, housing tips and a welcome dinner.',
   2026, '2026-10-01', array['anchalgupta.chp@gmail.com'], 21, true),
  ('First ISAK Diwali celebration',
   'Book a venue, plan performances and food, sort sponsorship and tickets for our first Diwali.',
   2026, '2026-10-20', array['anchalgupta.chp@gmail.com'], 30, true),
  ('Elect the first official board',
   'Hold elections at the founding assembly and hand over roles.',
   2026, '2026-12-01', array['anchalgupta.chp@gmail.com'], 21, true),
  ('Launch careers & mentorship programme',
   'CV workshops, company connects, and a senior-to-newcomer mentorship scheme.',
   2027, '2027-03-01', array['anchalgupta.chp@gmail.com'], 30, true),
  ('Annual Finanzamt / Gemeinnützigkeit report',
   'File the annual non-profit report and keep the e.V. in good standing.',
   2027, '2027-05-31', array['anchalgupta.chp@gmail.com'], 30, false),
  ('Launch ISAK scholarship / hardship fund',
   'Set up a small fund to support students in need; build the alumni network.',
   2028, '2028-03-01', array['anchalgupta.chp@gmail.com'], 45, true)
on conflict do nothing;
