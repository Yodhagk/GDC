import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Building2, FileText, Shield, Globe } from 'lucide-react';
import { serviceSchema, breadcrumbSchema } from '@/lib/seo-schemas';
import FAQSection from '@/components/FAQSection';
import Breadcrumb from '@/components/Breadcrumb';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'US Business Registration | LLC & Corporation Formation | EIN Service',
  description: 'Register your US business (LLC, Corporation, S-Corp) with expert guidance. EIN, Articles of Incorporation, registered agent. Serving NRIs & Indian businesses expanding to USA.',
  alternates: { canonical: `${BASE}/services/business-registration` },
  keywords: ['US business registration', 'LLC formation USA', 'corporation formation USA', 'EIN application', 'register company USA', 'US company registration for Indians', 'startup registration USA', 'S-Corp formation'],
  openGraph: {
    url: `${BASE}/services/business-registration`,
    title: 'US Business Registration | Golden Dollar Consultancy',
    description: 'LLC, Corporation, S-Corp formation. EIN, registered agent, annual compliance. Serving NRIs expanding to the US.',
  },
};

const steps = [
  { num: '01', title: 'Choose Entity Type', desc: 'We analyze your business goals, tax situation, and investment plans to recommend the ideal structure — LLC, C-Corp, S-Corp, or Partnership.' },
  { num: '02', title: 'State Filing', desc: 'We prepare and file your Articles of Organization or Incorporation with the correct state — Delaware, Wyoming, Georgia, or your target state.' },
  { num: '03', title: 'EIN & Tax Setup', desc: 'We obtain your Federal EIN (Employer Identification Number) from the IRS, set up your business bank account, and configure your tax elections.' },
  { num: '04', title: 'Ongoing Compliance', desc: 'Annual reports, registered agent service, and corporate minutes — we keep your business in good standing year after year.' },
];

const structures = [
  { icon: Building2, title: 'LLC (Limited Liability Co.)', items: ['Most popular for small business', 'Pass-through taxation', 'Flexible management', 'Low compliance burden', 'Foreign ownership allowed'], highlight: true },
  { icon: FileText, title: 'C-Corporation', items: ['Ideal for VC/investor funding', 'Issue multiple share classes', 'Separate corporate tax', 'Delaware preferred', 'Required for US stock options'], highlight: false },
  { icon: Shield, title: 'S-Corporation', items: ['Pass-through taxation', 'Reduces self-employment tax', 'US citizens/residents only', 'Max 100 shareholders', 'One share class'], highlight: false },
  { icon: Globe, title: 'Foreign Company Branch', items: ['Expand your Indian company to US', 'No separate legal entity', 'Parent company liability', 'Simpler than new entity', 'Suitable for testing US market'], highlight: false },
];

const faqs = [
  {
    question: 'Can an Indian citizen register a company in the USA?',
    answer: 'Yes — non-US citizens and non-residents can form an LLC or C-Corporation in the United States. There are no citizenship or residency requirements. You will need a registered agent in the state of formation and an EIN from the IRS. We handle the entire process remotely.',
  },
  {
    question: 'Which US state is best to register a business?',
    answer: 'Delaware is the most popular for C-Corps (especially for startups seeking VC funding) due to its business-friendly courts and laws. Wyoming and Nevada are popular for LLCs due to privacy and low fees. If you\'ll operate physically in Georgia, registering there avoids foreign qualification fees. We help you choose based on your specific goals.',
  },
  {
    question: 'How long does it take to register a US company?',
    answer: 'Most states process standard filings in 5–10 business days. Delaware offers 24-hour expedited processing. Wyoming typically processes in 1–2 business days. Once the state approves your formation, the IRS EIN can be obtained the same day online (for US-based principals) or within 4 weeks by mail (for foreign principals).',
  },
  {
    question: 'What is an EIN and why do I need one?',
    answer: 'An Employer Identification Number (EIN) is your company\'s federal tax ID, similar to a social security number for businesses. You need it to open a US business bank account, hire employees, file federal taxes, apply for business licenses, and set up payment processing. We obtain your EIN directly from the IRS.',
  },
  {
    question: 'Do I need to be physically present in the US to register a company?',
    answer: 'No. You can register a US company entirely remotely. We handle all filings on your behalf. You will need to provide notarized identification documents and sign the formation documents. A US business address (provided by our registered agent service) is required — your personal Indian address is not sufficient.',
  },
];

export default function BusinessRegistrationPage() {
  const schemas = [
    serviceSchema({
      name: 'US Business Registration & Formation',
      description: 'LLC, Corporation, and S-Corp formation services for US and international entrepreneurs. EIN, registered agent, and annual compliance included.',
      url: `${BASE}/services/business-registration`,
      category: 'Business Formation',
      price: 'Starting from $299',
    }),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Services', url: `${BASE}/services` },
      { name: 'Business Registration', url: `${BASE}/services/business-registration` },
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
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px]"
            style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Breadcrumb items={[{ name: 'Services', href: '/services' }, { name: 'Business Registration', href: '/services/business-registration' }]} />
          <span className="section-tag">Business Formation</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-5">
            Register Your US Business<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              From Anywhere in the World
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Launch your US business the right way — correct entity type, correct state,
            complete documentation. We guide Indian entrepreneurs and global founders through
            every step, fully remotely.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Start My Business <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+14692699784" className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)' }}>
              Call +1 (469) 269-9784
            </a>
          </div>
          <div className="flex flex-wrap gap-6">
            {['LLC Formation', 'C-Corp / S-Corp', 'EIN Included', 'Registered Agent', '100% Remote', 'All 50 States'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle className="w-4 h-4 text-gold-400" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-step process */}
      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white text-center mb-12">How We Register Your Business</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="rounded-2xl p-6 cursor-default" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="font-serif text-3xl font-bold mb-3" style={{ color: 'rgba(200,146,14,0.40)' }}>{s.num}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entity structures */}
      <section className="py-20" style={{ background: '#040B18' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white text-center mb-4">Choose the Right Structure</h2>
          <p className="text-center text-lg mb-12" style={{ color: 'rgba(255,255,255,0.50)' }}>Every business is different. We match your goals to the optimal entity type.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {structures.map((st) => (
              <div key={st.title} className="rounded-2xl p-6 transition-all duration-300 cursor-default"
                style={{
                  background: st.highlight ? 'rgba(200,146,14,0.07)' : 'rgba(255,255,255,0.03)',
                  border: st.highlight ? '1px solid rgba(200,146,14,0.25)' : '1px solid rgba(255,255,255,0.07)',
                }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(200,146,14,0.12)', border: '1px solid rgba(200,146,14,0.20)' }}>
                  <st.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="font-semibold text-white mb-4 text-sm">{st.title}</h3>
                <ul className="space-y-2">
                  {st.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gold-400" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Business Registration FAQs" subtitle="Everything you need to know about registering a US company." />

      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Ready to Launch Your US Business?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.50)' }}>Free 30-minute consultation. We'll recommend the right entity and state for your goals.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 cursor-pointer">
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
