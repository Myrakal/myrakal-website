import { render } from '@testing-library/react'
import Contact from '@/views/Contact'
import Privacy from '@/views/Privacy'
import Terms from '@/views/Terms'

const text = (el: import('react').ReactElement) => render(el).container.textContent ?? ''

describe('legal pages reflect the intake and consult product', () => {
  it('no longer describe a waitlist', () => {
    for (const page of [<Terms key="terms" />, <Privacy key="privacy" />, <Contact key="contact" />]) {
      expect(text(page)).not.toMatch(/waitlist/i)
    }
  })

  it('privacy policy covers health information, intake, AI, labs, imaging and insurance', () => {
    const t = text(<Privacy />)
    expect(t).not.toMatch(/please do not submit medical information/i)
    for (const term of [/health information/i, /intake/i, /artificial intelligence|\bAI\b/, /lab results/i, /imaging/i, /insurance/i, /licensed/i])
      expect(t).toMatch(term)
  })

  it('terms describe intake, licensed doctor consult, and that AI is not a doctor', () => {
    const t = text(<Terms />)
    for (const term of [/intake/i, /consult/i, /licensed (doctor|physician)/i, /\bAI\b/])
      expect(t).toMatch(term)
    expect(t).not.toMatch(/does not currently complete medical bookings/i)
  })
})
