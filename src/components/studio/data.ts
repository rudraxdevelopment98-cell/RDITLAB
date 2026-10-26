// Central data for the Web & Software studio (plans, portfolio, templates).
// Edit these arrays to update pricing, add real client demos, or new templates.

export type Plan = {
  name: string
  tagline: string
  price: string
  period?: string
  popular?: boolean
  features: string[]
  cta: string
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'A sharp one-page site to get you online fast.',
    price: 'from £299',
    features: [
      'Single-page responsive website',
      'Mobile + tablet optimised',
      'Contact form & Google Maps',
      'Basic SEO setup',
      '3–5 day delivery',
      '1 revision round',
    ],
    cta: 'Start with Starter',
  },
  {
    name: 'Business',
    tagline: 'A complete multi-page site with a CMS you control.',
    price: 'from £799',
    popular: true,
    features: [
      'Up to 6 pages + blog',
      'Admin dashboard / CMS',
      'SEO + analytics wired in',
      'Custom design & animations',
      '2 week delivery',
      '3 revision rounds',
      '1 month free support',
    ],
    cta: 'Choose Business',
  },
  {
    name: 'Software / App',
    tagline: 'Full-stack web apps & custom software, built to scale.',
    price: 'Custom quote',
    features: [
      'Web app or custom software',
      'Auth, database & dashboards',
      'Third-party integrations & APIs',
      'Cloud deploy (Vercel / cloud)',
      'Security & performance baked in',
      'Ongoing support & maintenance',
    ],
    cta: 'Book a discovery call',
  },
]

export type Project = {
  name: string
  category: string
  description: string
  tags: string[]
  demo: string
  gradient: string
}

// Only real, PUBLIC, ours-to-share work. No private/client projects here.
// Add real client builds from the admin as they go live.
export const projects: Project[] = [
  {
    name: 'RD IT Lab Platform',
    category: 'Web app · CMS',
    description:
      'A full-stack business platform we designed, built and run: editorial UI, light/dark theming, Google-secured admin, and a database-backed CMS for projects, plans and testimonials. The kind of system we build for clients.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    demo: 'https://rditlabuk.vercel.app',
    gradient: 'from-brand-500 to-brand-700',
  },
]

export type Template = {
  name: string
  category: string
  price: string
  description: string
  gradient: string
}

export const templates: Template[] = [
  { name: 'Apex Business', category: 'Business', price: 'Free', description: 'Clean corporate site with services & team sections.', gradient: 'from-brand-500 to-brand-600' },
  { name: 'Folio Minimal', category: 'Portfolio', price: '£49', description: 'Elegant portfolio for creatives and freelancers.', gradient: 'from-slate-600 to-slate-800' },
  { name: 'ShopWave', category: 'E-commerce', price: '£79', description: 'Modern storefront layout with product grid & cart.', gradient: 'from-sky-500 to-blue-600' },
  { name: 'LaunchPad', category: 'SaaS / Landing', price: '£59', description: 'High-converting SaaS landing page with pricing.', gradient: 'from-fuchsia-500 to-purple-600' },
  { name: 'Savoury', category: 'Restaurant', price: '£49', description: 'Restaurant template with menu and reservations.', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Inkwell', category: 'Blog', price: 'Free', description: 'Content-first blog & magazine layout.', gradient: 'from-emerald-500 to-teal-600' },
]
