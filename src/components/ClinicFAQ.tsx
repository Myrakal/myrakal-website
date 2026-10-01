import { FAQ, type FaqItem } from '@/components/FAQ'

const CLINIC_FAQS: FaqItem[] = [
  {
    question: 'What does it cost to join?',
    answer:
      'Nothing upfront. We do the work first, and we only get paid for each patient who books.',
  },
  {
    question: 'Who can join?',
    answer:
      "We're starting with a small group of accredited hospitals and clinics. We consider accreditations such as JCI, DNV, ACHSI, Accreditation Canada International, NABH, and others, and we review other recognized programs case by case.",
  },
  {
    question: 'How do you verify hospitals?',
    answer:
      'We look at your accreditation, patient reviews, and track record. We only work with partners we would trust with our own family.',
  },
  {
    question: 'Where do the patients come from?',
    answer:
      "We're source patients from the U.S. who are looking for care abroad, and we match them with vetted hospitals like yours.",
  },
  {
    question: 'What does onboarding involve?',
    answer:
      'Paperwork and setup, including any contracts, your hospital profile, and billing details. A dedicated person from our team guides you through it.',
  },
  {
    question: 'Is Myrakal open to every hospital?',
    answer:
      "Not yet. We're invite only while we start out, which is also why you get hands-on support. Contact us and we'll let you know if there's a fit.",
  },
]

export function ClinicFAQ() {
  return <FAQ faqs={CLINIC_FAQS} />
}
