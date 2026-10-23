import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import CTASection from '@/components/studio/CTASection'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'AI agents, automation, custom software, websites and digitalization — plus laptop/PC repair, networking and IT support across the UK.',
}

const primary = [
  {
    title: 'AI Agents',
    blurb: 'Custom AI assistants wired into your tools, documents and data — so routine questions and tasks handle themselves.',
    points: ['Knowledge-base assistants & chatbots', 'Lead qualification & support triage', 'Internal copilots for your team', 'Integrations with your existing tools'],
  },
  {
    title: 'Automation & Workflows',
    blurb: 'We remove repetitive work — connecting your apps so data moves and tasks run without anyone touching them.',
    points: ['App-to-app & API integrations', 'Automated data entry & reporting', 'Scheduled pipelines & syncs', 'Alerts, approvals & notifications'],
  },
  {
    title: 'Custom Software & Web Apps',
    blurb: 'Full-stack applications, dashboards and internal tools — secure, scalable, and built around how you actually work.',
    points: ['Dashboards & admin portals', 'Auth, databases & roles', 'Third-party & payment integrations', 'Cloud deployment & maintenance'],
  },
  {
    title: 'Websites',
    blurb: 'Fast, modern, conversion-focused websites — from a sharp landing page to a full platform with a CMS you control.',
    points: ['Marketing sites & landing pages', 'Content management (edit it yourself)', 'SEO, analytics & performance', 'E-commerce & booking flows'],
  },
  {
    title: 'Digitalization',
    blurb: 'Take your business paperless — turn manual processes, forms and records into one secure, searchable system.',
    points: ['Paperless processes & forms', 'Digital records & document stores', 'Cloud migration', 'Process mapping & rollout'],
  },
]

const support = [
  { title: 'Laptop & PC Repair', price: '£50 – £1,000', text: 'Screens, batteries, boards, diagnostics and upgrades — 1–4 day turnaround, up to 1-year warranty.' },
  { title: 'Custom PC Builds', price: '£500 – £5,000', text: 'Tailored gaming, CAD and workstation builds with quality testing and warranty.' },
  { title: 'Data Recovery', price: '£50 – £500', text: 'Recovery from damaged drives, SSDs and corrupted systems — confidential handling.' },
  { title: 'Networking & Setup', price: '£200 – £10,000', text: 'Routers, switches, cabling, VLANs and security hardening for home and business.' },
  { title: 'Lab Setup', price: 'On request', text: 'Virtualised, segmented lab environments with secure access and documentation.' },
  { title: 'IT Audit & Security', price: 'On request', text: 'Vulnerability review, compliance gaps and an actionable remediation plan.' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Services"
          title={<>Software, AI &amp; automation — <span className="text-[var(--accent)]">plus the IT support to back it up.</span></>}
          subtitle="We build the digital tools your business runs on, and keep your hardware and networks healthy. Here's how we can help."
        />

        {/* Primary — digital services */}
        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-10">What we build</p>
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {primary.map((s, i) => (
                <div key={s.title} className="grid gap-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
                  <div className="flex items-start gap-5">
                    <span className="font-display text-2xl text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">{s.title}</h2>
                      <p className="mt-3 max-w-md leading-relaxed text-muted">{s.blurb}</p>
                    </div>
                  </div>
                  <ul className="grid gap-x-8 gap-y-3 self-center sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[var(--text)]">
                        <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[15px]">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Secondary — IT support & hardware */}
        <section className="px-6 pb-20 md:px-12">
          <div className="mx-auto max-w-5xl">
            <p className="eyebrow mb-3">Also — IT support &amp; hardware</p>
            <h2 className="mb-10 font-display text-3xl font-semibold text-[var(--text)]">The IT backbone, handled</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {support.map((s) => (
                <div key={s.title} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-[var(--text)]">{s.title}</h3>
                    <span className="shrink-0 text-sm font-medium text-[var(--accent)]">{s.price}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
