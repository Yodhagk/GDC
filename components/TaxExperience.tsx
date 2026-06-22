'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { BarChart2, Shield, TrendingDown, FileText, ArrowRight, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: TrendingDown,
    title: 'Tax Planning & Advisory',
    desc: 'Optimize your tax position with strategic planning tailored for individuals, entrepreneurs, and corporations.',
    items: ['Strategic tax minimization', 'Multi-year tax projections', 'Investment tax strategies', 'Estate & gift tax planning'],
    glow: 'rgba(59,130,246,0.15)',
    accent: '#3B82F6',
  },
  {
    icon: FileText,
    title: 'Corporate Tax Services',
    desc: 'Comprehensive tax compliance, reporting, and advisory solutions that help businesses reduce risk and maximize profitability.',
    items: ['Corporate tax compliance', 'International tax planning', 'Merger & acquisition tax', 'Transfer pricing'],
    glow: 'rgba(200,146,14,0.15)',
    accent: '#C8920E',
  },
  {
    icon: Shield,
    title: 'Financial Compliance',
    desc: 'Stay compliant with evolving regulations while focusing on business growth.',
    items: ['IRS audit representation', 'FBAR & FATCA reporting', 'Sales & payroll tax', 'Regulatory advisory'],
    glow: 'rgba(16,185,129,0.15)',
    accent: '#10B981',
  },
];

// CSS-based floating 3D financial objects
function FloatingDashboard() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
      {/* Main dashboard card */}
      <motion.div
        animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, 3, 0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: 340,
          background: 'rgba(7,18,40,0.9)',
          border: '1px solid rgba(200,146,14,0.25)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,146,14,0.08) inset',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold text-white/70 tracking-wide">TAX DASHBOARD</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Saving stat */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(200,146,14,0.08)', border: '1px solid rgba(200,146,14,0.15)' }}>
            <div className="text-xs text-white/45 mb-1">Total Tax Saved This Year</div>
            <div className="font-serif text-3xl font-bold" style={{
              background: 'linear-gradient(135deg, #E8C040, #C8920E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>$47,820</div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">↓ 34% vs last year</span>
            </div>
          </div>

          {/* Mini bar chart */}
          <div>
            <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Monthly Savings</div>
            <div className="flex items-end gap-1.5 h-16">
              {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 78, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  className="flex-1 rounded-sm origin-bottom"
                  style={{
                    height: `${h}%`,
                    background: i === 11
                      ? 'linear-gradient(to top, #C8920E, #E8C040)'
                      : 'rgba(200,146,14,0.25)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Status pills */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IRS Compliant
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60A5FA' }}>
              <Shield className="w-3 h-3" />
              Audit Protected
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating shield badge */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-6 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1A4080, #071228)',
          border: '1px solid rgba(200,146,14,0.3)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        <Shield className="w-7 h-7 text-gold-400" />
      </motion.div>

      {/* Floating doc card */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, -2, 0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-4 -left-8 px-4 py-3 rounded-xl"
        style={{
          background: 'rgba(7,18,40,0.95)',
          border: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div className="text-xs text-white/40 mb-0.5">Documents Filed</div>
        <div className="font-serif text-xl font-bold text-white">2,847</div>
      </motion.div>
    </div>
  );
}


export default function TaxExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(160deg, #040B18 0%, #071228 60%, #040B18 100%)' }}
    >
      {/* BG accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full translate-x-1/3"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.07) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,146,14,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,14,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-tag">Tax Intelligence</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mt-5 mb-6">
              Premium Tax
              <span className="block" style={{
                background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Consulting Services</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              From individual returns to complex corporate structures — our licensed CPAs and
              enrolled agents deliver strategies that protect your wealth and maximize efficiency.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block h-[360px]"
          >
            <FloatingDashboard />
          </motion.div>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
              className="rounded-2xl p-7 group relative overflow-hidden cursor-default transition-all duration-400"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = `rgba(${svc.accent.replace('#','').match(/../g)!.map(h=>parseInt(h,16)).join(',')},0.07)`;
                el.style.borderColor = `${svc.accent}40`;
                el.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${svc.accent}20 inset`;
                el.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.03)';
                el.style.borderColor = 'rgba(255,255,255,0.08)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${svc.glow} 0%, transparent 70%)` }} />
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${svc.accent}60 50%, transparent 100%)` }} />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${svc.glow}`, border: `1px solid ${svc.accent}30` }}>
                <svc.icon className="w-5 h-5" style={{ color: svc.accent }} />
              </div>

              <h3 className="text-white font-semibold text-lg mb-3">{svc.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{svc.desc}</p>

              <ul className="space-y-2 mb-6">
                {svc.items.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: svc.accent }} />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3 cursor-pointer"
                style={{ color: svc.accent }}>
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
