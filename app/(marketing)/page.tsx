import type { Metadata } from 'next';
import { localBusinessSchema, serviceSchema, reviewSchema } from '@/lib/seo-schemas';
import Hero from '@/components/Hero';
import TaxExperience from '@/components/TaxExperience';
import TrustStats from '@/components/TrustStats';
import ImmigrationExperience from '@/components/ImmigrationExperience';
import Testimonials from '@/components/Testimonials';
import BookingWizard from '@/components/BookingWizard';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant USA | 5,000+ Clients | Free Consultation',
  description: 'Golden Dollar Consultancy — IRS-enrolled agents offering tax filing, US immigration, H-1B visa, business registration & bookkeeping. Serving Atlanta, GA & nationwide. Free consultation.',
  alternates: { canonical: BASE },
  openGraph: {
    url: BASE,
    title: 'Golden Dollar Consultancy | Expert Tax & Immigration Consulting',
    description: 'Expert US tax filing, immigration consulting, visa services, and business registration. 5,000+ satisfied clients. Book your free consultation today.',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  const schemas = [
    localBusinessSchema(),
    serviceSchema({ name: 'US Tax Filing & Preparation', description: 'Professional federal and state tax filing for individuals and businesses.', url: `${BASE}/services/tax-filing`, category: 'Tax Preparation' }),
    serviceSchema({ name: 'US Immigration Consulting', description: 'Expert H-1B, L-1, green card, and citizenship immigration assistance.', url: `${BASE}/services/immigration`, category: 'Immigration Consulting' }),
    ...reviewSchema([
      { author: 'Rajesh Kumar', rating: 5, body: 'Golden Dollar saved me $12,000 in taxes and got my H-1B approved in record time. Truly the best.', date: '2024-03-15' },
      { author: 'Priya Nair', rating: 5, body: 'Professional, responsive, and incredibly knowledgeable. They handled my entire green card process flawlessly.', date: '2024-05-20' },
    ]),
  ];

  return (
    <main style={{ background: '#040B18' }}>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <Hero />

      {/* Thin divider */}
      <div className="section-divider" />

      <TaxExperience />

      <div className="section-divider" />

      <TrustStats />

      <div className="section-divider" />

      <ImmigrationExperience />

      <div className="section-divider" />

      <Testimonials />

      <div className="section-divider" />

      <BookingWizard />

      {/* Premium CTA Banner */}
      <section className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071228 0%, #0A1838 50%, #071228 100%)' }}>
        {/* Gold radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(200,146,14,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.30) 50%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,146,14,0.15) 50%, transparent 100%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-tag mb-6 inline-flex">Limited Availability</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            Ready to Secure Your
            <span className="block" style={{
              background: 'linear-gradient(110deg, #A07500 0%, #E8C040 35%, #C8920E 55%, #E8C040 75%, #A07500 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 4s linear infinite',
            }}>Financial Future?</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.50)' }}>
            Schedule your complimentary 30-minute consultation with a licensed professional today.
            Zero obligation — maximum value.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn-gold flex items-center gap-2 cursor-pointer">
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+14692699784"
              className="flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              style={{
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.80)',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Phone className="w-4 h-4 text-gold-400" />
              +1 (469) 269-9784
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
