import { render, screen } from '@testing-library/react'
import { HowItWorks } from '@/components/HowItWorks'

const stepTitles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('HowItWorks', () => {
  it('walks through the four scenes in order', () => {
    render(<HowItWorks />)
    expect(stepTitles()).toEqual([
      'Tell us what you need',
      'A licensed doctor reviews',
      'Everything, arranged',
      'Recover beautifully',
    ])
  })

  it('introduces the section with a heading', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { level: 2, name: /any care, at home or abroad, for less/i })).toBeTruthy()
  })

  it('describes each step of the workflow', () => {
    const { container } = render(<HowItWorks />)
    const t = container.textContent ?? ''
    for (const term of [
      /labs/i,
      /imaging/i,
      /insurance/i,
      /licensed doctor/i,
      /\$150/,
      /options/i,
      /choose/i,
      /scheduling/i,
      /medication/i,
      /domestic pharmac/i,
      /mix of both|hybrid/i,
      /split/i,
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

  it('gives every scene a described photograph', () => {
    render(<HowItWorks />)
    for (const name of [/fountain pen/i, /reading glasses/i, /watch/i, /crystal glass/i])
      expect(screen.getByRole('img', { name })).toBeTruthy()
  })

  it('no longer uses the old cards, stepper or coming-soon labels', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelector('[aria-label="Selected"]')).toBeNull()
    expect(container.textContent).not.toMatch(/coming soon|select your country/i)
  })

  it('keeps the step numerals out of the spoken headings', () => {
    const { container } = render(<HowItWorks />)
    const numerals = [...container.querySelectorAll('p')].filter((p) => /^[IV]+$/.test(p.textContent ?? ''))
    expect(numerals).toHaveLength(4)
    for (const n of numerals) expect(n.getAttribute('aria-hidden')).toBe('true')
  })

  it('has the AI only gather information, never suggest', () => {
    const { container } = render(<HowItWorks />)
    expect(container.textContent).not.toMatch(/suggest/i)
  })
})
