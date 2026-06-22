'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="url(#footer-ring)" strokeWidth="1.5" />
      <text x="16" y="21" textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Georgia, serif" fill="url(#footer-text)">G</text>
      <defs>
        <linearGradient id="footer-ring" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C040" /><stop offset="1" stopColor="#C8920E" />
        </linearGradient>
        <linearGradient id="footer-text" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E8C040" /><stop offset="1" stopColor="#C8920E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#020810', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 cursor-pointer">
              <LogoMark />
              <div>
                <div className="text-white font-serif font-bold text-lg leading-tight">Golden Dollar</div>
                <div className="text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: 'rgba(200,146,14,0.7)' }}>Consultancy</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Your trusted global partner for expert tax consulting, immigration services, and business compliance.
              Serving professionals and families in 30+ countries.
            </p>
            <div className="space-y-3">
              <a href="tel:+14692699784" className="flex items-center gap-3 text-sm transition-colors cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'}>
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                +1 (469) 269-9784
              </a>
              <a href="mailto:priti@goldendollarconsulting.com" className="flex items-center gap-3 text-sm transition-colors cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'}>
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                priti@goldendollarconsulting.com
              </a>
              <div className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                3730 Graham Way SW<br />Lilburn, GA 30047
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: 'rgba(200,146,14,0.70)' }}>Services</h3>
            <ul className="space-y-2.5">
              {['Tax Filing', 'USA VISA', 'Bookkeeping', 'Company Registration', 'Corporate Tax', 'Tax Planning'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-sm transition-colors cursor-pointer" style={{ color: 'rgba(255,255,255,0.40)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)'}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: 'rgba(200,146,14,0.70)' }}>Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us',      href: '/about' },
                { label: 'Our Services',  href: '/services' },
                { label: 'Contact',       href: '/contact' },
                { label: 'Client Portal', href: '/portal/login' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm transition-colors cursor-pointer" style={{ color: 'rgba(255,255,255,0.40)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#E8C040'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.40)'}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            © {year} Golden Dollar Consultancy LLC. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.18)' }}>
            Licensed Tax Consultants · IRS Enrolled Agents · NATP Member
          </p>
        </div>
      </div>
    </footer>
  );
}
