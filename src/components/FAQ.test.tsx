import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FAQ } from '@/components/FAQ'

const openAll = async () => {
  const user = userEvent.setup()
  const { container } = render(<FAQ />)
  let text = ''
  for (const trigger of screen.getAllByRole('button')) {
    await user.click(trigger)
    text += container.textContent
  }
  return text
}

describe('FAQ', () => {
  it('asks the intake and consult questions', () => {
    render(<FAQ />)
    for (const q of [
      'How does it work?',
      'Does a doctor review my prescription?',
    ])
      expect(screen.getByRole('button', { name: q })).toBeTruthy()
  })

  it('covers prescriptions, price, coordination and doctor review', async () => {
    const t = await openAll()
    for (const term of [/prescription/i, /best price/i, /coordinat/i, /licensed doctor/i]) expect(t).toMatch(term)
  })

  it('stays on prescriptions rather than all care', async () => {
    const t = await openAll()
    expect(t).not.toMatch(/hotel|flight|surgery|abroad|\$150/i)
  })

  it('tells visitors not to send health details through the contact form', async () => {
    const t = await openAll()
    expect(t).toMatch(/contact form/i)
  })

  it('heads the list with a Frequently asked heading in Bodoni', () => {
    render(<FAQ />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Frequently asked' })
    expect(heading.className).toMatch(/font-display/)
  })

  it('sets questions in Bodoni on the ink ground with a gold plus that turns to a minus', () => {
    const { container } = render(<FAQ />)
    expect(container.querySelector('section')!.className).toMatch(/\bbg-ink\b/)
    const trigger = screen.getByRole('button', { name: 'How much does it cost?' })
    expect(trigger.className).toMatch(/font-display/)
    const indicator = trigger.querySelector('[aria-hidden="true"].text-champagne')!
    expect(indicator.className).toContain("before:content-['+']")
    expect(indicator.className).toContain("group-aria-expanded/accordion-trigger:before:content-['−']")
    expect(container.innerHTML).not.toMatch(/font-grotesk|font-sans/)
  })
})
