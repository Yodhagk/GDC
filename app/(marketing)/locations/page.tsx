import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { breadcrumbSchema } from '@/lib/seo-schemas';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Locations | Atlanta Metro GA',
  description: 'Golden Dollar Consultancy serves the entire Atlanta metro area — Atlanta, Lilburn, Norcross, Lawrenceville, Duluth, Alpharetta, Johns Creek & surrounding Gwinnett County cities.',
  alternates: { canonical: `${BASE}/locations` },
  openGraph: {
    url: `${BASE}/locations`,
    title: 'Our Locations | Atlanta Metro Tax & Immigration Services',
    description: 'Serving Atlanta, Lilburn, Norcross, Lawrenceville, Duluth, Alpharetta, and Johns Creek. Free consultation.',
  },
};

const cities = [
  { name: 'Atlanta', state: 'GA', href: '/locations/atlanta-ga', desc: 'Fulton / Gwinnett County · Full tax, immigration & visa services' },
  { name: 'Lilburn', state: 'GA', href: '/locations/lilburn-ga', desc: 'Our headquarters · Walk-ins welcome · Gwinnett County' },
  { name: 'Norcross', state: 'GA', href: '/locations/norcross-ga', desc: 'Technology Park area · Diverse immigrant community' },
  { name: 'Lawrenceville', state: 'GA', href: '/locations/lawrenceville-ga', desc: 'Gwinnett County seat · Business formation specialists' },
  { name: 'Duluth', state: 'GA', href: '/locations/duluth-ga', desc: 'Korean & South Asian community · NRI tax specialists' },
  { name: 'Alpharetta', state: 'GA', href: '/locations/alpharetta-ga', desc: 'Tech hub · H-1B & corporate tax experts' },
  { name: 'Johns Creek', state: 'GA', href: '/locations/johns-creek-ga', desc: 'NRI community · H-1B & estate tax planning' },
];

export default function LocationsPage() {
  const bc = breadcrumbSchema([
    { name: 'Home', url: BASE },
    { name: 'Locations', url: `${BASE}/locations` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />

      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #020912 0%, #040B18 50%, #071228 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-tag">Our Locations</span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-5">
            Serving the Entire<br />
            <span style={{ background: 'linear-gradient(110deg,#A07500,#E8C040,#C8920E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Atlanta Metro Area
            </span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-10" style={{ color: 'rgba(255,255,255,0.58)' }}>
            Headquartered in Lilburn, GA, we serve individuals and businesses across
            Gwinnett County and the greater Atlanta metropolitan area — in person or virtually.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ background: '#071228' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((city) => (
              <Link key={city.href} href={city.href}
                className="rounded-2xl p-6 transition-all duration-300 group cursor-pointer block"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gold-400" />
                  <span className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                    {city.name}, {city.state}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{city.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#E8C040' }}>
                  View page <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-2xl p-8 text-center"
            style={{ background: 'rgba(200,146,14,0.07)', border: '1px solid rgba(200,146,14,0.20)' }}>
            <h2 className="font-serif text-2xl font-bold text-white mb-3">Don't See Your City?</h2>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              We serve all of Georgia and the United States — virtual consultations available nationwide.
            </p>
            <Link href="/contact" className="btn-gold inline-flex items-center gap-2 cursor-pointer">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
