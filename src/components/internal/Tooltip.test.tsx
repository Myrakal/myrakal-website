import { act, render, screen } from '@testing-library/react'
import { buildCity } from '@/lib/internal/city'
import Tooltip from './Tooltip'

const city = buildCity({
  providers: [
    { id: 'p1', slug: 'a', name: 'Alpha Clinic', kind: 'day_surgery', address: '1 Main St', city: 'Austin', region: 'TX', country: 'US', postal_code: null, phone: '555-0100', website: 'https://alpha.test' },
    { id: 'p2', slug: 'b', name: 'Beta Clinic', kind: 'clinic', address: null, city: 'Dallas', region: 'TX', country: 'US', postal_code: null, phone: null, website: null },
  ],
  doctors: [{ id: 'd1', slug: 'x', name: 'Ada Lovelace', specialty: 'Cardiology', credentials: 'MD', languages: ['English', 'French'] }],
  affiliations: [
    { id: 'a1', doctor_id: 'd1', provider_id: 'p1', role: null },
    { id: 'a2', doctor_id: 'd1', provider_id: 'p2', role: null },
  ],
  procedures: [{ id: 'pr1', slug: 'mri', name: 'MRI', category: null }],
  prices: [
    { id: 'x1', provider_id: 'p1', procedure_id: 'pr1', price_type: 'cash', amount_cents: '50000', amount_max_cents: null },
    { id: 'x2', provider_id: 'p2', procedure_id: 'pr1', price_type: 'cash', amount_cents: 90000, amount_max_cents: null },
  ],
})

describe('Tooltip', () => {
  it('renders nothing without a hover', () => {
    const { container } = render(<Tooltip city={city} hover={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows clinic details, doctors and the cheapest price marker', () => {
    render(<Tooltip city={city} hover={{ type: 'clinic', id: 'p1' }} />)
    expect(screen.getByRole('heading', { name: 'Alpha Clinic' })).toBeInTheDocument()
    expect(screen.getByText('day surgery · Austin · TX')).toBeInTheDocument()
    expect(screen.getByText('1 Main St')).toBeInTheDocument()
    expect(screen.getByText('alpha.test')).toBeInTheDocument()
    expect(screen.getByText('Doctors (1)')).toBeInTheDocument()
    expect(screen.getByText('$500 ★')).toBeInTheDocument()
    expect(screen.getByText('★ cheapest across all clinics')).toBeInTheDocument()
  })

  it('shows doctor details and affiliated clinics', () => {
    render(<Tooltip city={city} hover={{ type: 'doctor', id: 'd1' }} />)
    expect(screen.getByRole('heading', { name: 'Ada Lovelace, MD' })).toBeInTheDocument()
    expect(screen.getByText('Speaks: English, French')).toBeInTheDocument()
    expect(screen.getByText('Beta Clinic')).toBeInTheDocument()
  })

  it('follows the pointer and sets the cursor', () => {
    render(<Tooltip city={city} hover={{ type: 'doctor', id: 'd1' }} />)
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: 100, clientY: 120 }))
    })
    const tip = screen.getByRole('heading', { name: 'Ada Lovelace, MD' }).parentElement as HTMLElement
    expect(tip.style.left).toBe('118px')
    expect(tip.style.top).toBe('138px')
    expect(document.body.style.cursor).toBe('pointer')
  })

  it('renders nothing when the hovered id is unknown', () => {
    const clinic = render(<Tooltip city={city} hover={{ type: 'clinic', id: 'missing' }} />)
    expect(clinic.container).toBeEmptyDOMElement()
    const doctor = render(<Tooltip city={city} hover={{ type: 'doctor', id: 'missing' }} />)
    expect(doctor.container).toBeEmptyDOMElement()
  })

  it('replaces every underscore in the kind', () => {
    const multi = { ...city, clinicById: { ...city.clinicById, p1: { ...city.clinicById.p1, kind: 'day_surgery_center' } } }
    render(<Tooltip city={multi} hover={{ type: 'clinic', id: 'p1' }} />)
    expect(screen.getByText('day surgery center · Austin · TX')).toBeInTheDocument()
  })

  it('restores the previous cursor on unmount', () => {
    document.body.style.cursor = 'crosshair'
    const { unmount } = render(<Tooltip city={city} hover={{ type: 'doctor', id: 'd1' }} />)
    expect(document.body.style.cursor).toBe('pointer')
    unmount()
    expect(document.body.style.cursor).toBe('crosshair')
  })
})
