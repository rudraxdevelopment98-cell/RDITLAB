import { defaultContent, type SiteCopy } from '@/lib/content'

export default function Hero({ content }: { content?: SiteCopy['hero'] }) {
  const c = content ?? defaultContent.hero

  return (
    <section id="home" className="relative">
      <div className="container mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Left — editorial headline */}
          <div className="animate-fade-in-up lg:col-span-7">
            <p className="eyebrow">{c.eyebrow}</p>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.01em] text-[var(--text)] sm:text-6xl lg:text-7xl">
              {c.titleLead}
              <br />
              <span className="text-[var(--accent)]">{c.titleAccent}</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{c.body}</p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a
                href={c.primaryCta.href}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--accent-ink)]"
              >
                {c.primaryCta.label}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href={c.secondaryCta.href}
                className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--text)]"
              >
                <span className="border-b border-[var(--border-strong)] pb-0.5 transition group-hover:border-[var(--accent)]">{c.secondaryCta.label}</span>
              </a>
            </div>
          </div>

          {/* Right — framed credential panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card">
              <p className="text-sm text-muted">{c.panelLabel}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-[var(--text)]">{c.panelValue}</p>
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-[var(--border)] pt-7">
                {c.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-semibold text-[var(--text)]">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-[var(--border)] pt-6">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-weak)] text-[var(--accent)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
                  </svg>
                </span>
                <p className="text-sm text-muted">{c.credential}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6"><div className="rule" /></div>
    </section>
  )
}
