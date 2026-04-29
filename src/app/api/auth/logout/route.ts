import { NextRequest, NextResponse } from 'next/server'
import { clearTokenCookie, getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get current admin for audit log
    const adminPayload = await getCurrentAdmin(request)

    // Clear cookie
    await clearTokenCookie()

    // Log audit
    if (adminPayload) {
      await prisma.auditLog.create({
        data: {
          adminId: adminPayload.id,
          action: 'LOGOUT',
          entity: 'Admin',
          entityId: adminPayload.id,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
