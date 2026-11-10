import { TreatmentPage } from '@/components/TreatmentPage'
import { TREATMENTS, treatmentMetadata } from '@/lib/treatments'

export const metadata = treatmentMetadata(TREATMENTS.cosmetic)

export default function Cosmetic() {
  return <TreatmentPage treatment={TREATMENTS.cosmetic} />
}
