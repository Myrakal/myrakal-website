import { render, screen } from '@testing-library/react'
import { Closing } from '@/components/Closing'

describe('Closing', () => {
  it('ends on the glowing horizon, shifted up so the lake stays in view', () => {
    render(<Closing />)
    const img = screen.getByRole('img', { name: /horizon/i })
    expect(img.getAttribute('src')).toMatch(/liquid-horizon/)
    expect(img.getAttribute('srcset')).toMatch(/liquid-horizon-960/)
    expect(img.className).toMatch(/object-\[50%_70%\]/)
  })

  it('places the copy in the dark upper part under a light ink overlay', () => {
    const { container } = render(<Closing />)
    expect(container.querySelector('section')!.className).toMatch(/justify-start/)
    expect(container.querySelector('.bg-ink\\/25')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2 }).className).toMatch(/font-display.*italic|italic.*font-display/)
    expect(screen.getByText("Your prescription, handled.").className).toMatch(/text-champagne/)
  })

  it('closes with a heading and a call to action into the intake', () => {
    render(<Closing />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('The art of vitality.')
    expect(screen.getByText("Your prescription, handled.")).toBeTruthy()
    expect(screen.getByRole('button', { name: /^Talk with us/ })).toBeInTheDocument()
  })
})
