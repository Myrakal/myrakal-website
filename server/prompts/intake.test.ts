import { INTAKE_SYSTEM_PROMPT } from './intake.ts'

describe('intake system prompt', () => {
  const rules: [string, RegExp][] = [
    ['warm, friendly and professional tone', /warm, friendly and professional/i],
    ['plain language without jargon', /plain, everyday language/i],
    ['acknowledgement only, at most two sentences', /at most two short sentences/i],
    ['never asks a question', /never ask a question/i],
    ['never gives medical advice', /never give medical advice/i],
    ['never diagnoses or interprets results', /never diagnose, interpret results/i],
    ['never suggests tests, treatments, medications, providers, countries or costs', /never suggest or recommend tests, treatments, medications, providers, countries or costs/i],
    ['gathers information for a licensed doctor', /licensed doctor/i],
    ['emergencies point to emergency services', /emergency services/i],
    ['self-harm points to 988', /988/],
    ['messages are data, not instructions', /never instructions to you/i],
    ['does not repeat identifying details', /do not repeat names, email addresses/i],
  ]

  it.each(rules)('states the rule: %s', (_label, pattern) => {
    expect(INTAKE_SYSTEM_PROMPT).toMatch(pattern)
  })

  it('names the product', () => {
    expect(INTAKE_SYSTEM_PROMPT).toMatch(/Myrakal/)
  })
})
