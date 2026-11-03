import { TALK_EMAIL, TALK_WITH_US_HREF } from '@/lib/contact'

describe('TALK_WITH_US_HREF', () => {
  const url = new URL(TALK_WITH_US_HREF)

  it('emails eshaansood@myrakal.com', () => {
    expect(TALK_EMAIL).toBe('eshaansood@myrakal.com')
    expect(url.protocol).toBe('mailto:')
    expect(decodeURIComponent(url.pathname)).toBe('eshaansood@myrakal.com')
  })

  it('prefills a subject and a complete message body', () => {
    expect(url.searchParams.get('subject')).toBeTruthy()
    expect(url.searchParams.get('body')).toBe("Hey, I'm looking to get a treatment. Can Myrakal help me make it cheaper?")
  })
})
