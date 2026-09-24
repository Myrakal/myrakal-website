import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <h1 className="max-w-3xl text-4xl font-medium text-foreground sm:text-5xl md:text-6xl">
        International care at the cheapest price.
      </h1>
      <Button size="lg">Join the waitlist</Button>
    </section>
  )
}
