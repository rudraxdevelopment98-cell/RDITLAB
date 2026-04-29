import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY || '24')

export interface JwtPayload {
  id: string
  email: string
  role: string
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${JWT_EXPIRY}h`,
    algorithm: 'HS256',
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Set JWT token in HTTP-only cookie
 */
export async function setTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: JWT_EXPIRY * 60 * 60, // Convert hours to seconds
    path: '/',
  })
}

/**
 * Clear JWT token from cookie
 */
export async function clearTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

/**
 * Get token from cookie
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  return token || null
}

/**
 * Get current admin from token
 */
export async function getCurrentAdmin(): Promise<JwtPayload | null> {
  const token = await getTokenFromCookie()
  if (!token) return null
  return verifyToken(token)
}
