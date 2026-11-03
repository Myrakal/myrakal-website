import { render, screen } from '@testing-library/react'

import { PortalShell } from './PortalShell'

describe('PortalShell', () => {
  it('shows the Myrakal mark linking home and the page title as the only h1', () => {
    render(<PortalShell title="Log in" />)
    const home = screen.getByRole('link', { name: 'Myrakal home' })
    expect(home.getAttribute('href')).toBe('/')
    expect(home.querySelector('img')).not.toBeNull()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Log in' })).toBeTruthy()
  })

  it('labels the page with the member area eyebrow and the brand tagline', () => {
    render(<PortalShell title="Your chats" />)
    expect(screen.getByText('Member area')).toBeTruthy()
    expect(screen.getByText('Healthcare, as it should be')).toBeTruthy()
  })

  it('renders its children inside main', () => {
    render(
      <PortalShell title="Your case">
        <p>Body</p>
      </PortalShell>,
    )
    expect(screen.getByRole('main').textContent).toContain('Body')
  })

  it('centers its content only when asked', () => {
    const { rerender } = render(<PortalShell title="Log in" />)
    expect(screen.getByRole('main').className).not.toContain('items-center')
    rerender(<PortalShell title="Log in" centered />)
    expect(screen.getByRole('main').className).toContain('items-center')
    expect(screen.getByRole('main').className).toContain('justify-center')
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('text-center')
  })

  it('uses the ink ground with hairline rules and caslon labels', () => {
    const { container } = render(<PortalShell title="Your case" />)
    expect((container.firstChild as HTMLElement).className).toContain('bg-ink')
    expect(screen.getByRole('banner').className).toContain('border-rule')
    expect(screen.getByText('Member area').className).toContain('font-caslon')
  })
})
