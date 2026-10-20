import { render, screen } from '@testing-library/react'
import { HowItWorks } from '@/components/HowItWorks'

const stepTitles = () => [
  ...new Set(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)),
]

describe('HowItWorks', () => {
  it('walks through intake, consult, plan, coordinate and follow-up in order', () => {
    render(<HowItWorks />)
    expect(stepTitles()).toEqual(['Intake', 'Consult', 'Plan', 'Coordinate', 'Follow-up'])
  })

  it('describes each step of the workflow', () => {
    const { container } = render(<HowItWorks />)
    const t = container.textContent ?? ''
    for (const term of [
      /labs/i,
      /imaging/i,
      /insurance/i,
      /licensed doctor/i,
      /options/i,
      /pick|choose/i,
      /scheduling/i,
      /medication/i,
      /domestic pharmac/i,
      /aftercare/i,
    ])
      expect(t).toMatch(term)
  })

  it('keeps the international angle while covering any care', () => {
    const { container } = render(<HowItWorks />)
    const t = container.textContent ?? ''
    expect(t).toMatch(/abroad|international|overseas/i)
    expect(t).toMatch(/home|domestic|local/i)
  })

  it('no longer shows the old country, hotel and flight steps or coming-soon labels', () => {
    const { container } = render(<HowItWorks />)
    const t = container.textContent ?? ''
    expect(t).not.toMatch(/select your country|select your doctor|travel documents/i)
    expect(t).not.toMatch(/coming soon/i)
    expect(stepTitles()).not.toContain('Hotels')
    expect(stepTitles()).not.toContain('Flights')
  })

  it('marks a selection only on the plan options, where the consumer picks', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelectorAll('[aria-label="Selected"]').length).toBe(1)
  })
})
