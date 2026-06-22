import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Atlanta GA | IRS Enrolled Agent | Free Consultation',
  description: 'Best tax consultant in Atlanta, GA. IRS-enrolled agents for tax filing, immigration consulting, H-1B visa, and business registration. Serving Atlanta metro. Free consultation.',
  alternates: { canonical: `${BASE}/locations/atlanta-ga` },
  keywords: ['tax consultant Atlanta GA', 'immigration consultant Atlanta', 'tax filing Atlanta Georgia', 'H-1B visa consultant Atlanta', 'IRS enrolled agent Atlanta', 'tax preparation Atlanta', 'immigration attorney Atlanta GA', 'tax advisor Atlanta'],
  openGraph: {
    url: `${BASE}/locations/atlanta-ga`,
    title: 'Tax & Immigration Consultant Atlanta GA | Golden Dollar Consultancy',
    description: 'Expert tax filing, immigration, H-1B visa, and business registration in Atlanta, GA. 5,000+ clients. Free consultation.',
  },
};

const faqs = [
  {
    question: 'What is the best tax consultant in Atlanta, GA?',
    answer: 'Golden Dollar Consultancy is one of Atlanta\'s top-rated tax consulting firms, with IRS-enrolled agents who specialize in individual, business, and NRI tax returns. We\'ve served 5,000+ clients since 2009 with a 4.9/5 rating. Our Lilburn, GA office is conveniently located in the Atlanta metro area.',
  },
  {
    question: 'Do you offer immigration consulting in Atlanta?',
    answer: 'Yes. We provide comprehensive US immigration consulting in Atlanta including H-1B, L-1, EB-1, EB-2, green card, and citizenship services. Our immigration specialists have a 98% approval rate across all visa categories.',
  },
  {
    question: 'How much does tax filing cost in Atlanta?',
    answer: 'Our Atlanta tax preparation services start at $149 for simple individual returns (1040). Business returns, multi-state filings, and complex returns are quoted after a free consultation. We offer flat-fee pricing — no hourly billing, no hidden charges.',
  },
  {
    question: 'Do you handle IRS audits for Atlanta clients?',
    answer: 'Yes. Our IRS-enrolled agents are authorized to represent clients directly before the IRS in all audit, collection, and appeals matters. Every return we file includes year-round audit support at no additional charge.',
  },
];

export default function AtlantaPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Locations', url: `${BASE}/locations` },
      { name: 'Atlanta, GA', url: `${BASE}/locations/atlanta-ga` },
    ]),
    faqSchema(faqs),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <LocalServicePage city={{
        name: 'Atlanta',
        state: 'GA',
        slug: 'atlanta-ga',
        county: 'Fulton / Gwinnett County',
        tagline: 'IRS-Enrolled Agents · Immigration Specialists · Licensed CPAs',
        intro: 'Golden Dollar Consultancy has been serving Atlanta-area individuals, families, and businesses since 2009. From tax preparation and IRS audit defense to H-1B visas and green card applications — we handle it all under one roof.',
        nearbyAreas: ['Lilburn', 'Norcross', 'Duluth', 'Lawrenceville', 'Alpharetta', 'Johns Creek', 'Smyrna', 'Marietta', 'Decatur', 'Sandy Springs'],
      }} />
      <FAQSection faqs={faqs} title="Atlanta Tax & Immigration FAQs" subtitle="Common questions from Atlanta-area clients." />
    </>
  );
}
