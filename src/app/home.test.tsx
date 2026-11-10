import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

describe('landing page', () => {
  it('has one main landmark with one h1', () => {
    const { container } = render(<Home />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].querySelectorAll('h1')).toHaveLength(1)
  })

  it('leads with expensive, uncovered care', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Expensive care, fully handled.')
  })

  it('names dental and cosmetic care without cheap-sounding or platform language', () => {
    const { container } = render(<Home />)
    expect(container.textContent).toMatch(/We find and book the dental, cosmetic and other care your insurance won't cover/)
    expect(container.textContent).not.toMatch(/one all-in price/)
    expect(container.textContent).not.toMatch(/intelligent data platform|autonomous system|cheaper/i)
  })

  it('puts a Meet the team video frame directly before How it works', () => {
    const { container } = render(<Home />)
    const meet = container.querySelector('section[aria-labelledby="meet-the-team"]')
    expect(meet).not.toBeNull()
    expect(meet?.querySelector('h2')).toHaveTextContent('Meet the team')
    expect(meet?.querySelector('video')).not.toBeNull()
    expect(meet?.nextElementSibling).toBe(container.querySelector('section[aria-labelledby="how-it-works"]'))
  })

  it('walks through three steps from sending a quote to booked care', () => {
    const { container } = render(<Home />)
    const how = container.querySelector('section[aria-labelledby="how-it-works"]')
    expect(how?.querySelectorAll('li')).toHaveLength(3)
    expect(how?.querySelectorAll('h3')[0]).toHaveTextContent('Send your quote')
  })

  it('toggles the business-model answer under the steps on click', async () => {
    const { container } = render(<Home />)
    const how = container.querySelector('section[aria-labelledby="how-it-works"]') as HTMLElement
    const toggle = within(how).getByText('Wait.. how do you make money?')
    const details = toggle.closest('details') as HTMLDetailsElement
    expect(details.open).toBe(false)
    await userEvent.click(toggle)
    expect(details.open).toBe(true)
    expect(details).toHaveTextContent('Comparing options is free.')
    expect(details).toHaveTextContent('one coordination fee, shown before you commit')
    expect(details).toHaveTextContent('We never take money from clinics.')
    expect(details.textContent).not.toMatch(/commission/)
    await userEvent.click(toggle)
    expect(details.open).toBe(false)
  })

  it('opens a prefilled quote email from every CTA', () => {
    render(<Home />)
    expect(screen.queryAllByRole('link', { name: 'Text us!' })).toHaveLength(0)
    expect(screen.queryAllByRole('link', { name: 'Email instead' })).toHaveLength(0)
    expect(document.querySelector('a[href^="sms:"]')).toBeNull()

    const emailLinks = screen.getAllByRole('link', { name: 'Send your quote' })
    expect(emailLinks).toHaveLength(3)
    for (const link of emailLinks) {
      expect(link).toHaveAttribute('href', "mailto:eshaansood@myrakal.com?subject=My%20quote&body=Hi%20Myra!%20Here's%20my%20quote%20(or%20what%20I%20need)%3A")
    }
  })

  it('closes on one quote at a time', () => {
    render(<Home />)
    expect(screen.getByText('One quote at a time.')).toBeInTheDocument()
  })

  it('links only to home and the treatment pages', () => {
    render(<Home />)
    expect(screen.queryByRole('navigation')).toBeNull()
    const pageLinks = screen.queryAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/'))
    expect(pageLinks.map((link) => link.getAttribute('href'))).toEqual(['/', '/dental', '/cosmetic'])
  })
})
