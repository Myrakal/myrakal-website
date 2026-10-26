import { act, render, screen } from '@testing-library/react'

import { GoldThreadMain as GoldThread, ThreadStop } from '@/components/GoldThread'

const rect = (x: number, y: number) => ({ left: x, top: y, width: 0, height: 0, right: x, bottom: y, x, y, toJSON() {} })

describe('GoldThread', () => {
  let spy: jest.SpyInstance

  beforeEach(() => {
    spy = jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const at = this.getAttribute('data-at')
      if (at) return rect(...(at.split(',').map(Number) as [number, number])) as DOMRect
      return rect(0, 0) as DOMRect
    })
  })

  afterEach(() => spy.mockRestore())

  it('renders the page content it wraps', () => {
    render(
      <GoldThread>
        <h2>Inside</h2>
      </GoldThread>,
    )
    expect(screen.getByRole('heading', { name: 'Inside' })).toBeTruthy()
  })

  it('draws a decorative bundle of strands that gather at every stop', () => {
    const { container } = render(
      <GoldThread>
        <div data-at="200,0">
          <ThreadStop data-at="100,0" />
        </div>
        <div data-at="200,400">
          <ThreadStop marked data-at="100,400" />
        </div>
        <div data-at="200,900">
          <ThreadStop data-at="100,900" />
        </div>
      </GoldThread>,
    )
    act(() => window.dispatchEvent(new Event('resize')))
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    const strands = [...svg.querySelectorAll('path[data-strand]')].map((p) => p.getAttribute('d')!)
    expect(strands.length).toBeGreaterThanOrEqual(4)
    expect(new Set(strands).size).toBe(strands.length)
    for (const d of strands) {
      expect(d.startsWith('M100 0')).toBe(true)
      expect(d).toMatch(/100 400 C/)
      expect(d.endsWith('100 900')).toBe(true)
    }
  })

  it('gives each strand a soft glow behind it', () => {
    const { container } = render(
      <GoldThread>
        <ThreadStop data-at="100,0" />
        <ThreadStop data-at="100,600" />
      </GoldThread>,
    )
    act(() => window.dispatchEvent(new Event('resize')))
    const glows = container.querySelectorAll('path[data-glow]')
    expect(glows.length).toBeGreaterThanOrEqual(4)
    expect(glows.length).toBe(container.querySelectorAll('path[data-strand]').length)
    glows.forEach((g) => expect(Number(g.getAttribute('stroke-width'))).toBeGreaterThan(1))
  })

  it('sways between stops instead of running straight', () => {
    const { container } = render(
      <GoldThread>
        <div data-at="200,0">
          <ThreadStop data-at="100,0" />
        </div>
        <div data-at="200,600">
          <ThreadStop data-at="100,600" />
        </div>
      </GoldThread>,
    )
    act(() => window.dispatchEvent(new Event('resize')))
    const d = container.querySelector('path')!.getAttribute('d')!
    const xs = [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => Number(m[1]))
    expect(xs.some((x) => x !== 100)).toBe(true)
  })

  it('never sways far enough to touch the text beside a stop', () => {
    const { container } = render(
      <GoldThread>
        <div data-at="48,0">
          <ThreadStop data-at="36,0" />
        </div>
        <div data-at="48,600">
          <ThreadStop data-at="36,600" />
        </div>
      </GoldThread>,
    )
    act(() => window.dispatchEvent(new Event('resize')))
    const strands = container.querySelectorAll('path[data-strand]')
    expect(strands.length).toBeGreaterThan(0)
    for (const p of strands) {
      const [a, b] = [...p.getAttribute('d')!.matchAll(/C(-?[\d.]+) -?[\d.]+ (-?[\d.]+)/g)][0].slice(1).map(Number)
      for (let t = 0; t <= 1; t += 0.05) {
        const x = 36 * (1 - t) ** 3 + 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + 36 * t ** 3
        expect(x + 3).toBeLessThan(48)
      }
    }
  })

  it('shows gold marks only where a stop is marked', () => {
    const { container } = render(
      <GoldThread>
        <ThreadStop />
        <ThreadStop marked />
      </GoldThread>,
    )
    const stops = container.querySelectorAll('[data-thread-stop]')
    expect(stops[0].className).not.toMatch(/bg-champagne/)
    expect(stops[1].className).toMatch(/bg-champagne/)
    stops.forEach((s) => expect(s.getAttribute('aria-hidden')).toBe('true'))
  })

  it('shows the whole thread without drawing for reduced motion', () => {
    const { container } = render(
      <GoldThread>
        <ThreadStop />
      </GoldThread>,
    )
    expect(container.querySelector('svg')!.getAttribute('class')).toContain('motion-reduce:[clip-path:none]!')
  })
})
