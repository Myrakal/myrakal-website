import { TALK_EMAIL } from '@/lib/contact'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/Footer'

describe('Footer', () => {
  it('tells visitors it is not for emergencies', () => {
    render(<Footer />)
    expect(screen.getByText(/not for emergencies/i).textContent).toMatch(/911/)
  })

  it('says the website is not medical advice and doctors make clinical decisions', () => {
    const { container } = render(<Footer />)
    expect(container.textContent).toMatch(/website is not medical advice/i)
    expect(container.textContent).toMatch(/licensed doctors/i)
  })

  it('links to every legal and contact page', () => {
    render(<Footer />)
    for (const [name, href] of [
      ['Privacy Policy', '/privacy/'],
      ['Terms of Service', '/terms/'],
      ['Contact', '/contact/'],
      ['Accessibility', '/accessibility/'],
    ])
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
  })

  it('links to every section page so phones can reach them', () => {
    render(<Footer />)
    for (const [name, href] of [['Care', '/care'], ['Individual', '/individual'], ['Business', '/business']])
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
  })

  it('keeps the contact email, copyright and location', () => {
    const { container } = render(<Footer />)
    expect(screen.getByRole('link', { name: 'eshaansood@myrakal.com' }).getAttribute('href')).toBe(
      'mailto:eshaansood@myrakal.com',
    )
    expect(container.textContent).toMatch(new RegExp(`© ${new Date().getFullYear()} Myrakal Inc`))
    expect(container.textContent).toMatch(/Chicago, Illinois/)
  })

  it('splits section and legal links into separate labelled groups', () => {
    render(<Footer />)
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument()
  })

  it('shows the wordmark as a link home', () => {
    const { container } = render(<Footer />)
    const home = screen.getByRole('link', { name: 'Myrakal home' })
    expect(home.getAttribute('href')).toBe('/')
    expect(home.querySelector('img')?.getAttribute('src')).toMatch(/myrakal-wordmark/)
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
  })

  it('offers the talk-with-us address with copy and webmail fallbacks', () => {
    render(<Footer />)
    expect(screen.getByText(TALK_EMAIL)).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy address' })).toBeTruthy()
    const gmail = new URL(screen.getByRole('link', { name: 'Open in Gmail' }).getAttribute('href')!)
    expect(gmail.searchParams.get('to')).toBe(TALK_EMAIL)
  })

  it('prints the address exactly once whether or not the fallback is shown', () => {
    for (const talk of [true, false]) {
      const { container, unmount } = render(<Footer talk={talk} />)
      expect(container.textContent!.split(TALK_EMAIL).length - 1).toBe(1)
      expect(screen.getByRole('link', { name: TALK_EMAIL }).getAttribute('href')).toBe(`mailto:${TALK_EMAIL}`)
      unmount()
    }
  })

  it('can leave the talk-with-us fallback out', () => {
    render(<Footer talk={false} />)
    expect(screen.queryByRole('button', { name: 'Copy address' })).toBeNull()
  })
})
