import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { JsonLd } from '@/components/JsonLd'
import { faqPage } from '@/lib/structured-data'

export type FaqItem = { question: string; answer: string }

const FAQS: FaqItem[] = [
  {
    question: 'What is Myrakal?',
    answer:
      'Myrakal helps you understand your healthcare costs and explore your options, including care abroad. You tell us about your situation, and a licensed doctor reviews your case.',
  },
  {
    question: 'How does it work?',
    answer:
      "It starts with intake. Our AI only gathers information: your lab results, imaging, other tests, and your insurance plan. It gives no advice. Once intake is complete, it tells you it's done. Then a licensed doctor reviews your case and either approves it or makes changes. Nothing is recommended before the doctor has reviewed your case.",
  },
  {
    question: 'Do I need a diagnosis to start?',
    answer:
      "No. You can come to us with or without a current diagnosis or case. Intake gathers whatever you have, and the licensed doctor decides what is needed next.",
  },
  {
    question: 'Does AI make medical decisions?',
    answer:
      "No. AI only gathers your information. It doesn't diagnose or advise. A licensed doctor reviews your case before anything is recommended, approved, or changed.",
  },
  {
    question: 'Is my information kept private?',
    answer:
      'Health and insurance information you share during intake and consult is handled as described in our Privacy Policy. Please share it only through Myrakal intake, not by general email or the website contact form.',
  },
  {
    question: 'Is Myrakal available now?',
    answer:
      "Yes. Intake is self-serve, so you can start whenever you're ready. Talk with us if you have questions along the way.",
  },
  {
    question: 'How much does it cost?',
    answer:
      'The consult is a flat $50 fee. It is credited toward any treatment you choose through Myrakal.',
  },
  {
    question: 'How do you vet doctors and hospitals?',
    answer:
      'Every doctor is licensed and credential-verified, and every hospital we work with is internationally accredited. We hold every partner to the same standard we’d want for our own family.',
  },
  {
    question: 'What does Myrakal handle?',
    answer:
      'Everything around your care, in one place: finding your doctor, working with your insurance and financing, booking appointments, flights, hotels and ground transportation, sending your documents to your doctors, and coordinating aftercare and prescriptions.',
  },
]

export function FAQ({ faqs = FAQS }: { faqs?: FaqItem[] }) {
  return (
    <section className="grid gap-12 bg-ink px-6 py-24 font-caslon sm:px-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20 lg:px-24 lg:py-36">
      <JsonLd data={faqPage(faqs)} />
      <div className="flex flex-col gap-4">
        <p className="text-xs tracking-[0.32em] text-champagne uppercase">Questions</p>
        <h2 className="font-display text-4xl leading-tight text-cream italic sm:text-[2.75rem]">Frequently asked</h2>
      </div>
      <Accordion hiddenUntilFound className="border-b border-rule">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question} className="border-t border-rule not-last:border-b-0">
            <AccordionTrigger className="gap-6 rounded-none py-6 font-display text-xl font-normal text-cream no-underline hover:no-underline focus-visible:ring-champagne/60 sm:text-[1.625rem] **:data-[slot=accordion-trigger-icon]:hidden!">
              {faq.question}
              <span aria-hidden="true" className="font-caslon text-[22px] leading-none text-champagne before:content-['+'] group-aria-expanded/accordion-trigger:before:content-['−']" />
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-7 font-caslon text-[17px] leading-relaxed text-mist">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
