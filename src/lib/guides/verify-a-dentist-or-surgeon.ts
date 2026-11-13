import type { Guide } from '@/lib/guides/types'

export const verifyADentistOrSurgeon: Guide = {
  slug: 'verify-a-dentist-or-surgeon',
  title: 'How to verify a dentist or surgeon in the U.S. or Mexico | Myrakal',
  description:
    'Use official U.S. and Mexican registries to check licenses, disciplinary history, and board certification before choosing a dentist or surgeon.',
  headline: 'How to check a dentist or surgeon before you book',
  answer:
    'Look the provider up in the official registry for the place they practice. In the U.S. that is the state licensing board, and DocInfo covers physicians in every state. In Mexico it is the SEP professional registry, plus the CMCPER directory for plastic surgeons. All of these are free.',
  updated: '2026-11-10',
  sections: [
    {
      heading: 'Dentists in the U.S.',
      steps: [
        "Find your state's dental board. Each state licenses dentists separately, and each board runs a free license search by name or license number.",
        'Confirm the license is active in the state where you will be treated.',
        'Read any disciplinary actions the board lists. An active license can still carry restrictions.',
        'For implants or full-mouth work, ask whether the dentist is a specialist, such as an oral surgeon or prosthodontist, and check that specialty board too.',
      ],
    },
    {
      heading: 'Surgeons in the U.S.',
      steps: [
        "Search DocInfo.org, the Federation of State Medical Boards' free database of license history and disciplinary actions across all states.",
        "Check board certification at CertificationMatters.org, the American Board of Medical Specialties' free lookup.",
        'For cosmetic surgery, check which board certified the surgeon and that it is an ABMS member board. For body procedures that usually means the American Board of Plastic Surgery. Some boards that sound official are not ABMS boards.',
      ],
    },
    {
      heading: 'Dentists and doctors in Mexico',
      steps: [
        "Ask for the provider's full name and cédula profesional, the federal license number every doctor and dentist must hold.",
        'Search it in the Registro Nacional de Profesionistas at cedulaprofesional.sep.gob.mx. It is free and works by name or cédula number.',
        'Check the studies listed. A specialist should have a registered specialty, not only a general degree.',
        "For plastic surgery, also search the CMCPER directory at cmcper.org/directorio. Mexico's specialty council body, CONACEM, recognizes only CMCPER to certify plastic surgeons.",
      ],
    },
    {
      heading: 'What a license does not tell you',
      points: [
        'A license confirms legal status and training. It does not guarantee results, so treat it as a minimum, not a recommendation.',
        'Ask which implant or device brand will be used and what the warranty covers.',
        'Get the treatment plan and the price in writing, and arrange follow-up care at home before you travel.',
      ],
      body: 'Myrakal checks licenses and accreditation before we suggest a provider. Comparing options is free.',
    },
  ],
  sources: [
    ['FSMB: DocInfo for consumers', 'https://www.fsmb.org/guide-to-medical-regulation-in-the-united-states/information-for-consumers/'],
    ['ABMS: Verify certification', 'https://www.abms.org/verify-certification/'],
    ['American Board of Plastic Surgery: Is your surgeon certified?', 'https://www.abplasticsurgery.org/public/'],
    ['The Aesthetic Society: Board certification', 'https://www.theaestheticsociety.org/patient-resources/how-to-choose-a-plastic-surgeon/board-certification'],
    ['Georgia Dental Association: Is your provider licensed?', 'https://www.gadental.org/news/is-your-provider-licensed-how-to-protect-yourself-when-seeking-treatment'],
    ['SEP: Registro Nacional de Profesionistas', 'https://cedulaprofesional.sep.gob.mx/'],
    ['Gobierno de México: Aviso de riesgo, cirugía estética (CONACEM and CMCPER)', 'https://www.gob.mx/cms/uploads/attachment/file/859649/Aviso_de_Riesgo_Maestria_Cirugia_Estetica_19062023.pdf'],
    ['CDC: Medical tourism', 'https://wwwnc.cdc.gov/travel/page/medical-tourism'],
  ],
}
