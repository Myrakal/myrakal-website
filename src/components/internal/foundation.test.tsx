import { CHAMPAGNE, CREAM, DIM_EDGE, GLASS, GOLD, WALL } from './palette'
import { Block, Tower, Windows } from './primitives'

describe('internal scene foundation', () => {
  it('exposes the palette', () => {
    for (const color of [GOLD, CHAMPAGNE, CREAM, WALL, GLASS, DIM_EDGE]) expect(color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('exposes the scene primitives', () => {
    for (const part of [Block, Windows, Tower]) expect(typeof part).toBe('function')
  })

  it('Windows renders two panes per row', () => {
    const panes = Windows({ position: [0, 1, 0], size: [2, 2, 2], rows: 3 })
    expect(panes).toHaveLength(6)
  })
})
