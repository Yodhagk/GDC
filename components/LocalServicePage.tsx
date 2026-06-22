'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight, MapPin, Phone, Star } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

export interface LocalCity {
  name: string;           // e.g. "Atlanta"
  state: string;          // e.g. "GA"
  slug: string;           // e.g. "atlanta-ga"
  county?: string;        // e.g. "Fulton County"
  tagline: string;        // hero sub-headline
  intro: string;          // 2-sentence intro paragraph
  nearbyAreas?: string[]; // related nearby cities
}


const SERVICES = [
  { title: 'US Tax Filing & Preparation', href: '/services/tax-filing', desc: 'Federal & state returns for individuals, self-employed, and businesses. Maximum refund guaranteed.' },
  { title: 'US Immigration Consulting', href: '/services/immigration', desc: 'H-1B, L-1, EB-1, green card, and citizenship services with a 98% approval rate.' },
  { title: 'Visa Services', href: '/services/visa', desc: 'H-1B, L-1, B-1/B-2, F-1, O-1 visas — complete petition and interview prep.' },
  { title: 'Business Registration', href: '/services/business-registration', desc: 'LLC, Corporation, EIN, registered agent — launch your US business right.' },
  { title: 'Bookkeeping & Accounting', href: '/services', desc: 'Monthly reconciliation, P&L, payroll processing, and year-end financials.' },
  { title: 'IRS Audit Representation', href: '/services/tax-filing', desc: 'IRS-enrolled agents represent you directly before the IRS — no stress.' },
];

const TRUST_SIGNALS = [
  ['5,000+', 'Clients Served'],
  ['98%', 'Approval Rate'],
  ['15+', 'Years Experience'],
  ['$50M+', 'Tax Savings'],
];

const REVIEWS = [
  { author: 'Anita S.', text: 'They filed my H-1B petition perfectly and got it approved on the first try. Outstanding service.', rating: 5 },
  { author: 'James R.', text: 'Saved me $8,400 in taxes I didn\'t know I owed refunds on. Highly recommend for any small business owner.', rating: 5 },
  { author: 'Meera K.', text: 'Handled our entire green card process — from I-140 to the final interview. Stress-free experience.', rating: 5 },
];

export default function LocalServicePage({ city }: { city: LocalCity }) {
  const displayName = `${city.name}, ${city.state}`;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020912 0%, #040B18 50%, #071228 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-[5%] w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumb items={[
            { name: 'Locations', href: '/locations' },
            { name: city.name, href: `/locations/${city.slug}` },
          ]} />

          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium" style={{ color: 'rgba(200,146,14,0.80)' }}>
              Serving {displayName}{city.county ? ` · ${city.county}` : ''}
            </span>
          </div>

          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
            Tax &amp; Immigration<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Consultant in {city.name}
            </span>
          </h1>

          <p className="text-xl font-medium mb-3" style={{ color: '#E8C040' }}>{city.tagline}</p>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            {city.intro}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-current text-gold-400" />)}
            </div>
            <span className="font-semibold text-white">4.9/5</span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>· 247 verified reviews</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+14692699784"
              className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              <Phone className="w-4 h-4 text-gold-400" />
              +1 (469) 269-9784
            </a>
          </div>
        </div>
      </section>

      {/* Trust stats */}
      <section className="py-14" style={{ background: '#040B18', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST_SIGNALS.map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-serif text-3xl font-bold mb-1"
                  style={{ background: 'linear-gradient(135deg, #E8C040, #C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {v}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white">
              Our Services in {city.name}
            </h2>
            <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Full-spectrum tax and immigration services — right here in {displayName}.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <Link key={svc.title} href={svc.href}
                className="rounded-2xl p-6 transition-all duration-300 group cursor-pointer block"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200,146,14,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(200,146,14,0.25)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                <h3 className="font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors text-sm">{svc.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{svc.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#E8C040' }}>
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20" style={{ background: '#040B18' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag">Why Choose Us</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mt-4 mb-5 leading-tight">
                The Most Trusted Tax &amp; Immigration<br />Firm in {displayName}
              </h2>
              <ul className="space-y-4">
                {[
                  'IRS-enrolled agents — highest credential for tax representation',
                  'Immigration specialists with 98% visa approval rate',
                  'Founded 2009 — 15+ years serving the Atlanta metro area',
                  'Transparent flat-fee pricing — no hourly billing surprises',
                  'Year-round audit protection on every return we file',
                  'Bilingual staff — English, Hindi, and other languages available',
                  'Free 30-minute initial consultation — zero obligation',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-gold-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {REVIEWS.map((r) => (
                <div key={r.author} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current text-gold-400" />)}
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>&ldquo;{r.text}&rdquo;</p>
                  <p className="text-xs font-semibold" style={{ color: '#E8C040' }}>— {r.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby areas */}
      {city.nearbyAreas && city.nearbyAreas.length > 0 && (
        <section className="py-14" style={{ background: '#071228' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Also serving nearby areas:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {city.nearbyAreas.map((area) => (
                <span key={area} className="px-3 py-1.5 rounded-full text-sm"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20" style={{ background: '#040B18' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Ready to Work with {city.name}'s Best Tax &amp; Immigration Consultants?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Book a free 30-minute consultation. We respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+14692699784"
              className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              <Phone className="w-4 h-4 text-gold-400" />
              +1 (469) 269-9784
            </a>
          </div>
          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.30)' }}>
            📍 3730 Graham Way SW, Lilburn, GA 30047 &nbsp;·&nbsp; Serving all of the Atlanta metro area
          </p>
        </div>
      </section>
    </>
  );
}
