'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Users, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'IRS Compliance',
    desc: 'Full compliance with federal & state regulations',
  },
  {
    icon: Users,
    title: 'Dedicated Advisors',
    desc: 'Personal CPA assigned to every account',
  },
  {
    icon: Award,
    title: 'Expert Credentials',
    desc: 'CPAs & enrolled agents with 15+ years avg.',
  },
  {
    icon: TrendingUp,
    title: 'Maximum Savings',
    desc: 'Proven strategies to minimize your tax burden',
  },
];

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '$50M+', label: 'Tax Savings' },
  { value: '2,500+', label: 'Happy Clients' },
  { value: '99%', label: 'Satisfaction Rate' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-gold-400/8 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-navy-700/50 rounded-full blur-3xl" />
        {/* Decorative circles */}
        <div className="absolute -right-20 top-1/3 w-80 h-80 border border-gold-400/10 rounded-full" />
        <div className="absolute -right-32 top-1/3 w-[480px] h-[480px] border border-gold-400/5 rounded-full" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/25 rounded-full px-4 py-2 mb-8">
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span className="text-gold-400 text-xs font-semibold tracking-wide">
                Trusted by 2,500+ clients nationwide
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-[1.05] mb-6">
              Expert Tax
              <span className="block text-gold-400">Consulting</span>
              <span className="block text-3xl lg:text-4xl font-normal text-white/60 mt-1 font-sans">
                you can count on.
              </span>
            </h1>

            <p className="text-base lg:text-lg text-white/55 leading-relaxed mb-10 max-w-lg">
              Navigate complex tax laws with confidence. Golden Dollar Consultancy delivers
              personalized strategies, IRS compliance, and financial peace of mind — for
              individuals and businesses across the USA.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/contact" className="btn-gold flex items-center gap-2">
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portal/login" className="border border-white/20 hover:border-gold-400/50 text-white hover:text-gold-400 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200">
                Client Portal
              </Link>
            </div>

            <ul className="space-y-2">
              {['No hidden fees', 'Free initial consultation', 'IRS representation included'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-white/55 text-sm">
                  <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-12 pt-10 border-t border-white/10">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl lg:text-3xl font-bold text-gold-400 font-serif">{s.value}</div>
                  <div className="text-white/45 text-xs mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – feature cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-gold-400/30 hover:bg-white/8 transition-all duration-300 ${
                  i % 2 === 1 ? 'mt-8' : ''
                }`}
              >
                <div className="w-11 h-11 bg-gold-400/15 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-white font-semibold mb-1.5 text-sm">{f.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F9FAFB" />
        </svg>
      </div>
    </section>
  );
}
