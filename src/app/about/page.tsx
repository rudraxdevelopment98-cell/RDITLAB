import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import CTASection from '@/components/studio/CTASection'

export const metadata: Metadata = {
  title: 'About',
  description:
    'RD IT Lab UK is a Harrow-based studio for software, AI and automation — founded by a certified cybersecurity professional, backed by hands-on IT experience.',
}

const values = [
  { title: 'Build, don’t just fix', body: 'Our focus is creating the software, AI and automation that move a business forward — not only keeping the lights on.' },
  { title: 'Security by default', body: 'Founded by a certified cybersecurity professional, we design with privacy and protection built in from day one.' },
  { title: 'Clear & accountable', body: 'Transparent pricing, honest timelines and plain-English communication at every step.' },
  { title: 'Genuinely available', body: 'Quick response times and 24/7 emergency cover when something critical goes down.' },
]

const stats = [
  { value: '4.5+', label: 'Years experience' },
  { value: '1–4', label: 'Day turnaround' },
  { value: '24/7', label: 'Emergency support' },
  { value: '1 yr', label: 'Warranty up to' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageHeader
          eyebrow="About"
          title={<>A studio helping businesses <span className="text-[var(--accent)]">work smarter.</span></>}
          subtitle="RD IT Lab UK builds software, AI and automation for modern businesses — grounded in years of hands-on IT and cybersecurity experience."
        />

        {/* Story */}
        <section className="px-6 py-20 md:px-12">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <p className="eyebrow">Our story</p>
            <div className="space-y-6 text-lg leading-relaxed text-muted">
              <p className="font-display text-2xl leading-snug text-[var(--text)]">
                We started in IT repair and networking. Today we help businesses go further — automating the
                busywork, building custom software, and putting AI to work.
              </p>
              <p>
                From our base in Harrow, London, we work with businesses across the UK. What began as fast,
                reliable hardware and network support has grown into a studio for digitalization: turning manual,
                paper-heavy processes into clean, secure systems.
              </p>
              <p>
                We still fix laptops and set up networks — and we do it well. But our main work now is building
                the digital tools that help you save time, reduce errors and grow.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 pb-20 md:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title} className="bg-[var(--bg-elev)] p-8">
                  <h3 className="font-display text-xl font-semibold text-[var(--text)]">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder + stats */}
        <section className="px-6 pb-20 md:px-12">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="eyebrow mb-6">Founder</p>
              <div className="flex items-center gap-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-weak)] font-display text-xl font-semibold text-[var(--accent)]">KJ</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--text)]">Kuldip Jotaniya</h3>
                  <p className="text-sm text-muted">Founder &amp; Lead Engineer</p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted">
                A cybersecurity professional (Google Cybersecurity Certificate, MSc Cybersecurity) with 4.5 years
                of IT experience across India and the UK — specialising in secure software, automation and
                system diagnostics.
              </p>
            </div>
            <div className="self-center">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[var(--border)] pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-4xl font-semibold text-[var(--text)]">{s.value}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
