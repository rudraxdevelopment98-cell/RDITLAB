'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'

const services = [
  'AI agent or automation',
  'Custom software / web app',
  'Website',
  'Digitalization of a process',
  'IT support or repair',
  'Networking / infrastructure',
  'Something else',
]

const details = [
  { label: 'Email', value: 'rudraxdevelopment98@gmail.com', href: 'mailto:rudraxdevelopment98@gmail.com' },
  { label: 'Phone', value: '+44 7823 912875', href: 'tel:+447823912875' },
  { label: 'Location', value: 'Harrow, London, UK' },
  { label: 'Hours', value: 'Mon–Sat, 8am–10pm · 24/7 emergency' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: '', email: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 6000)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Contact"
          title={<>Let&apos;s build something — <span className="text-[var(--accent)]">or get you unstuck.</span></>}
          subtitle="Tell us about a project, or reach out for urgent IT support. We reply to every enquiry within 24 hours."
        />

        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Details */}
            <div>
              <p className="eyebrow mb-8">Get in touch</p>
              <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {details.map((d) => (
                  <div key={d.label} className="py-5">
                    <dt className="text-xs uppercase tracking-wider text-muted">{d.label}</dt>
                    <dd className="mt-1 text-[var(--text)]">
                      {d.href ? (
                        <a href={d.href} className="transition hover:text-[var(--accent)]">{d.value}</a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex gap-3">
                <a href="https://share.google/nMMOrlyJNoFbICUL5" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">Google Reviews</a>
                <a href="https://www.instagram.com/rditlab.uk" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">Instagram</a>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card md:p-10">
              {submitted && (
                <div className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-weak)] p-4 text-sm text-[var(--accent-ink)]">
                  ✓ Thanks — your message has been sent. We&apos;ll reply within 24 hours.
                </div>
              )}
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name">
                    <input name="name" required value={form.name} onChange={change} placeholder="Your name" className={field} />
                  </Field>
                  <Field label="Email">
                    <input name="email" type="email" required value={form.email} onChange={change} placeholder="you@email.com" className={field} />
                  </Field>
                </div>
                <Field label="What do you need?">
                  <select name="service" value={form.service} onChange={change} className={field}>
                    <option value="">Select…</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Message">
                  <textarea name="message" required rows={5} value={form.message} onChange={change} placeholder="Tell us a bit about your project or problem…" className={`${field} resize-none`} />
                </Field>
                <button type="submit" className="w-full rounded-full bg-[var(--accent)] py-3.5 font-semibold text-white transition hover:bg-[var(--accent-ink)]">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
      {children}
    </div>
  )
}
