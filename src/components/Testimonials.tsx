'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import type { ResolvedTestimonial } from '@/lib/studio'

const field =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-weak)]'

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < n ? 'text-[var(--accent)]' : 'text-[var(--border-strong)]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69L9.05 2.93z" />
        </svg>
      ))}
    </div>
  )
}

const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

export default function Testimonials({ testimonials }: { testimonials: ResolvedTestimonial[] }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', company: '', rating: 5, quote: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
      setForm({ name: '', role: '', company: '', rating: 5, quote: '' })
    } catch {
      setStatus('error')
    }
  }

  const hasAny = testimonials.length > 0

  return (
    <section id="testimonials" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Testimonials</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">
              {hasAny ? 'What clients say' : 'Build your reputation here'}
            </h2>
            {!hasAny && (
              <p className="mt-5 text-lg leading-relaxed text-muted">
                Real reviews from real clients will appear here as projects complete. Worked with us? We’d love to hear about it.
              </p>
            )}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)]"
          >
            {open ? 'Close' : 'Share your experience'}
          </button>
        </Reveal>

        {open && (
          <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card">
            {status === 'done' ? (
              <p className="py-6 text-center text-[var(--text)]">Thank you — your testimonial was submitted and will appear after review.</p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-[var(--text)]">Leave a testimonial</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
                  <input placeholder="Role (optional)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={field} />
                </div>
                <input placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">Rating:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setForm({ ...form, rating: n })} aria-label={`${n} stars`}>
                      <svg className={`h-6 w-6 ${n <= form.rating ? 'text-[var(--accent)]' : 'text-[var(--border-strong)]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69L9.05 2.93z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea required rows={4} placeholder="Tell us about your experience…" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className={`${field} resize-none`} />
                {status === 'error' && <p className="text-sm text-[var(--accent-ink)]">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={status === 'sending'} className="w-full rounded-full bg-[var(--accent)] py-3 font-semibold text-white transition hover:bg-[var(--accent-ink)] disabled:opacity-50">
                  {status === 'sending' ? 'Submitting…' : 'Submit testimonial'}
                </button>
              </form>
            )}
          </Reveal>
        )}

        {hasAny && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 90}>
                <figure className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-7 shadow-card">
                  <Stars n={t.rating} />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-[var(--text)]">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    {t.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-weak)] text-sm font-semibold text-[var(--accent)]">{initials(t.name)}</span>
                    )}
                    <div>
                      <p className="font-semibold text-[var(--text)]">{t.name}</p>
                      {(t.role || t.company) && (
                        <p className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
