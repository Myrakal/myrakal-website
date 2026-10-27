import { render } from '@testing-library/react'
import Home from '@/app/page'

describe('home page', () => {
  it('runs how it works into the FAQ, then closes on the art of vitality', () => {
    const { container } = render(<Home />)
    const how = container.querySelector('section[aria-labelledby="how-it-works"]')
    expect(how).toBeTruthy()
    const faq = how?.nextElementSibling
    expect(faq?.textContent).toMatch(/Frequently asked/)
    expect(faq?.nextElementSibling?.textContent).toMatch(/The art of vitality/)
  })
})
