/**
 * Editable copy for the public home page. Each top-level key is stored as one
 * row in the SiteContent table (value = JSON). getSiteContent() (in
 * content.server.ts) deep-merges the stored values over these defaults.
 *
 * This module is pure data + types with NO server imports, so it is safe to
 * import from client components (Footer, About, Contact, the admin editor).
 */

export type CtaLink = { label: string; href: string }
export type Stat = { value: string; label: string }
export type NamedText = { title: string; content: string }
export type ServiceItem = { icon: string; title: string; description: string }
export type Faq = { question: string; answer: string }

export type SiteCopy = {
  hero: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    body: string
    primaryCta: CtaLink
    secondaryCta: CtaLink
    panelLabel: string
    panelValue: string
    credential: string
    stats: Stat[]
  }
  about: {
    eyebrow: string
    heading: string
    intro: string
    items: NamedText[]
    benefitsTitle: string
    benefitsIntro: string
    benefits: string[]
  }
  services: {
    eyebrow: string
    headingLead: string
    headingAccent: string
    body: string
    items: ServiceItem[]
    ctaTitle: string
    ctaBody: string
    ctaLink: string
    supportLabel: string
    support: string[]
  }
  contact: {
    eyebrow: string
    heading: string
    intro: string
    email: string
    phone: string
    location: string
    googleUrl: string
    instagramUrl: string
    faqs: Faq[]
  }
  footer: {
    tagline: string
    email: string
    phone: string
    location: string
    googleUrl: string
    instagramUrl: string
    note: string
  }
}

export const SITE_SECTIONS: (keyof SiteCopy)[] = ['hero', 'about', 'services', 'contact', 'footer']

export const defaultContent: SiteCopy = {
  hero: {
    eyebrow: 'AI · Automation · Software',
    titleLead: 'We build the software, AI &',
    titleAccent: 'automation your business runs on.',
    body: 'RD IT Lab UK is a studio for custom software, AI agents, automation and digitalization — helping businesses work smarter. And our IT team keeps your hardware and networks running.',
    primaryCta: { label: 'See our work', href: '/web-development' },
    secondaryCta: { label: 'Get a quote', href: '/contact' },
    panelLabel: 'What we deliver',
    panelValue: 'AI · Automation · Software · Web',
    credential: 'Certified cybersecurity professionals · Harrow, London',
    stats: [
      { value: '4.5+', label: 'Years experience' },
      { value: '1–4', label: 'Day turnaround' },
      { value: '24/7', label: 'Support available' },
      { value: 'UK', label: 'Based & registered' },
    ],
  },
  about: {
    eyebrow: 'About us',
    heading: 'A software studio with an engineer’s discipline.',
    intro: 'We design, build and run the digital systems businesses depend on — then stay on to keep them sharp.',
    items: [
      { title: 'What we do', content: 'Custom software, AI agents, automation and websites — the digital backbone of your business, built end to end.' },
      { title: 'How we work', content: 'Clear scope, honest timelines and direct communication. You talk to the people building your product, not a call centre.' },
      { title: 'Our background', content: '4.5+ years across the UK and India delivering software, secure infrastructure and IT — led by certified cybersecurity professionals.' },
      { title: 'What you get', content: 'Reliable, secure, maintainable systems — transparent pricing, real warranties and a genuine long-term partnership.' },
    ],
    benefitsTitle: 'Why businesses choose RD IT Lab UK',
    benefitsIntro: 'Engineering depth, security by default, and a team that treats your business like its own.',
    benefits: [
      'Software, AI & automation built in-house',
      'Security-first — certified cybersecurity team',
      'Fast, predictable delivery',
      'Modern, scalable, maintainable stack',
      'Clear pricing and real warranties',
      'Ongoing support after launch',
    ],
  },
  services: {
    eyebrow: 'What we do',
    headingLead: 'Software, AI & automation —',
    headingAccent: 'that move your business forward.',
    body: 'We design and build the digital tools your business runs on. And when hardware needs attention, our IT team keeps everything running.',
    items: [
      { icon: 'ai', title: 'AI Agents', description: 'Custom AI assistants and chatbots wired into your tools, docs and data — answering, triaging and acting for you.' },
      { icon: 'automation', title: 'Automation & Workflows', description: 'We remove the repetitive work — connect your apps, automate pipelines and let data flow without manual steps.' },
      { icon: 'software', title: 'Custom Software', description: 'Full-stack web apps, dashboards and internal tools — auth, databases and integrations, built to scale.' },
      { icon: 'web', title: 'Websites & Web Apps', description: 'Fast, modern, conversion-focused sites — from landing pages to full platforms with a CMS you control.' },
      { icon: 'digital', title: 'Digitalization', description: 'Take your business paperless — digitise processes, records and operations into one secure system.' },
    ],
    ctaTitle: 'Have an idea?',
    ctaBody: 'Tell us the problem — we’ll scope the software, AI or automation to solve it.',
    ctaLink: '/contact',
    supportLabel: 'Also — IT support & hardware',
    support: ['Laptop & PC repair', 'Custom PC builds', 'Networking & setup', 'Lab setup', 'Security audits', '24/7 emergency support'],
  },
  contact: {
    eyebrow: 'Get in touch',
    heading: 'Let’s build something that lasts.',
    intro: 'Tell us what you’re trying to achieve. We’ll come back within 24 hours with a clear next step.',
    email: 'rudraxdevelopment98@gmail.com',
    phone: '+44 7823 912875',
    location: 'Harrow, London, UK',
    googleUrl: 'https://share.google/nMMOrlyJNoFbICUL5',
    instagramUrl: 'https://www.instagram.com/rditlab.uk',
    faqs: [
      { question: 'What kind of projects do you take on?', answer: 'Custom software, web apps, AI agents, automation and websites — from a single landing page to a full business platform. We also provide IT support and hardware services.' },
      { question: 'How do projects usually start?', answer: 'With a short discovery call. We map the problem, the users and the outcome, then come back with a clear scope, timeline and fixed or staged pricing.' },
      { question: 'Do you support what you build after launch?', answer: 'Yes. We deploy, monitor and keep improving — with support and maintenance options so your systems stay secure and current.' },
      { question: 'What areas do you serve?', answer: 'We’re based in Harrow, London and work with clients across the UK, with remote delivery and on-site visits where needed.' },
    ],
  },
  footer: {
    tagline: 'A UK software studio for AI, automation and web — with a security-first IT team behind every build.',
    email: 'rudraxdevelopment98@gmail.com',
    phone: '+44 7823 912875',
    location: 'Harrow, London, UK',
    googleUrl: 'https://share.google/nMMOrlyJNoFbICUL5',
    instagramUrl: 'https://www.instagram.com/rditlab.uk',
    note: 'Built in the UK.',
  },
}

