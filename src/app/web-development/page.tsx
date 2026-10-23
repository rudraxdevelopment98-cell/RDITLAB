import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StudioHero from '@/components/studio/StudioHero'
import Plans from '@/components/studio/Plans'
import Portfolio from '@/components/studio/Portfolio'
import CTASection from '@/components/studio/CTASection'
import Testimonials from '@/components/Testimonials'
import { getPlans, getProjects, getTestimonials } from '@/lib/studio'

export const metadata: Metadata = {
  title: 'Web, Software & AI',
  description:
    'Custom websites, web apps, AI agents and automation built by RD IT Lab UK. See our work, plans and process.',
}

// Content is admin-managed, so always render fresh from the database.
export const dynamic = 'force-dynamic'

export default async function WebDevelopmentPage() {
  const [plans, projects, testimonials] = await Promise.all([
    getPlans(),
    getProjects(),
    getTestimonials(),
  ])

  return (
    <div className="min-h-screen">
      <Navbar />
      <StudioHero />
      <Portfolio projects={projects} />
      <Plans plans={plans} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
      <Footer />
    </div>
  )
}
