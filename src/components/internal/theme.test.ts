import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { CYAN, DIM_EDGE, FOG, GOLD, GROUND, MOON, WALL } from './palette'

const read = (f: string) => readFileSync(join(__dirname, f), 'utf8')
const luma = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

describe('gotham palette', () => {
  it('uses near-black surfaces', () => {
    for (const c of [GROUND, FOG, WALL, DIM_EDGE]) expect(luma(c)).toBeLessThan(0.25)
  })

  it('uses bright accents and moonlight', () => {
    for (const c of [GOLD, CYAN, MOON]) expect(luma(c)).toBeGreaterThan(0.4)
  })
})

describe('gotham styling', () => {
  it('drops the maroon branding from the internal css', () => {
    for (const f of ['internal.css', 'Tooltip.module.css']) {
      const css = read(f).toLowerCase()
      for (const old of ['#120709', '#3a1419', '107, 34, 48', '77, 15, 26', '18, 7, 9']) expect(css).not.toContain(old)
    }
  })

  it('has no Myrakal logo in the HUD', () => {
    expect(read('CareNetwork.tsx')).not.toMatch(/internal-logo|Myrakal/)
  })
})
