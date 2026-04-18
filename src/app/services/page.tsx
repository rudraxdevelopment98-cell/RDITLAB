'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ServicesPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const services = [
    {
      title: 'Laptop & PC Repair',
      overview:
        'Professional diagnostics and repair for all laptop and PC issues. Fast turnaround (1-4 days) with 1 year warranty on repairs.',
      price: '£50 - £1,000',
      details: [
        'Component replacement (screens, batteries, keyboards)',
        'Motherboard and power diagnostics',
        'Data recovery and backup restoration',
        'System health checks and performance upgrades'
      ],
      benefits: [
        'Quick 1-4 day turnaround',
        '1 year warranty on repairs',
        'Secure data handling for sensitive devices'
      ],
      image: 'https://images.unsplash.com/photo-1587614295999-6c1f4c3f5b5a?w=900&h=700&fit=crop&crop=center'
    },
    {
      title: 'Custom PC Builds & Workstations',
      overview:
        'High-performance custom builds tailored to your needs - from gaming rigs to professional workstations. Includes testing, setup, and 1 year warranty.',
      price: '£500 - £5,000',
      details: [
        'Tailored builds for gaming, CAD, development, and analytics',
        'Industrial-grade hardware and thermal management',
        'Server and workstation assembly',
        'Quality assurance testing and software tuning'
      ],
      benefits: [
        'Expert component selection',
        'Reliable hardware for long-term use',
        '1 year comprehensive warranty'
      ],
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=900&h=700&fit=crop&crop=center'
    },
    {
      title: 'Data Recovery',
      overview:
        'Professional data recovery from damaged drives, corrupted systems, or accidental deletion. Confidential and secure handling.',
      price: '£50 - £500',
      details: [
        'Hard drive and SSD recovery',
        'Accidental file deletion recovery',
        'Corrupted partition recovery',
        'Secure data handling and backup creation'
      ],
      benefits: [
        'Fast recovery process',
        'Confidential handling of sensitive data',
        'Success-based pricing available'
      ],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=700&fit=crop&crop=center'
    },
    {
      title: 'Network Installation & Setup',
      overview:
        'Professional network setup, configuration, and optimization for homes and businesses. Includes routers, switches, cabling, and security setup.',
      price: '£200 - £10,000',
      details: [
        'Network design and planning',
        'Router and switch installation and configuration',
        'Structured cabling and fiber connections',
        'VLAN setup, security hardening, and optimization'
      ],
      benefits: [
        'Stable, secure connections',
        'Optimized performance and reliability',
        'Future-ready infrastructure'
      ],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=700&fit=crop&crop=center'
    },
    {
      title: 'Lab Setup & IT Environments',
      overview:
        'Complete lab environment setup with virtualization, segmented networks, and secure access for development and testing.',
      price: 'Quote on request',
      details: [
        'Virtualization and lab network segmentation',
        'Equipment staging and configuration',
        'Secure access and isolation controls',
        'Documentation and operational handover'
      ],
      benefits: [
        'Controlled testing environments',
        'Fast deployment for training',
        'Professional documentation'
      ],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=700&fit=crop&crop=center'
    },
    {
      title: 'IT Audit & Security Assessment',
      overview:
        'Comprehensive security audit to identify vulnerabilities, compliance gaps, and improvement opportunities in your IT systems.',
      price: 'Quote on request',
      details: [
        'Asset inventory and lifecycle review',
        'Vulnerability scans and remediation plans',
        'Policy alignment and compliance support',
        'Recommendations for security and continuity'
      ],
      benefits: [
        'Better risk management',
        'Compliance support',
        'Actionable security recommendations'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=700&fit=crop&crop=center'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-gray-100 text-gray-900">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-amber-50 px-6 py-16 md:px-12 md:py-24 animate-fade-in">
          <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 shadow-sm">
                Services overview
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Professional IT Services for Networks, Repair, and Support</h1>
              <p className="max-w-2xl text-lg text-gray-700 leading-relaxed">
                RD IT Lab UK delivers trusted solutions for laptop repair, PC build, network infrastructure, audit, and managed support. Click on any service below to explore detailed capabilities and benefits.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-amber-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Trusted repair</h2>
                  <p className="text-gray-600">Fast hardware diagnostics, secure data handling, and professional laptop/PC repairs.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-amber-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Network reliability</h2>
                  <p className="text-gray-600">Design, secure, and manage networks with enterprise-grade performance and uptime.</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-200 via-amber-100 to-white p-6 shadow-xl animate-slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&h=700&fit=crop&crop=center"
                alt="IT services"
                className="h-[420px] w-full rounded-[1.75rem] object-cover shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* Services Accordion Section */}
        <section className="mx-6 md:mx-12 my-16 rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 mb-3">Our core offerings</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Click to explore our services</h2>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => {
                const isExpanded = expandedIndex === index
                return (
                  <article
                    key={index}
                    className="rounded-[1.75rem] border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
                  >
                    {/* Header / Accordion Button */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-white to-amber-50 hover:from-amber-50 hover:to-amber-100 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-amber-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                              </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-lg font-semibold text-amber-600 mt-1">{service.price}</p>
                        </div>
                      </div>
                      <div
                        className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-6 pb-6 bg-white border-t border-gray-200 animate-fade-in">
                        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] mt-6">
                          <div className="overflow-hidden rounded-3xl">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-56 w-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="space-y-5">
                            <div>
                              <p className="text-gray-700 leading-relaxed text-lg">{service.overview}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="rounded-3xl bg-amber-50 p-5 border border-amber-200">
                                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                    ✓
                                  </span>
                                  What we deliver
                                </h4>
                                <ul className="space-y-2 text-gray-700 text-sm">
                                  {service.details.map((detail, detailIndex) => (
                                    <li
                                      key={detailIndex}
                                      className="before:content-['•'] before:mr-2 before:text-amber-600 hover:translate-x-1 transition-transform"
                                    >
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm">
                                    ★
                                  </span>
                                  Key benefits
                                </h4>
                                <ul className="space-y-2 text-gray-700 text-sm">
                                  {service.benefits.map((benefit, benefitIndex) => (
                                    <li
                                      key={benefitIndex}
                                      className="before:content-['→'] before:mr-2 before:text-amber-600 hover:translate-x-1 transition-transform"
                                    >
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-6 md:mx-12 mb-20 rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-100/50 p-10 shadow-xl animate-fade-in-up">
          <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
            <div className="hover:translate-y-[-4px] transition-transform duration-300">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">Fast Response</h3>
              <p className="text-gray-700 leading-relaxed">We minimise downtime with quick diagnostics, efficient repairs, and responsive support.</p>
            </div>
            <div className="hover:translate-y-[-4px] transition-transform duration-300">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">Professional Service</h3>
              <p className="text-gray-700 leading-relaxed">Every engagement is delivered with clear communication, quality assurance, and reliable follow-through.</p>
            </div>
            <div className="hover:translate-y-[-4px] transition-transform duration-300">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">Commercial Focus</h3>
              <p className="text-gray-700 leading-relaxed">Our services are tailored for UK businesses that need secure IT and strong infrastructure.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

