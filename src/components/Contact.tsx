'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import { defaultContent, type SiteCopy } from '@/lib/content'

const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-weak)]'

function Icon({ name }: { name: 'mail' | 'phone' | 'pin' }) {
  const paths: Record<string, JSX.Element> = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" /></>,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5c0 8 7 15 15 15l-1.5-4-4 1a11 11 0 01-6.5-6.5l1-4L4 5z" />,
    pin: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  }
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  )
}

export default function Contact({ content }: { content?: SiteCopy['contact'] }) {
  const c = content ?? defaultContent.contact
  const [expandedFAQ, setExpandedFAQ] = useState(0)
  const [formStatus, setFormStatus] = useState('')

  const details = [
    { icon: 'mail' as const, label: 'Email', value: c.email, href: `mailto:${c.email}` },
    { icon: 'phone' as const, label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s+/g, '')}` },
    { icon: 'pin' as const, label: 'Location', value: c.location, href: '' },
  ]

  return (
    <section id="contact" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">{c.heading}</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{c.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <Reveal className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card lg:col-span-2">
            <h3 className="font-display text-xl font-semibold text-[var(--text)]">Contact details</h3>
            <div className="mt-6 space-y-5">
              {details.map((d) => (
                <div key={d.label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent-weak)] text-[var(--accent)]">
                    <Icon name={d.icon} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="text-[var(--text)] transition hover:text-[var(--accent)]">{d.value}</a>
                    ) : (
                      <p className="text-[var(--text)]">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">
              <a href={c.googleUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-ink)]">Google Reviews</a>
              <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)]">Instagram</a>
            </div>
          </Reveal>

          {/* Quick message */}
          <Reveal delay={120} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card lg:col-span-3">
            <h3 className="font-display text-xl font-semibold text-[var(--text)]">Send a message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setFormStatus('Thanks for reaching out — we’ll respond within 24 hours.')
                setTimeout(() => setFormStatus(''), 6000)
              }}
              className="mt-6 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className={field} />
                <input required type="email" placeholder="your@email.com" className={field} />
              </div>
              <textarea required rows={5} placeholder="Tell us what you’re trying to build or solve…" className={`${field} resize-none`} />
              <button type="submit" className="w-full rounded-full bg-[var(--accent)] py-3.5 font-semibold text-white transition hover:bg-[var(--accent-ink)] active:scale-[0.99]">
                Send message
              </button>
              {formStatus && <p className="text-center text-sm font-medium text-[var(--accent)]">{formStatus}</p>}
            </form>
          </Reveal>
        </div>

        {/* FAQs */}
        <Reveal className="mt-16">
          <h3 className="text-center font-display text-2xl font-semibold text-[var(--text)]">Frequently asked questions</h3>
          <div className="mx-auto mt-8 max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {c.faqs.map((faq, index) => {
              const open = expandedFAQ === index
              return (
                <div key={faq.question}>
                  <button onClick={() => setExpandedFAQ(open ? -1 : index)} className="flex w-full items-center justify-between py-5 text-left" aria-expanded={open}>
                    <p className="pr-4 font-medium text-[var(--text)]">{faq.question}</p>
                    <span className={`text-xl text-[var(--accent)] transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {open && (
                    <div className="animate-fadeIn pb-6 pr-6">
                      <p className="leading-relaxed text-muted">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
