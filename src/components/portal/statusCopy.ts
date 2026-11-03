export const STATUS_COPY: Record<string, string> = {
  intake: 'Your conversation is not finished yet. Pick it up where you left off.',
  doctor_review: 'A doctor will review your transcript. Your plan will be emailed to you.',
  plan_ready: 'Your plan is ready for your review.',
  clarification_review: 'Your comments are being reviewed. We will email you the updated plan.',
  awaiting_payment: 'You approved your plan. Payment is the next step.',
  reservations: 'Reservations are being made. We will reach out once they are done.',
  booked: 'We have emailed you everything.',
}

export const PLAN_STATUSES = ['plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked']

export const STATUS_LABELS: Record<string, string> = {
  intake: 'In conversation',
  doctor_review: 'With a doctor',
  plan_ready: 'Plan ready',
  clarification_review: 'Reviewing your comments',
  awaiting_payment: 'Awaiting payment',
  reservations: 'Making reservations',
  booked: 'Booked',
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const formatUsd = (cents: number) => usd.format(cents / 100)
