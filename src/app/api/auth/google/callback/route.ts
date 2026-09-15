import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { generateToken, isAllowedAdminEmail } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const JWT_EXPIRY_HOURS = parseInt(process.env.JWT_EXPIRY || '24')

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookieState = request.cookies.get('g_oauth_state')?.value

  const fail = (reason: string) => NextResponse.redirect(new URL(`/login?error=${reason}`, request.url))

  if (!code) return fail('missing_code')
  if (!state || !cookieState || state !== cookieState) return fail('bad_state')

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return fail('google_not_configured')

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenRes.ok) return fail('token_exchange_failed')
    const tokens = await tokenRes.json()

    // 2. Fetch the user's Google profile
    const infoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    if (!infoRes.ok) return fail('userinfo_failed')
    const profile = await infoRes.json()

    const email: string | undefined = profile.email
    if (!email || profile.email_verified === false) return fail('email_unverified')

    // 3. Enforce the admin allowlist
    if (!isAllowedAdminEmail(email)) return fail('not_authorized')

    // 4. Upsert the admin record (password is unusable — Google is the only way in)
    const admin = await prisma.admin.upsert({
      where: { email: email.toLowerCase() },
      update: { name: profile.name ?? undefined },
      create: {
        email: email.toLowerCase(),
        name: profile.name ?? email.split('@')[0],
        password: `google_oauth_${crypto.randomBytes(24).toString('hex')}`,
        role: 'admin',
      },
    })

    // 5. Issue the same JWT session cookie the rest of the app expects
    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role })
    const res = NextResponse.redirect(new URL('/admin', request.url))
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRY_HOURS * 60 * 60,
      path: '/',
    })
    res.cookies.set('g_oauth_state', '', { maxAge: 0, path: '/' })

    await prisma.auditLog.create({
      data: { adminId: admin.id, action: 'login', entity: 'Admin', entityId: admin.id, newData: JSON.stringify({ via: 'google', email }) },
    }).catch(() => {})

    return res
  } catch (e) {
    console.error('Google OAuth callback error:', e)
    return fail('oauth_error')
  }
}
