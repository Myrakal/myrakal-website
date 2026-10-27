import { render, screen } from '@testing-library/react'
import { HowItWorks } from '@/components/HowItWorks'

const stepTitles = () => screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('HowItWorks', () => {
  it('walks through the four steps in order', () => {
    render(<HowItWorks />)
    expect(stepTitles()).toEqual([
      'Tell us what you need',
      'Get a doctor’s review',
      'Choose your care',
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
      /\$50\b/,
      /choose/i,
      /or both/i,
      /book/i,
      /prescriptions/i,
      /aftercare/i,
    ])
      expect(t).toMatch(term)
  })

  it('keeps every blurb quick to read', () => {
    const { container } = render(<HowItWorks />)
    const blurbs = [...container.querySelectorAll('h3 + p')].map((p) => p.textContent ?? '')
    expect(blurbs).toHaveLength(4)
    for (const blurb of blurbs) expect(blurb.trim().split(/\s+/).length).toBeLessThanOrEqual(25)
  })

  it('keeps the international angle while covering any care', () => {
    const { container } = render(<HowItWorks />)
    const t = container.textContent ?? ''
    expect(t).toMatch(/abroad|international|overseas/i)
    expect(t).toMatch(/home|domestic|local/i)
  })

  it('never quotes the old $150 review fee', () => {
    const { container } = render(<HowItWorks />)
    expect(container.textContent).not.toMatch(/\$150/)
  })

  it('illustrates each step with a described liquid image', () => {
    render(<HowItWorks />)
    const steps: [RegExp, string][] = [
      [/braiding/i, 'liquid-braid'],
      [/sphere/i, 'liquid-sphere'],
      [/four ribbons/i, 'liquid-ribbons'],
      [/ripple/i, 'liquid-ripple'],
    ]
    for (const [name, file] of steps) {
      const img = screen.getByRole('img', { name })
      expect(img.getAttribute('src')).toContain(file)
      expect(img.getAttribute('srcset')).toContain(`${file}-960`)
    }
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

  it('lays the steps out as ruled rows on the ink ground instead of a pinned stage', () => {
    const { container } = render(<HowItWorks />)
    const section = container.querySelector('section')!
    expect(section.className).toMatch(/\bbg-ink\b/)
    expect(container.querySelector('.sticky')).toBeNull()
    expect(container.querySelectorAll('.border-rule').length).toBeGreaterThanOrEqual(4)
    expect(container.textContent).not.toMatch(/The art of vitality/)
  })

  it('sets the numerals in gold and the copy in Caslon', () => {
    const { container } = render(<HowItWorks />)
    const numerals = [...container.querySelectorAll('p')].filter((p) => /^[IV]+$/.test(p.textContent ?? ''))
    for (const n of numerals) expect(n.className).toMatch(/text-champagne/)
    for (const h of container.querySelectorAll('h2, h3')) expect(h.className).toMatch(/font-display/)
    for (const p of container.querySelectorAll('h3 + p')) expect(p.className).toMatch(/text-mist/)
    expect(container.innerHTML).not.toMatch(/font-grotesk|font-sans/)
  })

  it('has the AI only gather information, never suggest', () => {
    const { container } = render(<HowItWorks />)
    expect(container.textContent).not.toMatch(/suggest/i)
  })
})
