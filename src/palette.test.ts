/// <reference types="node" />
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const css = read('./index.css')
const howItWorks = read('./components/HowItWorks.tsx')
const root = css.match(/:root\s*{([^}]*)}/)?.[1] ?? ''
const token = (name: string) =>
  root.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim()

describe('Velvet + Pearl palette', () => {
  it('defines the three brand colors', () => {
    expect(token('velvet')?.toLowerCase()).toBe('#4d0f1a')
    expect(token('cream')?.toLowerCase()).toBe('#f6eee4')
    expect(token('pearl')?.toLowerCase()).toBe('#ebd3da')
  })

  it('uses a velvet page with cream text', () => {
    expect(token('background')).toBe('var(--velvet)')
    expect(token('foreground')).toBe('var(--cream)')
  })

  it('defines an iridescent pearl gradient', () => {
    expect(token('pearl-gradient')).toMatch(/^linear-gradient\(/)
  })

  it('leaves no legacy hardcoded white/black in components', () => {
    expect(howItWorks).not.toMatch(/\bbg-white\b|ring-black/)
  })
})
