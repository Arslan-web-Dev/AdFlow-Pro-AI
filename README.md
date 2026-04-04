# AdFlow Pro

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Full-stack **sponsored listing marketplace**: public browse and detail pages, seller dashboards, moderation and admin tools, with **Supabase** auth and **Next.js 14** (App Router), **TanStack Query**, and **Tailwind CSS**.

---

## Table of contents

| | |
|--|--|
| 1 | [Key features](#key-features) |
| 2 | [Screenshots](#screenshots) |
| 3 | [Project summary](#project-summary) |
| 4 | [UI and design system](#ui-and-design-system) |
| 5 | [Technology stack](#technology-stack) |
| 6 | [Architecture](#architecture) |
| 7 | [Repository layout](#repository-layout) |
| 8 | [Routes](#routes) |
| 9 | [Authentication and RBAC](#authentication-and-rbac) |
| 10 | [Core systems](#core-systems) |
| 11 | [Database schema](#database-schema) |
| 12 | [Environment variables](#environment-variables) |
| 13 | [Getting started](#getting-started) |
| 14 | [Deploy (go live)](#deploy-go-live) |
| 15 | [Scripts](#scripts) |
| 16 | [Important files](#important-files) |
| 17 | [Roadmap](#roadmap) |
| 18 | [Contributing](#contributing) |
| 19 | [License](#license) |
| 20 | [Author](#author) |

---

## Key features

- **Dark marketplace UI** — Material-style tokens, glass header, gradients, **Inter** typography.
- **Public experience** — Landing (hero, featured listings, pricing), **Explore** with filter sidebar, **ad detail** (gallery, seller card, location strip).
- **Seller dashboard** — KPIs, campaigns table, activity feed, create-ad and payments flows (UI ready; hook to Supabase for live data).
- **Moderation and admin** — Queues, payment verification, analytics (Recharts) for elevated roles.
- **Route security** — `middleware.ts` applies authentication and **RBAC** per route prefix.
- **Ranking** — `lib/ranking-system.ts` combines featured flag, package weight, verification, freshness, and optional admin boost.

---

## Screenshots

The repo includes **placeholder images** in [`docs/screenshots/`](docs/screenshots/) so the sections below **render on GitHub** immediately. Replace those PNGs with your own captures (same filenames) for a real portfolio look.

| File | Replace with a capture of |
|------|---------------------------|
| `landing.png` | Home — hero, CTAs, featured strip |
| `explore.png` | Explore — filters + listing cards |
| `ad-detail.png` | Single ad — media + seller panel |
| `dashboard.png` | Seller dashboard |
| `admin.png` | Admin or moderator (optional) |

**GitHub tip:** The main repo page only shows **`README.md` at the repository root**. If AdFlow Pro is inside a subfolder, open [`03-AdFlow-Pro-AI/README.md`](./README.md) from the file tree, or add a short intro in the root `README` that links here.

### Landing

![Landing page](docs/screenshots/landing.png)

### Explore

![Explore marketplace](docs/screenshots/explore.png)

### Ad detail

![Listing detail](docs/screenshots/ad-detail.png)

### Dashboard

![Seller dashboard](docs/screenshots/dashboard.png)

### Admin / moderation (optional)

![Admin or moderator](docs/screenshots/admin.png)

---

## Project summary

Unauthenticated users can use the marketing site, browse listings, and open ad details. After sign-in, users access `/dashboard`; moderators and admins additionally use `/moderator` and `/admin`. Session cookies and role checks are handled by Supabase and `middleware.ts`.

---

## UI and design system

Dark, **Material-inspired** palette: deep navy surfaces, indigo primary (`#4f46e5`), cyan accent, high-contrast text.

| Topic | Where |
|-------|--------|
| CSS variables and utilities | `app/globals.css` (`--background`, `--card`, `--primary`, `.af-glass-header`, `.af-gradient`, …) |
| Tailwind semantic colors | `tailwind.config.ts` — `surface`, `surface-container`, `on-surface`, … |
| Font | [Inter](https://fonts.google.com/specimen/Inter) in `app/layout.tsx` |
| Public chrome | `components/layouts/main-nav.tsx`, `site-footer.tsx` |
| App shell | `dashboard-shell.tsx`, `dashboard-sidebar.tsx` |

---

## Technology stack

### Frontend

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router), React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3, project tokens |
| Components | shadcn/ui-style + Base UI |
| Icons | Lucide React |
| Animations | `tailwindcss-animate`, `tw-animate-css` |
| Toasts | Sonner |

### Backend and data

| Layer | Technology |
|-------|------------|
| Database / BaaS | Supabase (PostgreSQL) |
| Auth | Supabase Auth + `@supabase/ssr` |
| Data fetching | TanStack Query v5 |
| Client state | Zustand |
| Validation | Zod |
| Charts | Recharts |
| Optional AI | OpenAI via `/api/ai/*` |

---

## Architecture

```
Browser
   │
   ▼
middleware.ts     Session refresh, auth, RBAC by path
   │
   ▼
Next.js App Router
   ├── Public:  /, /explore, /ad/[slug], /auth/*
   ├── /dashboard/*     (client+)
   ├── /moderator/*     (moderator+)
   └── /admin/*         (admin, super_admin)
   │
   ▼
Supabase (PostgreSQL: users, ads, categories, cities, packages, payments)
```

---

## Repository layout

```
03-AdFlow-Pro-AI/
├── docs/screenshots/       # README images (landing.png, …)
├── app/                    # Routes, layouts, API routes
├── components/             # layouts/, providers/, ui/
├── lib/                    # supabase/, dummy-data, ranking-system, utils
├── middleware.ts
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## Routes

### Public

| Path | Description |
|------|-------------|
| `/` | Marketing and pricing |
| `/explore` | Browse listings |
| `/ad/[slug]` | Listing detail |
| `/auth/*` | Login, register, OAuth callback |

### Authenticated (representative)

| Prefix | Minimum role |
|--------|----------------|
| `/dashboard` | `client` |
| `/moderator` | `moderator` |
| `/admin` | `admin` or `super_admin` |

### API (representative)

| Prefix | Purpose |
|--------|---------|
| `/api/ai/*` | Optional AI helpers |
| `/api/cron/*` | Scheduled jobs (e.g. expiry) |

---

## Authentication and RBAC

1. **Supabase Auth** creates the session; **`@supabase/ssr`** reads/writes cookies on server and client.
2. **`middleware.ts`** refreshes the session, loads the user, reads `role` from `public.users`, and redirects if the role is insufficient for the path.
3. **`DashboardSidebar`** adjusts visible links based on whether you are under `/admin`, `/moderator`, or `/dashboard`.

Illustrative logic (see `middleware.ts` for the real code):

```typescript
if (!user && isProtectedPath(pathname)) redirect('/auth/login')
if (pathname.startsWith('/admin') && !isAdminRole(role)) redirect('/dashboard')
```

Role capability (high → low): `super_admin`, `admin`, `moderator`, `client`.

---

## Core systems

### Listing rank

**File:** `lib/ranking-system.ts` — combines featured status, package weight, seller verification, admin boost, and time-based freshness. Higher scores sort earlier when the browse API uses this field.

### Supabase clients

| File | Context |
|------|---------|
| `lib/supabase/client.ts` | Client Components |
| `lib/supabase/server.ts` | Server Components, Route Handlers, `middleware.ts` |

### UI kit

Shared primitives live in `components/ui/` and follow the same design tokens as the rest of the app.

---

## Database schema

Run in the Supabase SQL editor (adjust naming and add **RLS** for production):

```sql
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  role        TEXT NOT NULL DEFAULT 'client',
  name        TEXT,
  avatar_url  TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.categories (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  slug  TEXT NOT NULL UNIQUE,
  icon  TEXT
);

CREATE TABLE public.cities (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  state TEXT
);

CREATE TABLE public.packages (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  price          NUMERIC(10, 2) NOT NULL,
  duration_days  INTEGER NOT NULL,
  weight         INTEGER NOT NULL DEFAULT 0,
  is_featured    BOOLEAN DEFAULT false
);

CREATE TABLE public.ads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id    UUID REFERENCES public.users(id),
  category_id  INTEGER REFERENCES public.categories(id),
  city_id      INTEGER REFERENCES public.cities(id),
  package_id   INTEGER REFERENCES public.packages(id),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  price        NUMERIC(12, 2) NOT NULL,
  thumbnail    TEXT,
  status       TEXT DEFAULT 'pending',
  is_featured  BOOLEAN DEFAULT false,
  admin_boost  INTEGER DEFAULT 0,
  rank_score   INTEGER DEFAULT 0,
  expires_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id),
  ad_id        UUID REFERENCES public.ads(id),
  package_id   INTEGER REFERENCES public.packages(id),
  amount       NUMERIC(10, 2) NOT NULL,
  status       TEXT DEFAULT 'pending',
  proof_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Environment variables

Root file: **`.env.local`** (do not commit).

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

# Optional
# OPENAI_API_KEY=
# CRON_SECRET=
```

Only `NEXT_PUBLIC_*` keys are available in the browser.

---

## Getting started

**Prerequisites:** Node.js ≥ 18.17, npm ≥ 9 (or pnpm/yarn), a Supabase project.

```bash
git clone <your-repository-url>
cd 03-AdFlow-Pro-AI
npm install
```

Create `.env.local` as above, run the SQL schema in Supabase, seed data if needed (or use `lib/dummy-data.ts` for local UI only).

```bash
npm run dev
```

Application: [http://localhost:3000](http://localhost:3000).

---

## Deploy (go live)

Use your Vercel team dashboard, then import the GitHub repo and set **Root Directory** to `03-AdFlow-Pro-AI` if the repo is the parent monorepo.

**Dashboard:** [vercel.com/muhammad-arslans-projects-6abbf6f8](https://vercel.com/muhammad-arslans-projects-6abbf6f8) (log in with GitHub if needed).

1. Push the repo to GitHub.
2. **Add New → Project** from that dashboard → import the repository.
3. **Root Directory:** `03-AdFlow-Pro-AI` when the app is not at the repo root.
4. **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. **Deploy** → use the `*.vercel.app` URL Vercel assigns.

Full steps: [`docs/DEPLOY.md`](docs/DEPLOY.md).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs lint) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

---

## Important files

| Path | Purpose |
|------|---------|
| `middleware.ts` | Auth + RBAC |
| `app/layout.tsx` | Root layout and providers |
| `app/globals.css` | Design tokens |
| `lib/ranking-system.ts` | Listing score |
| `lib/supabase/client.ts`, `server.ts` | Supabase entry points |
| `components/layouts/dashboard-sidebar.tsx` | Nav + mobile drawer |

---

## Roadmap

- [ ] Wire UI to live Supabase data
- [ ] Working explore filters (category, city, price)
- [ ] Media upload for new listings
- [ ] Persist moderator actions
- [ ] Admin payment review flow
- [ ] Row Level Security on all tables
- [ ] Deploy (e.g. Vercel) with env vars

---

## Contributing

Issues and pull requests are welcome on your fork. For course submissions, follow your instructor’s collaboration rules.

---

## License

MIT. Add a root `LICENSE` file if your institution or publication requires it.

---

## Author

**Muhammad Arslan** — FA23-BCS-030 · Web technologies — AdFlow Pro (coursework).
