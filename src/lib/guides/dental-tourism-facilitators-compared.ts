import type { Guide } from '@/lib/guides/types'

export const dentalTourismFacilitatorsCompared: Guide = {
  slug: 'dental-tourism-facilitators-compared',
  title: 'Dental tourism services compared: who pays them, and what they do | Myrakal',
  description:
    'How Bookimed, Dental Departures, Doctours, booking a clinic directly and Myrakal are paid, what each one does and what each costs a patient, from their own published statements.',
  headline: 'Dental tourism services compared: who pays them, and what they do',
  answer:
    'Myrakal publishes this page and is one of the options compared. Bookimed, Dental Departures and Doctours say they are free for patients. Bookimed says partner clinics pay it a commission, Doctours was reported in October 2026 to be paid by participating clinics, and we could not find a public statement of how Dental Departures is paid. Booking a clinic directly has no middleman fee, but you do the vetting, travel planning and follow-up yourself.',
  updated: '2026-11-10',
  sections: [
    {
      heading: 'Who wrote this',
      body: 'Myrakal wrote this guide, and Myrakal is one of the services in the table below. We describe each company, including our own, using only what it says on its own website or what press coverage has reported. Everything here is as of November 2026. Terms change, so check each company\'s current terms before you book.',
    },
    {
      heading: 'The options side by side',
      table: {
        head: ['Service', 'Who pays it', 'What it does', 'Cost to patient'],
        rows: [
          ['Bookimed', 'Partner clinics pay it a commission. Bookimed says this does not change your price, and paid placements are labeled.', 'An assigned doctor coordinator suggests partner clinics and specialists for your case and helps with visas and trip planning.', 'Free to use. You pay the clinic for treatment. Some clinics ask for a $200 or €200 deposit through Bookimed, deducted from what you pay the clinic. Refund terms are in its deposit terms.'],
          ['Dental Departures', 'We could not find a public statement of how it is paid (checked November 2026).', 'Lists dental clinics abroad with prices, reviews and photos, gives free quotes and takes online bookings.', 'No fees to patients, per its FAQ. You pay the clinic directly for treatment.'],
          ['Doctours', 'Participating clinics pay it for coordination, according to coverage of its October 2026 funding announcement.', 'Helps Americans compare, book and coordinate care in the U.S. and abroad, with U.S.-based coordinators, travel support and aftercare. It is starting with hair restoration.', 'Free for patients, as reported in October 2026. Treatment is priced separately.'],
          ['Booking a clinic directly', 'No one. There is no service in the middle.', 'You find, check and book the clinic, then plan travel and follow-up care yourself.', 'Treatment only, with no service fee.'],
          ['Myrakal', 'Patients. Myrakal never takes money from clinics.', 'Compares verified providers near you, elsewhere in the U.S. and abroad, then books and coordinates your care.', 'Comparing is free. Booking and coordinating cost one coordination fee, shown before you commit.'],
        ],
      },
    },
    {
      heading: 'Why the business model matters',
      body: 'Every service is paid by someone. When clinics pay, a service earns more when patients choose the clinics it works with, which can shape which clinics it shows you. When patients pay, the service earns the same whichever clinic you pick. Neither model guarantees good or bad care. It is one more fact to weigh, and any service should answer the questions below plainly.',
    },
    {
      heading: 'Questions to ask any service',
      points: [
        'Who pays you, and how much?',
        'Do clinics pay to be listed or featured?',
        'Does booking through you change my treatment price?',
        'What help do I get if I need follow-up care at home?',
      ],
    },
    {
      heading: 'Booking a clinic directly',
      points: [
        'You pay no middleman fee and deal with the clinic yourself.',
        'You check the dentist\'s license and the clinic\'s accreditation yourself. Our guide to verifying a dentist or surgeon, linked below, shows how.',
        'You arrange travel, translation if needed, and travel health insurance that covers medical evacuation.',
        'You get copies of your records before you fly home and line up follow-up care in the U.S., since complications may not be covered by your insurance.',
      ],
    },
    {
      heading: 'Where Myrakal fits',
      body: 'Myrakal is paid by patients and never takes money from clinics. Comparing options is free, and booking and coordinating cost one coordination fee, shown before you commit. We compare verified providers near you, elsewhere in the U.S. and abroad, and check licenses and accreditation before we suggest anyone. Myrakal is not a medical provider and gives no medical advice. Licensed clinicians make treatment plans.',
    },
  ],
  sources: [
    ['Bookimed: Finance policy', 'https://us-uk.bookimed.com/page/finance-policy/'],
    ['Bookimed: Advertiser disclosure', 'https://us-uk.bookimed.com/page/advertiser-disclosure/'],
    ['Bookimed: How it works', 'https://us-uk.bookimed.com/doc/how-does-it-work'],
    ['Dental Departures: Home', 'https://www.dentaldepartures.com/'],
    ['Dental Departures: FAQs', 'https://www.dentaldepartures.com/about/faqs'],
    ['Dental Departures: Terms of service', 'https://www.dentaldepartures.com/terms'],
    ['Pulse 2.0: Doctours raises $2 million pre-seed (October 2026)', 'https://pulse2.com/doctours-raises-2-million-pre-seed/'],
    ['CDC: Medical tourism', 'https://wwwnc.cdc.gov/travel/page/medical-tourism'],
  ],
}
