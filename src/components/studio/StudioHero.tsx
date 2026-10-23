const badges = ['AI agents', 'Automation', 'Custom software', 'Websites & web apps', 'Digitalization']

export default function StudioHero() {
  return (
    <section className="relative">
      <div className="container mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
        <p className="eyebrow justify-center">Web, Software &amp; AI</p>
        <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.06] tracking-[-0.01em] text-[var(--text)] sm:text-5xl lg:text-6xl">
          We design &amp; build <span className="text-[var(--accent)]">software, AI and automation</span> that works.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          From AI agents and automated workflows to custom web apps and full digitalization — modern,
          fast, secure, and built to grow with your business.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-5">
          <a href="#plans" className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--accent-ink)]">
            View plans
          </a>
          <a href="#portfolio" className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--text)]">
            <span className="border-b border-[var(--border-strong)] pb-0.5 transition group-hover:border-[var(--accent)]">See our work</span>
          </a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm text-muted">{badge}</span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6"><div className="rule" /></div>
    </section>
  )
}
