import Link from 'next/link';
import { DollarSign } from 'lucide-react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal portal header */}
      <header className="bg-navy-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
            </div>
            <div className="leading-none">
              <span className="text-white font-serif font-bold text-sm">Golden Dollar</span>
              <span className="text-gold-400 text-[9px] block tracking-[0.2em] uppercase">
                Client Portal
              </span>
            </div>
          </Link>
          <Link href="/" className="text-white/50 hover:text-white text-xs transition-colors">
            ← Back to website
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
