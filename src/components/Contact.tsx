'use client'

import { useState } from 'react'

export default function Contact() {
  const [expandedFAQ, setExpandedFAQ] = useState(0)
  const [formStatus, setFormStatus] = useState('')

  const faqs = [
    {
      question: 'How quickly can you respond to urgent IT issues?',
      answer: "For critical systems, we offer same-day response through our 24/7 support team. Contact us immediately for urgent needs and we'll prioritize accordingly."
    },
    {
      question: 'Do you provide warranties on repairs and builds?',
      answer: 'Yes, all repairs come with comprehensive warranties, and custom builds include parts and labor guarantees. Details are provided in your service agreement.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'We service commercial and industrial clients throughout the UK with on-site and remote support options available based on your needs.'
    },
    {
      question: 'Can you handle network setups for large offices?',
      answer: 'Absolutely. We design and deploy scalable network infrastructure for businesses of all sizes, with redundancy and security built in from the start.'
    }
  ]

  return (
    <section id="contact" className="pt-24 pb-24 px-6 md:px-12 bg-gradient-to-br from-white via-amber-50 to-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 mb-3">Get in touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Let's Discuss Your IT Needs</h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 mb-16">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-amber-100 bg-white shadow-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">✉</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:rudraxdevelopment98@gmail.com" className="text-amber-600 hover:text-amber-700 transition-colors">
                      rudraxdevelopment98@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a href="tel:+447823912875" className="text-amber-600 hover:text-amber-700 transition-colors">
                      +44 7823912875
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">Harrow, London, UK</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-amber-100">
                <p className="text-gray-600 mb-4">Follow us on Google and Instagram:</p>
                <div className="flex gap-3">
                  <a
                    href="https://share.google/nMMOrlyJNoFbICUL5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    Google Reviews
                  </a>
                  <a
                    href="https://www.instagram.com/rditlab.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-100 bg-white shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Message</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setFormStatus('Thanks for reaching out! We will respond within 24 hours.')
                setTimeout(() => setFormStatus(''), 5000)
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-full border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-full border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Message</label>
                <textarea
                  placeholder="Tell us about your IT needs..."
                  rows={4}
                  className="w-full rounded-3xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-full transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Send Message
              </button>
              {formStatus && (
                <p className="text-center text-amber-700 bg-amber-50 p-3 rounded-full text-sm animate-fadeIn">
                  {formStatus}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-100 bg-white shadow-xl p-10 md:p-12">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-amber-50 transition-colors duration-300"
                >
                  <p className="text-lg font-semibold text-gray-900 text-left">{faq.question}</p>
                  <span
                    className={`text-2xl font-bold text-amber-600 transition-transform duration-300 flex-shrink-0 ml-4 ${
                      expandedFAQ === index ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {expandedFAQ === index && (
                  <div className="animate-fadeIn border-t border-gray-200 px-6 pb-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}