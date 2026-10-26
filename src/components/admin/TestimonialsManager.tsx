'use client'

import { useEffect, useState } from 'react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  photo: string | null
  rating: number
  quote: string
  source: string
  approved: boolean
  featured: boolean
  order: number
  active: boolean
  updatedAt: string
}

const empty = { name: '', role: '', company: '', photo: '', rating: 5, quote: '', approved: true, featured: false, active: true, order: 0 }

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ ...empty })

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/testimonials?all=1', { credentials: 'include' })
      if (!res.ok) throw new Error()
      setItems(await res.json())
      setError('')
    } catch { setError('Failed to load testimonials') } finally { setLoading(false) }
  }

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setForm((f) => ({ ...f, photo: data.url }))
    } catch { setError('Image upload failed') } finally { setUploading(false) }
  }

  const edit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({ name: t.name, role: t.role, company: t.company, photo: t.photo || '', rating: t.rating, quote: t.quote, approved: t.approved, featured: t.featured, active: t.active, order: t.order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const reset = () => { setEditingId(null); setForm({ ...empty }) }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.quote) { setError('Name and quote are required'); return }
    try {
      const res = await fetch('/api/testimonials', {
        method: editingId ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      })
      if (!res.ok) throw new Error()
      reset(); await load()
    } catch { setError('Save failed') }
  }

  const patch = async (id: string, data: Partial<Testimonial>) => {
    await fetch('/api/testimonials', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) })
    load()
  }
  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  const pending = items.filter((t) => !t.approved).length

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">Testimonials</h2>
        <p className="mb-4 text-sm text-muted">
          Manage reviews shown on the site. {pending > 0 && <span className="font-semibold text-amber-600">{pending} awaiting approval.</span>}
        </p>
        {error && <div className="mb-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] p-3 text-sm text-[var(--accent-ink)]">{error}</div>}

        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <F label="Name *"><input className={inp} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client name" /></F>
            <F label="Role"><input className={inp} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Owner" /></F>
            <F label="Company"><input className={inp} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Ltd" /></F>
          </div>
          <F label="Quote *"><textarea className={inp} rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} placeholder="What the client said…" /></F>
          <div className="grid gap-4 md:grid-cols-2">
            <F label="Rating">
              <select className={inp} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </F>
            <F label="Photo / logo (optional)">
              <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="w-full rounded-lg border border-[var(--border)] px-3 py-2" />
              {uploading && <span className="text-sm text-[var(--accent-ink)]">Uploading…</span>}
              {form.photo && <img src={form.photo} alt="" className="mt-1 h-12 w-12 rounded-full object-cover" />}
            </F>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <F label="Order"><input type="number" className={inp} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></F>
            <Chk label="Approved" v={form.approved} on={(v) => setForm({ ...form, approved: v })} />
            <Chk label="Featured" v={form.featured} on={(v) => setForm({ ...form, featured: v })} />
            <Chk label="Active" v={form.active} on={(v) => setForm({ ...form, active: v })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">{editingId ? 'Update' : 'Add'} testimonial</button>
            {editingId && <button type="button" onClick={reset} className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">Cancel</button>}
          </div>
        </form>

        {loading ? <div className="py-8 text-center text-muted">Loading…</div> : items.length === 0 ? (
          <div className="py-8 text-center text-muted">No testimonials yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((t) => (
              <div key={t.id} className={`rounded-lg border p-4 ${editingId === t.id ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'} ${!t.active ? 'opacity-60' : ''}`}>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[var(--text)]">{t.name}</h3>
                  <span className="text-amber-500">{'★'.repeat(t.rating)}</span>
                  {t.source === 'visitor' && <span className="rounded-full bg-[var(--accent-weak)] px-2 py-0.5 text-xs font-medium text-[var(--accent-ink)]">Visitor</span>}
                  {!t.approved && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Pending</span>}
                  {t.featured && <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs text-brand-700">Featured</span>}
                </div>
                {(t.role || t.company) && <p className="mb-1 text-xs text-muted">{[t.role, t.company].filter(Boolean).join(' · ')}</p>}
                <p className="mb-3 line-clamp-3 text-sm text-muted">“{t.quote}”</p>
                <div className="flex flex-wrap gap-2">
                  {!t.approved && <button onClick={() => patch(t.id, { approved: true })} className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition hover:bg-[var(--accent-ink)]">Approve</button>}
                  {t.approved && <button onClick={() => patch(t.id, { approved: false })} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">Unapprove</button>}
                  <button onClick={() => edit(t)} className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition hover:bg-[var(--accent-ink)]">Edit</button>
                  <button onClick={() => remove(t.id)} className="rounded-full px-3 py-1 text-sm font-medium text-muted transition hover:text-[var(--accent-ink)]">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inp = 'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500'
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-sm font-medium text-muted">{label}</label>{children}</div>
}
function Chk({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 pt-8 text-sm font-medium text-muted"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} />{label}</label>
}
