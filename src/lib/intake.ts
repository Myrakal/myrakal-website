export const INTAKE_PROMPTS = [
  "Thank you for sharing that. Could you tell me a little more about what's going on, such as your symptoms, how long you've had them, and anything you've already tried?",
  "That's very helpful. Do you have any recent labs, imaging, or other tests? Let me know what you have, or just say none.",
  'Thank you. What insurance plan do you have, if any?',
  "Almost done. What's your name and the best email to reach you once a licensed doctor has reviewed your case?",
]

export const SUPPORT_EMAIL = 'eshaansood@myrakal.com'

export const INTAKE_COMPLETE =
  `Thank you so much, that's everything I need. Intake is complete. A licensed doctor will review your case, and we'll be in touch once they have.\n\nIf you remember anything else, you can email ${SUPPORT_EMAIL}.`

export const replyFor = (userTurns: number) =>
  INTAKE_PROMPTS[userTurns - 1] ?? INTAKE_COMPLETE

export const CONTACT_RETRY =
  "Thank you. I couldn't find an email address in that. Could you share your name and the best email to reach you?"

export const INTAKE_FAILED =
  `I'm sorry, I wasn't able to save that just now. Please send me any message to try again, or email ${SUPPORT_EMAIL} and we'll take it from there.`

const EMAIL = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]+/
const EDGE = /^[\s.,;:!?()]+|[\s.,;:!?()]+$/g
const LEADING_FILLER =
  /^(my name is|name is|i'm|i am|this is|it's|my email is|email is|email|contact me at|reach me at)\b[\s.,;:!?-]*/i
const TRAILING_LABEL = /\s+(and\s+)?(my\s+)?(email(\s+is)?|contact me at|reach me at)$/i

export function extractContact(text: string): { name?: string; email: string } | null {
  const match = text.match(EMAIL)?.[0]
  if (!match) return null
  const email = match.replace(EDGE, '')
  if (!EMAIL.test(email)) return null
  const name = text
    .replace(match, ' ')
    .replace(/\s+/g, ' ')
    .replace(EDGE, '')
    .replace(LEADING_FILLER, '')
    .replace(EDGE, '')
    .replace(TRAILING_LABEL, '')
    .replace(EDGE, '')
  return name ? { name, email } : { email }
}
