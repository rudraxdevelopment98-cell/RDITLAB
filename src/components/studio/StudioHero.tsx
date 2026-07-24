const badges = ['Websites', 'Web apps', 'Custom software', 'E-commerce', 'Maintenance']

export default function StudioHero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-24 -top-20 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute right-0 top-24 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-[120px] animate-blob [animation-delay:5s]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="container relative z-10 mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200 backdrop-blur-sm">
          Web &amp; Software Studio
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          We design &amp; build <span className="text-gradient-brand">websites and software</span> that work.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
          From a sharp landing page to a full custom web app — modern, fast, secure, and built to grow with
          your business. Explore our plans, live demos, and templates below.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#plans"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-brand-lg active:scale-95"
          >
            View plans
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
          >
            See our work
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
