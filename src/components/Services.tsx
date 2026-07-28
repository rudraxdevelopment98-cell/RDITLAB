import Reveal from './Reveal'

type IconProps = { className?: string }

const icons: Record<string, (p: IconProps) => JSX.Element> = {
  laptop: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path strokeLinecap="round" d="M2 20h20M9 16h6" />
    </svg>
  ),
  desktop: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path strokeLinecap="round" d="M8 20h8M12 16v4" />
    </svg>
  ),
  build: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path strokeLinecap="round" d="M9 7h6M9 11h6M9 15h3" />
    </svg>
  ),
  network: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
      <path strokeLinecap="round" d="M12 7v4m0 0l-5 6m5-6l5 6" />
    </svg>
  ),
  lab: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v6l-4 8a2 2 0 002 3h10a2 2 0 002-3l-4-8V3M8 3h8M7 14h10" />
    </svg>
  ),
  audit: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  ),
  software: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3M13 6l-2 12" />
    </svg>
  ),
}

const services = [
  { icon: 'laptop', title: 'Laptop Repair', description: 'Screen replacement, keyboard fixes, battery replacement, and hardware upgrades for all laptop brands.' },
  { icon: 'desktop', title: 'PC Repair', description: 'Comprehensive desktop repair, from component replacement to full system diagnostics and optimization.' },
  { icon: 'build', title: 'PC Build', description: 'Custom builds tailored to your needs — gaming rigs, workstations, and industrial machines.' },
  { icon: 'network', title: 'Networking', description: 'Design and maintenance of network infrastructure: routers, switches, and secure connections.' },
  { icon: 'lab', title: 'Lab Setup', description: 'Complete lab environments with specialised equipment, software installation, and configuration.' },
  { icon: 'audit', title: 'Audit', description: 'Thorough system audits to find vulnerabilities, boost performance, and ensure compliance.' },
  { icon: 'software', title: 'Software Support', description: 'Ongoing software maintenance, updates, troubleshooting, and custom software solutions.' },
]

export default function Services() {
  return (
    <section id="services" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} what we do</p>
            <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">Our Services</h2>
          </div>
          <a href="/services" className="glass glass-edge inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:scale-[1.02]">
            View full service page
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[service.icon]
            return (
              <Reveal key={service.title} delay={(index % 3) * 90}>
                <div className="glass glass-edge group relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-brand">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold text-[var(--text)]">{service.title}</h3>
                  <p className="leading-relaxed text-muted">{service.description}</p>
                </div>
              </Reveal>
            )
          })}

          <Reveal delay={90}>
            <a href="/contact" className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 p-7 text-white shadow-brand transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <h3 className="font-display text-xl font-semibold">Need something else?</h3>
                <p className="mt-2 leading-relaxed text-white/85">Tell us about your setup and we&apos;ll put together a tailored IT solution.</p>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-2 font-semibold">
                Talk to us
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
