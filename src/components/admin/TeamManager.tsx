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
      const response = await fetch('/api/team')
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        if (!response.ok) throw new Error('Failed to update')
        setEditingId(null)
      } else {
        const response = await fetch('/api/team', {
          method: 'POST',
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
      const response = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
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
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-amber-600">Team Members Management</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role / Position *</label>
              <input
                type="text"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
                placeholder="e.g., Lead Technician, Support Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Description *</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:amber-500"
                placeholder="Enter team member bio"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image *</label>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />
                {uploadingImage && <span className="text-blue-600">Uploading...</span>}
              </div>
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                {editingId ? 'Update' : 'Add'} Team Member
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

        {/* Team List */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading team members...</div>
        ) : team.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No team members found</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {team.map(member => (
              <div
                key={member.id}
                className={`border rounded-lg overflow-hidden transition ${
                  editingId === member.id
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
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
                  <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-sm text-amber-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-3">{member.bio}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Updated: {new Date(member.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
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
