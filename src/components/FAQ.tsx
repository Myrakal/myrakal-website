import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
    question: 'How do you vet doctors and hospitals?',
    answer:
      'Every doctor is licensed and credential-verified, and every hospital we work with is internationally accredited. We hold every partner to the same standard we’d want for our own family.',
  },
  {
    question: "What's next?",
    answer:
      "Intake and consult are just the start. We're building out flight and hotel booking, ground transportation, insurance support, and a doctor portal for sending documents. Your entire trip is handled in one place.",
  },
]

export function FAQ({
  faqs = FAQS,
  className = 'bg-background',
}: {
  faqs?: FaqItem[]
  className?: string
}) {
  return (
    <section className={`flex flex-col gap-12 px-6 py-24 sm:px-12 ${className}`}>
      <div className="mx-auto w-full max-w-2xl text-center">
        <h2 className="text-4xl text-foreground sm:text-5xl">
          Frequently asked questions
        </h2>
      </div>
      <Accordion className="mx-auto w-full max-w-2xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="py-6 text-lg font-medium text-foreground no-underline hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
