import { TreatmentPage } from '@/components/TreatmentPage'
import { TREATMENTS, treatmentMetadata } from '@/lib/treatments'

export const metadata = treatmentMetadata(TREATMENTS.dental)

export default function Dental() {
  return <TreatmentPage treatment={TREATMENTS.dental} />
}
