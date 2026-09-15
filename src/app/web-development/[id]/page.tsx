import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getProject } from '@/lib/studio'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProject(params.id)
  return { title: project ? `${project.name} — Case study` : 'Case study' }
}

/** Turn a share link into an embeddable src. */
function embedSrc(url: string): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('docs.google.com') && u.pathname.includes('/presentation')) {
      return url.replace(/\/(edit|pub|view).*$/, '/embed?start=false&loop=false')
    }
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`
    }
    // PDFs and everything else: embed directly
    return url
  } catch {
    return url
  }
}

export default async function CaseStudyPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) notFound()

  const src = project.presentationUrl ? embedSrc(project.presentationUrl) : null
  const paragraphs = (project.overview || project.description || '').split(/\n{2,}/).filter(Boolean)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [background-size:44px_44px]" />
          <div className="aurora left-[-8%] top-[-15%] h-80 w-80 animate-aurora" style={{ background: 'var(--aurora-1)' }} />
          <div className="aurora right-[-6%] top-[0%] h-80 w-80 animate-aurora [animation-delay:5s]" style={{ background: 'var(--aurora-3)' }} />
          <div className="container relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
            <Link href="/web-development#portfolio" className="mb-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-[var(--text)]">← Back to work</Link>
            <p className="glass glass-edge inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text)]">{project.category}</p>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">{project.name}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{project.description}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {project.tags.map((t) => (
                <span key={t} className="glass rounded-full px-3 py-1 font-mono text-xs text-[var(--text)]">{t}</span>
              ))}
            </div>
            {project.demo && project.demo !== '#' && (
              <div className="mt-8">
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-3.5 font-semibold text-white shadow-brand transition hover:shadow-glow">
                  Visit live site
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </div>
            )}
          </div>
        </section>

        <div className="container mx-auto max-w-4xl px-6 pb-24">
          {/* Presentation */}
          {src && (
            <div className="glass glass-edge mb-12 overflow-hidden rounded-[2rem] p-3">
              <div className="relative w-full overflow-hidden rounded-[1.4rem]" style={{ aspectRatio: '16 / 9' }}>
                <iframe src={src} className="absolute inset-0 h-full w-full" allowFullScreen loading="lazy" title={`${project.name} presentation`} />
              </div>
              <div className="px-4 py-3 text-center">
                <a href={project.presentationUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gradient-brand">Open presentation in new tab ↗</a>
              </div>
            </div>
          )}

          {/* Overview */}
          {paragraphs.length > 0 && (
            <article className="glass glass-edge rounded-[2rem] p-8 md:p-10">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-gradient-brand">{'//'} overview</p>
              <div className="space-y-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-[var(--text)]">{p}</p>
                ))}
              </div>
            </article>
          )}

          <div className="mt-12 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-brand transition hover:shadow-glow">
              Start a project like this
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
