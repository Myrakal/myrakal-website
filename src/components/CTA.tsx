import { WaitlistForm } from '@/components/WaitlistForm'

export function CTA() {
  return (
    <section
      id="waitlist"
      className="grid scroll-mt-16 gap-10 border-y border-border bg-velvet-deep px-6 py-28 sm:px-12 lg:grid-cols-12 lg:items-end lg:py-36"
    >
      <div className="space-y-5 lg:col-span-5">
        <h2 className="max-w-2xl text-5xl leading-none text-foreground sm:text-7xl">
          Open by invitation.
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Access Myrakal as it redefines how healthcare works across borders.
        </p>
      </div>
      <div className="lg:col-span-7"><WaitlistForm /></div>
    </section>
  )
}
