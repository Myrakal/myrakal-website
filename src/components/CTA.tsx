import { WaitlistForm } from '@/components/WaitlistForm'

export function CTA() {
  return (
    <section className="flex flex-col items-center gap-8 bg-background px-6 py-32 text-center sm:px-12">
      <h2 className="max-w-2xl text-4xl font-medium text-foreground sm:text-5xl">
        Open by invitation.
      </h2>
      <p className="max-w-md text-lg text-muted-foreground">
        Access Myrakal as it redefines how healthcare works across borders.
      </p>
      <WaitlistForm />
    </section>
  )
}
