import { TALK_EMAIL, TALK_WITH_US_HREF } from '@/lib/contact'

describe('TALK_WITH_US_HREF', () => {
  const url = new URL(TALK_WITH_US_HREF)

  it('emails anikuppili@myrakal.com', () => {
    expect(TALK_EMAIL).toBe('anikuppili@myrakal.com')
    expect(url.protocol).toBe('mailto:')
    expect(decodeURIComponent(url.pathname)).toBe('anikuppili@myrakal.com')
  })

  it('prefills a subject and a body that starts the sentence for the sender', () => {
    expect(url.searchParams.get('subject')).toBeTruthy()
    expect(url.searchParams.get('body')).toMatch(/^Hey, I'm looking to/)
  })
})
