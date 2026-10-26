'use client'

import { useState, useEffect } from 'react'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  createdAt: string
  updatedAt: string
}

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/team', { credentials: 'include' })
      if (!response.ok) throw new Error('Failed to fetch team')
      const data = await response.json()
      setTeam(data)
      setError('')
    } catch (err) {
      setError('Failed to load team members')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setFormData(prev => ({ ...prev, image: data.url }))
      setError('')
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.role || !formData.bio || !formData.image) {
      setError('All fields are required, including an image')
      return
    }

    try {
      if (editingId) {
        const response = await fetch('/api/team', {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        if (!response.ok) throw new Error('Failed to update')
        setEditingId(null)
      } else {
        const response = await fetch('/api/team', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        if (!response.ok) throw new Error('Failed to create')
      }
      setFormData({ name: '', role: '', bio: '', image: '' })
      await fetchTeam()
      setError('')
    } catch (err) {
      setError('Operation failed')
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const response = await fetch(`/api/team?id=${id}`, { method: 'DELETE', credentials: 'include' })
      if (!response.ok) throw new Error('Failed to delete')
      await fetchTeam()
      setError('')
    } catch (err) {
      setError('Failed to delete team member')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', role: '', bio: '', image: '' })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 shadow-card">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--text)] mb-4">Team Members Management</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-weak)] p-3 text-sm text-[var(--accent-ink)]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:brand-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Role / Position *</label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:brand-500"
                placeholder="e.g., Lead Technician, Support Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Bio / Description *</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:brand-500"
                placeholder="Enter team member bio"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">Profile Image *</label>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg"
                />
                {uploadingImage && <span className="text-[var(--accent-ink)]">Uploading...</span>}
              </div>
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-muted mb-2">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-[var(--border)]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
              >
                {editingId ? 'Update' : 'Add'} Team Member
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 font-medium text-[var(--text)] transition hover:border-[var(--border-strong)]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Team List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted">Loading team members...</div>
        ) : team.length === 0 ? (
          <div className="text-center py-8 text-muted">No team members found</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {team.map(member => (
              <div
                key={member.id}
                className={`border rounded-lg overflow-hidden transition ${
                  editingId === member.id
                    ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border)] hover:border-brand-300'
                }`}
              >
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-[var(--text)] text-lg">{member.name}</h3>
                  <p className="text-sm text-brand-600 font-medium mb-2">{member.role}</p>
                  <p className="text-muted text-sm line-clamp-3 mb-3">{member.bio}</p>
                  <p className="text-xs text-muted mb-4">
                    Updated: {new Date(member.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-medium text-white transition hover:bg-[var(--accent-ink)]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 rounded-full px-3 py-1 text-sm font-medium text-muted transition hover:text-[var(--accent-ink)]"
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
