'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Globe, Briefcase, Home, Users, ArrowRight, MapPin, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Work Visas',
    desc: 'Professional support for skilled workers seeking international opportunities across all major visa categories.',
    items: ['H-1B Specialty Occupation', 'L-1 Intracompany Transfer', 'O-1 Extraordinary Ability', 'TN NAFTA Professionals'],
    accent: '#E8C040',
  },
  {
    icon: Briefcase,
    title: 'Business Immigration',
    desc: 'Helping entrepreneurs and investors establish global business presence with the right visa strategies.',
    items: ['EB-5 Investor Visa', 'E-2 Treaty Investor', 'National Interest Waiver', 'PERM Labor Certification'],
    accent: '#60A5FA',
  },
  {
    icon: Home,
    title: 'Permanent Residency',
    desc: 'Expert guidance for long-term settlement and residency pathways for families and individuals.',
    items: ['Family-based petitions', 'Employment-based green card', 'Naturalization & citizenship', 'DACA & renewals'],
    accent: '#34D399',
  },
  {
    icon: Users,
    title: 'Immigration Services',
    desc: 'Guiding individuals, families, and businesses through successful immigration pathways worldwide.',
    items: ['Visa consultation & strategy', 'Application preparation', 'RFE responses & appeals', 'Status adjustments'],
    accent: '#F472B6',
  },
];

// 3D-style visa card visualization
function VisaCard({ delay = 0, rotation = 0, color = '#C8920E', label = 'VISA', country = 'USA' }: {
  delay?: number; rotation?: number; color?: string; label?: string; country?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
      className="absolute rounded-xl overflow-hidden"
      style={{
        rotate: `${rotation}deg`,
        width: 200,
        height: 126,
        background: `linear-gradient(135deg, ${color}15 0%, rgba(7,18,40,0.95) 100%)`,
        border: `1px solid ${color}35`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${color}15 inset`,
      }}
    >
      <div className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: `${color}80` }}>DOCUMENT</span>
          <div className="w-6 h-4 rounded-sm" style={{ background: `linear-gradient(135deg, ${color}, ${color}60)` }} />
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-white">{label}</div>
          <div className="text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{country} — {new Date().getFullYear()}</div>
        </div>
        <div className="flex gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: `${color}${30 + i * 8}` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ImmigrationVisual() {
  const cities = [
    { name: 'New York', x: 22, y: 38 },
    { name: 'London', x: 48, y: 28 },
    { name: 'Dubai', x: 63, y: 44 },
    { name: 'Singapore', x: 79, y: 55 },
    { name: 'Sydney', x: 88, y: 70 },
    { name: 'Toronto', x: 18, y: 30 },
    { name: 'Paris', x: 50, y: 32 },
  ];

  return (
    <div className="relative h-[420px] flex items-center justify-center">
      {/* World map background shape */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(160deg, rgba(7,18,40,0.9) 0%, rgba(4,11,24,0.95) 100%)',
        border: '1px solid rgba(200,146,14,0.15)',
      }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          {cities.flatMap((from, i) =>
            cities.slice(i + 1).map((to, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${from.x}%`} y1={`${from.y}%`}
                x2={`${to.x}%`}  y2={`${to.y}%`}
                stroke="rgba(200,146,14,0.2)"
                strokeWidth={0.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
            ))
          )}
        </svg>

        {/* City markers */}
        {cities.map((city, i) => (
          <motion.div
            key={city.name}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 + 0.5, duration: 0.5 }}
            className="absolute"
            style={{ left: `${city.x}%`, top: `${city.y}%`, transform: 'translate(-50%,-50%)' }}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(200,146,14,0.4)' }}
              />
              <div className="w-3 h-3 rounded-full relative z-10"
                style={{ background: 'linear-gradient(135deg, #E8C040, #C8920E)', boxShadow: '0 0 8px rgba(200,146,14,0.6)' }} />
            </div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold text-white/50">
              {city.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating visa cards */}
      <div className="relative w-full h-full">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 right-8"
        >
          <VisaCard color="#E8C040" label="WORK VISA" country="USA" rotation={-4} delay={0.2} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-8 left-6"
        >
          <VisaCard color="#60A5FA" label="PASSPORT" country="GLOBAL" rotation={6} delay={0.5} />
        </motion.div>

        {/* Success badge */}
        <motion.div
          animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-14 right-10 px-4 py-3 rounded-xl"
          style={{
            background: 'rgba(7,18,40,0.95)',
            border: '1px solid rgba(52,211,153,0.3)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">Visa Approved</span>
          </div>
          <div className="text-xs text-white/40 mt-0.5">98% approval rate</div>
        </motion.div>

        {/* Journey steps */}
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-10 left-6 space-y-1.5"
          style={{
            background: 'rgba(7,18,40,0.95)',
            border: '1px solid rgba(200,146,14,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
          }}
        >
          {['Application', 'Review', 'Approval', 'Arrival'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < 3 ? 'bg-gold-400' : 'border border-white/20'}`}>
                {i < 3 && <CheckCircle className="w-2.5 h-2.5 text-navy-900" />}
              </div>
              <span style={{ color: i < 3 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)' }}>{step}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function ImmigrationExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-28 relative overflow-hidden" style={{ background: '#040B18' }}>
      {/* Subtle blue accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/3"
          style={{ background: 'radial-gradient(circle, rgba(30,80,180,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.06) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="section-tag">Global Mobility</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mt-5 mb-5">
              Immigration Consulting
              <span className="block" style={{
                background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Built for the World</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.50)' }}>
              Guiding individuals, families, and businesses through successful immigration pathways
              in 30+ countries with a 98% approval rate.
            </p>
          </motion.div>
        </div>

        {/* Visual + cards grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ImmigrationVisual />
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-6 group transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(255,255,255,0.06)';
                  el.style.borderColor = `${svc.accent}40`;
                  el.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = 'rgba(255,255,255,0.03)';
                  el.style.borderColor = 'rgba(255,255,255,0.08)';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${svc.accent}15`, border: `1px solid ${svc.accent}30` }}>
                  <svc.icon className="w-5 h-5" style={{ color: svc.accent }} />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">{svc.title}</h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>{svc.desc}</p>
                <Link href="/contact" className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 group-hover:gap-2 cursor-pointer"
                  style={{ color: svc.accent }}>
                  Learn more <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(200,146,14,0.10) 0%, rgba(200,146,14,0.05) 100%)',
            border: '1px solid rgba(200,146,14,0.20)',
          }}
        >
          <div className="flex items-center gap-4">
            <MapPin className="w-8 h-8 text-gold-400 shrink-0" />
            <div>
              <div className="text-white font-semibold">Ready to begin your global journey?</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Free eligibility assessment — no commitment required</div>
            </div>
          </div>
          <Link href="/contact" className="btn-gold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer">
            Start Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
