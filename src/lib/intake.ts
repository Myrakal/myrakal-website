export const INTAKE_PROMPTS = [
  'Thanks for sharing. Can you tell me a bit more about what is going on, such as your symptoms, how long they have lasted, and anything you have already tried?',
  'Do you have any recent labs, imaging, or other tests? Tell me what you have, or say none.',
  'What insurance plan do you have, if any?',
  'Last one: what is your name and the best email to reach you once a licensed doctor has reviewed your case?',
]

export const INTAKE_COMPLETE =
  "Thank you, that's everything I need. Intake is complete. A licensed doctor will review your case, and we will be in touch once they have.\n\nIf you remember anything else, you can add it here."

export const replyFor = (userTurns: number) =>
  INTAKE_PROMPTS[userTurns - 1] ?? INTAKE_COMPLETE
