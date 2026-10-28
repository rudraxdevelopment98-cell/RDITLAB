import { prisma } from '@/lib/prisma'
import { launches as defaultLaunches, type Launch } from '@/lib/launches'

const split = (value: string, sep: string) =>
  (value || '').split(sep).map((s) => s.trim()).filter(Boolean)

function mapRow(r: any): Launch {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    tagline: r.tagline,
    description: r.description,
    features: split(r.features, '\n'),
    stack: split(r.stack, ','),
    liveUrl: r.liveUrl ? r.liveUrl : null,
    liveLabel: r.liveLabel || undefined,
    duration: r.duration || 0,
    accent: r.accent || '#b45309',
    videoUrl: r.videoUrl || undefined,
    previewUrl: r.previewUrl || undefined,
    posterUrl: r.posterUrl || undefined,
  }
}

/** Active launches from the DB, falling back to the built-in defaults. */
export async function getLaunches(): Promise<Launch[]> {
  try {
    const rows = await prisma.launch.findMany({
      where: { active: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    if (rows.length === 0) return defaultLaunches
    return rows.map(mapRow)
  } catch {
    return defaultLaunches
  }
}
