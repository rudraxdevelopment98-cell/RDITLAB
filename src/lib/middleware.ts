import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export async function withAuth(request: NextRequest, handler: Function) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Add payload to request for handler to use
    ;(request as any).admin = payload

    // Call handler
    return handler(request)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function withAdminRole(request: NextRequest, handler: Function) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    ;(request as any).admin = payload
    return handler(request)
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
