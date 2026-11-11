import type { Metadata } from 'next'

import { pageMetadata } from '@/lib/site'

export type Treatment = {
  slug: string
  name: string
  title: string
  description: string
  headline: string
  intro: string
  places: [string, string][]
  faqs: [string, string][]
  guides: string[]
}

export const TREATMENTS = {
  dental: {
    slug: 'dental',
    name: 'Dental',
    title: 'Dental implants and All-on-4, best price anywhere | Myrakal',
    description:
      'Send us your dental quote for implants, All-on-4, full-mouth work or veneers. We compare verified dentists near you, elsewhere in the U.S. and abroad, then book the one you pick. Comparing is free.',
    headline: 'Your dental work, at the best price anywhere.',
    intro:
      'Implants, All-on-4, full-mouth work and veneers. Send us your quote and we compare verified dentists near you, elsewhere in the U.S. and abroad. Pick one and we book it.',
    places: [
      ['Near you', 'Verified practices in your area. Prices for the same work can vary a lot between offices.'],
      ['Elsewhere in the U.S.', 'A short drive or flight can lower the price, with follow-up visits still close to home.'],
      ['Abroad', 'Accredited clinics priced all-in, with flights, hotel and aftercare included.'],
    ],
    faqs: [
      [
        'What does all-in include?',
        'For care away from home, the price covers the treatment, flights, hotel, local transport and the aftercare we arrange. Each option lists exactly what it includes.',
      ],
    ],
    guides: ['verify-a-dentist-or-surgeon', 'is-dental-work-abroad-safe', 'when-not-to-get-dental-work-abroad', 'dental-tourism-facilitators-compared'],
  },
  cosmetic: {
    slug: 'cosmetic',
    name: 'Cosmetic',
    title: 'Cosmetic surgery, best price anywhere | Myrakal',
    description:
      'Send us your quote for rhinoplasty, eyelid surgery, a facelift or another elective procedure. We compare verified surgeons near you, elsewhere in the U.S. and abroad, then book the one you pick. Comparing is free.',
    headline: 'Cosmetic care, at the best price anywhere.',
    intro:
      'Rhinoplasty, eyelid surgery, facelifts and other elective procedures. Send us your quote and we compare verified surgeons near you, elsewhere in the U.S. and abroad. Pick one and we book it.',
    places: [
      ['Near you', 'Board-certified surgeons in your area, compared on price and on what each quote includes.'],
      ['Elsewhere in the U.S.', 'Another city can cost less, with recovery and follow-up planned before you go.'],
      ['Abroad', 'Accredited hospitals priced all-in, with flights, a recovery stay and aftercare included.'],
    ],
    faqs: [
      [
        'What does all-in include?',
        'For care away from home, the price covers the procedure, flights, a recovery stay, local transport and the aftercare we arrange. Each option lists exactly what it includes.',
      ],
      [
        'When can I fly home after surgery?',
        'Your surgeon decides. After major surgery many people need to stay put for one to two weeks, so we plan the trip and the recovery stay around it.',
      ],
      [
        'How do you choose surgeons?',
        "We check each surgeon's license and board certification and the facility's accreditation before we suggest them.",
      ],
    ],
    guides: ['verify-a-dentist-or-surgeon']
  },
} satisfies Record<string, Treatment>

export function treatmentMetadata(treatment: Treatment): Metadata {
  return { title: treatment.title, description: treatment.description, ...pageMetadata(`/${treatment.slug}`) }
}
