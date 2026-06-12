import Link from 'next/link';
import { FileText, Globe, BookOpen, Building2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Tax Filing',
    desc: 'Accurate federal and state income tax preparation for individuals, families, and small businesses. We maximize your refund while keeping you fully compliant.',
    items: ['Individual & joint returns', 'Self-employed & freelancer returns', 'Multi-state filing', 'Prior-year amendments'],
    accent: '#2B5CE6',
    iconBg: 'rgba(43,92,230,0.10)',
    iconBorder: 'rgba(43,92,230,0.20)',
    cardGrad: 'linear-gradient(135deg, #F0F4FF 0%, #E8EEFF 100%)',
  },
  {
    icon: Globe,
    title: 'USA VISA',
    desc: 'Expert guidance through U.S. immigration processes — from visa applications and green cards to citizenship and ITIN registration for non-residents.',
    items: ['Visa applications (H-1B, L-1, O-1)', 'Green card & residency filing', 'Citizenship & naturalization', 'ITIN for non-residents'],
    accent: '#C8920E',
    iconBg: 'rgba(200,146,14,0.12)',
    iconBorder: 'rgba(200,146,14,0.25)',
    cardGrad: 'linear-gradient(135deg, #FEFAED 0%, #FAF0D0 100%)',
  },
  {
    icon: BookOpen,
    title: 'Bookkeeping',
    desc: 'Accurate, timely financial recordkeeping that gives you a clear picture of your business health and keeps you ready for tax season year-round.',
    items: ['Monthly reconciliation', 'Financial statements', 'Accounts payable/receivable', 'Payroll processing'],
    accent: '#1A8C55',
    iconBg: 'rgba(26,140,85,0.10)',
    iconBorder: 'rgba(26,140,85,0.20)',
    cardGrad: 'linear-gradient(135deg, #F0FBF5 0%, #E4F7ED 100%)',
  },
  {
    icon: Building2,
    title: 'Startup Company Registration',
    desc: 'Full business formation and compliance services — from choosing the right entity to filing with state and federal agencies so you launch with confidence.',
    items: ['LLC & corporation formation', 'EIN / Tax ID application', 'Articles of incorporation', 'Annual compliance filings'],
    accent: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.10)',
    iconBorder: 'rgba(124,58,237,0.20)',
    cardGrad: 'linear-gradient(135deg, #F5F0FF 0%, #EDE8FF 100%)',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-section-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-heading mt-4 mb-4">
            Comprehensive Tax &amp; Financial Services
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From simple tax returns to immigration consulting and business formation,
            our team of credentialed professionals covers every aspect of your needs.
          </p>
          <hr className="divider-gold w-24 mx-auto mt-8" />
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl p-8 border border-transparent hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              style={{
                background: service.cardGrad,
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px -3px rgba(7,18,40,0.07)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 16px 40px -8px rgba(7,18,40,0.13), 0 0 0 1px ${service.accent}28`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 2px 12px -3px rgba(7,18,40,0.07)';
              }}
            >
              {/* Subtle corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, ${service.accent}25 0%, transparent 70%)`,
                }} />

              {/* Icon */}
              <div className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 w-12 h-12"
                style={{ background: service.iconBg, border: `1px solid ${service.iconBorder}` }}>
                <service.icon className="w-6 h-6" style={{ color: service.accent }} />
              </div>

              <h3 className="font-serif text-2xl font-bold text-navy-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.desc}</p>

              <ul className="space-y-2 mb-6">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: service.accent }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-semibold text-sm transition-all group-hover:gap-2.5"
                style={{ color: service.accent }}
              >
                Learn more <ArrowRight className="w-4 h-4 transition-all" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/services" className="btn-navy inline-flex items-center gap-2">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
