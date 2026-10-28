import { render } from '@testing-library/react'
import Home from '@/app/page'

describe('home page', () => {
  it('runs the scroll scenes straight into the FAQ', () => {
    const { container } = render(<Home />)
    const how = container.querySelector('section[aria-labelledby="how-it-works"]')
    expect(how).toBeTruthy()
    expect(how?.textContent).toMatch(/The art of vitality/)
    expect(how?.nextElementSibling?.textContent).toMatch(/Frequently asked questions/)
  })

  it('keeps the page content inside one main landmark', () => {
    const { container } = render(<Home />)
    const mains = container.querySelectorAll('main')
    expect(mains).toHaveLength(1)
    expect(mains[0].querySelector('h1')).toBeTruthy()
    expect(mains[0].querySelector('section[aria-labelledby="how-it-works"]')).toBeTruthy()
  })
})
