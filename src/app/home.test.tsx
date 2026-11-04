import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('landing page', () => {
  it('has one main landmark with one h1', () => {
    const { container } = render(<Home />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].querySelectorAll('h1')).toHaveLength(1)
  })

  it('uses the selected healthcare-cost hero headline', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Care costs too much. Text us.')
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

  it('opens a prefilled text draft with an email fallback', () => {
    render(<Home />)
    const textLinks = screen.getAllByRole('link', { name: 'Text us!' })
    expect(textLinks).toHaveLength(3)
    for (const link of textLinks) expect(link).toHaveAttribute('href', 'sms:+14152265827?body=Hi%20Myra!')

    const emailLinks = screen.getAllByRole('link', { name: 'Email instead' })
    expect(emailLinks).toHaveLength(2)
    for (const link of emailLinks) {
      expect(link).toHaveAttribute('href', 'mailto:eshaansood@myrakal.com?subject=Myrakal%20inquiry&body=Hi%20Myra!')
    }
  })

  it('has no navigation to other pages', () => {
    render(<Home />)
    expect(screen.queryByRole('navigation')).toBeNull()
    const pageLinks = screen.queryAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/'))
    expect(pageLinks).toHaveLength(1)
    expect(pageLinks[0]).toHaveAttribute('href', '/')
  })
})
