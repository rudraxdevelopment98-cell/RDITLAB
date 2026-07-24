type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
}

/** Shared dark, premium header used at the top of inner pages for a cohesive look. */
export default function PageHeader({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-violet-600/30 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute right-0 top-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px] animate-blob [animation-delay:5s]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink-950" />

      <div className="container relative z-10 mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-200 backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  )
}
