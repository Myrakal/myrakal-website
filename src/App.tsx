import { Closing } from '@/components/Closing'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { Navbar } from '@/components/Navbar'
import Accessibility from '@/pages/Accessibility'
import Chat from '@/pages/Chat'
import Contact from '@/pages/Contact'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Closing />
      <FAQ />
      <Footer />
    </>
  )
}

const pages: Record<string, React.ComponentType> = {
  '/chat': Chat,
  '/privacy': Privacy,
  '/terms': Terms,
  '/contact': Contact,
  '/accessibility': Accessibility,
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const Page = pages[path] ?? Home
  return <Page />
}

export default App
