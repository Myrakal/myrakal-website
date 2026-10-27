import { GMAIL_HREF, OUTLOOK_HREF, TALK_EMAIL, TALK_WITH_US_HREF } from '@/lib/contact'

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

describe('webmail compose links', () => {
  it('open Gmail and Outlook compose with the recipient, subject and body prefilled', () => {
    for (const href of [GMAIL_HREF, OUTLOOK_HREF]) {
      const url = new URL(href)
      expect(url.protocol).toBe('https:')
      expect(url.searchParams.get('to')).toBe(TALK_EMAIL)
      expect(url.searchParams.get('body')).toMatch(/^Hey, I'm looking to/)
    }
    expect(new URL(GMAIL_HREF).searchParams.get('su')).toBe(new URL(TALK_WITH_US_HREF).searchParams.get('subject'))
    expect(new URL(OUTLOOK_HREF).searchParams.get('subject')).toBe(new URL(TALK_WITH_US_HREF).searchParams.get('subject'))
  })
})
