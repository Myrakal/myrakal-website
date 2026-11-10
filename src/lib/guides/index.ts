import { isDentalWorkAbroadSafe } from '@/lib/guides/is-dental-work-abroad-safe'
import { dentalTourismFacilitatorsCompared } from '@/lib/guides/dental-tourism-facilitators-compared'
import { verifyADentistOrSurgeon } from '@/lib/guides/verify-a-dentist-or-surgeon'
import { whenNotToGetDentalWorkAbroad } from '@/lib/guides/when-not-to-get-dental-work-abroad'

export const GUIDES = {
  [verifyADentistOrSurgeon.slug]: verifyADentistOrSurgeon,
  [isDentalWorkAbroadSafe.slug]: isDentalWorkAbroadSafe,
  [whenNotToGetDentalWorkAbroad.slug]: whenNotToGetDentalWorkAbroad,
  [dentalTourismFacilitatorsCompared.slug]: dentalTourismFacilitatorsCompared,
}
