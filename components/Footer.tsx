import Link from 'next/link';
import { DollarSign, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold-400 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-white font-serif font-bold text-lg leading-tight">Golden Dollar</div>
                <div className="text-gold-400 text-[10px] tracking-[0.2em] uppercase font-semibold">Consultancy</div>
              </div>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-6">
              Your trusted partner for expert tax consulting, immigration services, and company registrations.
              Serving individuals and businesses across all 50 states.
            </p>
            <div className="space-y-2.5">
              <a
                href="tel:+14692699784"
                className="flex items-center gap-3 text-white/55 hover:text-gold-400 text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                +1 (469) 269-9784
              </a>
              <a
                href="mailto:priti@goldendollarconsulting.com"
                className="flex items-center gap-3 text-white/55 hover:text-gold-400 text-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-gold-400" />
                priti@goldendollarconsulting.com
              </a>
              <div className="flex items-start gap-3 text-white/55 text-sm">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                3730 Graham Way SW<br />Lilburn, GA 30047
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold-400 text-xs font-bold uppercase tracking-[0.15em] mb-5">Services</h3>
            <ul className="space-y-2.5">
              {[
                'Tax Filing',
                'Immigration',
                'Bookkeeping',
                'Company Registrations',
                'Business Tax',
                'Tax Planning',
              ].map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-white/55 hover:text-gold-400 text-sm transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gold-400 text-xs font-bold uppercase tracking-[0.15em] mb-5">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Services', href: '/services' },
                { label: 'Contact', href: '/contact' },
                { label: 'Client Portal', href: '/portal/login' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/55 hover:text-gold-400 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/35 text-xs">
            © {year} Golden Dollar Consultancy LLC. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            Licensed Tax Consultants · IRS Enrolled Agents · NATP Member
          </p>
        </div>
      </div>
    </footer>
  );
}
