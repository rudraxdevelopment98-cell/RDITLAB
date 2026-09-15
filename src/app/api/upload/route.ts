import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { put } from '@vercel/blob'
import { getCurrentAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const ALLOWED = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]
const MAX_BYTES = 25 * 1024 * 1024 // 25 MB (presentations can be large)

export async function POST(request: NextRequest) {
  try {
    // Uploads are an admin-only action.
    const admin = await getCurrentAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (file.type && !ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds 25MB limit' }, { status: 400 })
    }

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]+/g, '-')}`

    // Prefer Vercel Blob (persists on serverless). Falls back to local disk in dev.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${safeName}`, file, {
        access: 'public',
        addRandomSuffix: false,
      })
      return NextResponse.json({ success: true, url: blob.url, filename: safeName })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const uploadDir = join(process.cwd(), 'public/uploads')
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, safeName), bytes)
    return NextResponse.json({ success: true, url: `/uploads/${safeName}`, filename: safeName })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
