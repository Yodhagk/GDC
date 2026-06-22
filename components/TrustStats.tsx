'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, ThumbsUp, Clock, Globe } from 'lucide-react';

const stats = [
  { icon: Users,     value: 5000, suffix: '+', label: 'Successful Cases',  desc: 'Across tax, immigration & business' },
  { icon: ThumbsUp,  value: 98,   suffix: '%', label: 'Approval Rate',     desc: 'Industry-leading success record' },
  { icon: Clock,     value: 15,   suffix: '+', label: 'Years Experience',   desc: 'Since 2009, trusted worldwide' },
  { icon: Globe,     value: 30,   suffix: '+', label: 'Countries Served',   desc: 'Global reach, local expertise' },
];

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #040B18 0%, #071228 50%, #040B18 100%)' }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,146,14,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,146,14,1) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        {/* Decorative circle rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ border: '1px solid rgba(200,146,14,0.06)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ border: '1px solid rgba(200,146,14,0.04)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-tag">By the Numbers</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mt-5 mb-4">
            Results That
            <span style={{
              background: 'linear-gradient(135deg, #E8C040, #C8920E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}> Speak for Themselves</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Fifteen years of delivering exceptional outcomes for clients across the globe.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-8 text-center group overflow-hidden transition-all duration-400 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = 'rgba(200,146,14,0.07)';
                el.style.borderColor = 'rgba(200,146,14,0.30)';
                el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px -10px rgba(200,146,14,0.20)';
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
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.6) 50%, transparent 100%)' }} />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(200,146,14,0.10)', border: '1px solid rgba(200,146,14,0.20)' }}>
                <Icon className="w-5 h-5 text-gold-400" />
              </div>

              {/* Number */}
              <div className="font-serif text-5xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, #E8C040 0%, #C8920E 60%, #E8C040 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                animation: 'shimmer 4s linear infinite',
              }}>
                <AnimatedCounter target={value} suffix={suffix} inView={inView} />
              </div>

              <div className="text-white font-semibold text-sm mb-1.5">{label}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Bottom divider accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 h-px mx-auto max-w-md origin-center"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.4) 50%, transparent 100%)' }}
        />
      </div>
    </section>
  );
}
