export default function CTASection() {
  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="container mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-700 px-8 py-14 text-center text-white shadow-brand-lg md:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:34px_34px] opacity-40" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Have a project in mind?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">
              Tell us what you need — a website, a web app, or something custom — and we&apos;ll send a
              clear plan and quote within 24 hours.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50 active:scale-95"
              >
                Start a project
              </a>
              <a
                href="tel:+447823912875"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
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
