import { render, screen, within } from '@testing-library/react'

import Home from '@/app/page'

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
})

describe('service cards', () => {
  it('features dental and cosmetic care between the hero and the team', () => {
    const { container } = render(<Home />)
    const services = container.querySelector('section[aria-labelledby="services"]') as HTMLElement
    expect(services).not.toBeNull()
    expect(within(services).getByRole('heading', { level: 2 })).toHaveTextContent('Starting with the big bills.')
    expect(within(services).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Dental', 'Cosmetic'])
    expect(services.previousElementSibling?.querySelector('h1')).not.toBeNull()
    expect(services.nextElementSibling).toBe(container.querySelector('section[aria-labelledby="meet-the-team"]'))
    expect(services).toHaveTextContent("If insurance won't cover it, just ask.")
  })

  it('shows the phone chat with no caption and no invented links', () => {
    render(<Home />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    expect(within(phone).queryByText(/illustrative example/i)).toBeNull()
    expect(phone.querySelector('figcaption')).toBeNull()
    for (const option of within(phone).getAllByTestId('option')) expect(option.textContent).not.toMatch(/\.com/)
  })

  it('makes each treatment card look and act like one big link', () => {
    const { container } = render(<Home />)
    const services = container.querySelector('section[aria-labelledby="services"]') as HTMLElement
    for (const [name, href] of [['Dental', '/dental'], ['Cosmetic', '/cosmetic']]) {
      const link = within(services).getByRole('link', { name })
      expect(link).toHaveAttribute('href', href)
      expect(link.className).toMatch(/after:absolute/)
      expect(link.className).toMatch(/after:inset-0/)
      const card = link.closest('li') as HTMLElement
      expect(card.className).toMatch(/\brelative\b/)
      expect(card.className).toMatch(/hover:/)
      expect(within(card).getByText(/^See options/)).toBeInTheDocument()
    }
  })
})
