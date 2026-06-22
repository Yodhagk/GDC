'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

// Minimal SVG logo mark
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="url(#gold-ring)" strokeWidth="1.5" />
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Georgia, serif" fill="url(#gold-text)">G</text>
      <defs>
        <linearGradient id="gold-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C040" />
          <stop offset="1" stopColor="#C8920E" />
        </linearGradient>
        <linearGradient id="gold-text" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C040" />
          <stop offset="1" stopColor="#C8920E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed z-50 transition-all duration-400',
          scrolled
            ? 'top-0 left-0 right-0 py-0'
            : 'top-4 left-4 right-4 rounded-2xl'
        )}
        style={{
          background: scrolled
            ? 'rgba(4,11,24,0.96)'
            : 'rgba(4,11,24,0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
          border: scrolled ? undefined : '1px solid rgba(255,255,255,0.08)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : '0 8px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top gold shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.4) 50%, transparent 100%)' }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <LogoMark />
              </div>
              <div className="leading-none">
                <div className="text-white font-serif font-bold text-base tracking-wide">Golden Dollar</div>
                <div className="text-xs font-semibold tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(200,146,14,0.7)', fontSize: '9px' }}>Consultancy</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      color: active ? '#E8C040' : 'rgba(255,255,255,0.65)',
                      background: active ? 'rgba(200,146,14,0.10)' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.95)';
                        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)';
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, #E8C040, transparent)' }} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/portal/login"
                className="text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#fff'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'}
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="relative overflow-hidden text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(110deg, #A07500 0%, #E8C040 35%, #C8920E 55%, #E8C040 75%, #A07500 100%)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 4s linear infinite',
                  color: '#040B18',
                  boxShadow: '0 4px 16px -4px rgba(200,146,14,0.50)',
                }}
              >
                Free Consultation
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl overflow-hidden md:hidden"
            style={{
              background: 'rgba(4,11,24,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: pathname === link.href ? '#E8C040' : 'rgba(255,255,255,0.65)',
                    background: pathname === link.href ? 'rgba(200,146,14,0.10)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Link
                  href="/portal/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm rounded-xl cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  Sign In to Portal
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-bold px-4 py-3.5 rounded-xl cursor-pointer"
                  style={{
                    background: 'linear-gradient(110deg, #A07500, #E8C040, #C8920E)',
                    color: '#040B18',
                  }}
                >
                  Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
