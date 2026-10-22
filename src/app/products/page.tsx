import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import LaunchPlayer from '@/components/launches/LaunchPlayer'
import { launches } from '@/lib/launches'

export const metadata: Metadata = {
  title: 'Products we’ve launched',
  description:
    'Watch the launch films for products built by RD IT Lab: Mahadev APF, JAYKAVI, MOBILE ICU and DUDAO — every page, feature and function, shown with demo data.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [background-size:44px_44px]" />
          <div className="aurora left-[-8%] top-[-15%] h-80 w-80 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
          <div className="aurora right-[-6%] top-[0%] h-80 w-80 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-2)' }} />
          <div className="container relative z-10 mx-auto max-w-5xl px-6 pb-10 pt-20 text-center md:pt-24">
            <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--text)] sm:text-6xl">Products we’ve launched</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
              Websites, stores and back-office systems we designed, built and run. Each launch film walks through every page and feature.
            </p>
            <nav aria-label="Products" className="mt-8 flex flex-wrap justify-center gap-2">
              {launches.map((l) => (
                <a key={l.slug} href={`#${l.slug}`} className="glass glass-edge inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:scale-[1.03]">
                  <span className="h-2 w-2 rounded-full" style={{ background: l.accent }} />
                  {l.name}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl space-y-24 px-6 pb-24 pt-10">
          {launches.map((l) => (
            <section key={l.slug} id={l.slug} className="scroll-mt-28" aria-labelledby={`${l.slug}-title`}>
              <Reveal>
                <div className="glass glass-edge rounded-[2rem] p-3" style={{ boxShadow: `0 30px 80px -40px ${l.accent}` }}>
                  <LaunchPlayer launch={l} />
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_1fr]">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: l.accent }}>{l.category}</p>
                    <h2 id={`${l.slug}-title`} className="mt-1 font-display text-3xl font-bold text-[var(--text)] md:text-4xl">{l.name}</h2>
                    <p className="mt-3 text-lg font-medium text-[var(--text)]">{l.tagline}</p>
                    <p className="mt-3 leading-relaxed text-muted">{l.description}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      {l.liveUrl ? (
                        <a href={l.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-brand transition hover:shadow-glow">
                          Visit live site
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" /></svg>
                        </a>
                      ) : (
                        <span className="glass rounded-full px-4 py-2 text-sm font-semibold text-muted">{l.liveLabel}</span>
                      )}
                      <span className="text-sm text-muted">Films use demo data only</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">What’s inside</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {l.features.map((f) => (
                        <li key={f} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)]">{f}</li>
                      ))}
                    </ul>
                    <h3 className="mt-6 text-sm font-semibold text-[var(--text)]">Built with</h3>
                    <p className="mt-2 font-mono text-sm text-muted">{l.stack.join(' · ')}</p>
                  </div>
                </div>
              </Reveal>
            </section>
          ))}
        </div>

        <section className="px-6 pb-24">
          <div className="glass glass-edge mx-auto max-w-4xl rounded-[2rem] p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-[var(--text)]">Want one built for your business?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Tell us what you sell and how you work. We’ll scope it, build it and give you a launch film of your own.</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-brand transition hover:shadow-glow">
              Start a project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
