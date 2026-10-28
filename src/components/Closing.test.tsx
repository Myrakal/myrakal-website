import { TALK_WITH_US_HREF } from '@/lib/contact'
import { render, screen } from '@testing-library/react'
import { Closing } from '@/components/Closing'

describe('Closing', () => {
  it('ends on the glowing horizon, anchored to the top so the glow sits low', () => {
    render(<Closing />)
    const img = screen.getByRole('img', { name: /horizon/i })
    expect(img.getAttribute('src')).toMatch(/liquid-horizon/)
    expect(img.getAttribute('srcset')).toMatch(/liquid-horizon-960/)
    expect(img.className).toMatch(/object-top/)
  })

  it('places the copy in the dark upper part under a light ink overlay', () => {
    const { container } = render(<Closing />)
    expect(container.querySelector('section')!.className).toMatch(/justify-start/)
    expect(container.querySelector('.bg-ink\\/25')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2 }).className).toMatch(/font-display.*italic|italic.*font-display/)
    expect(screen.getByText("We'll take it from here.").className).toMatch(/text-champagne/)
  })

  it('closes with a heading and a call to action into the intake', () => {
    render(<Closing />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('The art of vitality.')
    expect(screen.getByText("We'll take it from here.")).toBeTruthy()
    expect(screen.getByRole('link', { name: /^Talk with us/ }).getAttribute('href')).toBe(TALK_WITH_US_HREF)
  })
})
