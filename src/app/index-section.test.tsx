import { render } from '@testing-library/react'
import Home from '@/app/page'

describe('Myrakal Index teaser', () => {
  const getSection = () => {
    const { container } = render(<Home />)
    return { container, section: container.querySelector('section[aria-labelledby="myrakal-index"]') as HTMLElement | null }
  }

  it('sits between How it works and the closing section', () => {
    const { container, section } = getSection()
    expect(section).not.toBeNull()
    expect(section?.previousElementSibling).toBe(container.querySelector('section[aria-labelledby="how-it-works"]'))
    expect(section?.nextElementSibling).toHaveTextContent('Making the system better.')
  })

  it('is titled the Myrakal Index and marked coming soon', () => {
    const { section } = getSection()
    expect(section?.querySelector('h2')).toHaveTextContent('The Myrakal Index')
    expect(section).toHaveTextContent('Coming soon')
  })

  it('briefly explains the index with a preview that shows no real prices', () => {
    const { section } = getSection()
    expect(section).toHaveTextContent(/real quotes/)
    expect(section?.querySelectorAll('li').length).toBeGreaterThanOrEqual(3)
    expect(section?.textContent).not.toMatch(/\$\d/)
  })

  it('uses no em dashes or cheap-sounding language', () => {
    const { section } = getSection()
    expect(section?.textContent).not.toMatch(/—|cheap/i)
  })
})
