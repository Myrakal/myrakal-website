import { render, screen, within } from '@testing-library/react'
import { Hero } from '@/components/Hero'

describe('hero', () => {
  it('puts the logo and text on the left and the iPhone on the right', () => {
    const { container } = render(<Hero />)
    const left = container.querySelector('[data-hero-copy]')
    const right = container.querySelector('[data-hero-phone]')
    expect(left).not.toBeNull()
    expect(right).not.toBeNull()
    expect(left!.compareDocumentPosition(right!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(left!.querySelector('img[src*="wordmark"]')).not.toBeNull()
    expect(within(left as HTMLElement).getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(within(left as HTMLElement).getByRole('button', { name: 'Email us' })).toBeInTheDocument()
    expect(right!.contains(screen.getByRole('figure'))).toBe(true)
  })

  it('shows an iPhone mockup with a text conversation that starts with a blue message', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const messages = within(phone).getAllByRole('listitem')
    expect(messages[0].className).toContain('bg-imessage')
    expect(messages[0].textContent).toContain('My MRI quote is $2,400. Is that normal?')
    expect(phone.textContent).toContain("No, that doesn't sound right. Let me get back to you, I'll talk to the team.")
    expect(phone.textContent).toContain(
      "Definitely not right. We ran your stuff against our data system and found 2 options closer to you. There's one in Chicago, and another in Naperville. Here's the prices and links:",
    )
  })

  it('lists a Chicago and a Naperville option with prices and links', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const options = within(phone).getAllByTestId('option')
    expect(options).toHaveLength(2)
    expect(options[0].textContent).toMatch(/Chicago/)
    expect(options[1].textContent).toMatch(/Naperville/)
    for (const option of options) {
      expect(option.textContent).toMatch(/\$\d/)
      expect(option.textContent).toMatch(/\.com\//)
    }
  })

  it('hides the headline visually and the CTA on mobile, keeping the white text', () => {
    const { container } = render(<Hero />)
    const copy = container.querySelector('[data-hero-copy]') as HTMLElement
    expect(within(copy).getByRole('heading', { level: 1 }).className).toContain('max-sm:sr-only')
    expect(copy.querySelector('p')!.className).not.toContain('max-sm:hidden')
    expect(within(copy).getByRole('button', { name: 'Email us' }).className).toContain('max-sm:hidden')
  })

  it('invites cheaper-healthcare seekers to email for early access', () => {
    render(<Hero />)
    expect(screen.getByText("If you're looking for cheaper healthcare, email us for early access")).toBeInTheDocument()
  })
})
