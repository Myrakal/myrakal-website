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
