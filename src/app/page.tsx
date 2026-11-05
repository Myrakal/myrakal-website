import type { Metadata } from 'next'

import { Closing } from '@/components/Closing'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { JsonLd } from '@/components/JsonLd'
import { MeetTheTeam } from '@/components/MeetTheTeam'
import { Navbar } from '@/components/Navbar'
import { DESCRIPTION } from '@/lib/site'
import { ORGANIZATION, WEBSITE } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Myrakal: Healthcare that costs less',
  description: DESCRIPTION,
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <JsonLd data={[ORGANIZATION, WEBSITE]} />
      <Navbar />
      <main>
        <Hero />
        <MeetTheTeam />
        <HowItWorks />
        <Closing />
      </main>
      <Footer />
    </>
  )
}
