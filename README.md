# Myrakal 

Medical-travel concierge. A patient signs up, talks to Claude, which collects a fixed list of intake information, and a doctor reviews the transcript. The team emails a PDF plan, the patient comments or approves and pays, and the team makes the reservations. See `PLAN.md` for the full rebuild plan, status enum and API contract.

## Stack

- Next.js (App Router, `src/` directory), React 19, TypeScript
- Tailwind 4, shadcn / base-ui components, `motion`
- Prisma on Postgres (Supabase), Supabase Auth and Storage
- Stripe Checkout, Anthropic API
- Jest and Testing Library for unit tests, Playwright for e2e
- Oxlint, pnpm, Vercel

## Setup

```sh
pnpm install
cp .env.example .env
pnpm db:deploy
pnpm dev
```

`pnpm db:deploy` applies the migrations to the database in `DATABASE_URL` and `DIRECT_URL`; do it only against a database you mean to change. The app runs on http://localhost:3000. Fill `.env` with real values; every variable is listed in `.env.example`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Oxlint |
| `pnpm exec tsc --noEmit` | Type check (run `pnpm build` once first so Next generates its types) |
| `pnpm test` | Jest unit tests |
| `pnpm test:e2e` | Playwright tests |
| `pnpm screenshot [path ...]` | Screenshots of a running dev server into `.screenshots/` |
| `pnpm db:migrate` / `pnpm db:deploy` | Prisma migrations |
| `pnpm db:check` | Connectivity check against `DATABASE_URL` |

## Layout

- `src/app`: routes, route handlers (`src/app/api`) and metadata
- `src/views`: page bodies used by routes
- `src/components`: UI components
- `src/server`: server-only code (Prisma, Stripe, auth helpers)
- `prisma`: schema and migrations
- `tests/e2e`: Playwright specs

## Conventions

See `CLAUDE.md`: pnpm only, no code comments, 150-line diff budget, one branch and worktree per change, tests first.
