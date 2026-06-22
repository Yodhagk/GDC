import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Lilburn GA | Gwinnett County | Golden Dollar',
  description: 'Tax consultant in Lilburn, GA. IRS-enrolled agents for tax filing, immigration, H-1B visa & business registration. Gwinnett County. Walk-ins welcome. Free consultation.',
  alternates: { canonical: `${BASE}/locations/lilburn-ga` },
  keywords: ['tax consultant Lilburn GA', 'tax filing Lilburn Georgia', 'immigration consultant Lilburn', 'Gwinnett County tax consultant', 'IRS enrolled agent Lilburn', 'tax advisor Lilburn GA', 'H1B consultant Lilburn GA'],
  openGraph: {
    url: `${BASE}/locations/lilburn-ga`,
    title: 'Tax & Immigration Consultant Lilburn GA | Golden Dollar Consultancy',
    description: 'Located in Lilburn, GA. Expert tax, immigration, and visa consulting for Gwinnett County. Free consultation.',
  },
};

const faqs = [
  {
    question: 'Where is Golden Dollar Consultancy located in Lilburn, GA?',
    answer: 'Our office is located at 3730 Graham Way SW, Lilburn, GA 30047. We serve clients across Gwinnett County including Lilburn, Lawrenceville, Norcross, Duluth, and Snellville. Walk-in appointments are welcome during business hours: Mon–Fri 9 AM–6 PM, Sat 10 AM–2 PM.',
  },
  {
    question: 'Do you serve clients in Gwinnett County?',
    answer: 'Yes — Gwinnett County is our home market. We serve clients throughout Gwinnett County including Lilburn, Lawrenceville, Norcross, Duluth, Buford, Snellville, Suwanee, and Grayson with both in-office and virtual consultations.',
  },
  {
    question: 'Can you help with tax returns for South Asian (Indian, Pakistani) families in Gwinnett?',
    answer: 'Absolutely. Gwinnett County has one of the largest South Asian communities in the Southeast. We specialize in NRI tax returns, FBAR/FATCA compliance, Indian income disclosure under DTAA, and H-1B/L-1 visa services — all with bilingual staff who understand the community\'s unique needs.',
  },
];

export default function LilburnPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([
      { name: 'Home', url: BASE },
      { name: 'Locations', url: `${BASE}/locations` },
      { name: 'Lilburn, GA', url: `${BASE}/locations/lilburn-ga` },
    ]),
    faqSchema(faqs),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <LocalServicePage city={{
        name: 'Lilburn',
        state: 'GA',
        slug: 'lilburn-ga',
        county: 'Gwinnett County',
        tagline: 'Our Home Office · Walk-Ins Welcome · Gwinnett\'s Trusted Tax Experts',
        intro: 'Golden Dollar Consultancy is headquartered in Lilburn, GA — right in the heart of Gwinnett County. Since 2009, we\'ve been the go-to tax and immigration firm for Lilburn families, businesses, and the area\'s thriving immigrant community.',
        nearbyAreas: ['Lawrenceville', 'Norcross', 'Snellville', 'Stone Mountain', 'Tucker', 'Duluth', 'Grayson'],
      }} />
      <FAQSection faqs={faqs} title="Lilburn Tax & Immigration FAQs" />
    </>
  );
}
