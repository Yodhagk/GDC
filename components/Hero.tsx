'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Play, MapPin, Shield, TrendingUp, Award } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlobeScene = dynamic(() => import('./GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full border border-gold-400/20 animate-pulse" />
    </div>
  ),
});

const badges = [
  { icon: MapPin,     label: 'Lilburn, GA' },
  { icon: Shield,     label: 'IRS Certified' },
  { icon: TrendingUp, label: '$50M+ Saved' },
  { icon: Award,      label: '15+ Years' },
];

const ease = 'easeOut' as const;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY  = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #020912 0%, #040B18 45%, #071228 100%)' }}
    >
      {/* ── Background layers ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[55%] h-full"
          style={{ background: 'linear-gradient(to left, rgba(200,146,14,0.12) 0%, transparent 65%)' }} />
        <div className="absolute -top-20 right-[5%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,60,140,0.18) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,146,14,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,14,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,9,18,0.6) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left column – copy ────────────────────────── */}
          <motion.div style={{ y: textY }}>

            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.7, ease }}
              className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full"
              style={{ background: 'rgba(200,146,14,0.10)', border: '1px solid rgba(200,146,14,0.30)' }}
            >
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-gold-400 text-xs font-semibold tracking-wide uppercase">
                Trusted by 5,000+ clients across Georgia &amp; the USA
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease }}
              className="font-serif font-bold leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
            >
              <span className="text-white">Georgia&apos;s Trusted Expert</span>
              <br />
              <span className="text-white">for Tax &amp;</span>
              <span className="block" style={{
                background: 'linear-gradient(110deg, #A07500 0%, #E8C040 30%, #C8920E 55%, #E8C040 75%, #A07500 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}>
                Immigration Success
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.30, duration: 0.7, ease }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.58)' }}
            >
              Expert tax planning, immigration guidance, and business compliance solutions
              for individuals and businesses across Atlanta, GA and nationwide.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
                Book Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portal/login"
                className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(200,146,14,0.5)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.18)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)';
                }}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Your Assessment
              </Link>
            </motion.div>

            {/* Trust badges strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.60, duration: 0.7, ease }}
              className="flex flex-wrap gap-3"
            >
              {badges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-gold-400" />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right column – 3D Globe ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            style={{ y: globeY }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.08) 0%, transparent 65%)', filter: 'blur(30px)' }} />
            {/* Decorative rings */}
            <div className="absolute w-[520px] h-[520px] rounded-full"
              style={{ border: '1px solid rgba(200,146,14,0.15)', animation: 'spin 30s linear infinite' }} />
            <div className="absolute w-[480px] h-[480px] rounded-full"
              style={{ border: '1px dashed rgba(200,146,14,0.08)', animation: 'spin 20s linear infinite reverse' }} />

            <div className="w-[480px] h-[480px]">
              <GlobeScene />
            </div>

            {/* Floating info cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 -left-6 px-4 py-3 rounded-xl cursor-default"
              style={{
                background: 'rgba(7,18,40,0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(200,146,14,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Approval Rate</div>
              <div className="font-serif text-2xl font-bold" style={{
                background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>98%</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute bottom-12 -right-4 px-4 py-3 rounded-xl cursor-default"
              style={{
                background: 'rgba(7,18,40,0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(200,146,14,0.25)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Cases Handled</div>
              <div className="font-serif text-2xl font-bold" style={{
                background: 'linear-gradient(135deg, #E8C040, #C8920E)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>5,000+</div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, rgba(200,146,14,0.5), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
