import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin) {
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a reset link will be sent.',
      })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/reset-password?token=${token}`

    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      resetLink, // Always include the reset link for testing
    })
  } catch (error) {
    console.error('Request password reset error:', error)
    return NextResponse.json({ error: 'Failed to request password reset' }, { status: 500 })
  }
}
