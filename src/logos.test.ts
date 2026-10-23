import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const asset = (file: string) => resolve(__dirname, 'assets', file)

describe('logos', () => {
  it.each(['myrakal-logo', 'myrakal-wordmark'])('%s is a transparent SVG, not a PNG', (name) => {
    expect(existsSync(asset(`${name}.png`))).toBe(false)
    const svg = readFileSync(asset(`${name}.svg`), 'utf8')
    expect(svg).toMatch(/<svg[^>]+viewBox=/)
    expect(svg).not.toContain('<rect')
    expect(svg).not.toContain('<image')
  })
})
