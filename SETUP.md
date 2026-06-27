# ISAK Koblenz — Setup & Deployment Guide

This site is a static multi-page site (already on Vercel) plus serverless functions
in `/api` and a Supabase backend. Follow these steps once to make everything live.

---

## What's already built

- **Honest 2026 content** + your real **logo** and **photos** across all pages.
- **Founder section** on the home page (photo, bio, "book a chat", LinkedIn).
- **Working membership form** → saves to Supabase, emails you, emails the applicant
  the WhatsApp invite + member ID.
- **Newsletter** + **India pre-arrival lead capture** (`india.html`).
- **Admin panel** (`/admin.html`) — events, members, roadmap, leads, subscribers, invite admins.
- **Dynamic events** on the home + events pages (with safe static fallback).
- **Public roadmap** on the About page + **automated roadmap email reminders** (daily Vercel cron).
- **Instagram feed** (Elfsight) on the home page.

---

## Step 1 — Supabase project

1. Create a project at <https://supabase.com> (free tier is fine). Pick the EU (Frankfurt) region.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. **Storage → New bucket** → name it `media`, mark it **Public** → Create.
4. **Project Settings → API** → copy:
   - **Project URL**
   - **anon / public** key  → goes in `supabase-config.js`
   - **service_role** key  → goes in Vercel env (Step 5). Keep this secret.

## Step 2 — Connect the browser client

Edit `supabase-config.js` and paste your **Project URL** and **anon key**:

```js
window.ISAK_SUPABASE_URL = "https://xxxx.supabase.co";
window.ISAK_SUPABASE_ANON_KEY = "eyJ...your anon key...";
```

(Both are safe to commit — the anon key only allows the public reads defined by RLS.)

## Step 3 — Create the first admin (you)

1. Supabase **Authentication → Users → Add user**: email `anchalgupta.chp@gmail.com`,
   set a password, tick "Auto confirm".
2. **SQL Editor**, run:

```sql
insert into public.admins (id, email, name)
select id, email, 'Anchal Gera' from auth.users
where email = 'anchalgupta.chp@gmail.com';
```

3. You can now sign in at `/admin.html`. Invite the rest of your team from the **Admins** tab.

## Step 4 — Resend (email)

1. Create an account at <https://resend.com>.
2. **Domains → Add domain** `isak-koblenz.de` → add the shown DNS records at your domain
   host (SPF/DKIM). Wait until it's **Verified**. (Until then, emails only send to your own
   address via Resend's sandbox `onboarding@resend.dev`.)
3. **API Keys → Create** → copy the key for Vercel (Step 5).
4. Once the domain is verified, set `EMAIL_FROM` to e.g. `ISAK Koblenz <hello@isak-koblenz.de>`.

## Step 5 — Vercel environment variables

Vercel → your project → **Settings → Environment Variables** (Production + Preview):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | your Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret!) |
| `SUPABASE_ANON_KEY` | anon key |
| `RESEND_API_KEY` | from Resend |
| `EMAIL_FROM` | `ISAK Koblenz <hello@isak-koblenz.de>` (after domain verified) |
| `FOUNDER_EMAILS` | `anchalgupta.chp@gmail.com` (comma-separate to add more) |
| `WHATSAPP_INVITE_URL` | `https://chat.whatsapp.com/LVNXqJU9LokG6B6aPOQeTa?mode=gi_t` |
| `CRON_SECRET` | any long random string |
| `SITE_URL` | `https://isak-koblenz.de` (used for admin-invite links) |

## Step 6 — Deploy

Push to the branch connected to Vercel (or merge to `main`). Vercel installs the npm deps
(`@supabase/supabase-js`, `resend`) and registers the daily cron from `vercel.json`
automatically. Check **Vercel → Settings → Cron Jobs** shows `/api/cron-roadmap`.

---

## Test checklist (on the Vercel preview/production URL)

- [ ] **Membership:** submit the form on `/contact.html` → row appears in Supabase `members`,
      you get the "New ISAK member" email, the applicant gets the welcome + WhatsApp email.
      (Before the Resend domain is verified, test with your own email address.)
- [ ] **Honeypot/consent:** form refuses to submit without the consent box.
- [ ] **Newsletter:** footer form → row in `subscribers`.
- [ ] **India lead:** `/india.html` form → row in `leads` + guide email.
- [ ] **Admin:** sign in at `/admin.html`; add an event with an image and publish it →
      it shows on `/events.html` and the home page. Approve a member. 
- [ ] **Roadmap automation:** in admin, add a milestone due today with your email and lead
      days 0, then visit `/api/cron-roadmap?key=YOUR_CRON_SECRET` → you get the reminder and
      it shows "Notified: Sent". Running it again sends nothing.
- [ ] **Roadmap (public):** `/about.html` shows the 2026/2027/2028 roadmap.

---

## Still to add (content you own)

- Replace remaining stock images on `events.html`/home event cards by adding real events in
  the admin panel (they override the placeholders).
- Real Instagram/LinkedIn handles for the footer social icons (currently `#`).
- Confirm the founder bio wording on the home page.
- Light review of `blog.html` and `documents.html` (still contain example articles/files).

## Local development (optional)

```bash
npm install
npx vercel dev   # runs the static site + /api functions locally
```
Set the same env vars in a local `.env` (gitignored) for the functions to work locally.

## Security notes

- The **service_role** and **Resend** keys live ONLY in Vercel env vars — never in committed files.
- `admin.html` / `admin-onboarding.html` are `noindex` and gated by Supabase Auth + the `admins` table.
- All public writes go through `/api` (server-side) so the powerful key is never exposed.
