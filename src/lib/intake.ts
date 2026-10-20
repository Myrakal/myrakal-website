export const INTAKE_PROMPTS = [
  "Thank you for sharing that. Could you tell me a little more about what's going on, such as your symptoms, how long you've had them, and anything you've already tried?",
  "That's very helpful. Do you have any recent labs, imaging, or other tests? Let me know what you have, or just say none.",
  'Thank you. What insurance plan do you have, if any?',
  "Almost done. What's your name and the best email to reach you once a licensed doctor has reviewed your case?",
]

export const INTAKE_COMPLETE =
  "Thank you so much, that's everything I need. Intake is complete. A licensed doctor will review your case, and we'll be in touch once they have.\n\nIf you remember anything else, feel free to add it here."

export const replyFor = (userTurns: number) =>
  INTAKE_PROMPTS[userTurns - 1] ?? INTAKE_COMPLETE

export const CONTACT_RETRY =
  "Thank you. I couldn't find an email address in that. Could you share your name and the best email to reach you?"

export const INTAKE_FAILED =
  "I'm sorry, I wasn't able to save that just now. Please send me any message to try again, or email eshaansood@myrakal.com and we'll take it from there."

const EMAIL = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]+/
const FILLER = /\b(my name is|name is|i'm|i am|my email is|email is|email|and)\b/gi

export function extractContact(text: string): { name?: string; email: string } | null {
  const email = text.match(EMAIL)?.[0]
  if (!email) return null
  const name = text
    .replace(email, ' ')
    .replace(FILLER, ' ')
    .replace(/[,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return name ? { name, email } : { email }
}
