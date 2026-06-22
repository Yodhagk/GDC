import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, FileText, Shield, TrendingDown, Clock } from 'lucide-react';
import { serviceSchema, breadcrumbSchema } from '@/lib/seo-schemas';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'US Tax Filing Service | IRS-Enrolled Agents | Maximum Refund',
  description: 'Professional US tax filing for individuals, self-employed & businesses. IRS-enrolled agents. 1040, Schedule C, S-Corp, multi-state returns. Free consultation. Lilburn GA.',
  alternates: { canonical: `${BASE}/services/tax-filing` },
  keywords: ['US tax filing', 'IRS tax preparation', 'tax filing service USA', 'NRI tax filing', '1040 tax return', 'self employed tax filing', 'corporate tax filing USA', 'tax consultant Georgia'],
  openGraph: {
    url: `${BASE}/services/tax-filing`,
    title: 'US Tax Filing Service | Golden Dollar Consultancy',
    description: 'Professional federal and state tax filing by IRS-enrolled agents. Maximum refund guaranteed. Free consultation.',
  },
};

const features = [
  { icon: FileText, title: 'Individual Returns (1040)', desc: 'W-2, 1099, Schedule A/B/C/D — every form, every deduction maximized.' },
  { icon: TrendingDown, title: 'Business & Corporate', desc: 'S-Corp, C-Corp, Partnership, LLC returns with full compliance.' },
  { icon: Shield, title: 'NRI & Foreign Income', desc: 'FBAR, FATCA, Form 2555, Form 1116 — complex international filing.' },
  { icon: Clock, title: 'Prior-Year & Amended', desc: 'Catch up on unfiled years or correct previous returns risk-free.' },
];

const included = [
  'Federal & all 50-state returns',
  'IRS e-filing with instant confirmation',
  'Year-round audit support',
  'Tax planning consultation included',
  'FBAR / FATCA reporting',
  'Estimated quarterly payments (1040-ES)',
  'Self-employed & Schedule C returns',
  'Multi-state & non-resident filings',
  'S-Corp, C-Corp & partnership returns (1120/1065)',
  'Prior-year and amended returns (1040-X)',
];

const faqs = [
  {
    question: 'What documents do I need for US tax filing?',
    answer: 'You will need your W-2 or 1099 forms, Social Security numbers for all family members, last year\'s tax return, bank account details for direct deposit, receipts for deductions (mortgage interest, charitable donations, business expenses), and any foreign income documentation.',
  },
  {
    question: 'How much does tax filing cost?',
    answer: 'We offer flat-fee pricing based on return complexity. Individual 1040 returns start from $149. Business returns and complex multi-state filings vary. Your free consultation includes an upfront quote with no hidden fees.',
  },
  {
    question: 'Can you file taxes for NRIs and people with Indian income?',
    answer: 'Yes — NRI tax filing is one of our specializations. We handle Indian salary income, rental income, capital gains, DTAA (Double Tax Avoidance Agreement) benefits, FBAR for foreign bank accounts, and FATCA compliance.',
  },
  {
    question: 'What is the tax filing deadline in the USA?',
    answer: 'The standard IRS filing deadline is April 15. An automatic 6-month extension to October 15 is available by filing Form 4868. However, taxes owed are still due by April 15 — an extension only extends the filing deadline, not payment.',
  },
  {
    question: 'Do you provide audit support?',
    answer: 'Yes. All returns we prepare come with year-round IRS audit support at no extra charge. Our IRS-enrolled agents can represent you directly before the IRS in case of an audit.',
  },
  {
    question: 'Can you handle multi-state tax filing?',
    answer: 'Absolutely. We file in all 50 states. If you lived or worked in multiple states during the year, we handle all resident and non-resident state returns simultaneously.',
  },
];

export default function TaxFilingPage() {
  const schemas = [
    serviceSchema({
      name: 'US Tax Filing & Preparation',
      description: 'Professional federal and state tax preparation for individuals, self-employed, and businesses. IRS-enrolled agents. Maximum refund guaranteed.',
      url: `${BASE}/services/tax-filing`,
      category: 'Tax Preparation',
      price: 'Starting from $149',
    }),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Services', url: `${BASE}/services` },
      { name: 'Tax Filing', url: `${BASE}/services/tax-filing` },
    ]),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020912 0%, #040B18 50%, #071228 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.10) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }, { name: 'Tax Filing', href: '/services/tax-filing' }]} />
          <span className="section-tag">Tax Services</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-5">
            US Tax Filing &amp;<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Preparation Services
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            IRS-enrolled agents maximizing your refund while keeping you fully compliant.
            From simple W-2 returns to complex corporate filings — we handle everything.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+14692699784" className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              Call +1 (469) 269-9784
            </a>
          </div>
          {/* Trust strip */}
          <div className="flex flex-wrap gap-6 mt-10">
            {['IRS Enrolled Agents', 'All 50 States', 'NRI Specialists', 'Audit Protected', 'Flat-Fee Pricing'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle className="w-4 h-4 text-gold-400" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white">All Return Types Covered</h2>
            <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.50)' }}>One firm. Every tax situation. Every form.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl p-6 transition-all duration-300 group cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(200,146,14,0.12)', border: '1px solid rgba(200,146,14,0.20)' }}>
                  <f.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20" style={{ background: '#040B18' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag">What's Included</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mt-4 mb-5 leading-tight">
                Everything You Need in One Flat Fee
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                No surprises, no hidden charges. Your fee covers federal, state, and year-round support.
              </p>
              <Link href="/contact" className="btn-gold flex items-center gap-2 w-fit cursor-pointer">
                Start Your Return <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <CheckCircle className="w-4 h-4 shrink-0 text-gold-400" />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.70)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Tax Filing FAQs" subtitle="Common questions about US tax preparation and filing." />

      {/* CTA */}
      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to Maximize Your Refund?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Book your free 30-minute consultation. We'll review your situation and give you an upfront quote.
          </p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 cursor-pointer">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
