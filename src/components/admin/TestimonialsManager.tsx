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
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-2xl font-bold text-violet-600">💬 Testimonials</h2>
        <p className="mb-4 text-sm text-gray-500">
          Manage reviews shown on the site. {pending > 0 && <span className="font-semibold text-amber-600">{pending} awaiting approval.</span>}
        </p>
        {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}

        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
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
              <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              {uploading && <span className="text-sm text-blue-600">Uploading…</span>}
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
            <button type="submit" className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">{editingId ? 'Update' : 'Add'} testimonial</button>
            {editingId && <button type="button" onClick={reset} className="flex-1 rounded-lg bg-gray-400 px-4 py-2 text-white hover:bg-gray-500">Cancel</button>}
          </div>
        </form>

        {loading ? <div className="py-8 text-center text-gray-500">Loading…</div> : items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No testimonials yet.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((t) => (
              <div key={t.id} className={`rounded-lg border p-4 ${editingId === t.id ? 'border-violet-600 bg-violet-50' : 'border-gray-200'} ${!t.active ? 'opacity-60' : ''}`}>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{t.name}</h3>
                  <span className="text-amber-500">{'★'.repeat(t.rating)}</span>
                  {t.source === 'visitor' && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">Visitor</span>}
                  {!t.approved && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Pending</span>}
                  {t.featured && <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">Featured</span>}
                </div>
                {(t.role || t.company) && <p className="mb-1 text-xs text-gray-500">{[t.role, t.company].filter(Boolean).join(' · ')}</p>}
                <p className="mb-3 line-clamp-3 text-sm text-gray-700">“{t.quote}”</p>
                <div className="flex flex-wrap gap-2">
                  {!t.approved && <button onClick={() => patch(t.id, { approved: true })} className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">Approve</button>}
                  {t.approved && <button onClick={() => patch(t.id, { approved: false })} className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600">Unapprove</button>}
                  <button onClick={() => edit(t)} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">Edit</button>
                  <button onClick={() => remove(t.id)} className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const inp = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500'
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>{children}</div>
}
function Chk({ label, v, on }: { label: string; v: boolean; on: (v: boolean) => void }) {
  return <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} />{label}</label>
}
