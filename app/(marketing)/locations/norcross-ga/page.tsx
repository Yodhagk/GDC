import type { Metadata } from 'next';
import { localBusinessSchema, breadcrumbSchema, faqSchema } from '@/lib/seo-schemas';
import LocalServicePage from '@/components/LocalServicePage';
import FAQSection from '@/components/FAQSection';

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  title: 'Tax & Immigration Consultant Norcross GA | H-1B Visa | NRI Tax Filing',
  description: 'Expert tax consultant in Norcross, GA. Tax filing, H-1B visa, immigration consulting & business registration. Serving Gwinnett County\'s diverse community. Free consultation.',
  alternates: { canonical: `${BASE}/locations/norcross-ga` },
  keywords: ['tax consultant Norcross GA', 'immigration consultant Norcross', 'H1B visa consultant Norcross', 'NRI tax filing Norcross GA', 'tax preparation Norcross Georgia', 'immigration lawyer Norcross GA'],
  openGraph: {
    url: `${BASE}/locations/norcross-ga`,
    title: 'Tax & Immigration Consultant Norcross GA | Golden Dollar Consultancy',
    description: 'Tax filing, H-1B visa, and immigration consulting in Norcross, GA. Free consultation.',
  },
};

const faqs = [
  {
    question: 'Do you provide tax services to Norcross, GA residents?',
    answer: 'Yes. We serve individuals and businesses in Norcross, GA with comprehensive tax preparation, IRS representation, and business tax planning. Norcross is approximately 10 minutes from our Lilburn office, and virtual consultations are available for your convenience.',
  },
  {
    question: 'Do you offer H-1B visa consulting for Norcross IT professionals?',
    answer: 'Absolutely. Norcross has a large technology and professional workforce. We provide end-to-end H-1B, L-1, and EB-1 visa consulting for professionals in Norcross and surrounding Technology Park area employers.',
  },
];

export default function NorcrossPage() {
  const schemas = [
    localBusinessSchema(),
    breadcrumbSchema([{ name: 'Home', url: BASE }, { name: 'Locations', url: `${BASE}/locations` }, { name: 'Norcross, GA', url: `${BASE}/locations/norcross-ga` }]),
    faqSchema(faqs),
  ];
  return (
    <>
      {schemas.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <LocalServicePage city={{
        name: 'Norcross',
        state: 'GA',
        slug: 'norcross-ga',
        county: 'Gwinnett County',
        tagline: 'Serving Norcross\'s Diverse Business & Professional Community',
        intro: 'Norcross, GA is one of Gwinnett County\'s most diverse cities — and we\'re proud to serve its vibrant immigrant and business community. From individual tax returns to H-1B visa petitions, Golden Dollar Consultancy handles it all.',
        nearbyAreas: ['Peachtree Corners', 'Dunwoody', 'Doraville', 'Chamblee', 'Lilburn', 'Lawrenceville'],
      }} />
      <FAQSection faqs={faqs} title="Norcross Tax & Immigration FAQs" />
    </>
  );
}
