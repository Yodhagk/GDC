'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    location: 'Austin, TX',
    initials: 'SJ',
    rating: 5,
    color: '#3B82F6',
    text: 'Golden Dollar saved me over $14,000 on my business taxes last year. They found deductions I never knew existed and walked me through everything clearly. I won\'t trust anyone else with my finances.',
    result: '$14K Saved',
  },
  {
    name: 'Michael Chen',
    role: 'Tech Entrepreneur',
    location: 'San Francisco, CA',
    initials: 'MC',
    rating: 5,
    color: '#10B981',
    text: 'When the IRS sent me an audit notice, I panicked. Golden Dollar\'s team took over completely, handled all the correspondence, and got the audit closed with zero additional liability. Truly life-saving.',
    result: 'Audit Won',
  },
  {
    name: 'Amanda Williams',
    role: 'Freelance Designer',
    location: 'Chicago, IL',
    initials: 'AW',
    rating: 5,
    color: '#E8C040',
    text: 'As a freelancer, tax season was always a nightmare. Now with their client portal, I upload documents year-round and they handle everything. My tax bill dropped significantly too!',
    result: '40% Less Tax',
  },
  {
    name: 'Robert Davis',
    role: 'Real Estate Investor',
    location: 'Miami, FL',
    initials: 'RD',
    rating: 5,
    color: '#F472B6',
    text: 'Managing taxes across multiple investment properties was overwhelming. Golden Dollar built a custom strategy that maximized my depreciation and reduced my effective tax rate dramatically.',
    result: 'Multi-Property',
  },
  {
    name: 'Priya Sharma',
    role: 'H-1B Visa Holder',
    location: 'Seattle, WA',
    initials: 'PS',
    rating: 5,
    color: '#A78BFA',
    text: 'Their immigration team guided me through my H-1B renewal and green card process seamlessly. I got my approval in record time. They made the entire journey stress-free and clear.',
    result: 'Green Card Approved',
  },
  {
    name: 'James O\'Brien',
    role: 'Business Owner',
    location: 'Alpharetta, GA',
    initials: 'JO',
    rating: 5,
    color: '#34D399',
    text: 'With multiple business entities and investment properties across several US states, I needed a firm that truly understood cross-border taxation. Golden Dollar delivered a strategy that saved six figures annually.',
    result: '$100K+ Saved',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = testimonials.length;

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setActive(p => (p + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [total]);

  const go = (dir: number) => {
    setDirection(dir);
    setActive(p => (p + dir + total) % total);
  };

  const t = testimonials[active];

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #040B18 0%, #071228 55%, #040B18 100%)' }}
    >
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(30,80,180,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-tag">Client Stories</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mt-5 mb-4">
            Trusted by Thousands
            <span className="block" style={{
              background: 'linear-gradient(135deg, #E8C040, #C8920E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Across Georgia &amp; the USA</span>
          </h2>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${t.color}60 50%, transparent 100%)` }} />
            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${t.color}12 0%, transparent 65%)`, filter: 'blur(20px)' }} />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar + info */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold font-serif text-xl mb-3"
                      style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`, border: `1px solid ${t.color}40` }}>
                      {t.initials}
                    </div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{t.role}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{t.location}</div>
                    <div className="mt-3"><Stars count={t.rating} /></div>
                    {/* Result badge */}
                    <div className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: `${t.color}15`, border: `1px solid ${t.color}30`, color: t.color }}>
                      {t.result}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="flex-1">
                    <Quote className="w-10 h-10 mb-4" style={{ color: `${t.color}40` }} />
                    <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {t.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className="transition-all duration-300 rounded-full cursor-pointer"
                    style={{
                      width: i === active ? 24 : 6,
                      height: 6,
                      background: i === active ? 'linear-gradient(90deg, #E8C040, #C8920E)' : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,146,14,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,146,14,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4 text-white/60" />
                </button>
                <button
                  onClick={() => go(1)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,146,14,0.4)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,146,14,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom preview cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3"
        >
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
              className="p-3 rounded-xl transition-all duration-300 text-center cursor-pointer"
              style={{
                background: i === active ? 'rgba(200,146,14,0.10)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === active ? 'rgba(200,146,14,0.30)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white mx-auto mb-2"
                style={{ background: `${t.color}25`, border: `1px solid ${t.color}30` }}>
                {t.initials}
              </div>
              <div className="text-xs text-white/50 truncate">{t.name.split(' ')[0]}</div>
            </button>
          ))}
        </motion.div>

        {/* Aggregate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl px-8 py-5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <div className="font-serif text-4xl font-bold" style={{
              background: 'linear-gradient(135deg, #E8C040, #C8920E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>4.9</div>
            <div>
              <Stars count={5} />
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Based on 840+ verified reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
