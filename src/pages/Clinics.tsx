import { useEffect } from 'react'

import { DemandExplorer } from '@/components/DemandExplorer'
import { ClinicFAQ } from '@/components/ClinicFAQ'
import { Footer } from '@/components/Footer'
import { HowToJoin } from '@/components/HowToJoin'
import { Navbar } from '@/components/Navbar'
import { NetworkBenefits } from '@/components/NetworkBenefits'
import { buttonVariants } from '@/components/ui/button'

const CONTACT_EMAIL = 'anikuppili@myrakal.com'

const TITLE = 'For clinics and hospitals: Myrakal'
const DESCRIPTION =
  'Partner with Myrakal to welcome international patients to your clinic or hospital.'

export default function Clinics() {
  useEffect(() => {
    const previousTitle = document.title
    const existing = document.querySelector('meta[name="description"]')
    const meta = existing ?? document.createElement('meta')
    const previousDescription = meta.getAttribute('content')

    document.title = TITLE
    meta.setAttribute('name', 'description')
    meta.setAttribute('content', DESCRIPTION)
    if (!existing) document.head.appendChild(meta)
    window.scrollTo(0, 0)

    return () => {
      document.title = previousTitle
      if (!existing) meta.remove()
      else if (previousDescription !== null) meta.setAttribute('content', previousDescription)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="flex min-h-screen items-center bg-background px-6 pt-28 pb-16 sm:px-12">
          <div className="mx-auto grid w-full max-w-[100rem] items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span className="text-base font-medium tracking-[0.2em] text-muted-foreground uppercase">
                For top-tier international hospitals &amp; clinics
              </span>
              <h1 className="text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                We make you more money.
              </h1>
              <p className="max-w-xl text-xl text-muted-foreground sm:text-2xl">
                No upfront cost to be listed. We only take a cut for each booked patient.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <DemandExplorer />
            </div>
          </div>
        </section>

        <NetworkBenefits />

        <HowToJoin />

        <ClinicFAQ />

        <section className="flex flex-col items-center gap-8 bg-background px-6 py-32 text-center sm:px-12">
          <h2 className="max-w-2xl text-4xl text-foreground sm:text-5xl">
            We're building a network of accredited hospitals.
          </h2>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Clinic partnership inquiry')}`}
            className={buttonVariants({
              size: 'lg',
              className: 'h-12 px-10 text-base sm:h-14 sm:text-lg',
            })}
          >
            Contact us
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
