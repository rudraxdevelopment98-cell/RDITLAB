import Link from 'next/link'
import Reveal from './Reveal'
import { BrowserMock } from './studio/BrowserMock'
import type { ResolvedProject } from '@/lib/studio'

const highlights = ['Custom websites & web apps', 'Fixed-scope plans from £299', 'Templates to start fast']

export default function StudioTeaser({ projects }: { projects: ResolvedProject[] }) {
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 3)

  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-12">
      <div className="aurora left-[-6%] top-[10%] h-80 w-80 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
      <div className="aurora right-[-6%] bottom-0 h-80 w-80 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-2)' }} />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} web &amp; software studio</p>
            <h2 className="font-display text-4xl font-bold leading-tight text-[var(--text)] md:text-5xl">
              We don&apos;t just fix tech — <span className="text-gradient-brand">we build it.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Beautiful, fast websites and custom software for your business. Browse our plans, live demos, and ready-made templates.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-[var(--text)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-white">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/web-development" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-glow active:scale-95">
                Explore Web &amp; Software
              </Link>
              <Link href="/web-development#plans" className="glass glass-edge inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-[var(--text)] transition hover:scale-[1.02]">
                View plans
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="grid gap-4 sm:grid-cols-2">
            {featured.map((project, i) => (
              <div key={project.id} className={`glass glass-edge rounded-2xl p-3 ${i === 0 ? 'sm:col-span-2' : ''}`}>
                <BrowserMock label={project.name} gradient={project.gradient} image={project.image} />
                <p className="mt-3 px-1 text-sm text-muted">
                  <span className="font-semibold text-[var(--text)]">{project.name}</span> · {project.category}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
