/**
 * Products RD IT Lab has designed, built and launched.
 *
 * Each product ships with a launch film (full walkthrough) and a short preview
 * loop, both in /public/products. The films use invented demo data only — no
 * real customer, sales or account information appears in them.
 */
export type Launch = {
  slug: string
  name: string
  category: string
  tagline: string
  description: string
  /** Shown as chips; keep each to a few words. */
  features: string[]
  stack: string[]
  /** Public URL, or null for private tools that sit behind a sign-in. */
  liveUrl: string | null
  liveLabel?: string
  /** Seconds — shown on the play button. */
  duration: number
  /** Accent used for the card edge and play button. */
  accent: string
}

export const launches: Launch[] = [
  {
    slug: 'mahadev-apf',
    name: 'Mahadev APF',
    category: 'Showroom website + GST billing',
    tagline: 'A cinematic showroom website with its own billing back office.',
    description:
      'A dark-and-gold website for a furniture, aluminium and glass workshop, paired with a private admin that prices jobs, raises GST tax invoices, tracks payments and runs the website content.',
    features: [
      'Cinematic hero & preloader',
      'Filterable product catalogue',
      'Gallery with lightbox',
      'WhatsApp enquiries',
      'Job estimator',
      'GST tax invoices',
      'Payments & dues',
      'Rate list',
      'Sales reports',
      'Reviews & enquiries',
      'Role-based access',
    ],
    stack: ['Next.js 15', 'Prisma', 'PostgreSQL', 'Framer Motion', 'Vercel Blob'],
    liveUrl: 'https://mahadev-apf.vercel.app',
    duration: 113,
    accent: '#d4af37',
  },
  {
    slug: 'jaykavi',
    name: 'JAYKAVI',
    category: 'Artist archive + content studio',
    tagline: 'The songs, lyrics and journey of a Gujarati lyricist, with a studio behind it.',
    description:
      'A song archive with Gujarati lyrics and one-tap English translation, singers, collections and a career timeline — run from a studio that harvests YouTube uploads, tracks views, keeps a notebook and backs everything up nightly.',
    features: [
      'Song archive search',
      'Gujarati lyrics & translator',
      'YouTube carousel',
      'Song requests',
      '⌘K command palette',
      'Dark & light',
      'Analytics',
      'YouTube harvester',
      'Rich-text notebook',
      'Theme skins',
      'Google Sheets backup',
    ],
    stack: ['Next.js', 'Prisma', 'Neon Postgres', 'Tiptap', 'Cloudinary'],
    liveUrl: 'https://jaykavi.vercel.app',
    duration: 113,
    accent: '#22e1e1',
  },
  {
    slug: 'mobile-icu',
    name: 'MOBILE ICU',
    category: 'Trade-only wholesale store',
    tagline: 'A wholesale store where prices unlock only for approved trade accounts.',
    description:
      'A storefront for a UK wholesaler of phone and laptop parts. Visitors browse the full range; trade customers apply, get approved, then see wholesale prices, order from a cart drawer and pay on account.',
    features: [
      'Trade-locked pricing',
      'Approval-based accounts',
      'Category browsing',
      'Filters & sorting',
      'Instant search',
      'Collections',
      'Stock badges',
      'Cart drawer',
      'Pay on account',
      'Mobile ready',
    ],
    stack: ['Next.js', 'Headless Shopify', 'Tailwind CSS'],
    liveUrl: 'https://store.mobileicu.co.uk/shop',
    duration: 83,
    accent: '#e3122d',
  },
  {
    slug: 'dudao',
    name: 'DUDAO',
    category: 'Trade counter portal',
    tagline: 'Till, invoices, stock and staff for a trade counter, in one portal.',
    description:
      'A staff back office for a trade counter: a barcode till that switches price tier by customer, PDF invoices shared on WhatsApp, customer ledgers, online orders, five-tier inventory with label printing and nine staff permissions.',
    features: [
      'Barcode till',
      'Multi-tier pricing',
      'PDF invoices',
      'WhatsApp sharing',
      'Customer ledgers',
      'Online orders',
      'Excel import',
      'Label printing',
      'Staff permissions',
      'Shift clock-in',
      'Light & dark',
    ],
    stack: ['Next.js 16', 'NextAuth', 'Prisma', 'PostgreSQL', 'jsPDF'],
    liveUrl: null,
    liveLabel: 'Private staff portal',
    duration: 99,
    accent: '#5b53e0',
  },
]

export const launchVideo = (slug: string) => `/products/${slug}.mp4`
export const launchPreview = (slug: string) => `/products/${slug}-preview.mp4`
export const launchPoster = (slug: string) => `/products/${slug}.jpg`

export const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
