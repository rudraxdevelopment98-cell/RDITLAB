import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword } from '@/lib/password'
import { generateToken, setTokenCookie } from '@/lib/auth'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin) {
      // Don't reveal if user exists (security best practice)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Compare passwords
    const passwordMatches = await comparePassword(password, admin.password)
    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })

    // Set cookie
    await setTokenCookie(token)

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN',
        entity: 'Admin',
        entityId: admin.id,
      },
    })

    // Send login notification if configured
    const ipAddress =
      request.headers.get('x-forwarded-for') || 'unknown IP address'
    await sendAdminNotification(
      `RD IT Lab Admin Login: ${admin.email}`,
      `Administrator ${admin.email} logged in on ${new Date().toLocaleString('en-GB')} from ${ipAddress}.`,
      `<p>Administrator <strong>${admin.email}</strong> logged in on <strong>${new Date().toLocaleString('en-GB')}</strong> from <strong>${ipAddress}</strong>.</p>`
    )

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
