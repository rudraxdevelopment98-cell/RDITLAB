const stats = [
  { value: '4.5+', label: 'Years experience' },
  { value: '1–4', label: 'Day turnaround' },
  { value: '24/7', label: 'Emergency support' },
  { value: '1 yr', label: 'Warranty up to' },
]

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div className="container mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          {/* Left — editorial headline */}
          <div className="animate-fade-in-up lg:col-span-7">
            <p className="eyebrow">AI · Automation · Software</p>

            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.01em] text-[var(--text)] sm:text-6xl lg:text-7xl">
              We build the software, AI &amp;
              <br />
              <span className="text-[var(--accent)]">automation your business runs on.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              RD IT Lab UK is a studio for custom software, AI agents, automation and digitalization —
              helping businesses work smarter. And our IT team keeps your hardware and networks running.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a
                href="/web-development"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--accent-ink)]"
              >
                See our work
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--text)]"
              >
                <span className="border-b border-[var(--border-strong)] pb-0.5 transition group-hover:border-[var(--accent)]">Get a quote</span>
              </a>
            </div>
          </div>

          {/* Right — framed credential panel */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card">
              <p className="text-sm text-muted">What we deliver</p>
              <p className="mt-1 font-display text-2xl font-semibold text-[var(--text)]">
                AI · Automation · Software · Web
              </p>
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-[var(--border)] pt-7">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-semibold text-[var(--text)]">{stat.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-[var(--border)] pt-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-weak)] text-[var(--accent)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
                  </svg>
                </span>
                <p className="text-sm text-muted">Certified cybersecurity professionals · Harrow, London</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6"><div className="rule" /></div>
    </section>
  )
}
