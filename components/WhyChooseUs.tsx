import { CheckCircle } from 'lucide-react';

const reasons = [
  {
    title: 'Licensed & Credentialed',
    desc: 'Our team consists of CPAs, Enrolled Agents, and tax attorneys licensed to practice in all 50 states.',
  },
  {
    title: 'Transparent Pricing',
    desc: 'Flat-fee pricing with no surprise billing. You know exactly what you pay before we start.',
  },
  {
    title: 'Year-Round Support',
    desc: 'Tax questions don\'t only arise in April. We\'re available 365 days for all your financial needs.',
  },
  {
    title: 'Secure Document Portal',
    desc: 'Safely upload and manage all your tax documents through our encrypted client portal.',
  },
  {
    title: 'Proven Track Record',
    desc: 'Over $50 million in tax savings delivered across 2,500+ client accounts since 2009.',
  },
  {
    title: 'IRS Representation Rights',
    desc: 'As enrolled agents, we have unlimited rights to represent you before the IRS at any level.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-navy-800 overflow-hidden relative">
      {/* Decorative gold accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <span className="section-tag">Why Golden Dollar</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 mb-6">
              The Difference Is In
              <span className="text-gold-400 block">Our Commitment</span>
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              Since 2009, we've built our reputation on trust, accuracy, and results. When you
              choose Golden Dollar, you get a partner who is genuinely invested in your
              financial success.
            </p>

            {/* Big stat */}
            <div className="bg-gold-400/10 border border-gold-400/25 rounded-2xl p-6">
              <div className="font-serif text-5xl font-bold text-gold-400 mb-1">$50M+</div>
              <div className="text-white/70 text-sm">
                Total tax savings delivered to our clients — and counting.
              </div>
            </div>
          </div>

          {/* Right column – checklist */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold-400/30 hover:bg-white/8 transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5 text-gold-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1.5">{r.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
