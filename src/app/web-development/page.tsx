import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StudioHero from '@/components/studio/StudioHero'
import Plans from '@/components/studio/Plans'
import Portfolio from '@/components/studio/Portfolio'
import Templates from '@/components/studio/Templates'
import CTASection from '@/components/studio/CTASection'

export const metadata: Metadata = {
  title: 'Web & Software Development',
  description:
    'Custom websites, web apps and software built by RD IT Lab UK. Explore our plans, portfolio of live demos, and ready-made templates.',
}

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <StudioHero />
      <Plans />
      <Portfolio />
      <Templates />
      <CTASection />
      <Footer />
    </div>
  )
}
