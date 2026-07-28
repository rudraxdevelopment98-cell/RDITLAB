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
  gradient: 'from-violet-500 to-indigo-600',
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
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-2xl font-bold text-violet-600">🚀 Portfolio Projects</h2>
        <p className="mb-4 text-sm text-gray-500">
          Manage the website demos shown on the Web &amp; Software page and homepage.
        </p>

        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>
        )}

        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
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
              <p className="mt-2 text-xs text-gray-500">Used when no thumbnail image is set.</p>
            </div>
            <Field label="Thumbnail image (optional)">
              <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              {uploading && <span className="text-sm text-blue-600">Uploading…</span>}
              {form.image && (
                <button type="button" onClick={() => setForm({ ...form, image: '' })} className="mt-1 text-xs text-red-600 underline">
                  Remove image
                </button>
              )}
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Order">
              <input type="number" className={input} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured (shown on homepage)
            </label>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active (visible on site)
            </label>
          </div>

          {/* Live preview */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Live preview</p>
            <div className="max-w-xs">
              <BrowserMock label={form.name || 'Preview'} gradient={form.gradient} image={form.image || null} />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-700">
              {editingId ? 'Update' : 'Add'} project
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="flex-1 rounded-lg bg-gray-400 px-4 py-2 text-white transition hover:bg-gray-500">
                Cancel
              </button>
            )}
          </div>
        </form>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No projects yet — add your first above.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className={`overflow-hidden rounded-lg border transition ${editingId === p.id ? 'border-violet-600 bg-violet-50' : 'border-gray-200'} ${!p.active ? 'opacity-60' : ''}`}>
                <BrowserMock label={p.name} gradient={p.gradient} image={p.image} />
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    {p.featured && <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">Featured</span>}
                    {!p.active && <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">Hidden</span>}
                  </div>
                  <p className="mb-2 text-xs font-medium text-gray-500">{p.category}</p>
                  <p className="mb-3 line-clamp-2 text-sm text-gray-700">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => edit(p)} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">Edit</button>
                    <button onClick={() => toggleActive(p)} className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600">{p.active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => remove(p.id)} className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">Delete</button>
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

const input = 'w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
