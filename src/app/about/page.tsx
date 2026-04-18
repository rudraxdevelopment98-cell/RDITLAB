'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>('mission')

  const teamMembers = [
    {
      name: 'Kuldeep J',
      role: 'Founder & Lead Technician',
      bio: 'Cyber Security Professional with Google Cybersecurity Certificate and MSC in Cybersecurity. 4.5 years of IT expertise across India and UK. Specializes in system diagnosis, repairs, and security solutions.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center'
    },
    {
      name: 'Udit',
      role: 'Hardware & Repair Technician',
      bio: 'Skilled technician dedicated to accurate diagnostics and professional laptop/PC repair services. Handles component replacement, data recovery, and system optimization with precision.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=center'
    },
    {
      name: 'Karan',
      role: 'Support Technician & Operations',
      bio: 'Customer support specialist ensuring smooth service delivery. Handles client communication, scheduling, pickup/drop services, and provides ongoing technical support.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=center'
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
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-gray-100 text-gray-900">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-50 to-white px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="animate-fadeIn space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 shadow-sm">
                About RD IT Lab UK
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Trusted IT Services for London & Surrounding Areas
              </h1>
              <p className="max-w-2xl text-xl text-gray-700 leading-relaxed">
                Since establishing operations in the UK, we have been committed to providing professional, reliable IT support—from laptop and PC repairs to data recovery and networking solutions—for businesses and individuals across London and beyond.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-amber-100 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
                <div className="text-4xl font-bold text-amber-600 mb-2">200+</div>
                <p className="text-gray-600">Clients Served</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
                <div className="text-4xl font-bold text-amber-600 mb-2">1-4 Days</div>
                <p className="text-gray-600">Average Turnaround</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl">
                <div className="text-4xl font-bold text-amber-600 mb-2">24/7</div>
                <p className="text-gray-600">Emergency Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="mx-6 md:mx-12 my-16 rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12">
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
                    className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white hover:from-amber-100 hover:to-amber-50 transition"
                  >
                    <h3 className="text-2xl font-semibold text-gray-900 text-left">{section.title}</h3>
                    <span className={`text-2xl text-amber-600 transition-transform ${expandedSection === section.id ? 'rotate-180' : ''}`}>
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
        <section className="mx-6 md:mx-12 mb-16 rounded-[2rem] bg-amber-50/50 border border-amber-100 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Meet Our Team</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-amber-100 overflow-hidden shadow-lg transition hover:-translate-y-2 hover:shadow-xl animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Highlights */}
        <section className="mx-6 md:mx-12 mb-16 rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Deliver</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-8 border border-amber-100">
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Professional Expertise</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our certified technicians and engineers bring years of hands-on experience in commercial IT environments, network design, and enterprise-grade support.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Certified technical expertise</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Commercial IT knowledge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Industry best practices</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-8 border border-amber-100">
                <h3 className="text-2xl font-semibold text-amber-800 mb-4">Reliable Support</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Available when you need us, with quick response times, transparent communication, and solutions designed to keep your business running.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>24/7 availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Quick response times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-600 font-bold">✓</span>
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
