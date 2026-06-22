'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle, User, Calendar, FileText, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Select Service',   icon: Sparkles },
  { id: 2, label: 'Tell Us About You', icon: User },
  { id: 3, label: 'Pick a Date',       icon: Calendar },
  { id: 4, label: 'Confirm',            icon: CheckCircle },
];

const SERVICES = [
  { id: 'tax',         label: 'Tax Planning',           desc: 'Individual or corporate tax strategy', color: '#3B82F6' },
  { id: 'immigration', label: 'Immigration Consulting',  desc: 'Visa, green card & global mobility',  color: '#E8C040' },
  { id: 'business',   label: 'Business Setup',          desc: 'Formation, EIN & compliance',         color: '#10B981' },
  { id: 'combined',   label: 'Full Advisory Package',   desc: 'Tax + immigration + compliance',      color: '#A78BFA' },
];

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

type Form = {
  service: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 50 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -50 }),
};

export default function BookingWizard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Form>({
    service: '', name: '', email: '', phone: '', date: '', time: '', message: '',
  });

  const next = () => { setDir(1); setStep(s => Math.min(s + 1, 4)); };
  const prev = () => { setDir(-1); setStep(s => Math.max(s - 1, 1)); };

  const canNext =
    (step === 1 && !!form.service) ||
    (step === 2 && !!form.name && !!form.email) ||
    (step === 3 && !!form.date && !!form.time) ||
    step === 4;

  const handleConfirm = () => setDone(true);

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#fff',
    width: '100%',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #071228 0%, #040B18 60%)' }}
    >
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,146,14,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-tag">Consultation</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mt-5 mb-4">
            Book Your
            <span style={{
              background: 'linear-gradient(135deg, #E8C040, #C8920E)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}> Expert Session</span>
          </h2>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Free 30-minute consultation with a licensed professional. No obligation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
          }}
        >
          {/* Step indicator */}
          {!done && (
            <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-0">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = step > s.id;
                  const isActive = step === s.id;
                  return (
                    <div key={s.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isDone ? 'linear-gradient(135deg, #E8C040, #C8920E)' : isActive ? 'rgba(200,146,14,0.20)' : 'rgba(255,255,255,0.05)',
                            border: isActive ? '1px solid rgba(200,146,14,0.50)' : isDone ? 'none' : '1px solid rgba(255,255,255,0.10)',
                          }}
                        >
                          {isDone
                            ? <CheckCircle className="w-4 h-4 text-navy-900" />
                            : <Icon className="w-4 h-4" style={{ color: isActive ? '#E8C040' : 'rgba(255,255,255,0.30)' }} />
                          }
                        </div>
                        <span className="text-[10px] font-semibold text-center leading-tight hidden sm:block"
                          style={{ color: isActive ? '#E8C040' : isDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)' }}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-px mx-2 transition-all duration-500"
                          style={{ background: step > s.id ? 'linear-gradient(90deg, #C8920E, #E8C040)' : 'rgba(255,255,255,0.08)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="p-8 min-h-[340px]">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(200,146,14,0.2), rgba(200,146,14,0.05))', border: '1px solid rgba(200,146,14,0.3)' }}>
                  <CheckCircle className="w-10 h-10 text-gold-400" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white mb-3">You're Confirmed!</h3>
                <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.50)' }}>
                  Your consultation request has been received. A specialist will reach out within 24 hours to confirm your appointment.
                </p>
                <div className="rounded-xl p-5 mb-6 text-left"
                  style={{ background: 'rgba(200,146,14,0.08)', border: '1px solid rgba(200,146,14,0.20)' }}>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span style={{ color: 'rgba(255,255,255,0.40)' }}>Service</span><br /><span className="text-white font-medium">{SERVICES.find(s => s.id === form.service)?.label}</span></div>
                    <div><span style={{ color: 'rgba(255,255,255,0.40)' }}>Name</span><br /><span className="text-white font-medium">{form.name}</span></div>
                    <div><span style={{ color: 'rgba(255,255,255,0.40)' }}>Date</span><br /><span className="text-white font-medium">{form.date}</span></div>
                    <div><span style={{ color: 'rgba(255,255,255,0.40)' }}>Time</span><br /><span className="text-white font-medium">{form.time}</span></div>
                  </div>
                </div>
                <button
                  onClick={() => { setDone(false); setStep(1); setForm({ service: '', name: '', email: '', phone: '', date: '', time: '', message: '' }); }}
                  className="text-sm cursor-pointer transition-colors"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  Book another consultation
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >

                  {/* Step 1 – Service selection */}
                  {step === 1 && (
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-6">What can we help you with?</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {SERVICES.map((svc) => (
                          <button
                            key={svc.id}
                            onClick={() => setForm(f => ({ ...f, service: svc.id }))}
                            className="text-left rounded-xl p-5 transition-all duration-200 cursor-pointer"
                            style={{
                              background: form.service === svc.id ? `${svc.color}15` : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${form.service === svc.id ? `${svc.color}50` : 'rgba(255,255,255,0.10)'}`,
                              boxShadow: form.service === svc.id ? `0 8px 24px rgba(0,0,0,0.3)` : 'none',
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full mt-2 shrink-0"
                                style={{ background: svc.color, boxShadow: form.service === svc.id ? `0 0 8px ${svc.color}` : 'none' }} />
                              <div>
                                <div className="text-white font-semibold text-sm">{svc.label}</div>
                                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.40)' }}>{svc.desc}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 – Personal info */}
                  {step === 2 && (
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-6">Tell us about yourself</h3>
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Full Name *</label>
                            <input
                              value={form.name}
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                              placeholder="John Smith"
                              style={inputStyle}
                              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,146,14,0.5)'}
                              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Phone</label>
                            <input
                              value={form.phone}
                              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                              placeholder="+1 (555) 000-0000"
                              style={inputStyle}
                              onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,146,14,0.5)'}
                              onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Email Address *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="john@example.com"
                            style={inputStyle}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,146,14,0.5)'}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Brief Description</label>
                          <textarea
                            rows={3}
                            value={form.message}
                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            placeholder="Briefly describe your situation or question..."
                            style={{ ...inputStyle, resize: 'none' }}
                            onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(200,146,14,0.5)'}
                            onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.12)'}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 – Date/time */}
                  {step === 3 && (
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-6">Choose your preferred time</h3>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Preferred Date *</label>
                          <input
                            type="date"
                            value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            style={{ ...inputStyle, colorScheme: 'dark' }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(200,146,14,0.5)'}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)'}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Preferred Time *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {TIMES.map(t => (
                              <button
                                key={t}
                                onClick={() => setForm(f => ({ ...f, time: t }))}
                                className="py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                                style={{
                                  background: form.time === t ? 'rgba(200,146,14,0.20)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${form.time === t ? 'rgba(200,146,14,0.5)' : 'rgba(255,255,255,0.10)'}`,
                                  color: form.time === t ? '#E8C040' : 'rgba(255,255,255,0.55)',
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4 – Confirm */}
                  {step === 4 && (
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-6">Review & Confirm</h3>
                      <div className="rounded-xl p-6 mb-6"
                        style={{ background: 'rgba(200,146,14,0.06)', border: '1px solid rgba(200,146,14,0.18)' }}>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          {[
                            { label: 'Service', value: SERVICES.find(s => s.id === form.service)?.label ?? '—' },
                            { label: 'Name',    value: form.name || '—' },
                            { label: 'Email',   value: form.email || '—' },
                            { label: 'Phone',   value: form.phone || 'Not provided' },
                            { label: 'Date',    value: form.date || '—' },
                            { label: 'Time',    value: form.time || '—' },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</span>
                              <div className="text-white font-medium mt-0.5">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        By confirming, you agree to be contacted by our team. This is a free consultation with no obligation.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Nav buttons */}
          {!done && (
            <div className="px-8 pb-8 flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 1}
                className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 disabled:opacity-30 cursor-pointer disabled:cursor-default"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 4 ? (
                <button
                  onClick={next}
                  disabled={!canNext}
                  className="btn-gold flex items-center gap-2 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="btn-gold flex items-center gap-2 text-sm cursor-pointer"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                >
                  Confirm Booking <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Alternative */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm mt-6"
          style={{ color: 'rgba(255,255,255,0.30)' }}
        >
          Prefer to call?{' '}
          <a href="tel:+14692699784" className="transition-colors cursor-pointer"
            style={{ color: 'rgba(200,146,14,0.7)' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(200,146,14,0.7)'}>
            +1 (469) 269-9784
          </a>
        </motion.p>
      </div>
    </section>
  );
}
