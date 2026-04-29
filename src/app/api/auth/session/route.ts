import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin(request)

    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Get admin details from database
    const adminDetails = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return NextResponse.json({
      authenticated: true,
      admin: adminDetails,
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
