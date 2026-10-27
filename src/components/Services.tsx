import Reveal from './Reveal'
import { defaultContent, type SiteCopy } from '@/lib/content'

type IconProps = { className?: string }

const icons: Record<string, (p: IconProps) => JSX.Element> = {
  ai: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <rect x="5" y="7" width="14" height="12" rx="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4M9 12h.01M15 12h.01M9 16h6" />
    </svg>
  ),
  automation: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0113.7-5.7L20 8M20 12a8 8 0 01-13.7 5.7L4 16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 4v4h-4M4 20v-4h4" />
    </svg>
  ),
  software: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3M13 6l-2 12" />
    </svg>
  ),
  web: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </svg>
  ),
  digital: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </svg>
  ),
}

export default function Services({ content }: { content?: SiteCopy['services'] }) {
  const c = content ?? defaultContent.services

  return (
    <section id="services" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">
            {c.headingLead} <span className="text-[var(--accent)]">{c.headingAccent}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{c.body}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((service, index) => {
            const Icon = icons[service.icon] ?? icons.software
            return (
              <Reveal key={`${service.title}-${index}`} delay={(index % 3) * 70}>
                <div className="group h-full bg-[var(--bg-elev)] p-8 transition-colors hover:bg-[var(--bg)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-weak)] text-[var(--accent)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-[var(--text)]">{service.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{service.description}</p>
                </div>
              </Reveal>
            )
          })}
          <Reveal delay={140}>
            <a href={c.ctaLink} className="group flex h-full flex-col justify-between bg-[var(--bg-contrast)] p-8 text-[var(--text-on-contrast)]">
              <div>
                <h3 className="font-display text-xl font-semibold">{c.ctaTitle}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{c.ctaBody}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-medium text-[var(--accent)]">
                Start a conversation
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </Reveal>
        </div>

        {/* Secondary — IT support & hardware */}
        {c.support.length > 0 && (
          <Reveal className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">{c.supportLabel}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--text)]">
                {c.support.map((s) => (
                  <span key={s} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <a href="/services" className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-ink)]">
              All services →
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
