import Link from 'next/link'
import Reveal from '../Reveal'
import LaunchPlayer from './LaunchPlayer'
import { launches } from '@/lib/launches'

/** Home-page strip of launched products, each with its preview loop. */
export default function LaunchesTeaser() {
  return (
    <section id="products" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Our products</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">Products we’ve launched</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">Live websites, stores and back-office systems. Press play for the full launch film.</p>
          </div>
          <Link href="/products" className="inline-flex shrink-0 items-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)]">
            See all products
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {launches.map((l, i) => (
            <Reveal key={l.slug} delay={(i % 2) * 90}>
              <article className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-card">
                <LaunchPlayer launch={l} compact />
                <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{l.name}</h3>
                    <p className="mt-1 text-sm text-muted">{l.tagline}</p>
                  </div>
                  <Link href={`/products#${l.slug}`} className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-ink)]">
                    Details
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
