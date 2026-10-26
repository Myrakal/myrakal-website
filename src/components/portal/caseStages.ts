export const STEPS = ['Conversation', 'Doctor review', 'Your plan', 'Payment', 'Reservations', 'Booked']

export const STAGES: Record<string, { label: string; step: number }> = {
  intake: { label: 'In conversation', step: 0 },
  doctor_review: { label: 'With our doctors', step: 1 },
  plan_ready: { label: 'Plan ready', step: 2 },
  clarification_review: { label: 'Plan under review', step: 2 },
  awaiting_payment: { label: 'Awaiting payment', step: 3 },
  reservations: { label: 'Booking in progress', step: 4 },
  booked: { label: 'Booked', step: 5 },
}
