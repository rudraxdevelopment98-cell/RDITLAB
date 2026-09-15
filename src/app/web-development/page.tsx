import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StudioHero from '@/components/studio/StudioHero'
import Plans from '@/components/studio/Plans'
import Portfolio from '@/components/studio/Portfolio'
import Templates from '@/components/studio/Templates'
import CTASection from '@/components/studio/CTASection'
import Testimonials from '@/components/Testimonials'
import { getPlans, getProjects, getTemplates, getTestimonials } from '@/lib/studio'

export const metadata: Metadata = {
  title: 'Web & Software Development',
  description:
    'Custom websites, web apps and software built by RD IT Lab UK. Explore our plans, portfolio of live demos, and ready-made templates.',
}

// Content is admin-managed, so always render fresh from the database.
export const dynamic = 'force-dynamic'

export default async function WebDevelopmentPage() {
  const [plans, projects, templates, testimonials] = await Promise.all([
    getPlans(),
    getProjects(),
    getTemplates(),
    getTestimonials(),
  ])

  return (
    <div className="min-h-screen">
      <Navbar />
      <StudioHero />
      <Plans plans={plans} />
      <Portfolio projects={projects} />
      <Templates templates={templates} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
      <Footer />
    </div>
  )
}
