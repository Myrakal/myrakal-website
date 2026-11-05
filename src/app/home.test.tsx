import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('landing page', () => {
  it('has one main landmark with one h1', () => {
    const { container } = render(<Home />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].querySelectorAll('h1')).toHaveLength(1)
  })

  it('pitches cheaper healthcare through a free text-us flow', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/cheaper|less/i)
    expect(screen.getAllByText(/free/i).length).toBeGreaterThan(0)
  })

  it('frames Myrakal as an intelligent data platform with an autonomous system', () => {
    const { container } = render(<Home />)
    expect(container.textContent).toMatch(/intelligent data platform/i)
    expect(container.textContent).toMatch(/autonomous system/i)
  })

  it('walks through three steps from texting us to cheaper options', () => {
    const { container } = render(<Home />)
    const how = container.querySelector('section[aria-labelledby="how-it-works"]')
    expect(how?.querySelectorAll('li')).toHaveLength(3)
  })

  it('offers Email us as a button that does nothing', () => {
    render(<Home />)
    const buttons = screen.getAllByRole('button', { name: 'Email us' })
    expect(buttons.length).toBeGreaterThanOrEqual(3)
    for (const button of buttons) expect(button).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('link', { name: /email us|talk with us/i })).toBeNull()
  })

  it('has no navigation to other pages', () => {
    render(<Home />)
    expect(screen.queryByRole('navigation')).toBeNull()
    for (const link of screen.queryAllByRole('link')) expect(link.getAttribute('href')).toBe('/')
  })
})
