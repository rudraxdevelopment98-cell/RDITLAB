import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function normalizeDatabaseUrl() {
  let databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    databaseUrl = 'file:./prisma/dev.db'
  }

  const isSqliteUrl = databaseUrl.startsWith('file:') || databaseUrl.startsWith('./') || databaseUrl.startsWith('/')
  const isKnownProtocol = /^(file:|postgresql:|mysql:|mongodb:|sqlserver:)/.test(databaseUrl)

  if (!isKnownProtocol && isSqliteUrl) {
    databaseUrl = `file:${databaseUrl}`
  }

  process.env.DATABASE_URL = databaseUrl
}

normalizeDatabaseUrl()

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
