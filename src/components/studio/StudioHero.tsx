const badges = ['Websites', 'Web apps', 'Custom software', 'E-commerce', 'Maintenance']

export default function StudioHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [background-size:44px_44px]" />
      <div className="aurora left-[-8%] top-[-10%] h-96 w-96 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
      <div className="aurora right-[-6%] top-[6%] h-96 w-96 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-2)' }} />

      <div className="container relative z-10 mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
        <p className="glass glass-edge inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text)]">
          Web &amp; Software Studio
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
          We design &amp; build <span className="text-gradient-brand">websites and software</span> that work.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          From a sharp landing page to a full custom web app — modern, fast, secure, and built to grow with your business. Explore our plans, live demos, and templates below.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#plans" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-glow active:scale-95">
            View plans
          </a>
          <a href="#portfolio" className="glass glass-edge inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-[var(--text)] transition hover:scale-[1.02]">
            See our work
          </a>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {badges.map((badge) => (
            <span key={badge} className="glass rounded-full px-4 py-1.5 text-sm text-[var(--text)]">{badge}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
