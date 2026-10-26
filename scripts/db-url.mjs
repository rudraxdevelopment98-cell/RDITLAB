// Resolves the Postgres connection string from whichever env var the Vercel
// Neon integration provides, and pins our app to its OWN schema ("rditlab")
// so we never collide with or drop tables another app keeps in "public".
// Prefers a DIRECT (non-pooled) URL — needed for DDL (prisma db push) and
// safe/simple for this app's low traffic at runtime.
const candidates = [
  process.env.DATABASE_URL_UNPOOLED,
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.DATABASE_URL,
  process.env.POSTGRES_PRISMA_URL,
  process.env.POSTGRES_URL,
  process.env.NEON_DATABASE_URL,
]

let url = candidates.find((u) => u && u.trim().length > 0) || ''

if (url) {
  // Prisma + pgbouncer flag breaks db push; drop it (we use a direct URL).
  url = url.replace(/([?&])pgbouncer=true&?/i, '$1').replace(/[?&]$/, '')
  if (!/[?&]schema=/.test(url)) {
    url += (url.includes('?') ? '&' : '?') + 'schema=rditlab'
  }
}

process.stdout.write(url)
