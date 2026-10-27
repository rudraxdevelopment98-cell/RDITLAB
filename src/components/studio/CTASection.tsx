export default function CTASection() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="container mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl bg-[var(--bg-contrast)] px-8 py-14 text-[var(--text-on-contrast)] md:px-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Let’s talk</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight md:text-4xl">Have a project in mind?</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">
              Tell us what you need — a website, a web app, AI or automation — and we’ll send a clear plan and
              quote within 24 hours.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--accent-ink)] active:scale-[0.99]"
              >
                Start a project
              </a>
              <a
                href="tel:+447823912875"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
              >
                Call +44 7823 912875
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
