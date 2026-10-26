import { render, screen } from '@testing-library/react'
import { Closing } from '@/components/Closing'

describe('Closing', () => {
  it('ends on the opened ampoule', () => {
    render(<Closing />)
    expect(screen.getByRole('img', { name: /opened/i }).getAttribute('src')).toMatch(/scene-ampoule-open/)
  })

  it('closes with a heading and a call to action into the intake', () => {
    render(<Closing />)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('The art of vitality.')
    expect(screen.getByText("We'll take it from here.")).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Talk with us' }).getAttribute('href')).toBe('/dashboard')
  })
})
