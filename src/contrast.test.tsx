import { readFileSync } from 'node:fs'
import { join } from 'node:path'


const read = (path: string) => readFileSync(join(__dirname, path), 'utf8')

describe('form control text contrast', () => {
  it('sets a dark text colour on every form control by default', () => {
    const css = read('index.css')
    const rule = css.match(/input,\s*textarea,\s*select\s*\{[^}]*\}/)?.[0] ?? ''
    expect(rule).toMatch(/color:\s*var\(--card-foreground\)/)
  })

  it('styles placeholders with the dark text colour', () => {
    expect(read('index.css')).toMatch(/::placeholder\s*\{[^}]*--card-foreground/)
  })
})
