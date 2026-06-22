import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { serviceSchema, breadcrumbSchema } from '@/lib/seo-schemas';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'US Visa Services | H-1B, L-1, B-1/B-2, F-1, O-1 Visa Experts',
  description: 'Complete US visa services: H-1B, L-1, B-1/B-2 tourist, F-1 student, O-1 extraordinary ability. Expert consultants serving India & USA. 98% success rate. Free consultation.',
  alternates: { canonical: `${BASE}/services/visa` },
  keywords: ['US visa services', 'H-1B visa', 'B1 B2 visa', 'F1 student visa USA', 'US tourist visa', 'O-1 visa', 'L-1 visa consultant', 'US visa consultant India', 'visa consultant Bangalore'],
  openGraph: {
    url: `${BASE}/services/visa`,
    title: 'US Visa Services | Golden Dollar Consultancy',
    description: 'H-1B, L-1, B-1/B-2, F-1, O-1 visa services by expert US immigration consultants. 98% success rate.',
  },
};

const visaCategories = [
  {
    code: 'H-1B', label: 'Specialty Occupation',
    desc: 'For professionals in IT, engineering, finance, medicine, and other specialty fields requiring at least a bachelor\'s degree.',
    items: ['Cap & cap-exempt petitions', 'Premium processing', 'RFE responses', 'Extensions & transfers', 'H-4 dependents'],
    color: '#E8C040',
  },
  {
    code: 'L-1', label: 'Intracompany Transfer',
    desc: 'Transfer executives, managers (L-1A), or specialized knowledge employees (L-1B) from an overseas company.',
    items: ['L-1A managerial/executive', 'L-1B specialized knowledge', 'Blanket L petitions', 'New office L-1', 'L-2 dependent EAD'],
    color: '#60A5FA',
  },
  {
    code: 'O-1', label: 'Extraordinary Ability',
    desc: 'For individuals with extraordinary ability in sciences, arts, education, business, or athletics.',
    items: ['O-1A & O-1B petitions', 'Evidence strategy', 'Advisory opinion letters', 'Extensions', 'O-2 & O-3 dependents'],
    color: '#34D399',
  },
  {
    code: 'B-1/B-2', label: 'Visitor / Tourist Visa',
    desc: 'Business (B-1) or tourism/medical (B-2) temporary visas. Critical for parents and family visitors.',
    items: ['New applications', 'Extension of stay', 'Change to other status', 'Interview preparation', 'Supporting documents'],
    color: '#F472B6',
  },
  {
    code: 'F-1', label: 'Student Visa',
    desc: 'Study at US universities and colleges. Includes OPT and STEM OPT work authorization after graduation.',
    items: ['I-20 guidance', 'SEVIS registration', 'OPT / STEM OPT EAD', 'CPT authorization', 'Change of status'],
    color: '#A78BFA',
  },
  {
    code: 'EB-1', label: 'Employment Green Card',
    desc: 'Fastest path to permanent residency for extraordinary ability, outstanding researchers, and multinational managers.',
    items: ['EB-1A self-petition', 'EB-1B researchers', 'EB-1C executives', 'I-140 filing', 'Concurrent AOS'],
    color: '#E8C040',
  },
];

const faqs = [
  {
    question: 'What is the H-1B visa cap for 2025?',
    answer: 'The annual H-1B cap is 65,000 for regular cap plus 20,000 additional for US master\'s degree holders. USCIS conducts a lottery in March for petitions received during the first five business days of April. Cap-exempt employers (universities, non-profits) can file year-round.',
  },
  {
    question: 'How can I apply for a US tourist visa (B-2) from India?',
    answer: 'To apply for a B-2 visitor visa from India: (1) Complete DS-160 online application, (2) Pay the $185 MRV fee, (3) Schedule your interview at the US Consulate in Chennai, Mumbai, Delhi, Hyderabad, or Kolkata, (4) Attend interview with required documents. We help you prepare a strong application package and interview strategy.',
  },
  {
    question: 'How long does an H-1B visa last?',
    answer: 'Initial H-1B approval is for 3 years, extendable in 3-year increments. If an I-140 immigrant petition is approved, you can extend in 1-year increments beyond the standard 6-year cap. With an approved I-140 and priority date not current, you can extend indefinitely until your green card is approved.',
  },
  {
    question: 'Can I switch jobs on an H-1B visa?',
    answer: 'Yes — H-1B portability allows you to change employers after filing an H-1B transfer petition, even before it is approved. The new employer must file an H-1B transfer petition and you must have been maintaining valid status. You can begin working for the new employer as soon as the transfer is filed.',
  },
  {
    question: 'What documents are needed for an L-1 visa?',
    answer: 'L-1 requires: proof of qualifying employment abroad for 1+ year, proof of managerial/executive role (L-1A) or specialized knowledge (L-1B), organizational charts, job descriptions, evidence of the qualifying relationship between the US and foreign companies, and financial statements. We compile the complete petition package.',
  },
];

export default function VisaPage() {
  const schemas = [
    serviceSchema({
      name: 'US Visa Services',
      description: 'Complete H-1B, L-1, B-1/B-2, F-1, O-1 visa consulting services with 98% success rate.',
      url: `${BASE}/services/visa`,
      category: 'Visa Services',
    }),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Services', url: `${BASE}/services` },
      { name: 'Visa Services', url: `${BASE}/services/visa` },
    ]),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020912 0%, #040B18 50%, #071228 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }, { name: 'Visa Services', href: '/services/visa' }]} />
          <span className="section-tag">Visa Services</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-5">
            US Visa Services<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              H-1B · L-1 · B-2 · F-1 · O-1
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Expert US visa consulting for every category. We prepare flawless petitions,
            coach you for interviews, and respond to RFEs — so your visa gets approved.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Check Visa Eligibility <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services/immigration" className="flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              Full Immigration Services
            </Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {['H-1B', 'L-1', 'O-1', 'B-1/B-2', 'F-1', 'EB-1'].map((v) => (
              <div key={v} className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: 'rgba(200,146,14,0.12)', border: '1px solid rgba(200,146,14,0.25)', color: '#E8C040' }}>
                {v}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white text-center mb-12">Visa Categories We Handle</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaCategories.map((vc) => (
              <div key={vc.code} className="rounded-2xl p-6 transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${vc.color}18`, color: vc.color, border: `1px solid ${vc.color}30` }}>{vc.code}</span>
                  <span className="text-sm font-semibold text-white">{vc.label}</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>{vc.desc}</p>
                <ul className="space-y-1.5">
                  {vc.items.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: vc.color }} />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="US Visa FAQs" subtitle="Clear answers on H-1B, L-1, B-2, F-1 and more." />

      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to Start Your Visa Application?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.50)' }}>Get a free eligibility assessment from our expert visa consultants.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 cursor-pointer">
            Book Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
