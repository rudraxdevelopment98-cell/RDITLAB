import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import StudioTeaser from '@/components/StudioTeaser'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getProjects, getTestimonials } from '@/lib/studio'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, testimonials] = await Promise.all([getProjects(), getTestimonials()])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <StudioTeaser projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Contact />
      <Footer />
    </div>
  )
}
