import { DemoVideo } from '@/components/DemoVideo'

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 pt-24 pb-12 sm:px-8 text-center sm:pt-28">
      <h1 className="max-w-4xl text-4xl text-foreground sm:text-5xl md:text-6xl">
        Healthcare, but way cheaper
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
        Made for people who want to understand their healthcare costs and explore options
      </p>
      <a
        href="/contact/"
        className="rounded-full bg-(image:--pearl-gradient) px-8 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        Talk with us
      </a>
      <div className="mt-2 w-full max-w-6xl">
        <DemoVideo />
      </div>
    </section>
  )
}
