# Ops runbook

How the team moves a patient's chat through the flow by hand. Everything here runs in the Supabase dashboard. We never send email from code: emails to patients are sent by hand from the team inbox.

Run SQL in Supabase -> SQL Editor. It runs as the `postgres` role, so row level security does not get in the way.

## Statuses

`intake` -> `doctor_review` -> `plan_ready` -> `clarification_review` -> `plan_ready` (revised plan) -> `awaiting_payment` -> `reservations` -> `booked`

| Status | Who moves it | How |
|---|---|---|
| `intake` -> `doctor_review` | the AI | automatic when every required intake field is filled |
| `doctor_review` -> `plan_ready` | team | after uploading the PDF (below) |
| `plan_ready` -> `clarification_review` | patient | posts a comment |
| `clarification_review` -> `plan_ready` | team | after uploading the revised PDF |
| `plan_ready` -> `awaiting_payment` | patient | presses Approve |
| `awaiting_payment` -> `reservations` | Stripe webhook | payment completed |
| `reservations` -> `booked` | team | after emailing the patient everything |

## Find a chat

```sql
select c.id, c.status, c.created_at, u.email
from chats c
join auth.users u on u.id = c.user_id
order by c.created_at desc
limit 50;
```

Chats waiting on us:

```sql
select c.id, c.status, u.email
from chats c
join auth.users u on u.id = c.user_id
where c.status in ('doctor_review', 'clarification_review', 'reservations')
order by c.created_at;
```

## Read the transcript and comments

```sql
select role, text, created_at from messages where chat_id = '<chat id>' order by created_at;
select text, created_at from comments where chat_id = '<chat id>' order by created_at;
select intake from chats where id = '<chat id>';
```

## Upload the plan PDF

1. Name the file exactly `<chat id>_plan.pdf`, for example `0b7e1c52-3f0a-4a6e-9a43-6a2f4f1d9c11_plan.pdf`.
2. Supabase -> Storage -> bucket `plans` -> Upload file. For a revision, upload again with the same name and choose to replace the existing file; the patient always sees the latest file.
3. Flip the status:

```sql
update chats set status = 'plan_ready' where id = '<chat id>' and status in ('doctor_review', 'clarification_review');
```

4. Email the patient that their plan is ready.

The patient page only serves a signed link to the PDF while the status is `plan_ready`, `clarification_review`, `awaiting_payment`, `reservations` or `booked`.

## Set a custom price

The default is env `PLAN_PRICE_CENTS` (15000 = $150.00). To override for one chat, before the patient approves:

```sql
update chats set price_cents = 42000 where id = '<chat id>';
```

The payment covers all reservation costs. Set it back to default with `price_cents = null`.

## Finish a booking

After making the reservations and emailing the patient everything:

```sql
update chats set status = 'booked' where id = '<chat id>' and status = 'reservations';
```

## Payment stuck in `awaiting_payment`

Check the Stripe dashboard first (Payments, search by the chat id in metadata). If the payment succeeded but the status did not move, check Developers -> Webhooks for failed deliveries of `checkout.session.completed` and resend the event. Only as a last resort:

```sql
update chats set status = 'reservations', paid_at = now() where id = '<chat id>' and status = 'awaiting_payment';
```

## One-time bucket setup

1. Supabase -> Storage -> New bucket.
2. Name: `plans` (or whatever `PLAN_BUCKET` is set to).
3. Leave "Public bucket" off. The server reads it with the service role key and hands out short-lived signed links.
4. Add no storage policies for anon or authenticated users.
