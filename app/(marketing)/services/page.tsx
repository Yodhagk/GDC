import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Globe, BookOpen, Building2, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore the full range of services at Golden Dollar Consultancy — tax filing, immigration, bookkeeping, and company registrations.',
};

const services = [
  {
    id: 'tax-filing',
    icon: FileText,
    title: 'Tax Filing & Preparation',
    subtitle: 'Individual, Joint & Business Returns',
    desc: 'We handle the full spectrum of federal and state tax preparation — from simple W-2 returns to complex multi-state and self-employment filings. Our goal is always to maximize your refund while keeping you fully compliant.',
    features: [
      'Individual & joint income tax returns (1040)',
      'Self-employed & freelancer returns (Schedule C)',
      'S-Corp, C-Corp & partnership returns',
      'Multi-state & non-resident filings',
      'Prior-year and amended returns (1040-X)',
      'Estimated quarterly tax payments',
    ],
    color: 'navy',
  },
  {
    id: 'immigration',
    icon: Globe,
    title: 'USA VISA',
    subtitle: 'Visa, Green Card & Citizenship Support',
    desc: 'Navigating U.S. immigration law is complex. Our experienced consultants guide individuals, families, and businesses through every step — from visa applications to green cards and citizenship — with accuracy and care.',
    features: [
      'Visa applications (H-1B, L-1, O-1, EB series)',
      'Green card & permanent residency filing',
      'Citizenship & naturalization assistance',
      'Family-based immigration petitions',
      'Work authorization & EAD renewal',
      'ITIN applications for non-residents',
    ],
    color: 'gold',
  },
  {
    id: 'bookkeeping',
    icon: BookOpen,
    title: 'Bookkeeping & Accounting',
    subtitle: 'Accurate Books, Clear Financials',
    desc: 'Accurate bookkeeping is the foundation of sound financial health. Our bookkeepers maintain your records monthly, giving you real-time visibility into your business finances and making tax season effortless.',
    features: [
      'Monthly bank & credit card reconciliation',
      'Profit & loss statements',
      'Balance sheet preparation',
      'Accounts payable & receivable',
      'Payroll processing & filings',
      'Year-end financial package',
    ],
    color: 'navy',
  },
  {
    id: 'company-registrations',
    icon: Building2,
    title: 'Startup Company Registration',
    subtitle: 'Business Formation & Compliance',
    desc: 'Starting a business in the U.S. requires the right structure from day one. We handle the full registration process — from choosing the right entity type to filing with state and federal agencies — so you can launch with confidence.',
    features: [
      'LLC & corporation formation',
      'EIN / Tax ID number application',
      'Articles of incorporation filing',
      'Registered agent services',
      'Business license & permit guidance',
      'Annual compliance filings',
    ],
    color: 'gold',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-800 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag">Our Expertise</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-4">
            Full-Spectrum Tax Services
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            From your first tax return to complex IRS negotiations, our certified professionals
            provide expert guidance at every stage of your financial journey.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((service, i) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mb-5">
                  <service.icon className="w-7 h-7 text-gold-500" />
                </div>
                <p className="text-gold-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  {service.subtitle}
                </p>
                <h2 className="section-heading mb-4">{service.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
                <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`bg-gray-50 rounded-2xl p-8 border border-gray-100 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h3 className="font-semibold text-navy-800 mb-5 text-sm uppercase tracking-wide">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-gray-700 text-sm">
                      <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-heading mb-4">Transparent, Flat-Fee Pricing</h2>
          <p className="text-gray-500 text-lg mb-8">
            We believe in honest pricing. Contact us for a free consultation and a no-obligation quote
            tailored to your specific situation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/portal/register" className="btn-outline-gold inline-flex items-center gap-2">
              Create Client Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
