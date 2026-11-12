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
  it('shows no HUD text, only the map', () => {
    const { container } = render(<CareNetwork raw={raw} />)
    expect(screen.queryByRole('heading')).toBeNull()
    expect(container.textContent).toBe('')
  })

  it('scopes everything under the wrapper class', () => {
    const { container } = render(<CareNetwork raw={raw} />)
    expect((container.firstChild as HTMLElement).className).toContain('internal-root')
  })
})
