# StudioSpace — Client

Peer-to-peer marketplace for booking creative studios by the hour — photo studios, sound stages, podcast lounges, rehearsal rooms and video suites. Browse, save, book, and list your own space.

This is the **Next.js frontend**. It works against a sibling Express + MongoDB backend (`../studiospace-server`); without the backend it still renders the full seed catalogue, so the UI is usable standalone.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | [Next.js 16.4](https://nextjs.org) (App Router, Cache Components, Partial Prefetching, Turbopack) |
| UI | React 19.3, TypeScript, Tailwind CSS v4 (CSS-first theme), shadcn/ui v4 on **Base UI** primitives |
| Icons | lucide-react |
| Backend (sibling) | Express 5, MongoDB, JWT auth, bcryptjs |

> **Note:** this project uses Base UI (`@base-ui/react`), **not** Radix — never import `@radix-ui/*`.

## Features

- **Explore** (`/studios`) — combined catalogue (backend listings first, then seed), category chips, price bands, sort, live count
- **Studio detail** (`/studios/[slug]`) — seed studios prerender statically; backend-only studios stream in via client lookup, so added listings never 404
- **Auth** — register/login, private routes (wishlist, bookings, my studios) redirect to login
- **Wishlist** — heart any studio; saved slugs resolve against both catalogues
- **Bookings** — book by the hour, view in `/account/bookings`, cancel with confirmation
- **Host tools** — add (`/studios/new`) and edit (`/account/studios/edit/[id]`) your listings, delete from My Studios
- **Home** — hero carousel, live discipline counts, featured grid, recently added, how-it-works, about
- **Polish** — branded loading skeletons per route, custom 404 page, scroll-reveal animations, dark/light theme

### Demo login

```
email:    demo@studiospace.io
password: demo1234
```

## Getting started

### 1. Backend (required for live data)

```bash
cd ../studiospace-server
npm install
# .env:  PORT=5000  MONGODB_URI=...  JWT_SECRET=...
npm run dev        # http://localhost:5000
```

### 2. Frontend

```bash
npm install
# .env.local:  NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev       # http://localhost:3000
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server (Turbopack) |
| `npm run build` | production build (runs its own TypeScript pass) |
| `npm start` | serve the production build |
| `npm run lint` | ESLint (flat config, whole repo) |
| `npx tsc --noEmit` | typecheck (no `typecheck` script; `next typegen` first on a clean checkout) |

## Routes

| Page | Path | Notes |
| --- | --- | --- |
| Home | `/` | hero, categories, featured, recently added |
| Explore | `/studios` | filters via URL (`?category=Photo`) |
| Studio detail | `/studios/[slug]` | static for seed slugs, streamed for API studios |
| Add studio | `/studios/new` | protected |
| My studios | `/account/studios` | protected, edit/delete |
| Edit studio | `/account/studios/edit/[id]` | protected |
| Bookings | `/account/bookings` | protected, cancel with confirm |
| Wishlist | `/wishlist` | protected |
| Login / Register | `/login`, `/register` | |
| 404 | any unknown URL | branded not-found page |

### API consumed

```
POST   /api/auth/register        POST /api/auth/login
GET    /api/studios              POST /api/studios
GET    /api/studios/mine         GET  /api/studios/:slug
PUT    /api/studios/:id          DELETE /api/studios/:id
POST   /api/bookings             GET  /api/bookings/mine
POST   /api/bookings/:id/cancel
```

## Project structure

```
src/
  app/                 routes (App Router) + loading.tsx / not-found.tsx
  components/
    account/ animation/ auth/ home/ layout/
    studio/            cards, directory, detail view, forms, skeletons
    theme/ ui/ wishlist/
  lib/
    api.ts             backend client + shared mappers
    studios.ts         seed catalogue + categories
    auth-store.ts      JWT/session persistence
    wishlist.ts        localStorage wishlist store
```

## Notes for contributors

- **Theme tokens** live in `src/app/globals.css` (Tailwind v4 CSS-first + `shadcn/tailwind.css`) — there is no `tailwind.config.*`.
- **`reactCompiler: true`** — no manual `useMemo`/`useCallback`.
- **Cache Components** — `params` / `searchParams` are Promises; await them behind a Suspense boundary (route `loading.tsx` counts). Don't use pre-16 APIs (`revalidate`, `unstable_cache`).
- **Lint baseline:** `npm run lint` has 2 pre-existing `react-hooks/set-state-in-effect` errors in shadcn-generated files (`src/components/ui/carousel.tsx`, `src/hooks/use-mobile.ts`).
- **Build while `next dev` runs** fails with `EPERM` on `.next` (Windows) — stop the dev server first.
- **Image hosts** are wildcarded in `next.config.ts` (`images.remotePatterns: { hostname: "**" }`) so user-submitted photo URLs render — keep it if you extend image handling.
