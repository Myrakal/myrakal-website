import type { Guide } from '@/lib/guides/types'

export const isDentalWorkAbroadSafe: Guide = {
  slug: 'is-dental-work-abroad-safe',
  title: 'Is dental work abroad safe? Implants and All-on-4 in Mexico | Myrakal',
  description:
    'A balanced look at dental implants, All-on-4 and full-mouth work in Mexico or elsewhere: the real risks the CDC describes, the steps that lower them, and the questions to ask a dentist abroad.',
  headline: 'Is dental work abroad safe?',
  answer:
    'It can be, with a qualified dentist, a clean facility and a plan for follow-up care at home. The risks are real, though, and some come from the travel itself: infections, language gaps, gaps in follow-up and flying soon after surgery. Most of these risks can be lowered with research and planning before you book.',
  updated: '2026-11-10',
  sections: [
    {
      heading: 'What the risks are',
      points: [
        'Infection is the most common complication. The CDC names wound and bloodstream infections, plus hepatitis B, hepatitis C and HIV where infection control is weak.',
        'Drug-resistant bacteria and fungi are more common in some destinations and have caused outbreaks among medical tourists, including in Mexico.',
        'Licensing and oversight of dentists, drugs and devices can be looser than in the U.S. Some medicines may be counterfeit or expired.',
        'Language barriers can lead to misunderstandings about your care.',
        'Follow-up may not happen at the clinic that did the work. Fixing a problem back home can be costly, and your insurance may not pay for it.',
        'Flying soon after surgery raises the risk of blood clots. Ask your surgeon when it is safe to fly.',
        'You may have fewer legal options if something goes wrong.',
      ],
    },
    {
      heading: 'Steps that lower the risk',
      steps: [
        "Research the dentist and the facility. Check the dentist's license and any accreditation, knowing accreditation does not guarantee a good result. Our guide at /guides/verify-a-dentist-or-surgeon shows how.",
        'See your own dentist or a travel medicine clinician 4 to 6 weeks before the trip, and make sure your routine vaccines, including hepatitis B, are current.',
        'Confirm in writing what the quoted price includes. Some clinics charge extra for follow-up care.',
        'Plan how you will talk with the care team if you do not share a language.',
        'Get written records of everything done, in English, before you fly home, and share them with your dentist at home.',
        'Arrange follow-up care at home before you go, and agree with both dentists on how complications will be handled.',
        'Check what your health and dental plans cover abroad and after you return. Consider travel health insurance that includes medical evacuation.',
      ],
    },
    {
      heading: 'Dental questions to ask before you book',
      points: [
        'Which implant brand and model will you use? The FDA advises asking this and keeping it for your records.',
        'How many trips will this take, and how long between them? Implants usually need several months to fuse with the bone, so final teeth often come later.',
        'Who places the implants, and what is their training? Oral and maxillofacial surgeons have specialized surgical training for this work.',
        'What does the warranty cover, and for how long? Does it cover travel if a repair is needed?',
        'Who handles complications after I am home, and who pays?',
        'Are new gloves and needles used for each patient? Are instruments sterilized between patients? Is sterile water used for surgery? These come from a checklist the CDC and the Organization for Safety, Asepsis and Prevention (OSAP) created for travelers.',
      ],
    },
    {
      heading: 'When to stay home',
      body: 'Talk with your doctor first if you have a health condition or take medicines that could complicate surgery. Uncontrolled diabetes and smoking both raise the chance an implant fails. If you cannot arrange follow-up care at home, or the clinic will not answer the questions above, that is a reason to look closer to home.',
    },
    {
      heading: 'What Myrakal checks',
      body: 'Myrakal checks licenses and accreditation before suggesting any provider, near you, elsewhere in the U.S. or abroad, so you can compare them side by side for free. We are not a medical provider; a licensed clinician makes your treatment plan.',
    },
  ],
  sources: [
    ['CDC Travelers’ Health: Medical tourism', 'https://wwwnc.cdc.gov/travel/page/medical-tourism'],
    ['CDC Yellow Book 2026: Medical tourism', 'https://www.cdc.gov/yellow-book/hcp/health-care-abroad/medical-tourism.html'],
    ['FDA: Dental implants, what you should know', 'https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know'],
    ['AAOMS: Dental implant surgery', 'https://myoms.org/what-we-do/dental-implant-surgery/'],
    ['CDC and OSAP: Traveler’s Guide to Safe Dental Care (archived)', 'https://webarchive.library.unt.edu/eot2008/20090116093650/http:/www.cdc.gov/oralhealth/publications/library/pressrealeases/travel.htm'],
    ['Public Health Agency of Canada: Checklist for safe dental care abroad (archived, adapted from OSAP)', 'https://www.canada.ca/en/public-health/topics/oral-health/safe-dental-care-travelers/checklist-safe-dental-care-foreign-countries.html'],
  ],
}
