jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({ usePathname: () => '/privacy/' }))

import { render } from '@testing-library/react'
import Accessibility from '@/views/Accessibility'
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

describe('legal pages match the site design', () => {
  it('use the site navigation, the ink ground and Caslon body text', () => {
    for (const page of [<Terms key="terms" />, <Privacy key="privacy" />, <Contact key="contact" />, <Accessibility key="a11y" />]) {
      const { container, unmount } = render(page)
      expect(container.querySelector('nav[aria-label="Primary"]')).not.toBeNull()
      const main = container.querySelector('main')!
      expect(main.className).toMatch(/bg-ink/)
      expect(main.className).toMatch(/font-caslon/)
      expect(container.innerHTML).not.toMatch(/rounded-2xl|font-heading/)
      unmount()
    }
  })
})
