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
      'Myrakal finds the right prescription at the best price, and coordinates everything for you. A licensed doctor reviews it.',
  },
  {
    question: 'How does it work?',
    answer:
      'Tell us the prescription you need. We compare prices, coordinate the details, and a licensed doctor reviews it before anything is final.',
  },
  {
    question: 'Does a doctor review my prescription?',
    answer: 'Yes. A licensed doctor reviews every prescription before it is approved or changed.',
  },
  {
    question: 'How much does it cost?',
    answer: 'The consult is a flat $50 fee. It is credited toward any prescription you choose through Myrakal.',
  },
  {
    question: 'Is my information kept private?',
    answer:
      'Health information is handled as described in our Privacy Policy. Please do not include it in the contact form.',
  },
  {
    question: 'How do I start?',
    answer: 'Press Talk with us and send a short message. We will reply by email.',
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
