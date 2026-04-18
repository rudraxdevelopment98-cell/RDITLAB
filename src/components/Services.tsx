export default function Services() {
  const services = [
    {
      title: 'Laptop Repair',
      description: 'Professional repair services for laptops, including screen replacement, keyboard fixes, battery replacement, and hardware upgrades.',
      image: 'https://images.unsplash.com/photo-1587614295999-6c1f4c3f5f5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'PC Repair',
      description: 'Comprehensive PC repair solutions, from component replacement to full system diagnostics and optimization.',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'PC Build',
      description: 'Custom PC builds tailored to your specific needs, whether for gaming, workstations, or industrial applications.',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Networking',
      description: 'Setup and maintenance of network infrastructure, including routers, switches, and secure connections.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Lab Setup',
      description: 'Complete lab environment setup with specialized equipment, software installation, and configuration.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Audit',
      description: 'Thorough system audits to identify vulnerabilities, optimize performance, and ensure compliance.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'Software Support',
      description: 'Ongoing software maintenance, updates, troubleshooting, and custom software solutions.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ]

  return (
    <section id="services" className="pt-24 pb-24 px-6 md:px-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Our Services</h2>
          <a href="/services" className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
            View Full Service Page
          </a>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-lg mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-amber-600">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}