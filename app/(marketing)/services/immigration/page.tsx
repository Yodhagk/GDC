import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Globe, Users, Briefcase, Home } from 'lucide-react';
import { serviceSchema, breadcrumbSchema } from '@/lib/seo-schemas';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'US Immigration Consulting | H-1B, Green Card, Citizenship | 98% Approval',
  description: 'Expert US immigration consulting for H-1B, L-1, O-1, EB-5 visas, green card, and citizenship. 98% approval rate. Serving Atlanta metro GA & nationwide. Free consultation.',
  alternates: { canonical: `${BASE}/services/immigration` },
  keywords: ['US immigration consultant', 'H-1B visa consultant', 'green card consultant', 'US citizenship consultant', 'immigration lawyer Georgia', 'immigration consultant Atlanta GA', 'H-1B visa consultant Georgia', 'EB-5 visa consultant'],
  openGraph: {
    url: `${BASE}/services/immigration`,
    title: 'US Immigration Consulting | Golden Dollar Consultancy',
    description: '98% approval rate. Expert H-1B, green card, and citizenship consulting. Serving India and the US.',
  },
};

const visaTypes = [
  { icon: Briefcase, title: 'Work Visas', items: ['H-1B Specialty Occupation', 'L-1 Intracompany Transfer', 'O-1 Extraordinary Ability', 'TN NAFTA Professionals', 'E-3 Australian Specialty'] },
  { icon: Globe, title: 'Investor & Business', items: ['EB-5 Immigrant Investor', 'E-2 Treaty Investor', 'L-1A Managerial Transfer', 'National Interest Waiver', 'PERM Labor Certification'] },
  { icon: Home, title: 'Permanent Residency', items: ['Employment-Based Green Card', 'Family-Based Petitions', 'Adjustment of Status', 'Consular Processing', 'Naturalization (N-400)'] },
  { icon: Users, title: 'Family & Dependent', items: ['H-4 / L-2 Dependent Visas', 'Spousal Green Cards', 'K-1 Fiancé Visa', 'EAD / Work Authorization', 'DACA Applications & Renewals'] },
];

const faqs = [
  {
    question: 'How long does the H-1B visa process take?',
    answer: 'Standard H-1B processing takes 3–6 months after the April lottery. Premium processing (with USCIS Form I-907) provides a decision within 15 business days. Cap-exempt H-1Bs at universities or nonprofits can be filed year-round and typically process in 3–4 months.',
  },
  {
    question: 'Do you serve H-1B applicants across the Atlanta metro area?',
    answer: 'Yes. We serve H-1B applicants throughout the Atlanta metro — Lilburn, Norcross, Duluth, Alpharetta, Johns Creek, and Lawrenceville. We handle the complete petition process, including cap registration, RFE responses, extensions, and employer transfers.',
  },
  {
    question: 'What is the difference between H-1B and L-1 visa?',
    answer: 'H-1B is for specialty occupation workers (requires a US employer sponsor). L-1 is for intracompany transferees — you must have worked for the same company abroad for at least 1 year. L-1A is for managers/executives; L-1B is for specialized knowledge workers. L-1 visas are not subject to the annual cap.',
  },
  {
    question: 'How long does a green card application take?',
    answer: 'Employment-based green card timelines vary significantly by country of birth and category. EB-1A/B (extraordinary ability, outstanding professors) can take 1–2 years. EB-2/EB-3 for Indian nationals can have wait times of 10+ years due to per-country caps. Family-based varies from 1–5+ years.',
  },
  {
    question: 'Can you help with immigration if I am already in the US on a different visa?',
    answer: 'Yes. We handle change of status, extension of status, and adjustment of status from virtually any visa category. Common cases include changing from F-1 student to H-1B, extending H-1B or L-1 status, or adjusting to permanent resident from within the US.',
  },
];

export default function ImmigrationPage() {
  const schemas = [
    serviceSchema({
      name: 'US Immigration Consulting',
      description: 'Expert H-1B, L-1, EB-5, green card, and citizenship immigration services with 98% approval rate.',
      url: `${BASE}/services/immigration`,
      category: 'Immigration Consulting',
    }),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Services', url: `${BASE}/services` },
      { name: 'Immigration', url: `${BASE}/services/immigration` },
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
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(30,80,200,0.10) 0%, transparent 65%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.07) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }, { name: 'Immigration', href: '/services/immigration' }]} />
          <span className="section-tag">Immigration Services</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-5">
            US Immigration<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Consulting Experts
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Navigating US immigration is complex. Our experienced consultants have guided
            5,000+ individuals, families, and businesses to successful outcomes — with a
            98% approval rate across all visa categories.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Free Eligibility Check <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+14692699784" className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              Call +1 (469) 269-9784
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[['98%', 'Approval Rate'], ['5,000+', 'Cases Won'], ['30+', 'Countries'], ['15+', 'Years Exp.']].map(([v, l]) => (
              <div key={l} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-serif text-2xl font-bold" style={{ color: '#E8C040' }}>{v}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa categories */}
      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white">All Immigration Categories</h2>
            <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.50)' }}>Work, invest, reunite, and settle — we handle every pathway.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaTypes.map((vt) => (
              <div key={vt.title} className="rounded-2xl p-6 transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(200,146,14,0.12)', border: '1px solid rgba(200,146,14,0.20)' }}>
                  <vt.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white mb-4">{vt.title}</h3>
                <ul className="space-y-2">
                  {vt.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold-400" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atlanta metro callout */}
      <section className="py-16" style={{ background: '#040B18' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'linear-gradient(135deg, rgba(200,146,14,0.10) 0%, rgba(30,80,200,0.08) 100%)', border: '1px solid rgba(200,146,14,0.20)' }}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="section-tag mb-4 inline-flex">Atlanta Metro GA</span>
                <h2 className="font-serif text-3xl font-bold text-white mb-4 leading-tight">
                  Immigration Consulting Across<br />the Atlanta Area
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Headquartered in Lilburn, GA, we serve H-1B applicants, green card seekers, and
                  new citizens throughout Gwinnett County and the greater Atlanta metro. In-person
                  or virtual — your choice.
                </p>
                <ul className="space-y-2 mb-6">
                  {['H-1B cap registration strategy', 'RFE response specialists', 'Premium processing guidance', 'Consular interview preparation', 'Dependent (H-4/L-2) visa filing'].map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <CheckCircle className="w-4 h-4 text-gold-400" />{i}
                    </li>
                  ))}
                </ul>
                <Link href="/locations" className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: '#E8C040' }}>
                  View all service areas <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['Lilburn', '/locations/lilburn-ga'], ['Norcross', '/locations/norcross-ga'], ['Duluth', '/locations/duluth-ga'], ['Alpharetta', '/locations/alpharetta-ga']].map(([city, href]) => (
                  <Link key={city} href={href} className="rounded-xl p-4 text-center transition-all duration-200 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Globe className="w-5 h-5 mx-auto mb-2 text-gold-400" />
                    <div className="text-sm font-medium text-white">{city}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>GA</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Immigration FAQs" subtitle="Clear answers to common US immigration questions." />

      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Begin Your US Journey Today</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.50)' }}>Free eligibility assessment — no obligation, no commitment.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 cursor-pointer">
            Check My Eligibility <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
