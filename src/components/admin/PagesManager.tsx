'use client'

import { useState, useEffect } from 'react'

interface PageContent {
  id: string
  title: string
  section: string
  content: string
  updatedAt: string
}

export default function PagesManager() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSection, setSelectedSection] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    section: '',
    content: '',
  })

  const sections = ['hero', 'about', 'services', 'contact']

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const url = selectedSection === 'all' 
        ? '/api/pages' 
        : `/api/pages?section=${selectedSection}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch pages')
      const data = await response.json()
      setPages(data)
      setError('')
    } catch (err) {
      setError('Failed to load pages')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (page: PageContent) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      section: page.section,
      content: page.content,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.section || !formData.content) {
      setError('All fields are required')
      return
    }

    try {
      if (editingId) {
        const response = await fetch('/api/pages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        if (!response.ok) throw new Error('Failed to update')
        setEditingId(null)
      } else {
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error('Failed to create')
      }
      setFormData({ title: '', section: '', content: '' })
      await fetchPages()
      setError('')
    } catch (err) {
      setError('Operation failed')
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const response = await fetch(`/api/pages?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      await fetchPages()
      setError('')
    } catch (err) {
      setError('Failed to delete page')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ title: '', section: '', content: '' })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-amber-600">Pages Management</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filter by Section */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSelectedSection('all')
              setSelectedSection('all')
            }}
            className={`px-4 py-2 rounded transition ${
              selectedSection === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded transition capitalize ${
                selectedSection === section
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section *</label>
              <select
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
              >
                <option value="">Select section</option>
                {sections.map(section => (
                  <option key={section} value={section}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
                placeholder="Enter content"
                rows={5}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                {editingId ? 'Update' : 'Create'} Page
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Pages List */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading pages...</div>
        ) : pages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No pages found</div>
        ) : (
          <div className="space-y-3">
            {pages.map(page => (
              <div
                key={page.id}
                className={`p-4 border rounded-lg transition ${
                  editingId === page.id
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{page.title}</h3>
                    <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                      Section: <span className="font-medium">{page.section}</span>
                    </p>
                    <p className="text-gray-700 line-clamp-3">{page.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {new Date(page.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(page)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
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
