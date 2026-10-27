type Props = {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
}

/** Shared editorial page header — warm paper, serif title, amber eyebrow. */
export default function PageHeader({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="relative border-b border-[var(--border)]">
      <div className="container mx-auto max-w-5xl px-6 py-20 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
