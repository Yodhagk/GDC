import Link from 'next/link';
import { FileText, ShieldCheck, BookOpen, Search, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Tax Filing',
    desc: 'Accurate federal and state income tax preparation for individuals, families, and small businesses. We maximize your refund while keeping you fully compliant.',
    items: ['Individual & joint returns', 'Self-employed & freelancer returns', 'Multi-state filing', 'Prior-year amendments'],
    color: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'IRS Compliance',
    desc: 'Expert representation and resolution services for IRS notices, audits, back taxes, and penalty abatement. We handle the IRS so you don\'t have to.',
    items: ['IRS notice response', 'Penalty abatement', 'Installment agreements', 'Offer in compromise'],
    color: 'from-gold-50 to-amber-50',
    iconBg: 'bg-gold-100',
    iconColor: 'text-gold-600',
  },
  {
    icon: BookOpen,
    title: 'Bookkeeping',
    desc: 'Accurate, timely financial recordkeeping that gives you a clear picture of your business health and keeps you ready for tax season year-round.',
    items: ['Monthly reconciliation', 'Financial statements', 'Accounts payable/receivable', 'Payroll processing'],
    color: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: Search,
    title: 'Audit Support',
    desc: 'Comprehensive audit defense and representation for IRS and state tax authority examinations. We protect your rights and minimize your exposure.',
    items: ['Audit representation', 'Document preparation', 'Appeals filing', 'Correspondence audit'],
    color: 'from-purple-50 to-violet-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-heading mt-4 mb-4">
            Comprehensive Tax & Financial Services
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From simple tax returns to complex IRS negotiations, our team of credentialed
            professionals covers every aspect of your financial needs.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.desc}</p>
              <ul className="space-y-2 mb-6">
                {service.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-navy-700 hover:text-gold-500 font-semibold text-sm transition-colors group-hover:gap-2.5"
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
