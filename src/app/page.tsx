import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import StudioTeaser from '@/components/StudioTeaser'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-gray-100 text-gray-900">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <StudioTeaser />
      <Contact />
      <Footer />
    </div>
  )
}
