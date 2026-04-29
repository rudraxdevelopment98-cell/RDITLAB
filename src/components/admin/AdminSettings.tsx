'use client'

import { useState, useEffect } from 'react'

export default function AdminSettings() {
  const [adminEmail, setAdminEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' }

    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*]/.test(password)) strength++

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
    const colors = ['', 'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-lime-200', 'bg-green-200']

    return {
      strength,
      label: labels[strength],
      color: colors[strength],
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  useEffect(() => {
    async function loadAdminSession() {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setAdminEmail(data.admin?.email || '')
        }
      } catch (error) {
        console.error('Failed to load admin session', error)
      }
    }

    loadAdminSession()
  }, [])

  const validateNewPassword = () => {
    if (!currentPassword) {
      setError('Current password is required')
      return false
    }
    if (!newPassword) {
      setError('New password is required')
      return false
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Password must contain uppercase letters and numbers')
      return false
    }
    return true
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateNewPassword()) return

    try {
      setLoading(true)
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to change password')
        return
      }

      setSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError('An error occurred while changing password')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Settings Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage your admin account and security settings</p>
        {adminEmail && (
          <p className="text-sm text-gray-500 mt-2">
            Signed in as <strong>{adminEmail}</strong>
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* Change Password Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-900"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {passwordStrength.label}
                  </span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 ml-2">
                  <li>✓ At least 8 characters</li>
                  <li className={newPassword.length >= 12 ? '✓ text-green-600' : ''}>
                    • 12+ characters for stronger security
                  </li>
                  <li className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? '✓ text-green-600' : ''}>
                    • Mix of uppercase and lowercase
                  </li>
                  <li className={/\d/.test(newPassword) ? '✓ text-green-600' : ''}>
                    • Contains numbers
                  </li>
                  <li className={/[!@#$%^&*]/.test(newPassword) ? '✓ text-green-600' : ''}>
                    • Special characters (optional but recommended)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-green-600 text-sm mt-1">✓ Passwords match</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? '🔄 Updating...' : '🔐 Change Password'}
          </button>
        </form>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">🔒 Security Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1 ml-4 list-disc">
          <li>Use a unique password not used on other websites</li>
          <li>Never share your password with anyone, including support staff</li>
          <li>Your password is securely hashed and stored in the database</li>
          <li>We recommend changing your password every 90 days</li>
          <li>All login attempts are logged in the Audit Logs for security</li>
        </ul>
      </div>
    </div>
  )
}
