'use client'

import { useState } from 'react'
import Reveal from './Reveal'

export default function Contact() {
  const [expandedFAQ, setExpandedFAQ] = useState(0)
  const [formStatus, setFormStatus] = useState('')

  const faqs = [
    { question: 'How quickly can you respond to urgent IT issues?', answer: 'For critical systems we offer same-day response through our 24/7 support. Contact us immediately for urgent needs and we’ll prioritise accordingly.' },
    { question: 'Do you provide warranties on repairs and builds?', answer: 'Yes — all repairs come with comprehensive warranties, and custom builds include parts and labour guarantees.' },
    { question: 'What areas do you serve?', answer: 'We serve commercial and industrial clients across the UK, with on-site and remote support options.' },
    { question: 'Can you build websites and software too?', answer: 'Absolutely — from marketing sites to custom web apps. See our Web & Software page for plans, demos and templates.' },
  ]

  const contact = [
    { icon: '✉', label: 'Email', value: 'rudraxdevelopment98@gmail.com', href: 'mailto:rudraxdevelopment98@gmail.com' },
    { icon: '📞', label: 'Phone', value: '+44 7823 912875', href: 'tel:+447823912875' },
    { icon: '📍', label: 'Location', value: 'Harrow, London, UK' },
  ]

  return (
    <section id="contact" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} get in touch</p>
          <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">Let&apos;s discuss your project</h2>
        </Reveal>

        <div className="mb-14 grid gap-8 lg:grid-cols-2">
          <Reveal className="glass glass-edge rounded-[2rem] p-8">
            <h3 className="mb-6 font-display text-2xl font-semibold text-[var(--text)]">Contact information</h3>
            <div className="space-y-5">
              {contact.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-[var(--text)]">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-muted transition-colors hover:text-[var(--text)]">{c.value}</a>
                    ) : (
                      <p className="text-muted">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3 border-t border-[var(--border)] pt-6">
              <a href="https://share.google/nMMOrlyJNoFbICUL5" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-glow">Google Reviews</a>
              <a href="https://www.instagram.com/rditlab.uk" target="_blank" rel="noopener noreferrer" className="glass glass-edge rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--text)]">Instagram</a>
            </div>
          </Reveal>

          <Reveal delay={120} className="glass glass-edge rounded-[2rem] p-8">
            <h3 className="mb-6 font-display text-2xl font-semibold text-[var(--text)]">Quick message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setFormStatus('Thanks for reaching out! We’ll respond within 24 hours.')
                setTimeout(() => setFormStatus(''), 5000)
              }}
              className="space-y-4"
            >
              <input required placeholder="Your name" className={field} />
              <input required type="email" placeholder="your@email.com" className={field} />
              <textarea required rows={4} placeholder="Tell us about your IT or software needs…" className={`${field} resize-none`} />
              <button type="submit" className="w-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 py-3.5 font-semibold text-white transition hover:shadow-glow active:scale-95">
                Send message
              </button>
              {formStatus && <p className="text-center text-sm text-gradient-brand">{formStatus}</p>}
            </form>
          </Reveal>
        </div>

        <Reveal className="glass glass-edge rounded-[2rem] p-8 md:p-10">
          <h3 className="mb-6 text-center font-display text-2xl font-bold text-[var(--text)]">Frequently asked questions</h3>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-[var(--border)]">
                <button onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)} className="flex w-full items-center justify-between p-5 text-left">
                  <p className="font-semibold text-[var(--text)]">{faq.question}</p>
                  <span className={`ml-4 text-2xl text-gradient-brand transition-transform ${expandedFAQ === index ? 'rotate-45' : ''}`}>+</span>
                </button>
                {expandedFAQ === index && (
                  <div className="animate-fadeIn border-t border-[var(--border)] px-5 pb-5 pt-4">
                    <p className="leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const field =
  'w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500/50'
