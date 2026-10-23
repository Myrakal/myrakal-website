/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const rewrites = (): { source: string; destination: string }[] =>
  JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')).rewrites

const destinationFor = (path: string) =>
  rewrites().find((r) => new RegExp(`^${r.source}$`).test(path))?.destination

describe('deployed routing', () => {
  it.each(['/chat', '/chat/', '/privacy/', '/terms/', '/contact/', '/accessibility/'])(
    'serves the app shell for %s',
    (path) => {
      expect(destinationFor(path)).toBe('/index.html')
    },
  )

  it.each(['/api', '/api/intake', '/api/checkout', '/api/stripe-webhook'])('leaves %s to the API', (path) => {
    expect(destinationFor(path)).toBeUndefined()
  })
  it('lets a missing build asset 404 instead of returning the app shell', () => {
    expect(destinationFor('/assets/index-abc123.js')).toBeUndefined()
  })
})
