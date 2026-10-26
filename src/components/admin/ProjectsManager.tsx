'use client'

import { useState, useEffect } from 'react'
import GradientPicker from './GradientPicker'
import { BrowserMock } from '@/components/studio/BrowserMock'

interface Project {
  id: string
  name: string
  category: string
  description: string
  tags: string
  demoUrl: string
  image: string | null
  gradient: string
  overview: string
  presentationUrl: string
  presentationType: string
  featured: boolean
  order: number
  active: boolean
  updatedAt: string
}

const empty = {
  name: '',
  category: '',
  description: '',
  tags: '',
  demoUrl: '',
  image: '',
  gradient: 'from-brand-500 to-brand-600',
  overview: '',
  presentationUrl: '',
  presentationType: '',
  featured: false,
  active: true,
  order: 0,
}

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ ...empty })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/projects?all=1', { credentials: 'include' })
      if (!res.ok) throw new Error()
      setItems(await res.json())
      setError('')
    } catch {
      setError('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setForm((f) => ({ ...f, image: data.url }))
      setError('')
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const [uploadingDeck, setUploadingDeck] = useState(false)
  const uploadPresentation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingDeck(true)
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'upload failed')
      setForm((f) => ({ ...f, presentationUrl: data.url, presentationType: 'file' }))
      setError('')
    } catch (err: any) {
      setError(err?.message || 'Presentation upload failed')
    } finally {
      setUploadingDeck(false)
    }
  }

  const edit = (p: Project) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      tags: p.tags,
      demoUrl: p.demoUrl,
      image: p.image || '',
      gradient: p.gradient,
      overview: p.overview || '',
      presentationUrl: p.presentationUrl || '',
      presentationType: p.presentationType || '',
      featured: p.featured,
      active: p.active,
      order: p.order,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setEditingId(null)
    setForm({ ...empty })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.category || !form.description) {
      setError('Name, category and description are required')
      return
    }
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/projects', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      reset()
      await load()
    } catch {
      setError('Save failed')
    }
  }

  const toggleActive = async (p: Project) => {
    await fetch('/api/projects', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)]">Selected work</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          The builds shown on the Web &amp; Software page and homepage. Add real, shippable work here.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] p-3 text-sm text-[var(--accent-ink)]">{error}</div>
        )}

        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Project name *">
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Lumina Café" />
            </Field>
            <Field label="Category *">
              <input className={input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Restaurant" />
            </Field>
          </div>

          <Field label="Description *">
            <textarea className={input} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of the project" />
          </Field>

          {/* Case study: full overview + presentation */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--accent-ink)]">Case study (optional)</p>
            <Field label="Full overview">
              <textarea className={input} rows={5} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} placeholder="The full project story — problem, what you built, results. Blank lines separate paragraphs." />
            </Field>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <Field label="Presentation link (Google Slides / Drive PDF / YouTube)">
                <input className={input} value={form.presentationType === 'file' ? '' : form.presentationUrl} onChange={(e) => setForm({ ...form, presentationUrl: e.target.value, presentationType: e.target.value ? 'link' : '' })} placeholder="https://docs.google.com/presentation/..." />
              </Field>
              <Field label="…or upload a file (PDF / PPT)">
                <input type="file" accept=".pdf,.ppt,.pptx,application/pdf" onChange={uploadPresentation} disabled={uploadingDeck} className="w-full rounded-lg border border-[var(--border)] px-3 py-2" />
                {uploadingDeck && <span className="text-sm text-[var(--accent-ink)]">Uploading…</span>}
              </Field>
            </div>
            {form.presentationUrl && (
              <p className="mt-2 text-xs text-muted">
                Attached ({form.presentationType}): <a href={form.presentationUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-ink)] underline">view</a>{' '}
                <button type="button" onClick={() => setForm({ ...form, presentationUrl: '', presentationType: '' })} className="ml-2 text-muted underline hover:text-[var(--text)]">remove</button>
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tags (comma separated)">
              <input className={input} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Next.js, Tailwind, Stripe" />
            </Field>
            <Field label="Demo URL">
              <input className={input} value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="https://example.com" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <GradientPicker value={form.gradient} onChange={(g) => setForm({ ...form, gradient: g })} />
              <p className="mt-2 text-xs text-muted">Used when no thumbnail image is set.</p>
            </div>
            <Field label="Thumbnail image (optional)">
              <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="w-full rounded-lg border border-[var(--border)] px-3 py-2" />
              {uploading && <span className="text-sm text-[var(--accent-ink)]">Uploading…</span>}
              {form.image && (
                <button type="button" onClick={() => setForm({ ...form, image: '' })} className="mt-1 text-xs text-muted underline hover:text-[var(--text)]">
                  Remove image
                </button>
              )}
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Order">
              <input type="number" className={input} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-muted">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured (shown on homepage)
            </label>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-muted">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active (visible on site)
            </label>
          </div>

          {/* Live preview */}
          <div>
            <p className="mb-2 text-sm font-medium text-muted">Live preview</p>
            <div className="max-w-xs">
              <BrowserMock label={form.name || 'Preview'} gradient={form.gradient} image={form.image || null} />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-full bg-[var(--accent)] px-4 py-2.5 font-semibold text-white transition hover:bg-[var(--accent-ink)]">
              {editingId ? 'Update' : 'Add'} project
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
          <div className="py-8 text-center text-muted">No projects yet — add your first above.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className={`overflow-hidden rounded-xl border transition ${editingId === p.id ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'} ${!p.active ? 'opacity-60' : ''}`}>
                <BrowserMock label={p.name} gradient={p.gradient} image={p.image} />
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--text)]">{p.name}</h3>
                    {p.featured && <span className="rounded-full bg-[var(--accent-weak)] px-2 py-0.5 text-xs font-medium text-[var(--accent-ink)]">Featured</span>}
                    {!p.active && <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-muted">Hidden</span>}
                  </div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{p.category}</p>
                  <p className="mb-3 line-clamp-2 text-sm text-muted">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => edit(p)} className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition hover:bg-[var(--accent-ink)]">Edit</button>
                    <button onClick={() => toggleActive(p)} className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]">{p.active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => remove(p.id)} className="rounded-full px-3 py-1 text-sm font-medium text-muted transition hover:text-[var(--accent-ink)]">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const input = 'w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">{label}</label>
      {children}
    </div>
  )
}
