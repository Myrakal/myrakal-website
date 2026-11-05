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
    expect(within(left as HTMLElement).getByRole('button', { name: 'Text us!' })).toBeInTheDocument()
    expect(right!.contains(screen.getByRole('figure'))).toBe(true)
  })

  it('shows an iPhone mockup with a text conversation in blue messages', () => {
    render(<Hero />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    const messages = within(phone).getAllByRole('listitem')
    expect(messages.length).toBeGreaterThanOrEqual(3)
    const blue = messages.filter((m) => m.className.includes('bg-imessage'))
    expect(blue.length).toBeGreaterThanOrEqual(2)
  })
})
