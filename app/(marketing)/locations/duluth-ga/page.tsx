import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Duluth GA | H-1B Visa | NRI Tax | Free Consult',
  description: 'Expert tax consultant in Duluth, GA. Tax filing, H-1B immigration, NRI tax returns & business registration. Serving Gwinnett\'s Korean & South Asian community. Free consultation.',
  alternates: { canonical: `${BASE}/locations/duluth-ga` },
  keywords: ['tax consultant Duluth GA', 'immigration consultant Duluth Georgia', 'H1B visa Duluth GA', 'tax preparation Duluth GA', 'NRI tax filing Duluth', 'Korean tax consultant Duluth GA', 'Indian tax consultant Duluth'],
  openGraph: {
    url: `${BASE}/locations/duluth-ga`,
    title: 'Tax & Immigration Consultant Duluth GA | Golden Dollar Consultancy',
    description: 'Expert tax, immigration, and visa consulting in Duluth, GA. Free consultation.',
  },
};

const faqs = [
  {
    question: 'Do you provide tax services in Duluth, GA?',
    answer: 'Yes. Duluth, GA is part of the Gwinnett County metro area we actively serve. We provide complete federal and state tax preparation, IRS representation, and tax planning for individuals and businesses in Duluth. Virtual appointments are available.',
  },
  {
    question: 'Do you serve the Korean and Indian communities in Duluth?',
    answer: 'Absolutely. Duluth has one of Georgia\'s largest Korean-American communities, and we have experience serving diverse immigrant communities. We understand the tax and immigration complexities that come with living and working in the US as an immigrant, including ITIN applications, foreign income disclosure, and work visa consulting.',
  },
];

export default function DuluthPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: 'Home', url: BASE }, { name: 'Locations', url: `${BASE}/locations` }, { name: 'Duluth, GA', url: `${BASE}/locations/duluth-ga` }]),
    faqSchema(faqs),
  ];
  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <LocalServicePage city={{
        name: 'Duluth',
        state: 'GA',
        slug: 'duluth-ga',
        county: 'Gwinnett County',
        tagline: 'Serving Duluth\'s Diverse Families & Business Community',
        intro: 'Duluth, GA is known for its vibrant international community and thriving small business scene. Golden Dollar Consultancy proudly serves Duluth residents with expert tax preparation, immigration consulting, and business formation services tailored to diverse backgrounds.',
        nearbyAreas: ['Suwanee', 'Buford', 'Norcross', 'Johns Creek', 'Peachtree Corners', 'Lilburn'],
      }} />
      <FAQSection faqs={faqs} title="Duluth Tax & Immigration FAQs" />
    </>
  );
}
