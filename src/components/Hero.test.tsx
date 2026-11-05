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
    expect(within(left as HTMLElement).getByRole('link', { name: 'Email us' })).toBeInTheDocument()
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

  it('is sized with real iPhone proportions', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const width = Number(phone.className.match(/w-\[calc\((\d+)px/)?.[1])
    const height = Number(phone.className.match(/h-\[calc\((\d+)px/)?.[1])
    expect(width / height).toBeGreaterThan(0.465)
    expect(width / height).toBeLessThan(0.495)
  })

  it('lists a Chicago and a Naperville option with prices and links', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const options = within(phone).getAllByTestId('option')
    expect(options).toHaveLength(2)
    expect(options[0].textContent).toMatch(/Brightwell Imaging/)
    expect(options[1].textContent).toMatch(/Fernhollow Diagnostics/)
    expect(options[0].textContent).toMatch(/Chicago/)
    expect(options[1].textContent).toMatch(/Naperville/)
    for (const option of options) {
      expect(option.textContent).toMatch(/\$\d/)
      expect(option.textContent).toMatch(/\.com\//)
    }
  })

  it('has the user ask to book the closest one, then shows Myrakal typing', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const items = within(phone).getAllByRole('listitem')
    const booking = items[items.length - 2]
    expect(booking.className).toContain('bg-imessage')
    expect(booking.textContent).toContain('Can you book the one closest to me?')
    const typing = items[items.length - 1]
    expect(typing).toHaveAttribute('data-testid', 'typing')
    expect(typing.textContent).toBe('Myrakal is typing')
    expect(typing.querySelectorAll('[data-dot]')).toHaveLength(3)
  })

  it('keeps the headline and white text on mobile but hides the CTA', () => {
    const { container } = render(<Hero />)
    const copy = container.querySelector('[data-hero-copy]') as HTMLElement
    expect(within(copy).getByRole('heading', { level: 1 }).className).not.toMatch(/max-sm:(sr-only|hidden)/)
    expect(copy.querySelector('p')!.className).not.toContain('max-sm:hidden')
    expect(within(copy).getByRole('link', { name: 'Email us' }).className).toContain('max-sm:hidden')
  })

  it('invites visitors to email for early access', () => {
    render(<Hero />)
    expect(screen.getByText('Email us for early access')).toBeInTheDocument()
  })
})
