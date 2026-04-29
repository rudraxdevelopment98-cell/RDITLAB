import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePasswordStrength } from '@/lib/password'
import { sendAdminNotification } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }

    const admin = await prisma.admin.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    const validation = validatePasswordStrength(newPassword)
    if (!validation.valid) {
      return NextResponse.json({
        error: 'Password does not meet requirements',
        details: validation.errors,
      }, { status: 400 })
    }

    const hashedPassword = await hashPassword(newPassword)
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Admin',
        entityId: admin.id,
        newData: 'Password reset via email link',
      },
    })

    await sendAdminNotification(
      `RD IT Lab Admin Password Reset: ${admin.email}`,
      `Administrator ${admin.email} reset their password via email link on ${new Date().toLocaleString('en-GB')}.`,
      `<p>Administrator <strong>${admin.email}</strong> reset their password via email link on <strong>${new Date().toLocaleString('en-GB')}</strong>.</p>`
    )

    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
