'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'

export default function AboutPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('mission')

  const teamMembers = [
    {
      name: 'Kuldeep J',
      role: 'Founder & Lead Technician',
      bio: 'Cyber Security Professional with Google Cybersecurity Certificate and MSC in Cybersecurity. 4.5 years of IT expertise across India and UK. Specializes in system diagnosis, repairs, and security solutions.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center'
    }
  ]

  const sections = [
    {
      id: 'mission',
      title: 'Our Mission',
      content: 'To provide UK businesses with reliable, professional IT services that keep networks secure, systems running smoothly, and technology working on demand.'
    },
    {
      id: 'values',
      title: 'Our Values',
      content: 'We believe in transparency, accountability, and proactive support. Every service is delivered with attention to detail, clear communication, and a commitment to your business continuity.'
    },
    {
      id: 'expertise',
      title: 'Why Choose Us',
      content: 'With deep expertise across network design, repair, custom builds, and managed support, we understand commercial IT needs. We\'re not just a repair shop—we\'re your IT partner.'
    },
    {
      id: 'commitment',
      title: 'Our Commitment',
      content: 'Fast response times, quality workmanship, secure data handling, and transparent reporting. We measure success by your operational uptime and satisfaction.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-gray-100 text-gray-900">
      <Navbar />

      <main>
        <PageHeader
          eyebrow="About RD IT Lab UK"
          title={<>Trusted IT services for <span className="text-gradient-brand">London &amp; beyond</span></>}
          subtitle="Since establishing operations in the UK, we've been committed to professional, reliable IT support—from laptop and PC repairs to data recovery and networking—for businesses and individuals across London and beyond."
        />

        {/* Stats band */}
        <section className="px-6 py-16 md:px-12">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {[
              { value: '200+', label: 'Clients Served' },
              { value: '1–4 Days', label: 'Average Turnaround' },
              { value: '24/7', label: 'Emergency Support' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-violet-100 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-brand">
                <div className="mb-2 font-display text-4xl font-bold text-violet-600">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mx-6 md:mx-12 my-16 rounded-[2rem] bg-white border border-violet-100 shadow-xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Who We Are</h2>
            <div className="grid gap-6">
              {sections.map(section => (
                <div
                  key={section.id}
                  className="rounded-2xl border border-gray-200 overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-violet-50 to-white hover:from-violet-100 hover:to-violet-50 transition"
                  >
                    <h3 className="text-2xl font-semibold text-gray-900 text-left">{section.title}</h3>
                    <span className={`text-2xl text-violet-600 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedSection === section.id && (
                    <div className="animate-slideDown px-8 py-6 bg-white border-t border-gray-200">
                      <p className="text-gray-700 text-lg leading-relaxed">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mx-6 md:mx-12 mb-16 rounded-[2rem] bg-violet-50/50 border border-violet-100 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-violet-100 overflow-hidden shadow-lg transition hover:-translate-y-2 hover:shadow-xl animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-violet-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Highlights */}
        <section className="mx-6 md:mx-12 mb-16 rounded-[2rem] bg-white border border-violet-100 shadow-xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Deliver</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-white p-8 border border-violet-100">
                <h3 className="text-2xl font-semibold text-violet-800 mb-4">Professional Expertise</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our certified technicians and engineers bring years of hands-on experience in commercial IT environments, network design, and enterprise-grade support.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>Certified technical expertise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>Commercial IT knowledge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>Industry best practices</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-white p-8 border border-violet-100">
                <h3 className="text-2xl font-semibold text-violet-800 mb-4">Reliable Support</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Available when you need us, with quick response times, transparent communication, and solutions designed to keep your business running.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>24/7 availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>Quick response times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-violet-600 font-bold">✓</span>
                    <span>Clear communication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
