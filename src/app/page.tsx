import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import StudioTeaser from '@/components/StudioTeaser'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import { getProjects, getTestimonials } from '@/lib/studio'
import { getSiteContent } from '@/lib/content.server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projects, testimonials, content] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getSiteContent(),
  ])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero content={content.hero} />
      <About content={content.about} />
      <Services content={content.services} />
      <StudioTeaser projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Contact content={content.contact} />
      <Footer content={content.footer} />
    </div>
  )
}
