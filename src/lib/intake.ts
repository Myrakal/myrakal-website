export const INTAKE_PROMPTS = [
  "Thank you for sharing that. Could you tell me a little more about what's going on, such as your symptoms, how long you've had them, and anything you've already tried?",
  "That's very helpful. Do you have any recent labs, imaging, or other tests? Let me know what you have, or just say none.",
  'Thank you. What insurance plan do you have, if any?',
  "Thank you. We're almost done. What's your name?",
  "Thank you. And what's the best email to reach you once a licensed doctor has reviewed your case?",
]

export const SUPPORT_EMAIL = 'eshaansood@myrakal.com'

export const INTAKE_COMPLETE =
  `Thank you so much, that's everything I need. Intake is complete. A licensed doctor will review your case, and we'll be in touch once they have.\n\nIf you remember anything else, you can email ${SUPPORT_EMAIL}.`

export const replyFor = (userTurns: number) =>
  INTAKE_PROMPTS[userTurns - 1] ?? INTAKE_COMPLETE

export const EMAIL_RETRY =
  "Thank you. I couldn't find an email address in that. Could you share the best email to reach you?"

export const INTAKE_FAILED =
  `I'm sorry, I wasn't able to save that just now. Please send me any message to try again, or email ${SUPPORT_EMAIL} and we'll take it from there.`

const EMAIL = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]+/
const EDGE = /^[\s.,;:!?()]+|[\s.,;:!?()]+$/g

export function extractEmail(text: string) {
  const found = text.match(new RegExp(EMAIL.source, 'g'))?.map((m) => m.replace(EDGE, ''))
  return found?.filter((e) => EMAIL.test(e)).at(-1) ?? null
}
