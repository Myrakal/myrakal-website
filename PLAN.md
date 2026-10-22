# Myrakal rebuild plan

Every agent reads this file first, plus `CLAUDE.md`. This file is the source of truth for scope, contracts and who builds what. If reality disagrees with it, stop and ask the user; do not improvise a contract.

## Product

Medical-travel concierge. Patient flow: sign up or log in (Supabase Auth, email + password, no confirmation step) -> talk to Claude, which fills a fixed list of info -> redirected to that chat's portal page -> doctors review the transcript -> we email the plan (manually) -> patient reviews the PDF plan, comments or approves -> pays -> we make reservations -> we email everything (manually).

The dashboard (`/dashboard`) lists the patient's chats. Back from a chat goes there. A patient may have many chats.

We never send email from code. Only Supabase Auth sends mail. The team flips `status` by hand in Supabase and emails patients by hand.

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

- Prisma stays server-side. API routes verify the Supabase JWT (`Authorization: Bearer <access token>`). A chat not owned by the caller returns 404, never 403.
- Plan = PDF in a private Supabase Storage bucket `plans`, file `{chatId}_plan.pdf`. Revisions overwrite the same file. The server returns a short-lived signed URL, only when status is `plan_ready`, `clarification_review`, `awaiting_payment`, `reservations` or `booked`; otherwise 404.
- Price: `Chat.priceCents` (nullable) overrides env `PLAN_PRICE_CENTS` (default `15000`). The payment covers all reservation costs.
- Comments are a per-chat list with timestamps; no cancel flow; no record uploads.
- AI replies are not streamed (single JSON response). Model name in env `ANTHROPIC_MODEL` (Sonnet).
- New env vars, all added to `.env.example` in B2 only: `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PLAN_PRICE_CENTS`, `PLAN_BUCKET` (default `plans`). Existing ones stay.
- Only B10 adds a dependency (`@anthropic-ai/sdk`). No other MR touches `package.json` or the lockfile without asking.

## Data model (B1)

`Chat { id uuid, userId uuid (Supabase user), status ChatStatus @default(intake), intake Json @default("{}"), priceCents Int?, stripeSessionId String? @unique, paidAt DateTime?, createdAt }`, `Message { id, chatId, role 'assistant'|'user', text, createdAt }`, `Comment { id, chatId, text, createdAt }`. Index `Chat(userId, createdAt)`. B1 drops the old `intakes` table.

## API contract

`progress` is `{ collected: number, total: number }`: required intake fields filled so far, and how many there are. It is computed on the server from `Chat.intake`, never from the transcript.

All routes need the bearer token (401 without), return JSON, and use `cache-control: no-store`. UUID path segment is `:id`.

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
| `POST /api/stripe-webhook` | Stripe event | 200; `checkout.session.completed` + paid + `metadata.chatId` -> `reservations` |

Files live at `api/chats/index.ts`, `api/chats/[id]/index.ts`, `api/chats/[id]/<action>.ts`. Shared server helpers: `server/http.ts` (`json`, `sameHost`, `UUID`) and `server/auth.ts` (`requireUser`), both created in B2.

## Info the AI collects (B9)

Required: name, DOB, country of residence, passport nationality, phone, preferred language; condition or goal, symptoms and duration, past treatments and surgeries, current medications, allergies, other conditions, urgency; care preferences (destinations or open, doctor gender and language, priority: cost, wait time or reputation); departure city, date flexibility, travelers and companions, mobility needs, expected recovery length; budget range, insurance plan; visas held, passport valid 6+ months; consent that the AI is not medical advice and a doctor reviews the case. Optional: existing records and doctors. Claude gets an `update_intake` tool and calls it with whatever new fields it learned each turn; the server merges them into `Chat.intake` (B11). Intake completes when every required field is filled (B12). The chat page shows a simple bar filling as `progress.collected / progress.total` grows (F6). The system prompt forbids diagnosing and sends emergencies to 911.

## Rules for every agent

1. Follow `CLAUDE.md`: pnpm only; no code comments; 150 diff lines max excluding tests (split and tell the user if it will not fit); never work on main.
2. One MR = one branch = one worktree at `/Users/ani/Code/myrakal/worktrees/<branch with / replaced by ->`, created from the MR's base (table below). Branch names are exactly as listed.
3. Order inside an MR: failing tests first, then code until green, then `pnpm lint`, `pnpm exec tsc -b`, `pnpm test`, `pnpm build`. Copy `.env` into each new worktree and run `pnpm install`.
4. Frontend MRs: screenshots with `scripts/screenshot.ts`, published as claude.ai artifacts and linked in the PR.
5. Run the `reviewer` agent with only the diff command. Fix its findings. Ask the user on tradeoffs.
6. Open the PR with `gh pr create --base <base branch>` using `.github/pr_template.md`.
7. Frontend tests mock `fetch` against the contract above; backend tests mock Prisma, Supabase and Stripe. No MR may need the other side to be merged to pass.

## Coordination between windows

- An MR can serve as a base once its branch is on origin. Check with `git ls-remote --heads origin <branch>`. Push the branch (not necessarily the PR) as soon as local checks pass, before the review round, so dependents can start.
- If the base is not on origin yet, work on another MR from your list or wait. Never build on a base you cannot see.
- After you change a branch that others stack on, push with `--force-with-lease` and post a one-line note on the PR; the owner of each child rebases with `git rebase --onto <new base> <old base> <child>`.
- After a parent merges into main, retarget the child PR to `main` and rebase.
- Do not edit another window's files. Anything missing from the contract goes to the user, not into your MR.
- `gh pr list --state open` shows what is in flight.

## MRs and ownership

Window 1: R1, R2, R3, B9, B10, B11, B12, B13, Z2. Window 2: R4, B1, B2, B3, B4, B5, B6, B7, B8. Window 3: R5, F1, F2, F3, F4, F5, F6, F7. Window 4: F12, F8, F9, F10, F11, Z1.

| ID | Branch | Base | Scope |
|---|---|---|---|
| R1 | `chore/ci` | main | Actions: lint, tsc, test, build |
| R2 | `chore/lint-cleanup` | main | Legal.test keys, button.tsx export warning, vitest config extension |
| R3 | `docs/readme` | main | Real README; fix `.claude/agents/reviewer.md` (no cobe or Formspree) |
| R4 | `refactor/remove-legacy-api` | main | Delete legacy api/server consult code and tests; keep `server/stripe.ts` and `server/db.ts` |
| R5 | `refactor/remove-legacy-pages` | main | Delete Doctor, Case, caseSummary, routes, tests |
| B1 | `feat/schema` | R4 | Data model above, migration, update db tests and `scripts/db-check.ts` |
| B2 | `feat/chats-api` | B1 | `server/http.ts`, `server/auth.ts`, `POST` and `GET /api/chats`, env vars |
| B3 | `feat/chat-detail-api` | B2 | `GET /api/chats/:id` |
| B4 | `feat/plan-url-api` | B2 | `GET /api/chats/:id/plan` |
| B5 | `feat/comments-api` | B2 | `POST .../comments` |
| B6 | `feat/approve-api` | B2 | `POST .../approve` |
| B7 | `feat/checkout-api` | B2 | `POST .../checkout` |
| B8 | `feat/stripe-webhook` | B7 | `POST /api/stripe-webhook` |
| B9 | `feat/intake-fields` | B2 | Typed field schema, `update_intake` tool definition, `intakeProgress()` helper |
| B10 | `feat/claude-client` | B9 | SDK dependency, client, system prompt |
| B11 | `feat/messages-api` | B10 | `POST .../messages`, persists both sides, merges `update_intake` fields, returns `progress` |
| B12 | `feat/intake-complete` | B11 | Complete when `progress.collected === total` -> `doctor_review` |
| B13 | `feat/ai-limits` | B12 | Per-user caps on chats per day and messages per chat, counted from tables |
| F1 | `feat/router` | R5 | Param-aware router, 404, per-route titles; routes `/login`, `/dashboard`, `/chats/:id`, `/chat`, legal pages |
| F2 | `feat/session-guard` | F1 | Supabase session hook, `apiFetch` with bearer, route guard |
| F3 | `feat/login` | F2 | Email + password sign in and sign up |
| F4 | `feat/password-reset` | F3 | Forgot and reset password |
| F5 | `feat/dashboard` | F4 | `/dashboard` chat list, status badges, new chat |
| F6 | `feat/intake-ui` | F5 | Chat page on the API; redirect to `/chats/:id` on completion; progress bar (`role="progressbar"`, `aria-valuenow`) above the composer, restored from `GET /api/chats/:id` on reload; fix ChatComposer lint warning |
| F7 | `feat/portal-chat` | F6 | `/chats/:id`: transcript, back to dashboard, status copy for all 7 statuses |
| F8 | `feat/plan-viewer` | F7 | Inline PDF and download link |
| F9 | `feat/comments-ui` | F8 | Comment list and form in `plan_ready` |
| F10 | `feat/approve-ui` | F9 | Approve button |
| F11 | `feat/pay-ui` | F10 | Pay button, Stripe return handling |
| F12 | `feat/landing-cta` | F3 | Landing CTAs and navbar login or logout |
| Z1 | `test/e2e-flow` | F11 | Playwright flow with API and Supabase mocked |
| Z2 | `docs/ops-runbook` | B1 | SQL to flip statuses, PDF naming and upload, bucket setup |
