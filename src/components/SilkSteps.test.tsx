import { render, screen, within } from '@testing-library/react'

const mockReduced = jest.fn(() => false)
Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: (query: string) => ({
    matches: query.includes('reduced-motion') && mockReduced(),
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
})

import { SilkSteps } from '@/components/SilkSteps'

const steps = [
  { title: 'Find your doctor', body: 'One' },
  { title: 'Insurance and financing', body: 'Two' },
  { title: 'Everything arranged', body: 'Three' },
  { title: 'Aftercare', body: 'Four' },
]

describe('SilkSteps', () => {
  afterEach(() => mockReduced.mockReturnValue(false))

  it('lists the workflow as an ordered sequence', () => {
    render(<SilkSteps steps={steps} />)
    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items.map((li) => within(li).getByRole('heading', { level: 3 }).textContent)).toEqual(steps.map((s) => s.title))
    expect(screen.getByRole('list').tagName).toBe('OL')
  })

  it('treats the silk as decoration', () => {
    const { container } = render(<SilkSteps steps={steps} />)
    const img = container.querySelector('img')!
    expect(img.getAttribute('alt')).toBe('')
    expect(img.getAttribute('src')).toMatch(/care-silk/)
    expect(img.getAttribute('srcset')).toMatch(/care-silk-400/)
  })

  it('alternates steps on either side of the silk', () => {
    render(<SilkSteps steps={steps} />)
    const sides = screen.getAllByRole('listitem').map((li) => (li.className.includes('lg:left-0') ? 'left' : 'right'))
    expect(sides).toEqual(['left', 'right', 'left', 'right'])
  })

  it('shows the whole silk without animation for reduced motion', () => {
    mockReduced.mockReturnValue(true)
    const { container } = render(<SilkSteps steps={steps} />)
    expect(container.querySelector('img')!.getAttribute('style') ?? '').not.toMatch(/clip-path/)
  })
})
