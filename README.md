# AdFlow Pro

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Full-stack **sponsored listing marketplace**: public browse and detail pages, seller dashboards, moderation and admin tools, with **Supabase** auth and **Next.js 14** (App Router), **TanStack Query**, and **Tailwind CSS**.

| | |
|--|--|
| **Live demo** | [https://ad-flow-pro-ai.vercel.app](https://ad-flow-pro-ai.vercel.app) |
| **Repository** | [Arslan-web-Dev/AdFlow-Pro-AI](https://github.com/Arslan-web-Dev/AdFlow-Pro-AI) |

---

## Table of contents

| | |
|--|--|
| 1 | [Key features](#key-features) |
| 2 | [Core product overview](#core-product-overview) |
| 3 | [Screenshots](#screenshots) |
| 4 | [Project summary](#project-summary) |
| 5 | [UI and design system](#ui-and-design-system) |
| 6 | [Technology stack](#technology-stack) |
| 7 | [Architecture](#architecture) |
| 8 | [Repository layout](#repository-layout) |
| 9 | [Routes](#routes) |
| 10 | [Authentication and RBAC](#authentication-and-rbac) |
| 11 | [Core systems](#core-systems) |
| 12 | [Database schema](#database-schema) |
| 13 | [Environment variables](#environment-variables) |
| 14 | [Getting started](#getting-started) |
| 15 | [Deploy (go live)](#deploy-go-live) |
| 16 | [Scripts](#scripts) |
| 17 | [Important files](#important-files) |
| 18 | [Roadmap](#roadmap) |
| 19 | [Contributing](#contributing) |
| 20 | [License](#license) |
| 21 | [Author](#author) |

---

## Key features

- **Dark marketplace UI** — Material-style tokens, glass header, gradients, **Inter** typography, responsive layouts.
- **Marketing site** — Landing with hero, featured listings, pricing, and clear CTAs to explore or sign up.
- **Browse & discovery** — **Explore** with filters (category, city, price), ranked listing cards, and smooth navigation to detail pages.
- **Listing pages** — **Ad detail** with media gallery, seller card, location, and package context.
- **Seller workspace** — **Dashboard** KPIs, ads table, activity, **create listing** wizard (category, city, package, payment steps), and profile/settings shells.
- **Trust & operations** — **Moderator** queue and **Admin** analytics, payments review, and user role management (UI flows; connect to Supabase for production data).
- **Auth & security** — **Supabase Auth** with `@supabase/ssr`; **`middleware.ts`** enforces sessions and **RBAC** (`client` → `moderator` → `admin` / `super_admin`).
- **Ranking** — `lib/ranking-system.ts` scores listings using featured flag, package weight, seller verification, freshness, and optional admin boost.
- **Optional AI** — `/api/ai/*` routes for helpers when `OPENAI_API_KEY` is set.

---

## Core product overview

| Area | What users get |
|------|----------------|
| **Visitors** | Browse featured and ranked ads, open any listing, view pricing plans, and sign in or register. |
| **Clients (sellers)** | Post and manage sponsored listings, pick packages, and complete payment flows in the dashboard. |
| **Moderators** | Review pending content from a dedicated queue. |
| **Admins** | View analytics, verify payments, and adjust user roles. |

**Production note:** Sign-in on the [live demo](https://ad-flow-pro-ai.vercel.app) requires valid **Supabase** environment variables on Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and matching Auth/DB setup. Without them, the UI still loads but auth requests can fail (e.g. “Failed to fetch”).

---

## Screenshots

Images below live in [`Screenshots/`](Screenshots/) (same folder name as on [GitHub](https://github.com/Arslan-web-Dev/AdFlow-Pro-AI/tree/main/Screenshots)). Filenames with spaces use URL-encoded paths so they render correctly on GitHub.

| File | What it shows |
|------|----------------|
| `lendingpage1.png` | Landing — hero & primary CTA |
| `lendingpage2.png` | Landing — featured / content section |
| `lendingpage3.png` | Landing — lower section (e.g. pricing teaser or footer) |
| `add page.png` | Seller flow — create or edit listing |
| `add details.png` | Listing detail — media, seller, metadata |
| `plans.png` | Pricing & packages |
| `loginpage.png` | Sign-in screen (`/auth/login`) |
| `Email_.png` | Email-related UI (signup / capture strip) |

**Monorepo deploy:** If this app is not at the Git repo root on Vercel, set **Root Directory** to the folder that contains `package.json` — illustrated in [`screenshots/vercel-root-directory.png`](screenshots/vercel-root-directory.png).

### Landing

![Landing — section 1](Screenshots/lendingpage1.png)

![Landing — section 2](Screenshots/lendingpage2.png)

![Landing — section 3](Screenshots/lendingpage3.png)

### Create listing

![Create listing](Screenshots/add%20page.png)

### Listing detail

![Listing detail](Screenshots/add%20details.png)

### Pricing

![Pricing plans](Screenshots/plans.png)

### Sign in

![Sign in](Screenshots/loginpage.png)

### Email

![Email UI](Screenshots/Email_.png)

### Vercel: Root Directory (folder pick)

![Vercel import — Root Directory](docs/screenshots/vercel-root-directory.png)

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
AdFlow-Pro-AI/
├── Screenshots/            # README portfolio images (landing, login, …)
├── docs/
│   ├── screenshots/        # e.g. vercel-root-directory.png (deploy)
│   └── DEPLOY.md
├── app/                      # Routes, layouts, API routes
├── components/               # layouts/, providers/, ui/
├── lib/                      # supabase/, dummy-data, ranking-system, utils
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
git clone https://github.com/Arslan-web-Dev/AdFlow-Pro-AI.git
cd AdFlow-Pro-AI
npm install
```

Create `.env.local` as above, run the SQL schema in Supabase, seed data if needed (or use `lib/dummy-data.ts` for local UI only).

```bash
npm run dev
```

Application: [http://localhost:3000](http://localhost:3000).

---

## Deploy (go live)

Use the [Vercel dashboard](https://vercel.com/muhammad-arslans-projects-6abbf6f8) (GitHub login) and import **[Arslan-web-Dev/AdFlow-Pro-AI](https://github.com/Arslan-web-Dev/AdFlow-Pro-AI)**.

1. Push the repo to GitHub.
2. **Add New → Project** → import the repository.
3. **Root Directory:** leave default **`.`** when this repo is only the Next.js app. If the app lives inside a **parent monorepo folder**, set Root Directory to that subfolder (see screenshot in [Screenshots](#screenshots)).
4. **Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required for real sign-in on production).
5. **Deploy** → example URL: [ad-flow-pro-ai.vercel.app](https://ad-flow-pro-ai.vercel.app).

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
- [x] Deploy to Vercel (set Supabase env vars for working auth)

---

## Contributing

Issues and pull requests are welcome on your fork. For course submissions, follow your instructor’s collaboration rules.

---

## License

MIT. Add a root `LICENSE` file if your institution or publication requires it.

---

## Author

**Muhammad Arslan** — FA23-BCS-030 · Web technologies — AdFlow Pro (coursework).
