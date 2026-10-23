import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { Navbar } from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FAQ />
      <Footer />
    </>
  )
}
