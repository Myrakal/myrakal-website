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
      'Myrakal is a all-in-one platform for cross-border healthcare. We help you find the right country and the right doctor for the care you need, at a fraction of the cost.',
  },
  {
    question: 'Is Myrakal available now?',
    answer:
      "We're currently invite only. Join the waitlist and we'll let you know the moment you can get started.",
  },
  {
    question: 'How do you vet doctors and hospitals?',
    answer:
      'Every doctor is licensed and credential-verified, and every hospital we work with is internationally accredited. We hold every partner to the same standard we’d want for our own family.',
  },
  {
    question: 'Is my information kept private?',
    answer:
      'The current waitlist only asks for your name and email. Please do not submit medical information through this website. Our Privacy Policy explains how we handle website data.',
  },
  {
    question: "What's next?",
    answer:
      "Country and doctor selection is just the start. We're building out flight and hotel booking, ground transportation, insurance support, and a doctor portal for sending documents. Your entire trip is handled in one place.",
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
