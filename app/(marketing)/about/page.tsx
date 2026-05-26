import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Users, TrendingUp, Heart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Golden Dollar Consultancy — our story, mission, and the expert team behind your financial success.',
};

const values = [
  { icon: Heart, title: 'Client-First', desc: 'Every decision we make is guided by what is best for our clients, not our bottom line.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest professional standards — continuous education and credentials.' },
  { icon: Users, title: 'Partnership', desc: 'We see ourselves as long-term financial partners, not just service providers.' },
  { icon: TrendingUp, title: 'Results', desc: 'Measurable outcomes — tax savings, compliance, peace of mind — define our success.' },
];

const team = [
  { name: 'Priti Patel', role: 'Founder and CEO', exp: '22 years', initials: 'PP' },
  { name: 'Maria Gonzalez, EA', role: 'IRS Compliance Director', exp: '16 years', initials: 'MG' },
  { name: 'Mona', role: 'Senior Tax Consultant', exp: '14 years', initials: 'MO' },
  { name: 'Priya Sharma, CPA', role: 'Business Tax Specialist', exp: '11 years', initials: 'PS' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-800 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="section-tag">Our Story</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-6">
              Built on Trust,<br />
              <span className="text-gold-400">Driven by Results</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Since 2009, Golden Dollar Consultancy has been helping Americans navigate the
              complexities of the tax code with clarity, expertise, and genuine care.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-heading mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Golden Dollar Consultancy was founded in 2009 by Priti Patel, a tax professional
                with a vision: bring big-firm expertise to everyday Americans and small businesses
                who deserved better than cookie-cutter tax preparation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Starting with just three clients in a Manhattan office, we've grown to serve over
                2,500 individuals and businesses across all 50 states. Our growth has been entirely
                referral-based — a testament to the results we deliver and the relationships we build.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, our team of CPAs, Enrolled Agents, and tax attorneys brings over 120 combined
                years of experience to every client engagement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2009', label: 'Founded' },
                { value: '2,500+', label: 'Clients Served' },
                { value: '$50M+', label: 'Tax Savings' },
                { value: '50', label: 'States Served' },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="font-serif text-3xl font-bold text-gold-400 mb-1">{stat.value}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag">Our Values</span>
            <h2 className="section-heading mt-4">What Guides Everything We Do</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-11 h-11 bg-gold-100 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-gold-500" />
                </div>
                <h3 className="font-serif text-lg font-bold text-navy-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-tag">The Team</span>
            <h2 className="section-heading mt-4">Your Expert Advisors</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold font-serif text-xl group-hover:scale-105 transition-transform shadow-lg">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-navy-800 text-sm">{member.name}</h3>
                <p className="text-gold-500 text-xs mt-0.5">{member.role}</p>
                <p className="text-gray-400 text-xs mt-1">{member.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Ready to Meet Your Advisor?
          </h2>
          <p className="text-white/55 mb-8">
            Schedule a complimentary 30-minute consultation with one of our certified professionals.
          </p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
            Schedule Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
