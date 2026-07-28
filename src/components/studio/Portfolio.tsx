import Reveal from '../Reveal'
import { BrowserMock } from './BrowserMock'
import type { ResolvedProject } from '@/lib/studio'

export default function Portfolio({ projects }: { projects: ResolvedProject[] }) {
  return (
    <section id="portfolio" className="relative overflow-hidden bg-ink-950 px-6 py-24 text-white md:px-12">
      <div className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:44px_44px] opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">Our work</p>
          <h2 className="font-display text-4xl font-bold md:text-5xl">Websites we&apos;ve built</h2>
          <p className="mt-4 text-lg text-slate-300">
            A selection of live projects and demos. Real, fast, and built to convert.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={(index % 3) * 90}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400/40 hover:bg-white/10">
                <BrowserMock label={project.name} gradient={project.gradient} image={project.image} />
                <div className="flex flex-1 flex-col p-2 pt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-white">{project.name}</h3>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-violet-200">
                      {project.category}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.demo}
                    target={project.demo.startsWith('http') ? '_blank' : undefined}
                    rel={project.demo.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-300 transition group-hover:text-violet-200"
                  >
                    View demo
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
