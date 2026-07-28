import Reveal from '../Reveal'
import { BrowserMock } from './BrowserMock'
import type { ResolvedTemplate } from '@/lib/studio'

export default function Templates({ templates }: { templates: ResolvedTemplate[] }) {
  return (
    <section id="templates" className="bg-slate-50 px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Templates &amp; examples</p>
          <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
            Start from a ready-made template
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Kick off faster with a polished starting point — then we customise it to your brand.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <Reveal key={template.id} delay={(index % 3) * 90}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-brand">
                <div className="p-4 pb-0">
                  <BrowserMock label={template.name} gradient={template.gradient} image={template.image} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-gray-900">{template.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        template.price === 'Free'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-violet-100 text-violet-700'
                      }`}
                    >
                      {template.price}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600">{template.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      {template.category}
                    </span>
                    <a
                      href={template.preview || '/contact'}
                      target={template.preview?.startsWith('http') ? '_blank' : undefined}
                      rel={template.preview?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 transition group-hover:text-violet-800"
                    >
                      Preview
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
