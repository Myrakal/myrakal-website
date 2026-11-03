# Myrakal

Landing page for Myrakal, an intelligent health platform that makes healthcare cheaper. Message us and we get back with free data on cheaper options.

The site is a single static page. The Prisma schema and migrations in `prisma/` are kept as is; there is no server code.

## Stack

- Next.js (App Router, `src/` directory), React 19, TypeScript
- Tailwind 4, `motion`
- Jest and Testing Library
- Oxlint, pnpm, Vercel

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Next dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Oxlint |
| `pnpm test` | Jest tests |
| `pnpm screenshot [path ...]` | Screenshots of a running dev server into `.screenshots/` |
| `pnpm db:migrate` / `pnpm db:deploy` | Prisma migrations |
| `pnpm db:check` | Connectivity check against `DATABASE_URL` |

## Conventions

See `CLAUDE.md`: pnpm only, no code comments, 150-line diff budget, one branch and worktree per change, tests first.
