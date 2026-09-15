'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import type { ResolvedTestimonial } from '@/lib/studio'

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < n ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20">
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

  if (!testimonials.length && !open) {
    // still show the section so visitors can submit
  }

  return (
    <section id="testimonials" className="relative overflow-hidden px-6 py-24 md:px-12">
      <div className="aurora right-[-6%] top-[10%] h-80 w-80 animate-aurora [animation-delay:3s]" style={{ background: 'var(--aurora-2)' }} />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <Reveal className="mb-14 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} testimonials</p>
            <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">What clients say</h2>
          </div>
          <button onClick={() => setOpen((v) => !v)} className="glass glass-edge inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:scale-[1.02]">
            {open ? 'Close' : 'Share your experience'}
          </button>
        </Reveal>

        {open && (
          <Reveal className="glass glass-edge mx-auto mb-12 max-w-2xl rounded-[2rem] p-8">
            {status === 'done' ? (
              <p className="text-center text-[var(--text)]">🙏 Thank you! Your testimonial was submitted and will appear after review.</p>
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
                      <svg className={`h-6 w-6 ${n <= form.rating ? 'text-amber-400' : 'text-[var(--border)]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.75 1.69-1.54 1.12l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.79.57-1.84-.2-1.54-1.12l1.36-4.18a1 1 0 00-.36-1.12L1.4 9.6c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69L9.05 2.93z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea required rows={4} placeholder="Tell us about your experience…" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className={`${field} resize-none`} />
                {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
                <button type="submit" disabled={status === 'sending'} className="w-full rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 py-3 font-semibold text-white transition hover:shadow-glow disabled:opacity-50">
                  {status === 'sending' ? 'Submitting…' : 'Submit testimonial'}
                </button>
              </form>
            )}
          </Reveal>
        )}

        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 90}>
                <figure className="glass glass-edge flex h-full flex-col rounded-2xl p-7">
                  <Stars n={t.rating} />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-[var(--text)]">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    {t.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.photo} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-sm font-bold text-white">{initials(t.name)}</span>
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

const field =
  'w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500/50'
