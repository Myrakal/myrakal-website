import { Banknote, HeartHandshake, Users, type LucideIcon } from 'lucide-react'

const BENEFITS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'No upfront cost',
    description:
      "There's nothing to pay to join. We do the work first, and we only get paid when a patient books.",
    icon: Banknote,
  },
  {
    title: 'Exceptional support',
    description:
      "We're working with a small group of hospitals, so you get hands-on, dedicated support from our team.",
    icon: HeartHandshake,
  },
  {
    title: 'Patients ready to book',
    description:
      'Join a network of patients already looking for care abroad, so your hospital gets booked and paid.',
    icon: Users,
  },
]

export function NetworkBenefits() {
  return (
    <section className="flex flex-col items-center gap-16 bg-background px-6 py-32 sm:px-12">
      <h2 className="max-w-3xl text-center text-4xl font-medium text-foreground sm:text-5xl lg:text-6xl">
        Join a network of accredited hospitals
      </h2>

      <ul className="grid w-full max-w-6xl gap-12 md:grid-cols-3 md:gap-10">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="flex flex-col items-center gap-4 text-center">
            <span className="flex size-20 items-center justify-center rounded-3xl bg-secondary text-primary">
              <benefit.icon className="size-9" aria-hidden="true" />
            </span>
            <h3 className="mt-2 text-2xl font-medium text-foreground">{benefit.title}</h3>
            <p className="max-w-xs text-lg text-muted-foreground">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
