'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import { defaultContent, type SiteCopy } from '@/lib/content'

export default function About({ content }: { content?: SiteCopy['about'] }) {
  const c = content ?? defaultContent.about
  const [expanded, setExpanded] = useState(0)

  return (
    <section id="about" className="relative px-6 py-24 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-[var(--text)] md:text-5xl">
            {c.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{c.intro}</p>
        </Reveal>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — accordion */}
          <Reveal className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {c.items.map((item, index) => {
              const open = expanded === index
              return (
                <div key={item.title}>
                  <button
                    onClick={() => setExpanded(open ? -1 : index)}
                    className="flex w-full items-center justify-between py-5 text-left"
                    aria-expanded={open}
                  >
                    <h3 className="font-display text-lg font-semibold text-[var(--text)]">{item.title}</h3>
                    <span className={`ml-4 text-xl text-[var(--accent)] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {open && (
                    <div className="animate-fadeIn pb-6 pr-6">
                      <p className="leading-relaxed text-muted">{item.content}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </Reveal>

          {/* Right — benefits panel */}
          <Reveal delay={120} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-8 shadow-card">
            <h3 className="font-display text-2xl font-semibold text-[var(--text)]">{c.benefitsTitle}</h3>
            <p className="mt-2 text-muted">{c.benefitsIntro}</p>
            <ul className="mt-6 space-y-3.5">
              {c.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-weak)] text-[var(--accent)]">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-[var(--text)]">{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
