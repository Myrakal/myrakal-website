import { guardReply } from './reply.ts'

describe('guardReply', () => {
  it('passes a short warm acknowledgement, trimmed', () => {
    expect(guardReply('  Thank you for sharing that. That sounds uncomfortable.\n')).toBe(
      'Thank you for sharing that. That sounds uncomfortable.',
    )
  })

  it('returns an empty string for empty or whitespace replies', () => {
    expect(guardReply('')).toBe('')
    expect(guardReply('   \n ')).toBe('')
  })

  it('rejects replies over 240 characters, and accepts exactly 240', () => {
    expect(guardReply('a'.repeat(240))).toBe('a'.repeat(240))
    expect(guardReply('a'.repeat(241))).toBe('')
  })

  it('rejects any reply that asks a question', () => {
    expect(guardReply('Thanks for telling me. How long has it hurt?')).toBe('')
  })

  it.each([
    'recommend', 'suggest', 'advise', 'you should', 'you could', 'try', 'trying', 'consider', 'diagnosis', 'diagnose',
    'treat', 'treatment', 'therapy', 'therapist', 'medication', 'medicine', 'meds', 'drug', 'prescribe', 'prescription',
    'dose', 'dosage', 'surgery', 'supplement', 'ibuprofen', 'antibiotic', 'antibiotics', 'cure',
  ])('rejects advice or clinical wording: %s', (word) => {
    expect(guardReply(`Thank you for sharing. It may help to ${word} something.`)).toBe('')
    expect(guardReply(`Thank you. ${word.toUpperCase()} something.`)).toBe('')
  })

  it('does not reject ordinary words that merely contain a denylisted fragment', () => {
    const text = 'Thank you for telling me about your country and your secure plan.'
    expect(guardReply(text)).toBe(text)
  })

  it.each([
    'See https://example.com for more.',
    'Visit www.example.org today.',
    'Check example.com for details.',
    'Write to ada@example.com.',
    'Call 555-123-4567 now.',
    'Call +1 (555) 123 4567 now.',
    'Reach us on 5551234567.',
  ])('rejects links, emails and phone numbers: %s', (text) => {
    expect(guardReply(text)).toBe('')
  })

  it.each(['988', '911', '112', '999'])('rejects emergency numbers in model output: %s', (n) => {
    expect(guardReply(`Please call ${n} right away.`)).toBe('')
  })

  it('has no emergency exemption: emergency wording is held to the same checks as everything else', () => {
    expect(guardReply("I'd suggest calling your local emergency services right now, or 988 in the US.")).toBe('')
    expect(guardReply('You should call emergency services right away.')).toBe('')
    expect(guardReply('Please contact your local emergency services right away.')).toBe(
      'Please contact your local emergency services right away.',
    )
    expect(guardReply('Emergency services can start treatment, so my diagnosis is a heart attack.')).toBe('')
  })
})
