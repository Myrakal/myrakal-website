import { render, screen } from '@testing-library/react'

import type { RawGraph } from '@/lib/internal/types'
import CareNetwork from './CareNetwork'

const raw: RawGraph = {
  providers: [
    { id: 'p1', slug: 'a', name: 'Alpha', kind: 'hospital' },
    { id: 'p2', slug: 'b', name: 'Beta', kind: 'clinic' },
  ] as any,
  doctors: [{ id: 'd1', slug: 'd', name: 'Dr One', specialty: null }] as any,
  affiliations: [{ id: 'a1', doctor_id: 'd1', provider_id: 'p1', role: null }],
  procedures: [],
  prices: [],
}

describe('CareNetwork', () => {
  it('shows the HUD with counts', () => {
    const { container } = render(<CareNetwork raw={raw} />)
    expect(screen.getByRole('heading', { name: /care network/i })).toBeTruthy()
    expect(screen.getByText(/every clinic, doctor and price/i)).toBeTruthy()
    expect(container.textContent).toMatch(/2 clinics\s*·\s*1 doctors/)
    expect(screen.getByText(/drag to rotate/i)).toBeTruthy()
  })

  it('scopes everything under the wrapper class', () => {
    const { container } = render(<CareNetwork raw={raw} />)
    expect((container.firstChild as HTMLElement).className).toContain('internal-root')
  })
})
