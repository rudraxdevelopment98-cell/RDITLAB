'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Show success message
    setSubmitted(true)
    // Reset form
    setFormData({ name: '', email: '', service: '', message: '' })
    // Hide message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      details: 'rudraxdevelopment98@gmail.com',
      description: 'We respond to all inquiries within 24 hours'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+44 7823912875',
      description: 'Call for urgent support and inquiries'
    },
    {
      icon: '📍',
      title: 'Location',
      details: 'Harrow, London, UK',
      description: 'Serving London and surrounding areas online and on-site'
    },
    {
      icon: '🕐',
      title: 'Business Hours',
      details: 'Mon-Sat: 8am-10pm',
      description: '24/7 emergency support available (charges apply)'
    }
  ]

  const services = [
    'Network Infrastructure Design',
    'Managed Networking & Security',
    'Laptop & PC Repair',
    'Custom PC Builds & Workstations',
    'Lab Setup & IT Environments',
    'IT Audit & Compliance',
    'Software Deployment & Support'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-gray-100 text-gray-900">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-50 to-white px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="animate-fadeIn space-y-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700 shadow-sm">
                Get in Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Contact RD IT Lab UK
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-700 leading-relaxed">
                Have questions about our services? Need urgent support? Reach out to us anytime. We handle laptop repairs, PC builds, data recovery, and more with quick turnaround and professional service.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="mx-6 md:mx-12 my-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border border-amber-100 shadow-lg p-6 text-center transition hover:-translate-y-2 hover:shadow-xl animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-amber-600 font-semibold mb-3">{info.details}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </section>

        {/* Contact Form & Info Grid */}
        <section className="mx-6 md:mx-12 mb-16 grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-slideDown">
                <p className="text-green-800 font-semibold">✓ Message sent successfully! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Your name"
                />
              </div>

              <div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="your@email.com"
                />
              </div>

              <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Service Type</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Select a service...</option>
                  {services.map((service, idx) => (
                    <option key={idx} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div className="animate-fadeIn" style={{ animationDelay: '250ms' }}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  placeholder="Tell us about your needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold transition hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: '300ms' }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12 animate-slideInRight">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why contact us?</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-2xl text-amber-600">→</span>
                  <div>
                    <p className="font-semibold text-gray-900">Quick Consultation</p>
                    <p className="text-sm">Discuss your IT needs with our experts</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl text-amber-600">→</span>
                  <div>
                    <p className="font-semibold text-gray-900">Support Request</p>
                    <p className="text-sm">Get help with repairs, networking, or setup</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl text-amber-600">→</span>
                  <div>
                    <p className="font-semibold text-gray-900">Service Inquiry</p>
                    <p className="text-sm">Learn more about a specific service offering</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl text-amber-600">→</span>
                  <div>
                    <p className="font-semibold text-gray-900">Emergency Support</p>
                    <p className="text-sm">Call us 24/7 for urgent network or system issues</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-amber-50 border border-amber-100 p-8 md:p-12 animate-slideInRight" style={{ animationDelay: '100ms' }}>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">Response Time</h3>
              <div className="space-y-3 text-amber-900">
                <p><strong>Email:</strong> Within 24 hours</p>
                <p><strong>Phone:</strong> Immediate for urgent support</p>
                <p><strong>Emergency:</strong> On-call 24/7</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Coverage */}
        <section className="mx-6 md:mx-12 mb-16 rounded-[2rem] bg-white border border-amber-100 shadow-xl p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Services We Support</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-6 transition hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <p className="text-gray-900 font-semibold">{service}</p>
                  <p className="text-xs text-amber-600 mt-2">→ Click to inquire</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
