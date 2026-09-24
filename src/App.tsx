import { CTA } from '@/components/CTA'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { Navbar } from '@/components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FAQ />
      <CTA />
      <Footer />
    </>
  )
}

export default App
