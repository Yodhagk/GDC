import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Alpharetta GA | Tech Hub | H-1B Visa Expert',
  description: 'Tax consultant in Alpharetta, GA. Expert US tax filing, H-1B visa, corporate tax & business registration for Alpharetta\'s tech professionals & companies. Free consultation.',
  alternates: { canonical: `${BASE}/locations/alpharetta-ga` },
  keywords: ['tax consultant Alpharetta GA', 'immigration consultant Alpharetta', 'H1B visa Alpharetta Georgia', 'corporate tax Alpharetta GA', 'startup tax advisor Alpharetta', 'business registration Alpharetta GA', 'tech company tax Alpharetta'],
  openGraph: {
    url: `${BASE}/locations/alpharetta-ga`,
    title: 'Tax & Immigration Consultant Alpharetta GA | Golden Dollar Consultancy',
    description: 'Expert tax, H-1B immigration, and business consulting for Alpharetta tech professionals. Free consultation.',
  },
};

const faqs = [
  {
    question: 'Do you serve tech companies and professionals in Alpharetta, GA?',
    answer: 'Yes. Alpharetta is a major tech hub with numerous Fortune 500 offices and high-growth startups. We specialize in corporate tax planning, H-1B visa consulting for tech workers, and business formation services tailored to Alpharetta\'s technology sector.',
  },
  {
    question: 'Can you help Alpharetta startups with business registration and tax setup?',
    answer: 'Absolutely. We help Alpharetta entrepreneurs and startup founders choose the right entity (LLC vs. C-Corp), register in the optimal state, obtain EIN, set up proper accounting, and handle all federal and state tax compliance from day one.',
  },
];

export default function AlpharettaPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: 'Home', url: BASE }, { name: 'Locations', url: `${BASE}/locations` }, { name: 'Alpharetta, GA', url: `${BASE}/locations/alpharetta-ga` }]),
    faqSchema(faqs),
  ];
  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <LocalServicePage city={{
        name: 'Alpharetta',
        state: 'GA',
        slug: 'alpharetta-ga',
        county: 'Fulton County',
        tagline: 'Tax & Immigration Experts for Alpharetta\'s Tech Professionals',
        intro: 'Alpharetta is Georgia\'s technology capital, home to hundreds of major corporations and fast-growing startups. Golden Dollar Consultancy serves Alpharetta\'s professionals and businesses with expert tax planning, H-1B immigration, and corporate compliance services.',
        nearbyAreas: ['Roswell', 'Johns Creek', 'Milton', 'Cumming', 'Dunwoody', 'Marietta'],
      }} />
      <FAQSection faqs={faqs} title="Alpharetta Tax & Business FAQs" />
    </>
  );
}
