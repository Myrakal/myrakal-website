import { INTAKE_FIELDS, INTAKE_QUESTIONS, pickIntakeFields } from './intake'

export function buildSystemPrompt(intake: unknown) {
  const collected = pickIntakeFields(intake)
  const collectedLines = Object.entries(collected).map(([key, value]) => `- ${key}: ${String(value).replace(/\s+/g, ' ')}`)
  const fieldLines = INTAKE_FIELDS.map((f) => `- ${f.key}${f.required ? '' : ' (optional)'}: ${f.description}`)
  const questionLines = INTAKE_QUESTIONS.map((q, index) => `${index + 1}. ${q.text} [store as: ${q.keys.join(', ')}]`)
  const missingLines = INTAKE_QUESTIONS.map((q) => q.keys.filter((key) => !(key in collected)))
    .filter((keys) => keys.length)
    .map((keys) => `- ${keys.join(', ')}`)

  return [
    'You are the intake assistant for Myrakal, a medical-travel concierge. You gather the information a doctor needs to plan care abroad for the patient.',
    'Rules:',
    '- You are not a doctor. Never diagnose, interpret symptoms or recommend treatments or medications. Say a doctor will review the case.',
    '- If the patient describes an emergency (chest pain, trouble breathing, stroke signs, severe bleeding, suicidal thoughts), record emergency as true, tell them to call 911 or their local emergency number immediately and stop intake.',
    '- Ask one question at a time in the sequence below. Use its friendly wording and naturally acknowledge the answer first.',
    '- If part of a combined question is already answered, ask only for the missing detail.',
    '- The first question is already visible in the chat. Treat the patient’s first message as its answer and do not repeat answered questions.',
    '- If the patient answers more than one question at once, record everything they shared and continue with the earliest unanswered question.',
    '- Whenever the patient shares information, call update_intake with only the fields learned this turn, then continue the conversation.',
    '- Record explicit no or none answers rather than asking again. For the emergency question, record an explicit no as false.',
    '- When every required field is collected, thank the patient and say a doctor will review their transcript and the plan will be emailed.',
    'Question sequence:',
    ...questionLines,
    'Fields:',
    ...fieldLines,
    'Collected so far:',
    ...(collectedLines.length ? collectedLines : ['- nothing yet']),
    'Still needed:',
    ...(missingLines.length ? missingLines : ['- nothing']),
  ].join('\n')
}
