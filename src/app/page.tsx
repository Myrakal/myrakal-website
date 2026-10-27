import type { Metadata } from 'next'

import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { DESCRIPTION } from '@/lib/site'
import { ORGANIZATION, WEBSITE } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Myrakal: Healthcare, as it should be',
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
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
