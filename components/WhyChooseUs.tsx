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
    desc: "Tax questions don't only arise in April. We're available 365 days for all your financial needs.",
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
    <section className="py-24 overflow-hidden relative" style={{
      background: 'linear-gradient(160deg, #040B18 0%, #071228 55%, #0A1838 100%)',
    }}>

      {/* Rich background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2" style={{
          background: 'radial-gradient(circle, rgba(200,146,14,0.09) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full translate-x-1/3 translate-y-1/3" style={{
          background: 'radial-gradient(circle, rgba(200,146,14,0.07) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }} />
        {/* Subtle gold grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage:
            'linear-gradient(rgba(200,146,14,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,14,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left column */}
          <div>
            <span className="section-tag">Why Golden Dollar</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mt-4 mb-6">
              The Difference Is In
              <span className="block" style={{
                background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Our Commitment
              </span>
            </h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Since 2009, we've built our reputation on trust, accuracy, and results. When you
              choose Golden Dollar, you get a partner who is genuinely invested in your
              financial success.
            </p>

            {/* Premium stat block */}
            <div className="rounded-2xl p-7 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(200,146,14,0.12) 0%, rgba(200,146,14,0.06) 100%)',
              border: '1px solid rgba(200,146,14,0.25)',
              boxShadow: '0 0 40px -10px rgba(200,146,14,0.20)',
            }}>
              {/* Shimmer top-line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.6) 50%, transparent 100%)',
              }} />

              <div className="font-serif text-6xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, #E8C040 0%, #C8920E 60%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                $50M+
              </div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Total tax savings delivered to our clients — and counting.
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { v: '2,500+', l: 'Clients Served' },
                  { v: '15+', l: 'Years Experience' },
                  { v: '99%', l: 'Satisfaction Rate' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-serif font-bold text-xl text-white">{s.v}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column – reason cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-2xl p-5 transition-all duration-300 group relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(200,146,14,0.07)';
                  el.style.borderColor = 'rgba(200,146,14,0.28)';
                  el.style.boxShadow = '0 8px 30px -8px rgba(200,146,14,0.15)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.borderColor = 'rgba(255,255,255,0.09)';
                  el.style.boxShadow = 'none';
                }}
              >
                <CheckCircle className="w-5 h-5 text-gold-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-1.5">{r.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
