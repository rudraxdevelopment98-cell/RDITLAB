'use client'

import { useState } from 'react'

export default function About() {
  const [expandedSection, setExpandedSection] = useState(0)

  const sections = [
    {
      title: 'Our Mission',
      content: 'We want to make the IT environment secure and safe for the public with strong privacy practices and excellent availability. Our goal is to provide fast, reliable IT support that enables a modern, connected lifestyle for businesses and individuals across London and beyond.'
    },
    {
      title: 'Our Expertise',
      content: 'With 4.5 years of experience (4 years in India, 1.5 years in UK), our team specializes in laptop and PC repairs, custom PC builds, data recovery, and networking solutions. We bring technical expertise combined with cybersecurity knowledge to deliver secure, efficient IT solutions.'
    },
    {
      title: 'Our Approach',
      content: 'We pride ourselves on quick response times, high-quality service, and instant availability. Whether it\'s a simple repair or a complex networking setup, we listen to your needs, provide accurate diagnostics, and deliver solutions quickly. Our average turnaround is just 1-4 days.'
    },
    {
      title: 'Our Values',
      content: 'Trust, reliability, and customer satisfaction guide everything we do. We maintain open communication, offer competitive pricing, and back all our work with solid warranties (1 month to 1 year). We\'re committed to being your IT partner, not just a one-time service provider.'
    }
  ]

  const benefits = [
    'Certified technicians (Google Cybersecurity, MSC Cybersecurity)',
    'Fast turnaround: 1-4 days for most repairs',
    'Comprehensive warranty: 1 month to 1 year',
    '24/7 emergency support available',
    'Quick response and instant availability',
    'Transparent pricing and on-site visits available'
  ]

  return (
    <section id="about" className="pt-24 pb-24 px-6 md:px-12 bg-gradient-to-br from-white via-amber-50 to-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 mb-3">About us</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Who We Are & What We Do</h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center mb-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-200 via-amber-100 to-white p-6 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&h=700&fit=crop&crop=center"
              alt="Our team"
              className="h-[420px] w-full rounded-[1.75rem] object-cover shadow-lg"
            />
          </div>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-amber-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 text-left">{section.title}</h3>
                  <span
                    className={`text-2xl font-bold text-amber-600 transition-transform duration-300 ${
                      expandedSection === index ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {expandedSection === index && (
                  <div className="animate-fadeIn border-t border-amber-100 px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-100 bg-white shadow-xl p-10 md:p-12">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Why Choose RD IT Lab UK?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">We combine technical expertise, reliability, and a genuine commitment to your business success.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="mb-3 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-600 transition-colors duration-300">
                  <span className="text-amber-600 group-hover:text-white font-bold">✓</span>
                </div>
                <p className="text-gray-900 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}