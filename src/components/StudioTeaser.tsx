import Link from 'next/link'
import Reveal from './Reveal'
import { BrowserMock } from './studio/BrowserMock'
import type { ResolvedProject } from '@/lib/studio'

const highlights = [
  'AI agents & automation',
  'Custom software & web apps',
  'Websites & digitalization',
]

export default function StudioTeaser({ projects }: { projects: ResolvedProject[] }) {
  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 2)

  return (
    <section className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">Web &amp; Software Studio</p>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">
              We don&apos;t just fix tech — <span className="text-[var(--accent)]">we build it.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Custom software, AI and automation for your business — plus the websites and systems that bring it
              all together. See our work and plans.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-[var(--text)]">
                  <svg className="h-4 w-4 flex-shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link href="/web-development" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-[var(--accent-ink)]">
                Explore Web &amp; Software
              </Link>
              <Link href="/web-development#plans" className="group inline-flex items-center gap-2 text-base font-semibold text-[var(--text)]">
                <span className="border-b border-[var(--border-strong)] pb-0.5 transition group-hover:border-[var(--accent)]">View plans</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="space-y-5">
            {featured.map((project) => (
              <Link key={project.id} href={`/web-development/${project.id}`} className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
                <BrowserMock label={project.name} gradient={project.gradient} image={project.image} />
                <p className="mt-3 px-1 text-sm text-muted">
                  <span className="font-semibold text-[var(--text)]">{project.name}</span> · {project.category}
                </p>
              </Link>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
