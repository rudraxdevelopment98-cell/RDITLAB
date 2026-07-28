'use client'

import { useState, useEffect } from 'react'

interface Plan {
  id: string
  name: string
  tagline: string
  price: string
  period: string
  features: string
  cta: string
  popular: boolean
  order: number
  active: boolean
  updatedAt: string
}

const empty = {
  name: '',
  tagline: '',
  price: '',
  period: '',
  features: '',
  cta: 'Get started',
  popular: false,
  active: true,
  order: 0,
}

export default function PlansManager() {
  const [items, setItems] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/plans?all=1', { credentials: 'include' })
      if (!res.ok) throw new Error()
      setItems(await res.json())
      setError('')
    } catch {
      setError('Failed to load plans')
    } finally {
      setIsLoading(false)
    }
  }

  const edit = (p: Plan) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      tagline: p.tagline,
      price: p.price,
      period: p.period,
      features: p.features,
      cta: p.cta,
      popular: p.popular,
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
    if (!form.name || !form.tagline || !form.price) {
      setError('Name, tagline and price are required')
      return
    }
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/plans', {
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

  const toggleActive = async (p: Plan) => {
    await fetch('/api/plans', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    await fetch(`/api/plans?id=${id}`, { method: 'DELETE', credentials: 'include' })
    load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-1 text-2xl font-bold text-violet-600">💷 Pricing Plans</h2>
        <p className="mb-4 text-sm text-gray-500">Manage the plans shown on the Web &amp; Software page.</p>

        {error && <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">{error}</div>}

        <form onSubmit={submit} className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Plan name *">
              <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Business" />
            </Field>
            <Field label="Tagline *">
              <input className={input} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short one-line summary" />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Price *">
              <input className={input} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="from £799" />
            </Field>
            <Field label="Period (optional)">
              <input className={input} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="/mo" />
            </Field>
            <Field label="Button text">
              <input className={input} value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} placeholder="Choose Business" />
            </Field>
          </div>

          <Field label="Features (one per line)">
            <textarea className={input} rows={6} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder={'Up to 6 pages + blog\nAdmin dashboard / CMS\nSEO + analytics'} />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Order">
              <input type="number" className={input} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </Field>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
              Most popular (highlighted)
            </label>
            <label className="flex items-center gap-2 pt-8 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active (visible on site)
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-violet-600 px-4 py-2 text-white transition hover:bg-violet-700">
              {editingId ? 'Update' : 'Add'} plan
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
          <div className="py-8 text-center text-gray-500">No plans yet — add your first above.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className={`rounded-lg border p-5 transition ${editingId === p.id ? 'border-violet-600 bg-violet-50' : 'border-gray-200'} ${!p.active ? 'opacity-60' : ''}`}>
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                  {p.popular && <span className="rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">Popular</span>}
                  {!p.active && <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">Hidden</span>}
                </div>
                <p className="text-xl font-bold text-violet-600">{p.price} <span className="text-sm font-normal text-gray-500">{p.period}</span></p>
                <p className="mb-2 mt-1 text-sm text-gray-600">{p.tagline}</p>
                <ul className="mb-3 space-y-1 text-sm text-gray-700">
                  {p.features.split('\n').filter(Boolean).slice(0, 4).map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => edit(p)} className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">Edit</button>
                  <button onClick={() => toggleActive(p)} className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600">{p.active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => remove(p.id)} className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">Delete</button>
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
