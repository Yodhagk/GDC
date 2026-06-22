import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax Consultant Lawrenceville GA | Immigration | Business Registration',
  description: 'Trusted tax consultant in Lawrenceville, GA. Federal & state tax filing, immigration consulting, H-1B visa, and LLC formation. Gwinnett County seat. Free consultation.',
  alternates: { canonical: `${BASE}/locations/lawrenceville-ga` },
  keywords: ['tax consultant Lawrenceville GA', 'tax filing Lawrenceville Georgia', 'immigration consultant Lawrenceville', 'tax preparation Gwinnett County', 'IRS enrolled agent Lawrenceville', 'business registration Lawrenceville GA'],
  openGraph: {
    url: `${BASE}/locations/lawrenceville-ga`,
    title: 'Tax & Immigration Consultant Lawrenceville GA | Golden Dollar Consultancy',
    description: 'Expert tax filing and immigration consulting in Lawrenceville, GA (Gwinnett County). Free consultation.',
  },
};

const faqs = [
  {
    question: 'Do you serve clients in Lawrenceville, GA?',
    answer: 'Yes. Lawrenceville is the county seat of Gwinnett County and is very close to our Lilburn office. We serve individuals, families, and businesses throughout Lawrenceville with tax preparation, IRS audit representation, immigration consulting, and business formation services.',
  },
  {
    question: 'Can you help me register a business in Lawrenceville?',
    answer: 'Absolutely. We handle LLC and corporation formation, EIN applications, registered agent services, and annual compliance filings. If you\'re starting a business in Lawrenceville or anywhere in Georgia, we provide end-to-end formation services.',
  },
];

export default function LawrencevillePage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: 'Home', url: BASE }, { name: 'Locations', url: `${BASE}/locations` }, { name: 'Lawrenceville, GA', url: `${BASE}/locations/lawrenceville-ga` }]),
    faqSchema(faqs),
  ];
  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <LocalServicePage city={{
        name: 'Lawrenceville',
        state: 'GA',
        slug: 'lawrenceville-ga',
        county: 'Gwinnett County',
        tagline: 'Gwinnett County\'s Trusted Tax & Immigration Specialists',
        intro: 'As Gwinnett County\'s county seat, Lawrenceville is home to thousands of families and businesses who rely on Golden Dollar Consultancy for expert tax preparation, immigration consulting, and business formation services.',
        nearbyAreas: ['Lilburn', 'Buford', 'Suwanee', 'Grayson', 'Snellville', 'Duluth'],
      }} />
      <FAQSection faqs={faqs} title="Lawrenceville Tax & Immigration FAQs" />
    </>
  );
}
