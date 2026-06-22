import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Johns Creek GA | NRI Tax | H-1B Visa',
  description: 'Tax consultant in Johns Creek, GA. NRI tax filing, H-1B immigration, business registration for Johns Creek\'s South Asian & international community. Free consultation.',
  alternates: { canonical: `${BASE}/locations/johns-creek-ga` },
  keywords: ['tax consultant Johns Creek GA', 'NRI tax consultant Johns Creek', 'immigration consultant Johns Creek Georgia', 'H1B visa Johns Creek GA', 'Indian tax consultant Johns Creek', 'tax preparation Johns Creek Atlanta'],
  openGraph: {
    url: `${BASE}/locations/johns-creek-ga`,
    title: 'Tax & Immigration Consultant Johns Creek GA | Golden Dollar Consultancy',
    description: 'NRI tax filing, H-1B visa, and immigration consulting in Johns Creek, GA. Free consultation.',
  },
};

const faqs = [
  {
    question: 'Do you offer NRI tax services in Johns Creek, GA?',
    answer: 'Yes. Johns Creek has a large Indian-American and South Asian community. We specialize in NRI tax returns, FBAR filings, Indian income disclosure, DTAA treaty benefits, and H-1B/L-1 visa consulting — all with bilingual service in English and Hindi.',
  },
  {
    question: 'Can you help Johns Creek residents with H-1B renewals and extensions?',
    answer: 'Absolutely. We handle H-1B extensions, transfers, amendments, and cap-exempt petitions for Johns Creek professionals. We also assist with H-4 EAD applications for dependents and EB-1/EB-2 green card petitions.',
  },
];

export default function JohnsCreekPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: 'Home', url: BASE }, { name: 'Locations', url: `${BASE}/locations` }, { name: 'Johns Creek, GA', url: `${BASE}/locations/johns-creek-ga` }]),
    faqSchema(faqs),
  ];
  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <LocalServicePage city={{
        name: 'Johns Creek',
        state: 'GA',
        slug: 'johns-creek-ga',
        county: 'Fulton County',
        tagline: 'NRI Tax Specialists & Immigration Experts for Johns Creek Families',
        intro: 'Johns Creek is one of the Atlanta metro\'s most affluent and diverse cities, with a thriving South Asian professional community. Golden Dollar Consultancy provides specialized NRI tax filing, H-1B visa consulting, and estate tax planning for Johns Creek residents.',
        nearbyAreas: ['Alpharetta', 'Duluth', 'Cumming', 'Roswell', 'Suwanee', 'Peachtree Corners'],
      }} />
      <FAQSection faqs={faqs} title="Johns Creek Tax & Immigration FAQs" />
    </>
  );
}
