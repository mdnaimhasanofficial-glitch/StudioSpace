<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — dev server (Turbopack). This is also what writes the managed block above.
- `npm run build` — production build; runs its own TypeScript pass.
- `npm run lint` — `eslint` (flat config, whole repo).
- There is **no test runner, formatter, or `typecheck` script**. Typecheck manually with `npx tsc --noEmit`.

### Verification order

1. `npx next typegen` — **required first on a clean checkout.** `next-env.d.ts` is gitignored and imports `.next/*/types/routes.d.ts`, which define the global `LayoutProps<"/">` / `PageProps<...>` types used by `src/app/layout.tsx`. Without it, `tsc --noEmit` fails with `Cannot find name 'LayoutProps'`. Re-run after adding/renaming routes.
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build` (optional; covers typegen + types + prerender)

### Lint baseline

`npm run lint` currently fails with 2 pre-existing `react-hooks/set-state-in-effect` errors in shadcn-generated files (`src/components/ui/carousel.tsx`, `src/hooks/use-mobile.ts`). Not caused by your change — `eslint-config-next@16` ships `eslint-plugin-react-hooks@7` with strict effect rules.

## Stack — Next.js 16.4.3 / React 19.3

- App Router under `src/app`; path alias `@/*` → `./src/*` (no `baseUrl` in `tsconfig.json`).
- Bundled, version-matched docs: `node_modules/next/dist/docs/` (see managed block above).
- `next.config.ts` enables:
  - `cacheComponents: true` + `partialPrefetching: true` → the **Cache Components** model: `'use cache'` / `cacheLife` directives, and `params` / `searchParams` are **Promises** that must be awaited. Do not use pre-16 caching APIs (`revalidate`, `unstable_cache`).
  - `reactCompiler: true` (`babel-plugin-react-compiler`) → no manual `useMemo`/`useCallback` memoization.
  - Tailwind is loaded via the `@tailwindcss/turbopack` loader rule; there is **no** `tailwind.config.*` or `postcss.config.*`. Theme tokens live in `src/app/globals.css` (Tailwind v4 CSS-first + `shadcn/tailwind.css`).

## UI components — shadcn + Base UI

- shadcn v4, style `base-nova`, built on **Base UI primitives (`@base-ui/react`), not Radix** — never import `@radix-ui/*`.
- Add/upgrade components with `npx shadcn add <name>` (config: `components.json`); don't hand-write primitives.
- `cn` is the `cn` npm package, re-exported from `src/lib/utils.ts`. Don't add `clsx`/`tailwind-merge`.
- `src/lib/highlighter.tsx` lazily registers shiki languages; new language support goes in its `languages` map.

## Repo layout

- `src/app/` — routes (only `/` + root layout today). `src/components/ui/` — shadcn output (generated). `src/hooks/`, `src/lib/` — app code.
- Sibling `../studiospace-server` is a separate Express 5 + MongoDB backend (port 5000, own `.env`). It is not part of this package's tooling — run it independently if API work needs it.

## Git

- This folder has no `.git` of its own; the repo root resolves to `C:\Users\mdnai` with zero commits, so `git status` here lists unrelated home-directory files. Stage explicit paths — avoid `git add -A`.
