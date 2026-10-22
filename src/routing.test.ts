/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const rewrites = (): { source: string; destination: string }[] => {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8')).rewrites ?? []
  } catch {
    return []
  }
}

const destinationFor = (path: string) =>
  rewrites().find((r) => new RegExp(`^${r.source}$`).test(path))?.destination

describe('deployed routing', () => {
  it.each(['/chat', '/chat/', '/privacy/', '/terms/', '/contact/', '/accessibility/', '/case', '/doctor/'])(
    'serves the app shell for %s',
    (path) => {
      expect(destinationFor(path)).toBe('/index.html')
    },
  )

  it.each(['/api/intake', '/api/checkout', '/api/stripe-webhook'])('leaves %s to the API', (path) => {
    expect(destinationFor(path)).toBeUndefined()
  })
})
