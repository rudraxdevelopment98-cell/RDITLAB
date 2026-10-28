'use client'

import { useEffect, useState } from 'react'

interface Launch {
  id: string
  slug: string
  name: string
  category: string
  tagline: string
  description: string
  features: string
  stack: string
  liveUrl: string
  liveLabel: string
  duration: number
  accent: string
  videoUrl: string
  previewUrl: string
  posterUrl: string
  order: number
  active: boolean
  updatedAt: string
}

const empty = {
  name: '',
  category: '',
  tagline: '',
  description: '',
  features: '',
  stack: '',
  liveUrl: '',
  liveLabel: '',
  duration: 0,
  accent: '#b45309',
  videoUrl: '',
  previewUrl: '',
  posterUrl: '',
  order: 0,
  active: true,
}

const input =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] transition focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-weak)]'

export default function LaunchesManager() {
  const [items, setItems] = useState<Launch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ ...empty })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/launches?all=1', { credentials: 'include' })
      if (!res.ok) throw new Error()
      setItems(await res.json())
      setError('')
    } catch {
      setError('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  const importDefaults = async () => {
    try {
      const res = await fetch('/api/launches', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ importDefaults: true }),
      })
      if (!res.ok) throw new Error()
      await load()
    } catch {
      setError('Import failed')
    }
  }

  const uploadPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'upload failed')
      setForm((f) => ({ ...f, posterUrl: data.url }))
      setError('')
    } catch (err: any) {
      setError(err?.message || 'Poster upload failed')
    } finally {
      setUploading(false)
    }
  }

  const edit = (l: Launch) => {
    setEditingId(l.id)
    setEditingSlug(l.slug)
    setForm({
      name: l.name,
      category: l.category,
      tagline: l.tagline,
      description: l.description,
      features: l.features || '',
      stack: l.stack || '',
      liveUrl: l.liveUrl || '',
      liveLabel: l.liveLabel || '',
      duration: l.duration || 0,
      accent: l.accent || '#b45309',
      videoUrl: l.videoUrl || '',
      previewUrl: l.previewUrl || '',
      posterUrl: l.posterUrl || '',
      order: l.order,
      active: l.active,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setEditingId(null)
    setEditingSlug(null)
    setForm({ ...empty })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.tagline || !form.description) {
      setError('Name, category, tagline and description are required')
      return
    }
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/launches', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Save failed')
      }
      reset()
      await load()
    } catch (err: any) {
      setError(err?.message || 'Save failed')
    }
  }

  const toggleActive = async (l: Launch) => {
    await fetch('/api/launches', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: l.id, active: !l.active }),
    })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/launches?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">Launched products</h2>
            <p className="mt-1 text-sm text-muted">
              The products shown on the Products page and the home-page teaser, each with its launch film.
            </p>
          </div>
          {items.length === 0 && !isLoading && (
            <button onClick={importDefaults} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
              Import current 4 products
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 mt-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] p-3 text-sm text-[var(--accent-ink)]">{error}</div>
        )}

        <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
          {editingSlug && (
            <p className="text-xs text-muted">
              Editing <span className="font-semibold text-[var(--text)]">{editingSlug}</span> — slug is fixed (film files depend on it).
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Product name *">
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mahadev APF" />
            </Field>
            <Field label="Category *">
              <input className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Showroom website + GST billing" />
            </Field>
          </div>

          <Field label="Tagline *">
            <input className={input} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="One line that sums up the product" />
          </Field>
          <Field label="Description *">
            <textarea className={`${input} resize-y`} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A short paragraph about what it does" />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Features (one per line)">
              <textarea className={`${input} resize-y`} rows={5} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder={'Cinematic hero\nGST tax invoices\nRole-based access'} />
            </Field>
            <Field label="Built with (comma separated)">
              <textarea className={`${input} resize-y`} rows={5} value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} placeholder="Next.js, Prisma, PostgreSQL" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Live URL (blank = private tool)">
              <input className={input} value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://example.com" />
            </Field>
            <Field label="Private label (if no live URL)">
              <input className={input} value={form.liveLabel} onChange={(e) => setForm({ ...form, liveLabel: e.target.value })} placeholder="e.g. Private staff portal" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Film length (seconds)">
              <input type="number" className={input} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </Field>
            <Field label="Accent colour">
              <div className="flex items-center gap-2">
                <input type="color" value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} className="h-9 w-12 rounded border border-[var(--border)] bg-[var(--bg)]" />
                <input className={input} value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value })} placeholder="#b45309" />
              </div>
            </Field>
            <Field label="Order">
              <input type="number" className={input} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
          </div>

          {/* Media */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Media</p>
            <p className="mb-3 mt-1 text-xs text-muted">
              Leave blank to use the built-in files at <code>/products/&lt;slug&gt;.*</code>. Large films are best hosted as a URL (e.g. a Blob or external link); posters can be uploaded.
            </p>
            <div className="grid gap-4">
              <Field label="Launch film URL (.mp4)">
                <input className={input} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder={editingSlug ? `/products/${editingSlug}.mp4` : '/products/<slug>.mp4'} />
              </Field>
              <Field label="Preview loop URL (.mp4)">
                <input className={input} value={form.previewUrl} onChange={(e) => setForm({ ...form, previewUrl: e.target.value })} placeholder={editingSlug ? `/products/${editingSlug}-preview.mp4` : '/products/<slug>-preview.mp4'} />
              </Field>
              <Field label="Poster image URL">
                <input className={input} value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} placeholder={editingSlug ? `/products/${editingSlug}.jpg` : '/products/<slug>.jpg'} />
              </Field>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">…or upload a poster image</label>
                <input type="file" accept="image/*" onChange={uploadPoster} disabled={uploading} className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm" />
                {uploading && <span className="text-sm text-[var(--accent-ink)]">Uploading…</span>}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-muted">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active (visible on site)
          </label>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-full bg-[var(--accent)] px-4 py-2.5 font-semibold text-white transition hover:bg-[var(--accent-ink)]">
              {editingId ? 'Update' : 'Add'} product
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="flex-1 rounded-full border border-[var(--border)] px-4 py-2.5 font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">
                Cancel
              </button>
            )}
          </div>
        </form>

        {isLoading ? (
          <div className="py-8 text-center text-muted">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-muted">No products in the database yet — import the current 4 above, or add your first.</div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((l) => (
              <div key={l.id} className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition ${editingId === l.id ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'} ${!l.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full" style={{ background: l.accent }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--text)]">{l.name}</h3>
                      {!l.active && <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-muted">Hidden</span>}
                    </div>
                    <p className="text-xs uppercase tracking-wide text-muted">{l.category}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted">{l.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 flex-wrap justify-end gap-2">
                  <button onClick={() => edit(l)} className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition hover:bg-[var(--accent-ink)]">Edit</button>
                  <button onClick={() => toggleActive(l)} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">{l.active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => remove(l.id)} className="rounded-full px-3 py-1 text-sm font-medium text-muted transition hover:text-[var(--accent-ink)]">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">{label}</label>
      {children}
    </div>
  )
}
