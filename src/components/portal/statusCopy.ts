export const STATUS_COPY: Record<string, string> = {
  intake: 'Your conversation is not finished yet. Pick it up where you left off.',
  doctor_review: 'A doctor will review your transcript. Your plan will be emailed to you.',
  plan_ready: 'Your plan is ready for your review.',
  clarification_review: 'A doctor will review your transcript. Your plan will be emailed to you.',
  awaiting_payment: 'You approved your plan. Payment is the next step.',
  reservations: 'Reservations are being made. We will reach out once they are done.',
  booked: 'We have emailed you everything.',
}

export const PLAN_STATUSES = ['plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked']
