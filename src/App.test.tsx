import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders the home page at /', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })
})
