/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'

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

  it('uses a solid alabaster white as the primary color', () => {
    expect(token('alabaster')?.toLowerCase()).toBe('#fbf8f3')
    expect(token('primary')).toBe('var(--alabaster)')
  })

  it('uses no gradients in styles or components', () => {
    expect(css).not.toMatch(/gradient/)
    for (const file of readdirSync(new URL('./components', import.meta.url), { recursive: true }).map(String).filter((f) => /\.tsx$/.test(f) && !/\.test\./.test(f)))
      expect(read(`./components/${file}`)).not.toMatch(/gradient|bg-none|bg-linear|\bvia-|\bfrom-charcoal/)
  })

  it('draws every call to action in alabaster instead of gold', () => {
    for (const file of ['Hero', 'Closing', 'Navbar']) {
      const source = read(`./components/${file}.tsx`)
      expect(source).toMatch(/alabaster/)
      expect(source).not.toMatch(/bg-champagne|border-champagne/)
    }
  })

  it('leaves no legacy hardcoded white/black in components', () => {
    expect(howItWorks).not.toMatch(/\bbg-white\b|ring-black/)
  })
})
