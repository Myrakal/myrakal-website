import { summarize } from '@/lib/caseSummary'

const transcript = [
  { role: 'assistant', text: 'Hi, do you already have a diagnosis?' },
  { role: 'user', text: 'Knee pain for a month' },
  { role: 'assistant', text: 'Could you tell me a little more about your symptoms?' },
  { role: 'user', text: 'Worse on stairs' },
  { role: 'assistant', text: 'Do you have any recent labs, imaging, or other tests?' },
  { role: 'user', text: 'X-ray in March' },
  { role: 'assistant', text: 'What insurance plan do you have, if any?' },
  { role: 'user', text: 'Aetna PPO' },
  { role: 'assistant', text: "What's your name?" },
  { role: 'user', text: 'Ada Lovelace' },
  { role: 'assistant', text: "And what's the best email to reach you?" },
  { role: 'user', text: 'ada@example.com' },
] as const

describe('summarize', () => {
  it('groups answers by the question they responded to', () => {
    expect(summarize([...transcript])).toEqual({
      history: ['Knee pain for a month', 'Worse on stairs'],
      tests: 'X-ray in March',
      insurance: 'Aetna PPO',
    })
  })

  it('leaves tests and insurance empty when they were never asked', () => {
    expect(summarize([{ role: 'user', text: 'Headache' }])).toEqual({
      history: ['Headache'],
      tests: '',
      insurance: '',
    })
  })

  it('still classifies reworded questions', () => {
    const reworded = [
      { role: 'assistant', text: 'Any recent lab results or scans?' },
      { role: 'user', text: 'Blood panel in May' },
      { role: 'assistant', text: 'Who is your coverage with?' },
      { role: 'user', text: 'Cigna' },
    ] as const
    expect(summarize([...reworded])).toMatchObject({ history: [], tests: 'Blood panel in May', insurance: 'Cigna' })
  })

  it('does not put the name or email answers in the history', () => {
    expect(summarize([...transcript]).history.join(' ')).not.toMatch(/Ada|@/)
  })
})
