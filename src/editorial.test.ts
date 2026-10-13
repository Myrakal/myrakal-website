/// <reference types="node" />
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('editorial direction', () => {
  it('uses an asymmetric magazine composition on the homepage', () => {
    expect(read('./components/Hero.tsx')).toContain('editorial-hero')
    expect(read('./components/HowItWorks.tsx')).toContain('Issue 01')
  })

  it('uses solid brand fields instead of iridescent controls', () => {
    expect(read('./components/Navbar.tsx')).not.toContain('pearl-gradient')
    expect(read('./components/WaitlistForm.tsx')).not.toContain('pearl-gradient')
  })
})
