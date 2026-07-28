type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
}

/** Shared page header with aurora backdrop — adapts to light and dark. */
export default function PageHeader({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [background-size:44px_44px]" />
      <div className="aurora left-[-8%] top-[-20%] h-80 w-80 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
      <div className="aurora right-[-6%] top-[0%] h-80 w-80 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-3)' }} />

      <div className="container relative z-10 mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
        <p className="glass glass-edge inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text)]">
          {eyebrow}
        </p>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
