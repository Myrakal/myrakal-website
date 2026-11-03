import { FORMSPREE_ENDPOINT, TALK_EMAIL } from '@/lib/contact'

describe('contact', () => {
  it('emails eshaansood@myrakal.com', () => {
    expect(TALK_EMAIL).toBe('eshaansood@myrakal.com')
  })

  it('posts to the Formspree form', () => {
    expect(FORMSPREE_ENDPOINT).toBe('https://formspree.io/f/mdeepbjw')
  })
})
