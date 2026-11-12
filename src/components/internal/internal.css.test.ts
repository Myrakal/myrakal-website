import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const css = readFileSync(join(__dirname, 'internal.css'), 'utf8')
const zIndex = (selector: string) => {
  const rule = css.split('}').find((r) => r.includes(selector + ' {'))
  return Number(rule?.match(/z-index:\s*(\d+)/)?.[1])
}

describe('internal.css stacking', () => {
  it('puts the HUD, hint and status above the labels (max 5)', () => {
    for (const s of ['.internal-root .hud', '.internal-root .hint', '.internal-root .status']) {
      expect(zIndex(s)).toBeGreaterThan(5)
    }
  })

  it('keeps them below the tooltip (10) and sign out (20)', () => {
    for (const s of ['.internal-root .hud', '.internal-root .hint', '.internal-root .status']) {
      expect(zIndex(s)).toBeLessThan(10)
    }
  })
})
