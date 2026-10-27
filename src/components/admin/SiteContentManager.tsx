'use client'

import { useEffect, useState } from 'react'

const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-weak)]'

const ICONS = ['ai', 'automation', 'software', 'web', 'digital']

type Any = Record<string, any>

export default function SiteContentManager() {
  const [content, setContent] = useState<Any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [open, setOpen] = useState<string>('hero')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/site-content', { credentials: 'include' })
        if (!res.ok) throw new Error()
        setContent(await res.json())
      } catch {
        setErr('Failed to load content')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const set = (section: string, key: string, value: any) =>
    setContent((c) => (c ? { ...c, [section]: { ...c[section], [key]: value } } : c))

  const save = async () => {
    if (!content) return
    setSaving(true)
    setMsg('')
    setErr('')
    try {
      const res = await fetch('/api/site-content', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContent(data.content)
      setMsg('Saved — changes are live on the site.')
      setTimeout(() => setMsg(''), 5000)
    } catch {
      setErr('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
        <p className="mt-3 text-sm text-muted">Loading content…</p>
      </div>
    )
  }

  if (!content) {
    return <div className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] p-4 text-sm text-[var(--accent-ink)]">{err || 'No content'}</div>
  }

  const sections: { id: string; label: string; hint: string }[] = [
    { id: 'hero', label: 'Hero', hint: 'The headline area at the top of the home page' },
    { id: 'about', label: 'About', hint: 'Who you are and why to choose you' },
    { id: 'services', label: 'Services', hint: 'What you offer' },
    { id: 'contact', label: 'Contact', hint: 'Details, message form and FAQs' },
    { id: 'footer', label: 'Footer', hint: 'Site-wide footer' },
  ]

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">Home page content</h2>
            <p className="mt-1 text-sm text-muted">Edit the live copy on your home page. Changes publish the moment you save.</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-ink)] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
        {msg && <p className="mt-4 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-weak)] px-4 py-2.5 text-sm text-[var(--accent-ink)]">{msg}</p>}
        {err && <p className="mt-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] px-4 py-2.5 text-sm text-[var(--accent-ink)]">{err}</p>}
      </div>

      {sections.map((s) => {
        const isOpen = open === s.id
        return (
          <div key={s.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] shadow-card">
            <button
              onClick={() => setOpen(isOpen ? '' : s.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <div>
                <p className="font-display text-lg font-semibold text-[var(--text)]">{s.label}</p>
                <p className="text-sm text-muted">{s.hint}</p>
              </div>
              <span className={`text-xl text-[var(--accent)] transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
            </button>
            {isOpen && (
              <div className="border-t border-[var(--border)] p-6">
                {s.id === 'hero' && <HeroEditor c={content.hero} set={(k, v) => set('hero', k, v)} />}
                {s.id === 'about' && <AboutEditor c={content.about} set={(k, v) => set('about', k, v)} />}
                {s.id === 'services' && <ServicesEditor c={content.services} set={(k, v) => set('services', k, v)} />}
                {s.id === 'contact' && <ContactEditor c={content.contact} set={(k, v) => set('contact', k, v)} />}
                {s.id === 'footer' && <FooterEditor c={content.footer} set={(k, v) => set('footer', k, v)} />}
              </div>
            )}
          </div>
        )
      })}

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-ink)] disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- helpers */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  )
}

function Text({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Field label={label}>
      <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  )
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <Field label={label}>
      <textarea className={`${inputCls} resize-y`} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </Field>
  )
}

function ListShell({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <button onClick={onAdd} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
          + Add
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function RowShell({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="relative rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-3 pr-10">
      {children}
      <button
        onClick={onRemove}
        aria-label="Remove"
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:bg-[var(--accent-weak)] hover:text-[var(--accent)]"
      >
        ×
      </button>
    </div>
  )
}

const grid2 = 'grid gap-4 sm:grid-cols-2'

/* ---------------------------------------------------------------- sections */

function HeroEditor({ c, set }: { c: Any; set: (k: string, v: any) => void }) {
  const stats: Any[] = c.stats || []
  const updateStat = (i: number, k: string, v: string) => set('stats', stats.map((s, j) => (j === i ? { ...s, [k]: v } : s)))
  return (
    <div className="space-y-4">
      <Text label="Eyebrow (small label)" value={c.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <div className={grid2}>
        <Text label="Headline — line 1" value={c.titleLead} onChange={(v) => set('titleLead', v)} />
        <Text label="Headline — accent (amber)" value={c.titleAccent} onChange={(v) => set('titleAccent', v)} />
      </div>
      <Area label="Intro paragraph" value={c.body} onChange={(v) => set('body', v)} rows={3} />
      <div className={grid2}>
        <Text label="Primary button — text" value={c.primaryCta?.label} onChange={(v) => set('primaryCta', { ...c.primaryCta, label: v })} />
        <Text label="Primary button — link" value={c.primaryCta?.href} onChange={(v) => set('primaryCta', { ...c.primaryCta, href: v })} />
        <Text label="Secondary button — text" value={c.secondaryCta?.label} onChange={(v) => set('secondaryCta', { ...c.secondaryCta, label: v })} />
        <Text label="Secondary button — link" value={c.secondaryCta?.href} onChange={(v) => set('secondaryCta', { ...c.secondaryCta, href: v })} />
      </div>
      <div className={grid2}>
        <Text label="Panel label" value={c.panelLabel} onChange={(v) => set('panelLabel', v)} />
        <Text label="Panel value" value={c.panelValue} onChange={(v) => set('panelValue', v)} />
      </div>
      <Text label="Credential line" value={c.credential} onChange={(v) => set('credential', v)} />
      <ListShell title="Stats" onAdd={() => set('stats', [...stats, { value: '', label: '' }])}>
        {stats.map((s, i) => (
          <RowShell key={i} onRemove={() => set('stats', stats.filter((_, j) => j !== i))}>
            <div className={grid2}>
              <Text label="Value" value={s.value} onChange={(v) => updateStat(i, 'value', v)} />
              <Text label="Label" value={s.label} onChange={(v) => updateStat(i, 'label', v)} />
            </div>
          </RowShell>
        ))}
      </ListShell>
    </div>
  )
}

function AboutEditor({ c, set }: { c: Any; set: (k: string, v: any) => void }) {
  const items: Any[] = c.items || []
  const benefits: string[] = c.benefits || []
  const updateItem = (i: number, k: string, v: string) => set('items', items.map((it, j) => (j === i ? { ...it, [k]: v } : it)))
  return (
    <div className="space-y-4">
      <Text label="Eyebrow" value={c.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <Text label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <Area label="Intro" value={c.intro} onChange={(v) => set('intro', v)} rows={2} />
      <ListShell title="Accordion items" onAdd={() => set('items', [...items, { title: '', content: '' }])}>
        {items.map((it, i) => (
          <RowShell key={i} onRemove={() => set('items', items.filter((_, j) => j !== i))}>
            <div className="space-y-3">
              <Text label="Title" value={it.title} onChange={(v) => updateItem(i, 'title', v)} />
              <Area label="Content" value={it.content} onChange={(v) => updateItem(i, 'content', v)} rows={2} />
            </div>
          </RowShell>
        ))}
      </ListShell>
      <div className={grid2}>
        <Text label="Benefits panel — title" value={c.benefitsTitle} onChange={(v) => set('benefitsTitle', v)} />
        <Text label="Benefits panel — intro" value={c.benefitsIntro} onChange={(v) => set('benefitsIntro', v)} />
      </div>
      <ListShell title="Benefits" onAdd={() => set('benefits', [...benefits, ''])}>
        {benefits.map((b, i) => (
          <RowShell key={i} onRemove={() => set('benefits', benefits.filter((_, j) => j !== i))}>
            <Text label={`Benefit ${i + 1}`} value={b} onChange={(v) => set('benefits', benefits.map((x, j) => (j === i ? v : x)))} />
          </RowShell>
        ))}
      </ListShell>
    </div>
  )
}

function ServicesEditor({ c, set }: { c: Any; set: (k: string, v: any) => void }) {
  const items: Any[] = c.items || []
  const support: string[] = c.support || []
  const updateItem = (i: number, k: string, v: string) => set('items', items.map((it, j) => (j === i ? { ...it, [k]: v } : it)))
  return (
    <div className="space-y-4">
      <Text label="Eyebrow" value={c.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <div className={grid2}>
        <Text label="Heading — line" value={c.headingLead} onChange={(v) => set('headingLead', v)} />
        <Text label="Heading — accent (amber)" value={c.headingAccent} onChange={(v) => set('headingAccent', v)} />
      </div>
      <Area label="Intro" value={c.body} onChange={(v) => set('body', v)} rows={2} />
      <ListShell title="Service cards" onAdd={() => set('items', [...items, { icon: 'software', title: '', description: '' }])}>
        {items.map((it, i) => (
          <RowShell key={i} onRemove={() => set('items', items.filter((_, j) => j !== i))}>
            <div className="space-y-3">
              <div className={grid2}>
                <Field label="Icon">
                  <select className={inputCls} value={it.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)}>
                    {ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </Field>
                <Text label="Title" value={it.title} onChange={(v) => updateItem(i, 'title', v)} />
              </div>
              <Area label="Description" value={it.description} onChange={(v) => updateItem(i, 'description', v)} rows={2} />
            </div>
          </RowShell>
        ))}
      </ListShell>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--text)]">“Have an idea?” card</p>
        <div className="space-y-3">
          <Text label="Title" value={c.ctaTitle} onChange={(v) => set('ctaTitle', v)} />
          <Area label="Body" value={c.ctaBody} onChange={(v) => set('ctaBody', v)} rows={2} />
          <Text label="Link" value={c.ctaLink} onChange={(v) => set('ctaLink', v)} />
        </div>
      </div>
      <Text label="Support strip — label" value={c.supportLabel} onChange={(v) => set('supportLabel', v)} />
      <ListShell title="IT support tags" onAdd={() => set('support', [...support, ''])}>
        {support.map((sup, i) => (
          <RowShell key={i} onRemove={() => set('support', support.filter((_, j) => j !== i))}>
            <Text label={`Tag ${i + 1}`} value={sup} onChange={(v) => set('support', support.map((x, j) => (j === i ? v : x)))} />
          </RowShell>
        ))}
      </ListShell>
    </div>
  )
}

function ContactEditor({ c, set }: { c: Any; set: (k: string, v: any) => void }) {
  const faqs: Any[] = c.faqs || []
  const updateFaq = (i: number, k: string, v: string) => set('faqs', faqs.map((f, j) => (j === i ? { ...f, [k]: v } : f)))
  return (
    <div className="space-y-4">
      <Text label="Eyebrow" value={c.eyebrow} onChange={(v) => set('eyebrow', v)} />
      <Text label="Heading" value={c.heading} onChange={(v) => set('heading', v)} />
      <Area label="Intro" value={c.intro} onChange={(v) => set('intro', v)} rows={2} />
      <div className={grid2}>
        <Text label="Email" value={c.email} onChange={(v) => set('email', v)} />
        <Text label="Phone" value={c.phone} onChange={(v) => set('phone', v)} />
        <Text label="Location" value={c.location} onChange={(v) => set('location', v)} />
      </div>
      <div className={grid2}>
        <Text label="Google Reviews URL" value={c.googleUrl} onChange={(v) => set('googleUrl', v)} />
        <Text label="Instagram URL" value={c.instagramUrl} onChange={(v) => set('instagramUrl', v)} />
      </div>
      <ListShell title="FAQs" onAdd={() => set('faqs', [...faqs, { question: '', answer: '' }])}>
        {faqs.map((f, i) => (
          <RowShell key={i} onRemove={() => set('faqs', faqs.filter((_, j) => j !== i))}>
            <div className="space-y-3">
              <Text label="Question" value={f.question} onChange={(v) => updateFaq(i, 'question', v)} />
              <Area label="Answer" value={f.answer} onChange={(v) => updateFaq(i, 'answer', v)} rows={2} />
            </div>
          </RowShell>
        ))}
      </ListShell>
    </div>
  )
}

function FooterEditor({ c, set }: { c: Any; set: (k: string, v: any) => void }) {
  return (
    <div className="space-y-4">
      <Area label="Tagline" value={c.tagline} onChange={(v) => set('tagline', v)} rows={2} />
      <div className={grid2}>
        <Text label="Email" value={c.email} onChange={(v) => set('email', v)} />
        <Text label="Phone" value={c.phone} onChange={(v) => set('phone', v)} />
        <Text label="Location" value={c.location} onChange={(v) => set('location', v)} />
        <Text label="Bottom note" value={c.note} onChange={(v) => set('note', v)} />
      </div>
      <div className={grid2}>
        <Text label="Google Reviews URL" value={c.googleUrl} onChange={(v) => set('googleUrl', v)} />
        <Text label="Instagram URL" value={c.instagramUrl} onChange={(v) => set('instagramUrl', v)} />
      </div>
    </div>
  )
}
