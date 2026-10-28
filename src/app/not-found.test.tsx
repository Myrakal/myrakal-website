import { render, screen } from '@testing-library/react'
import NotFound from '@/app/not-found'

describe('not found page', () => {
  it('links Myrakal back to the home page', () => {
    render(<NotFound />)
    expect(screen.getByRole('link', { name: 'Myrakal' }).getAttribute('href')).toBe('/')
  })
})
