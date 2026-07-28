import Reveal from '../Reveal'
import type { ResolvedPlan } from '@/lib/studio'

const check = (
  <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export default function Plans({ plans }: { plans: ResolvedPlan[] }) {
  return (
    <section id="plans" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} plans &amp; pricing</p>
          <h2 className="font-display text-4xl font-bold text-[var(--text)] md:text-5xl">Simple pricing for websites &amp; software</h2>
          <p className="mt-4 text-lg text-muted">Transparent, fixed-scope packages — or a custom quote for bigger builds. No surprises.</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 90}>
              <div
                className={`glass glass-edge relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular ? 'shadow-glow lg:-translate-y-3' : 'hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-[var(--text)]">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted">{plan.tagline}</p>
                <p className="mt-6 font-display text-4xl font-bold text-[var(--text)]">
                  {plan.price}
                  {plan.period && <span className="text-base font-medium text-muted"> {plan.period}</span>}
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="text-gradient-brand">{check}</span>
                      <span className="text-[var(--text)]">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition active:scale-95 ${
                    plan.popular ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:shadow-glow' : 'glass glass-edge text-[var(--text)] hover:scale-[1.02]'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          Need ongoing updates? Ask about our monthly <span className="font-semibold text-gradient-brand">Care Plan</span> from £29/mo.
        </p>
      </div>
    </section>
  )
}
