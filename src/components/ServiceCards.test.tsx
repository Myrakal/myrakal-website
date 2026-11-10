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
    expect(within(services).getByRole('heading', { level: 2 })).toHaveTextContent('Start with the big bills.')
    expect(within(services).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Dental', 'Cosmetic'])
    expect(services.previousElementSibling?.querySelector('h1')).not.toBeNull()
    expect(services.nextElementSibling).toBe(container.querySelector('section[aria-labelledby="meet-the-team"]'))
    expect(services).toHaveTextContent("anything else insurance won't cover")
  })

  it('labels the phone chat as an illustrative example with no invented links', () => {
    render(<Home />)
    const phone = screen.getByRole('figure', { name: /iphone/i })
    expect(within(phone).getByText('Illustrative example').tagName).toBe('FIGCAPTION')
    for (const option of within(phone).getAllByTestId('option')) expect(option.textContent).not.toMatch(/\.com/)
  })
})
