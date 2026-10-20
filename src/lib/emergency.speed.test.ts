import { detectEmergency } from '@/lib/emergency'

const time = (text: string) => {
  const start = performance.now()
  detectEmergency(text)
  return performance.now() - start
}

describe('detectEmergency speed on the main thread', () => {
  it('handles a 4000-character message of single-character tokens quickly', () => {
    expect(time('a b '.repeat(1000))).toBeLessThan(100)
  })

  it('handles a 4000-character benign paragraph quickly', () => {
    const paragraph = 'My knee has hurt for about two months, mostly when I climb stairs. '
    expect(time(paragraph.repeat(60).slice(0, 4000))).toBeLessThan(100)
  })

  it('handles a 4000-character message of repeated trigger prefixes quickly', () => {
    expect(time('chest '.repeat(700).slice(0, 4000))).toBeLessThan(100)
    expect(time('took 9 of my '.repeat(300).slice(0, 4000))).toBeLessThan(100)
  })
})
