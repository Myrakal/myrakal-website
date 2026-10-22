# Myrakal rebuild plan (Next.js)

Every agent reads this file first, plus `CLAUDE.md`. This file is the source of truth for scope, contracts and who builds what. Re-read this file and `CLAUDE.md` before starting every MR; it can change while you work. If reality disagrees with it, extend the contract minimally and say so in the PR (see Autonomy).

## Product

Medical-travel concierge. Patient flow: sign up or log in (Supabase Auth, email + password, no confirmation step) -> talk to Claude, which fills a fixed list of info -> redirected to that chat's portal page -> doctors review the transcript -> we email the plan (manually) -> patient reviews the PDF plan, comments or approves -> pays -> we make reservations -> we email everything (manually).

The dashboard (`/dashboard`) lists the patient's chats. Back from a chat goes there. A patient may have many chats.

We never send email from code. Only Supabase Auth sends mail. The team flips `status` by hand in Supabase and emails patients by hand.

## Stack

The whole app is Next.js (latest stable, App Router, `src/` directory), TypeScript, Tailwind 4, pnpm, deployed on Vercel. Vite is gone: no `vite.config.ts`, `index.html`, `src/main.tsx`, `vercel.json` rewrites or `@vitejs/plugin-react`, and `vite` is not a declared dependency. Vitest stays as the unit test runner (it brings Vite in transitively; that is accepted) and Playwright stays for e2e.

- Routing is the filesystem under `src/app`. Per-route titles use the `metadata` export. Unknown paths use `src/app/not-found.tsx`.
- Components that use state, effects, `motion` or browser APIs start with `'use client'`. Static pages stay server components.
- API routes are Route Handlers at `src/app/api/**/route.ts`, exporting `GET`/`POST` on the Web `Request`/`Response`. `params` is a Promise: `{ params }: { params: Promise<{ id: string }> }`. Unsupported methods return 405 with `allow`.
- Server code lives in `src/server/` (imported as `@/server/...`). Prisma stays server-side only.
- Env: client vars are `NEXT_PUBLIC_*`. Analytics is initialised in `src/instrumentation-client.ts`.
- Auth uses `@supabase/ssr` cookie sessions, not bearer tokens. `src/proxy.ts` runs on every path except static assets and `/api/stripe-webhook`: it refreshes the session everywhere (API routes included) and redirects signed-out visitors from `/dashboard`, `/chat` and `/chats/*` to `/login`. Cookie sessions are CSRF-exposed, so every non-GET route except the webhook calls `sameHost` and returns 403 on mismatch, besides `requireUser`.

## Status enum (`ChatStatus`)

| Value | Patient sees | Moved by |
|---|---|---|
| `intake` | Talking to the AI | chat created |
| `doctor_review` | A doctor will review your transcript. Your plan will be emailed to you. | AI completes intake |
| `plan_ready` | PDF plan, comment box, Approve | team, by hand |
| `clarification_review` | Your comments are being reviewed. We will email you the updated plan. | patient posts a comment |
| `awaiting_payment` | Approved. Pay button. | patient approves |
| `reservations` | Reservations are being made. We will reach out once they are done. | Stripe webhook |
| `booked` | We have emailed you everything. | team, by hand |

Allowed API transitions only: `intake->doctor_review`, `plan_ready->clarification_review` (comment), `plan_ready->awaiting_payment` (approve), `awaiting_payment->reservations` (webhook). Every transition is a conditional `updateMany` on the expected current status; zero rows updated means 409.

## Decisions

- A chat not owned by the caller returns 404, never 403. No session returns 401.
- Plan = PDF in a private Supabase Storage bucket `plans`, file `{chatId}_plan.pdf`. Revisions overwrite the same file. The server returns a short-lived signed URL, only when status is `plan_ready`, `clarification_review`, `awaiting_payment`, `reservations` or `booked`; otherwise 404.
- Price: `Chat.priceCents` (nullable) overrides env `PLAN_PRICE_CENTS` (default `15000`). The payment covers all reservation costs.
- Comments are a per-chat list with timestamps; no cancel flow; no record uploads.
- AI replies are not streamed (single JSON response). Model name in env `ANTHROPIC_MODEL` (Sonnet). The system prompt forbids diagnosing and sends emergencies to 911.
- The old scripted intake, emergency detector branches and doctor token page are not carried over.
- Env renames: `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` become `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (X1, together with every `import.meta.env` read, so the build stays green). The server reuses `NEXT_PUBLIC_SUPABASE_URL`. New server vars, added to `.env.example` in B2 only: `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `SUPABASE_SERVICE_ROLE_KEY`, `PLAN_PRICE_CENTS`, `PLAN_BUCKET` (default `plans`). `DOCTOR_TOKEN` and `CONSULT_PRICE_CENTS` are removed in R4.
- Dependencies: X1 adds `next` and `@tailwindcss/postcss` and removes `vite`, `@vitejs/plugin-react` and `@tailwindcss/vite`; F2 adds `@supabase/ssr`; B10 adds `@anthropic-ai/sdk`. No other MR touches `package.json` or the lockfile without a note in its PR.

## Data model (B1)

`Chat { id uuid, userId uuid (Supabase user), status ChatStatus @default(intake), intake Json @default("{}"), priceCents Int?, stripeSessionId String? @unique, paidAt DateTime?, createdAt }`, `Message { id, chatId, role 'assistant'|'user', text, createdAt }`, `Comment { id, chatId, text, createdAt }`. Index `Chat(userId, createdAt)`. B1 drops the old `intakes` table by migration file only; nobody runs it against the real database (see Autonomy).

## API contract

`progress` is `{ collected: number, total: number }`: required intake fields filled so far, and how many there are. It is computed on the server from `Chat.intake`, never from the transcript.

All routes need a signed-in session (401 without), return JSON, and use `cache-control: no-store`. UUID path segment is `:id`.

| Route | Request | Response |
|---|---|---|
| `POST /api/chats` | none | 201 `{ id }` |
| `GET /api/chats` | none | `[{ id, status, createdAt, summary: string\|null }]` newest first, own chats only |
| `GET /api/chats/:id` | none | `{ id, status, createdAt, priceCents, paid, progress, messages:[{id,role,text,createdAt}], comments:[{id,text,createdAt}] }` |
| `POST /api/chats/:id/messages` | `{ text }` | `{ reply:{id,role:'assistant',text,createdAt}, status, progress }`; only in `intake`, else 409 |
| `GET /api/chats/:id/plan` | none | `{ url }` or 404 |
| `POST /api/chats/:id/comments` | `{ text }` (max 4000) | 201 `{ status:'clarification_review' }`; only from `plan_ready`, else 409 |
| `POST /api/chats/:id/approve` | none | `{ status:'awaiting_payment' }`; only from `plan_ready`, else 409 |
| `POST /api/chats/:id/checkout` | none | `{ url }`; only in `awaiting_payment`, else 409; reuses an open session |
| `POST /api/stripe-webhook` | Stripe event (raw body, signature header) | 200; `checkout.session.completed` + paid + `metadata.chatId` -> `reservations`. Not session-authenticated |

Files: `src/app/api/chats/route.ts`, `src/app/api/chats/[id]/route.ts`, `src/app/api/chats/[id]/<action>/route.ts`, `src/app/api/stripe-webhook/route.ts`. Shared helpers: `src/server/http.ts` (`json`, `sameHost`, `UUID`) and `src/server/auth.ts` (`requireUser`, reads the cookie session through `@supabase/ssr`), both created in B2.

## Info the AI collects (B9)

Required: name, DOB, country of residence, passport nationality, phone, preferred language; condition or goal, symptoms and duration, past treatments and surgeries, current medications, allergies, other conditions, urgency; care preferences (destinations or open, doctor gender and language, priority: cost, wait time or reputation); departure city, date flexibility, travelers and companions, mobility needs, expected recovery length; budget range, insurance plan; visas held, passport valid 6+ months; consent that the AI is not medical advice and a doctor reviews the case. Optional: existing records and doctors. Claude gets an `update_intake` tool and calls it with whatever new fields it learned each turn; the server merges them into `Chat.intake` (B11). Intake completes when every required field is filled (B12). The chat page shows a simple bar filling as `progress.collected / progress.total` grows (F6).

## Rules for every agent

1. Follow `CLAUDE.md`: pnpm only; no code comments; 150 diff lines max excluding tests (split and tell the user if it will not fit); never work on main.
2. One MR = one branch = one worktree at `/Users/ani/Code/myrakal/worktrees/<branch with / replaced by ->`, created from the MR's base (table below). Branch names are exactly as listed.
3. Order inside an MR: failing tests first, then code until green, then `pnpm lint`, `pnpm exec tsc -b`, `pnpm test`, `pnpm build`. Copy `.env` into each new worktree and run `pnpm install`.
4. Frontend MRs: screenshots with `scripts/screenshot.ts`, published as claude.ai artifacts and linked in the PR.
5. Run the `reviewer` agent with only the diff command. Fix its findings; decide tradeoffs yourself and record them (see Autonomy).
6. Open the PR with `gh pr create --base <base branch>` using `.github/pr_template.md`.
7. Frontend tests mock `fetch` against the contract above; backend tests mock Prisma, Supabase and Stripe. No MR may need the other side to be merged to pass.

## Autonomy

This section overrides every "ask the user" line in `CLAUDE.md` and in this file. The user is away and reviews everything later, expecting a finished product.

- Never stop, pause or ask questions, and never wait for a reply. Decide product, UX, copy and tradeoffs yourself, choosing the simplest option consistent with this plan. List each decision in the PR under "Decisions made".
- Never do anything destructive or hard to reverse: do not delete or force-push branches or files you do not own (`--force-with-lease` on your own branches only), merge any PR, reset, drop or migrate the real database, touch another window's files or worktrees, or skip tests or hooks.
- Keep going until every MR on your list has an open PR with passing local checks, a reviewer pass and its findings fixed. Work your MRs in listed order, but skip to the next unblocked one when a base is missing. When a base is not on origin, poll for it every 2-3 minutes (a background until-loop on `git ls-remote`) instead of stopping.
- Things only the user can do (env vars or secrets, Supabase Storage bucket or Auth dashboard settings, Stripe or Anthropic account steps, switching the Vercel project's framework preset from Vite to Next.js and renaming its env vars, GitHub repo settings, migrations against the real DB): build and test against mocks anyway. Add a "Setup needed from you" section to the MR description with exact copy-pasteable steps (variable names, where they go, what to click) and what stays unverified until done. Write "Setup needed from you: none" if there is nothing.
- When your list is done, or only blocked on other windows, send one final summary: every PR link, decisions made, setup needed, anything unverified.

## Coordination between windows

- An MR can serve as a base once its branch is on origin. Check with `git ls-remote --heads origin <branch>`. Push the branch (not necessarily the PR) as soon as local checks pass, before the review round, so dependents can start.
- If the base is not on origin yet, work on another MR from your list or wait. Never build on a base you cannot see.
- After you change a branch that others stack on, push with `--force-with-lease` and post a one-line note on the PR; the owner of each child rebases with `git rebase --onto <new base> <old base> <child>`.
- After a parent merges into main, retarget the child PR to `main` and rebase.
- Do not edit another window's files. A gap in the contract is fixed minimally in your MR and flagged in the PR and your final summary so other windows can adapt.
- `gh pr list --state open` shows what is in flight.

## MRs and ownership

Window 1: R4, R5, X1, X2, X3, R1, R2, R3, Z2. Window 2: B1, B2, B3, B4, B5, B6, B7, B8. Window 3: F1, F2, F3, F4, F5, F6, F7, F12. Window 4: B9, B10, B11, B12, B13, F8, F9, F10, F11, Z1.

Window 1 owns the trunk `R4 -> R5 -> X1` and pushes each branch the moment local checks pass, because every other chain starts from `X1`. Windows 2, 3 and 4 poll for `X1` before their first MR; Window 4 continues with B9 once B2 is up.

| ID | Branch | Base | Scope |
|---|---|---|---|
| R4 | `refactor/remove-legacy-api` | main | Delete legacy `api/` and `server/` consult code, its tests and the `DOCTOR_TOKEN`/`CONSULT_PRICE_CENTS` env lines; keep `server/stripe.ts` and `server/db.ts` |
| R5 | `refactor/remove-legacy-pages` | R4 | Delete Doctor, Case, caseSummary, scripted intake, their routes and tests |
| X1 | `chore/next-scaffold` | R5 | Add `next`; remove Vite packages, `vite.config.ts`, `index.html`, `main.tsx`, `App.tsx`, `vercel.json`; `src/app/layout.tsx` + `page.tsx` render the landing page; move `server/` to `src/server/`; add `postcss.config.mjs` for Tailwind; switch `import.meta.env.VITE_*` to `process.env.NEXT_PUBLIC_*` and rename `.env.example`; make `.webp`/`.svg` asset imports work in Next (`StaticImageData` is an object, use `.src` or `next/image`) and stub them in vitest; update tsconfig, vitest config (own JSX transform, `@` alias), oxlint, scripts, `playwright.config.ts` (port 3000) and `scripts/screenshot.ts`. If it will not fit the diff budget, split off the asset work as `chore/next-assets` and say so |
| X2 | `chore/next-routes` | X1 | `/privacy`, `/terms`, `/contact`, `/accessibility`, `/chat` (client page) as App Router routes with `metadata` titles, `not-found.tsx`; delete the hand-rolled router tests |
| X3 | `chore/next-env-analytics` | X1 | Move PostHog init into `src/instrumentation-client.ts` and delete `src/lib/analytics.ts` init wiring |
| R1 | `chore/ci` | X1 | Actions: lint, tsc, test, build |
| R2 | `chore/lint-cleanup` | X1 | Legal test keys, `button.tsx` export warning |
| R3 | `docs/readme` | X1 | Real README for Next; fix `.claude/agents/reviewer.md` (Next.js, no cobe, Formspree or Vite) |
| B1 | `feat/schema` | X1 | Data model above, migration, update db tests and `scripts/db-check.ts` |
| B2 | `feat/chats-api` | B1 | `src/server/http.ts`, `src/server/auth.ts`, `POST` and `GET /api/chats`, env vars |
| B3 | `feat/chat-detail-api` | B2 | `GET /api/chats/:id` |
| B4 | `feat/plan-url-api` | B2 | `GET /api/chats/:id/plan` |
| B5 | `feat/comments-api` | B2 | `POST .../comments` |
| B6 | `feat/approve-api` | B2 | `POST .../approve` |
| B7 | `feat/checkout-api` | B2 | `POST .../checkout` |
| B8 | `feat/stripe-webhook` | B7 | `POST /api/stripe-webhook` (read `request.text()` for signature verification) |
| B9 | `feat/intake-fields` | B2 | Typed field schema, `update_intake` tool definition, `intakeProgress()` helper |
| B10 | `feat/claude-client` | B9 | SDK dependency, client, system prompt |
| B11 | `feat/messages-api` | B10 | `POST .../messages`, persists both sides, merges `update_intake` fields, returns `progress` |
| B12 | `feat/intake-complete` | B11 | Complete when `progress.collected === total` -> `doctor_review` |
| B13 | `feat/ai-limits` | B12 | Per-user caps on chats per day and messages per chat, counted from tables |
| F1 | `feat/route-skeletons` | X2 | `/login`, `/dashboard`, `/chats/[id]` pages with titles and a client `useParams` shell |
| F2 | `feat/session-guard` | F1 | `@supabase/ssr` browser and server clients, `src/proxy.ts` refresh and redirect, session hook |
| F3 | `feat/login` | F2 | Email + password sign in and sign up |
| F4 | `feat/password-reset` | F3 | Forgot and reset password |
| F5 | `feat/dashboard` | F4 | `/dashboard` chat list, status badges, new chat |
| F6 | `feat/intake-ui` | F5 | `/chat` on the API; redirect to `/chats/:id` on completion; progress bar (`role="progressbar"`, `aria-valuenow`) above the composer, restored from `GET /api/chats/:id` on reload; fix ChatComposer lint warning |
| F7 | `feat/portal-chat` | F6 | `/chats/[id]`: transcript, back to dashboard, status copy for all 7 statuses |
| F8 | `feat/plan-viewer` | F7 | Inline PDF and download link |
| F9 | `feat/comments-ui` | F8 | Comment list and form in `plan_ready` |
| F10 | `feat/approve-ui` | F9 | Approve button |
| F11 | `feat/pay-ui` | F10 | Pay button, Stripe return handling |
| F12 | `feat/landing-cta` | F3 | Landing CTAs and navbar login or logout |
| Z1 | `test/e2e-flow` | F11 | Playwright flow with API and Supabase mocked |
| Z2 | `docs/ops-runbook` | B1 | SQL to flip statuses, PDF naming and upload, bucket setup |
