/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')
const css = read('./index.css')
const howItWorks = read('./components/HowItWorks.tsx')
const theme = css.match(/@theme inline\s*{([^}]*)}/)?.[1] ?? ''
const root = css.match(/:root\s*{([^}]*)}/)?.[1] ?? ''
const token = (name: string) =>
  root.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim()

describe('Velvet + Pearl palette', () => {
  it('defines the three brand colors', () => {
    expect(token('velvet')?.toLowerCase()).toBe('#47171d')
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

  it('draws every call to action as a gold outline instead of solid alabaster', () => {
    for (const file of ['TextUsButton']) {
      const source = read(`./components/${file}.tsx`)
      expect(source).toMatch(/border-champagne/)
      expect(source).not.toMatch(/\bbg-alabaster\b|border-alabaster/)
    }
  })

  it('defines the ink ground, mist text and rule colors', () => {
    expect(token('ink')?.toLowerCase()).toBe('#120709')
    expect(token('mist')?.toLowerCase()).toBe('#c9b8ad')
    expect(token('rule')?.toLowerCase()).toBe('#36181b')
  })

  it('sets the nav and footer in Caslon on the ink ground', () => {
    for (const file of ['TextUsButton', 'Footer']) {
      const source = read(`./components/${file}.tsx`)
      expect(source).toMatch(/font-caslon/)
      expect(source).not.toMatch(/font-grotesk/)
      expect(source).toMatch(/bg-ink/)
    }
  })

  it('leaves no legacy hardcoded white/black in components', () => {
    expect(howItWorks).not.toMatch(/\bbg-white\b|ring-black/)
  })

  it('softens the deep reds so they stay calm on uncalibrated screens', () => {
    expect(token('velvet-deep')?.toLowerCase()).toBe('#2a0c12')
    expect(token('velvet-light')?.toLowerCase()).toBe('#632a33')
    expect(token('greige')?.toLowerCase()).toBe('#381217')
    expect(read('./components/Hero.tsx')).toMatch(/\bsaturate-90\b/)
  })

  it('sets Bodoni at a sturdier optical size with larger body and label text', () => {
    expect(css).toMatch(/\.font-display\s*{[^}]*font-variation-settings:\s*'opsz' 18/)
    expect(theme).toMatch(/--text-lg:\s*1\.1875rem/)
    expect(theme).toMatch(/--text-xs:\s*0\.8125rem/)
  })
})
