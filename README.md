# Myrakal 

Marketing site for Myrakal: a landing page plus public pages (privacy, terms, accessibility, contact).

## Stack

- Next.js (App Router, `src/` directory), React 19, TypeScript
- Tailwind 4, shadcn / base-ui components, `motion`
- Jest and Testing Library for unit tests, Playwright for e2e
- Oxlint, pnpm, Vercel

## Setup

```sh
pnpm install
cp .env.example .env
pnpm dev
```

The app runs on http://localhost:3000. Variables are listed in `.env.example`.

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

## Layout

- `src/app`: routes and metadata
- `src/views`: page bodies used by routes
- `src/components`: UI components
- `tests/e2e`: Playwright specs

## Conventions

See `CLAUDE.md`: pnpm only, no code comments, 150-line diff budget, one branch and worktree per change, tests first.
