import Link from 'next/link'
import Reveal from '../Reveal'
import LaunchPlayer from './LaunchPlayer'
import { launches } from '@/lib/launches'

/** Home-page strip of launched products, each with its preview loop. */
export default function LaunchesTeaser() {
  return (
    <section id="products" className="relative overflow-hidden px-6 py-24 md:px-12">
      <div className="aurora right-[-8%] top-[5%] h-80 w-80 animate-aurora" style={{ background: 'var(--aurora-3)' }} />
      <div className="container relative z-10 mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">Products we’ve launched</h2>
            <p className="mt-4 text-lg text-muted">Live websites, stores and back-office systems. Press play for the full launch film.</p>
          </div>
          <Link href="/products" className="glass glass-edge inline-flex items-center rounded-full px-6 py-3 font-semibold text-[var(--text)] transition hover:scale-[1.02]">
            See all products
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {launches.map((l, i) => (
            <Reveal key={l.slug} delay={(i % 2) * 90}>
              <article className="glass glass-edge h-full rounded-2xl p-3">
                <LaunchPlayer launch={l} compact />
                <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">{l.name}</h3>
                    <p className="mt-1 text-sm text-muted">{l.tagline}</p>
                  </div>
                  <Link href={`/products#${l.slug}`} className="shrink-0 text-sm font-semibold text-gradient-brand">
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
