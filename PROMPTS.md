# Window prompts

Paste one prompt per Claude Code window, each started in `/Users/ani/Code/myrakal/myrakal-website`. Start Window 1 first; the others wait on its `chore/next-scaffold` branch.

## Window 1: trunk and infrastructure

You are Window 1 of 4 rebuilding the Myrakal site as a Next.js app (no Vite). Read `CLAUDE.md` and `PLAN.md` fully, then build your MRs in this order: R4, R5, X1, X2, X3, R1, R2, R3, Z2. R4 -> R5 -> X1 is the trunk every other window waits on: push each branch the moment its local checks pass, before the review round, then keep going. Follow the Rules, Autonomy and Coordination sections of `PLAN.md` exactly. Work only in your own worktrees. When your list is done, send the final summary.

## Window 2: chats and payments backend

You are Window 2 of 4 rebuilding the Myrakal site as a Next.js app. Read `CLAUDE.md` and `PLAN.md` fully, then build your MRs in this order: B1, B2, B3, B4, B5, B6, B7, B8. B1 is based on `chore/next-scaffold` (X1) from Window 1; poll `git ls-remote --heads origin chore/next-scaffold` until it exists, and do not build on a base you cannot see. Backend code is App Router Route Handlers under `src/app/api` and helpers under `src/server`, exactly as in the API contract. Tests mock Prisma, Supabase and Stripe. Follow the Rules, Autonomy and Coordination sections of `PLAN.md` exactly. Push B2 as soon as it is green because Window 4 stacks on it. When your list is done, send the final summary.

## Window 3: auth and patient portal frontend

You are Window 3 of 4 rebuilding the Myrakal site as a Next.js app. Read `CLAUDE.md` and `PLAN.md` fully, then build your MRs in this order: F1, F2, F3, F4, F5, F6, F7, F12 (F12 is based on F3 and can go whenever F3 is pushed). F1 is based on `chore/next-routes` (X2) from Window 1; poll `git ls-remote --heads origin chore/next-routes` until it exists. Use the App Router, mark interactive components `'use client'`, and mock `fetch` against the API contract in your tests. Frontend MRs need screenshots from `scripts/screenshot.ts`, published as claude.ai artifacts and linked in the PR. Follow the Rules, Autonomy and Coordination sections of `PLAN.md` exactly. Push F7 as soon as it is green because Window 4 stacks on it. When your list is done, send the final summary.

## Window 4: AI intake and plan frontend

You are Window 4 of 4 rebuilding the Myrakal site as a Next.js app. Read `CLAUDE.md` and `PLAN.md` fully, then build your MRs in this order: B9, B10, B11, B12, B13, then F8, F9, F10, F11, Z1. B9 is based on `feat/chats-api` (B2) from Window 2; poll `git ls-remote --heads origin feat/chats-api` until it exists. F8 is based on `feat/portal-chat` (F7) from Window 3; poll for it the same way, and until then keep working the backend chain. Test the Claude client with a mocked SDK; never call the real API. Frontend MRs need screenshots from `scripts/screenshot.ts`, published as claude.ai artifacts and linked in the PR. Follow the Rules, Autonomy and Coordination sections of `PLAN.md` exactly. When your list is done, send the final summary.
