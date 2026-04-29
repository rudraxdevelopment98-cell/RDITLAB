'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [resetLink, setResetLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setResetLink('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Unable to send reset email')
      } else {
        setMessage(data.message || 'Reset link generated successfully.')
        if (data.resetLink) {
          setResetLink(data.resetLink)
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-600">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your admin email to receive a reset link.</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-2xl p-8 md:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{message}</p>
              {resetLink && (
                <div className="mt-3 p-3 bg-white border rounded">
                  <p className="text-sm text-gray-600 mb-2">Your password reset link:</p>
                  <a href={resetLink} className="text-blue-600 hover:text-blue-800 break-all text-sm">
                    {resetLink}
                  </a>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="admin@rditlab.co.uk"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
