import Link from 'next/link'
import Reveal from './Reveal'
import { BrowserMock } from './studio/BrowserMock'
import type { ResolvedProject } from '@/lib/studio'

const highlights = [
  'Custom websites & web apps',
  'Fixed-scope plans from £299',
  'Templates to start fast',
]

export default function StudioTeaser({ projects }: { projects: ResolvedProject[] }) {
  // Prefer featured projects, otherwise fall back to the first few.
  const featured = (projects.filter((p) => p.featured).length
    ? projects.filter((p) => p.featured)
    : projects
  ).slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-ink-950 px-6 py-24 text-white md:px-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px] opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-violet-600/25 blur-[120px] animate-blob" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px] animate-blob [animation-delay:5s]" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Web &amp; Software Studio</p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              We don&apos;t just fix tech — <span className="text-gradient-brand">we build it.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Beautiful, fast websites and custom software for your business. Browse our plans, live demos,
              and ready-made templates.
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-slate-200">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/web-development"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:shadow-brand-lg active:scale-95"
              >
                Explore Web &amp; Software
              </Link>
              <Link
                href="/web-development#plans"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-95"
              >
                View plans
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="grid gap-4 sm:grid-cols-2">
            {featured.map((project, i) => (
              <div
                key={project.id}
                className={`rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm ${
                  i === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                <BrowserMock label={project.name} gradient={project.gradient} />
                <p className="mt-3 px-1 text-sm text-slate-300">
                  <span className="font-semibold text-white">{project.name}</span> · {project.category}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
