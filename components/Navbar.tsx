'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy-800/98 backdrop-blur-md shadow-xl shadow-navy-900/30'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold-400 rounded-full flex items-center justify-center shadow-lg shadow-gold-400/30 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <div className="text-white font-serif font-bold text-lg">Golden Dollar</div>
              <div className="text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Consultancy
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-gold-400 bg-gold-400/10'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/portal/login"
              className="text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              className="bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-gold-400/25 hover:-translate-y-0.5"
            >
              Free Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-navy-800 border-t border-white/10 shadow-2xl">
          <div className="px-4 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href ? 'text-gold-400 bg-gold-400/10' : 'text-white/75 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
              <Link
                href="/portal/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white text-sm font-medium rounded-lg"
              >
                Sign In to Portal
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block bg-gold-400 hover:bg-gold-500 text-navy-900 font-bold text-sm px-4 py-3 rounded-xl text-center transition-colors"
              >
                Free Consultation
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
