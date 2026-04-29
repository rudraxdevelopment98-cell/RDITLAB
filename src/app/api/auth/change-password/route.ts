import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { comparePassword, hashPassword, validatePasswordStrength } from '@/lib/password'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const validation = validatePasswordStrength(newPassword)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: validation.errors },
        { status: 400 }
      )
    }

    // Get admin with password
    const adminData = await prisma.admin.findUnique({
      where: { id: admin.id },
    })

    if (!adminData) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Verify current password
    const passwordCorrect = await comparePassword(currentPassword, adminData.password)
    if (!passwordCorrect) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Hash and update new password
    const hashedPassword = await hashPassword(newPassword)
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'UPDATE',
        entity: 'Admin',
        entityId: admin.id,
        newData: 'Password changed',
      },
    })

    // Send password change notification if configured
    await sendAdminNotification(
      `RD IT Lab Admin Password Changed: ${admin.email}`,
      `Administrator ${admin.email} changed their password on ${new Date().toLocaleString('en-GB')}. If this was not you, please investigate immediately.`,
      `<p>Administrator <strong>${admin.email}</strong> changed their password on <strong>${new Date().toLocaleString('en-GB')}</strong>.</p>`
    )

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
