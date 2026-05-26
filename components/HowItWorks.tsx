'use client';

import { useEffect, useRef, useState } from 'react';
import { UserPlus, UploadCloud, CheckCircle, Lock, ShieldCheck, Award, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    desc: 'Register in minutes and receive your unique Customer ID. This ID organizes all your documents securely in the cloud.',
    color: 'from-gold-400 to-gold-500',
    glow: 'shadow-gold-400/40',
  },
  {
    step: '02',
    icon: UploadCloud,
    title: 'Upload Your Documents',
    desc: 'Use our secure portal to upload tax forms, receipts, W-2s, 1099s, and any other relevant files directly to your private folder.',
    color: 'from-navy-600 to-navy-800',
    glow: 'shadow-navy-600/40',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'We Handle the Rest',
    desc: 'Your dedicated consultant reviews your documents, prepares your returns, and keeps you updated every step of the way.',
    color: 'from-gold-500 to-gold-600',
    glow: 'shadow-gold-500/40',
  },
];

const trustBadges = [
  { icon: Lock, label: 'Secure Dropbox Storage', desc: '256-bit encrypted' },
  { icon: ShieldCheck, label: 'IRS Compliant', desc: 'Fully regulated' },
  { icon: Award, label: 'Licensed CPAs', desc: 'Certified experts' },
  { icon: BadgeCheck, label: 'NATP Member', desc: 'Professional standards' },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Animate the connector line after cards appear
          setTimeout(() => setLineWidth(100), 400);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="section-tag">Simple Process</span>
          <h2 className="section-heading mt-4 mb-4">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Getting started is easy. Our streamlined process means you spend less time on paperwork
            and more time doing what you love.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-16">

          {/* Animated connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gray-100 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${lineWidth}%` }}
            />
          </div>

          {steps.map((s, i) => (
            <div
              key={s.step}
              className={`relative text-center group transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Icon */}
              <div className="relative inline-block mb-6">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg ${s.glow} transition-all duration-300 group-hover:scale-110 group-hover:rotate-0 rotate-3 group-hover:shadow-xl`}
                >
                  <s.icon className="w-8 h-8 text-white -rotate-3 group-hover:rotate-0 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-navy-800 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
              </div>

              {/* Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gold-200 hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-serif text-xl font-bold text-navy-800 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mb-16 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <Link href="/portal/register" className="btn-gold inline-flex items-center gap-2">
            Create Free Account
          </Link>
        </div>

        {/* Trust Badges */}
        <div
          className={`border-t border-gray-100 pt-12 transition-all duration-700 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-8">
            Trusted & Compliant
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gold-50 border border-gray-100 hover:border-gold-200 rounded-2xl transition-all duration-200 group cursor-default"
              >
                <div className="w-10 h-10 bg-white border border-gray-200 group-hover:border-gold-300 rounded-xl flex items-center justify-center shadow-sm transition-colors">
                  <badge.icon className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-center">
                  <p className="text-navy-800 font-semibold text-xs">{badge.label}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
