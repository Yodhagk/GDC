import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    location: 'Austin, TX',
    avatar: 'SJ',
    rating: 5,
    text: "Golden Dollar saved me over $14,000 on my business taxes last year. They found deductions I never knew existed and walked me through everything clearly. I won't trust anyone else with my finances.",
  },
  {
    name: 'Michael Chen',
    role: 'Tech Entrepreneur',
    location: 'San Francisco, CA',
    avatar: 'MC',
    rating: 5,
    text: "When the IRS sent me an audit notice, I panicked. Golden Dollar's team took over completely, handled all the correspondence, and got the audit closed with zero additional liability. Truly life-saving.",
  },
  {
    name: 'Amanda Williams',
    role: 'Freelance Designer',
    location: 'Chicago, IL',
    avatar: 'AW',
    rating: 5,
    text: "As a freelancer, tax season was always a nightmare. Now with their client portal, I upload documents year-round and they handle everything. My tax bill dropped significantly too!",
  },
  {
    name: 'Robert Davis',
    role: 'Real Estate Investor',
    location: 'Miami, FL',
    avatar: 'RD',
    rating: 5,
    text: "Managing taxes across multiple investment properties was overwhelming. Golden Dollar built a custom strategy that maximized my depreciation and reduced my effective tax rate dramatically.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-tag">Client Stories</span>
          <h2 className="section-heading mt-4 mb-4">What Our Clients Say</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Don't just take our word for it — hear from the thousands of clients who trust Golden
            Dollar with their most important financial decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-navy-700 to-navy-800 rounded-full flex items-center justify-center text-white font-bold text-sm font-serif">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-navy-800 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role} · {t.location}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-gold-200 shrink-0" />
              </div>
              <Stars count={t.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-4">{t.text}</p>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-8 py-5 shadow-sm">
            <div className="font-serif text-4xl font-bold text-navy-800">4.9</div>
            <div>
              <Stars count={5} />
              <div className="text-gray-400 text-xs mt-1">Based on 840+ verified reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
