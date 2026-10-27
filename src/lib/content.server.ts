import { prisma } from '@/lib/prisma'
import { defaultContent, type SiteCopy } from '@/lib/content'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

/** Read all stored sections and deep-merge (one level) over the defaults. */
export async function getSiteContent(): Promise<SiteCopy> {
  const merged = clone(defaultContent) as Record<string, any>
  try {
    const rows = await prisma.siteContent.findMany()
    for (const row of rows) {
      if (!(row.key in merged)) continue
      try {
        const parsed = JSON.parse(row.value)
        if (parsed && typeof parsed === 'object') {
          merged[row.key] = { ...merged[row.key], ...parsed }
        }
      } catch {
        // ignore malformed rows — fall back to defaults for that section
      }
    }
  } catch {
    // DB unavailable — defaults are already in `merged`
  }
  return merged as SiteCopy
}
