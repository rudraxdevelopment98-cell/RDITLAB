import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// The OAuth Client ID is public (it's exposed in the browser during sign-in),
// so it's safe to ship as a default. The Client SECRET must stay in an env var.
const DEFAULT_CLIENT_ID = '48459596607-nk6kqfn2e5h1v8g6hfjcg8im41cbe0jb.apps.googleusercontent.com'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', request.url))
  }

  const origin = new URL(request.url).origin
  const redirectUri = `${origin}/api/auth/google/callback`
  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state,
  })

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
  res.cookies.set('g_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  return res
}
