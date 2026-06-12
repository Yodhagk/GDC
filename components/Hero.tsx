'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Users, Award, TrendingUp, Star, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'USA VISA',
    desc: 'Visa, green card & citizenship guidance',
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
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--navy-deep)' }}>

      {/* ── Rich layered background ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base deep gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #040B18 0%, #071228 45%, #0A1A38 100%)',
        }} />

        {/* Large warm gold glow — right side */}
        <div className="absolute top-0 right-0 w-[60%] h-full" style={{
          background: 'linear-gradient(to left, rgba(200,146,14,0.10) 0%, transparent 70%)',
        }} />

        {/* Primary gold orb — top-right */}
        <div className="absolute -top-10 right-10 w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,146,14,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        {/* Secondary gold orb — bottom-left */}
        <div className="absolute bottom-0 -left-20 w-[450px] h-[450px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,146,14,0.10) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />

        {/* Accent orb — center-left */}
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,146,14,0.07) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />

        {/* Decorative concentric circles */}
        <div className="absolute -right-24 top-1/3 w-96 h-96 rounded-full border border-gold-400/10" />
        <div className="absolute -right-40 top-1/3 w-[560px] h-[560px] rounded-full border border-gold-400/6" />
        <div className="absolute -right-56 top-1/3 w-[720px] h-[720px] rounded-full border border-gold-400/3" />

        {/* Fine gold grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage:
            'linear-gradient(rgba(200,146,14,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,14,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Bottom fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(249,250,251,0.08))',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left — copy ──────────────────────────────────────────────── */}
          <div>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-gold-400/30"
              style={{ background: 'rgba(200,146,14,0.10)' }}>
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span className="text-gold-400 text-xs font-semibold tracking-wide">
                Trusted by 2,500+ clients nationwide
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.05] mb-6">
              <span className="text-white">Expert Tax</span>
              <span className="block text-gold-gradient animate-shimmer" style={{
                background: 'linear-gradient(110deg, #A07500 0%, #E8C040 30%, #C8920E 55%, #E8C040 75%, #A07500 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Consulting
              </span>
              <span className="block text-2xl lg:text-3xl font-normal mt-2 font-sans" style={{ color: 'rgba(255,255,255,0.45)' }}>
                you can count on.
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="text-base lg:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Navigate complex tax laws with confidence. Golden Dollar Consultancy delivers
              personalized strategies, IRS compliance, and financial peace of mind — for
              individuals and businesses across the USA.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/contact" className="btn-gold flex items-center gap-2">
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portal/login"
                className="border border-white/20 hover:border-gold-400/50 text-white hover:text-gold-400 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200">
                Client Portal
              </Link>
            </div>

            {/* Checklist */}
            <ul className="space-y-2.5">
              {['No hidden fees', 'Free initial consultation', 'IRS representation included'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* ── Stats bar ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-4 gap-4 mt-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl lg:text-3xl font-bold font-serif" style={{
                    background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {s.value}
                  </div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(255,255,255,0.40)' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — feature cards ─────────────────────────────────────── */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`card-glass group ${i % 2 === 1 ? 'mt-8' : ''}`}
              >
                {/* Icon with gold glow ring */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(200,146,14,0.15)',
                    border: '1px solid rgba(200,146,14,0.25)',
                  }}>
                  <f.icon className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-white font-semibold mb-1.5 text-sm">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.40)' }}>{f.desc}</p>

                {/* Bottom gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,14,0.7), transparent)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave into next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#FDFAF5" />
        </svg>
      </div>
    </section>
  );
}
