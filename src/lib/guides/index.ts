import { isDentalWorkAbroadSafe } from '@/lib/guides/is-dental-work-abroad-safe'
import { verifyADentistOrSurgeon } from '@/lib/guides/verify-a-dentist-or-surgeon'

export const GUIDES = {
  [verifyADentistOrSurgeon.slug]: verifyADentistOrSurgeon,
  [isDentalWorkAbroadSafe.slug]: isDentalWorkAbroadSafe,
}
