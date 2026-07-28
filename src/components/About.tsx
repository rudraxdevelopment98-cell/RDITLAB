'use client'

import { useState } from 'react'
import Reveal from './Reveal'

export default function About() {
  const [expanded, setExpanded] = useState(0)

  const sections = [
    { title: 'Our Mission', content: 'Make IT secure and reliable for businesses and people — fast, private, and dependable support that keeps you running.' },
    { title: 'Our Expertise', content: '4.5 years of hands-on experience across India and the UK: laptop & PC repairs, custom builds, data recovery, networking, and cybersecurity.' },
    { title: 'Our Approach', content: 'Quick response times, accurate diagnostics, and clear communication. Average turnaround is just 1–4 days.' },
    { title: 'Our Values', content: 'Trust, reliability, and satisfaction. Transparent pricing, solid warranties (1 month to 1 year), and a genuine long-term partnership.' },
  ]

  const benefits = [
    'Certified technicians (Google & MSc Cybersecurity)',
    'Fast turnaround: 1–4 days for most repairs',
    'Comprehensive warranty: 1 month to 1 year',
    '24/7 emergency support available',
    'Quick response and instant availability',
    'Transparent pricing and on-site visits',
  ]

  return (
    <section id="about" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} about us</p>
          <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">Who we are &amp; what we do</h2>
        </Reveal>

        <div className="grid items-start gap-8 lg:grid-cols-2">
          <Reveal className="space-y-3">
            {sections.map((section, index) => (
              <div key={section.title} className="glass glass-edge overflow-hidden rounded-2xl">
                <button onClick={() => setExpanded(expanded === index ? -1 : index)} className="flex w-full items-center justify-between p-6 text-left">
                  <h3 className="font-display text-lg font-semibold text-[var(--text)]">{section.title}</h3>
                  <span className={`text-2xl text-gradient-brand transition-transform duration-300 ${expanded === index ? 'rotate-45' : ''}`}>+</span>
                </button>
                {expanded === index && (
                  <div className="animate-fadeIn border-t border-[var(--border)] px-6 pb-6 pt-4">
                    <p className="leading-relaxed text-muted">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </Reveal>

          <Reveal delay={120} className="glass glass-edge rounded-[2rem] p-8">
            <h3 className="mb-2 font-display text-2xl font-bold text-[var(--text)]">Why choose RD IT Lab UK?</h3>
            <p className="mb-6 text-muted">Technical expertise, reliability, and a genuine commitment to your success.</p>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-white">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[var(--text)]">{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
