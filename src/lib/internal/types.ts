export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export type ProviderRow = {
  id: string
  slug: string
  name: string
  kind: string | null
  address: string | null
  city: string | null
  region: string | null
  country: string | null
  postal_code: string | null
  phone: string | null
  website: string | null
}
export type DoctorRow = {
  id: string
  slug: string
  name: string
  specialty: string | null
  credentials: string | null
  languages: string[] | null
}
export type AffiliationRow = { id: string; doctor_id: string; provider_id: string; role: string | null }
export type ProcedureRow = { id: string; slug: string; name: string; category: string | null }
export type PriceType = 'cash' | 'insurance' | 'range' | 'estimate'
export type PriceRow = {
  id: string
  provider_id: string
  procedure_id: string
  price_type: PriceType
  amount_cents: number | string
  amount_max_cents: number | string | null
}
export type RawGraph = {
  providers: ProviderRow[]
  doctors: DoctorRow[]
  affiliations: AffiliationRow[]
  procedures: ProcedureRow[]
  prices: PriceRow[]
}

export type PriceLine = {
  procedureId: string
  name: string
  type: PriceType
  amount: number
  max: number | null
  best?: boolean
}
export type Clinic = ProviderRow & { pos: Vec2; doctors: Doctor[]; prices: PriceLine[] }
export type Doctor = DoctorRow & { pos: Vec2; clinics: Clinic[] }
export type Link = { id: string; doctorId: string; clinicIds: [string, string]; points: Vec3[] }
export type Filler = { kind: 'tree' | 'block'; pos: Vec2; h: number; w: number }
export type City = {
  clinics: Clinic[]
  doctors: Doctor[]
  links: Link[]
  filler: Filler[]
  extent: Vec2
  clinicById: Record<string, Clinic>
  docById: Record<string, Doctor>
}
export type Hover = { type: 'clinic' | 'doctor'; id: string } | null
