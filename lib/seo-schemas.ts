// Centralized JSON-LD schema generators for Golden Dollar Consultancy

const BASE = 'https://goldendollarconsulting.com';

export const BUSINESS = {
  name: 'Golden Dollar Consultancy',
  legalName: 'Golden Dollar Consultancy LLC',
  url: BASE,
  logo: `${BASE}/logo.png`,
  telephone: '+14692699784',
  email: 'priti@goldendollarconsulting.com',
  foundingDate: '2009',
  address: {
    streetAddress: '3730 Graham Way SW',
    addressLocality: 'Lilburn',
    addressRegion: 'GA',
    postalCode: '30047',
    addressCountry: 'US',
  },
  geo: { latitude: 33.8899, longitude: -84.1399 },
  hours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-14:00'],
  priceRange: '$$',
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    logo: {
      '@type': 'ImageObject',
      url: BUSINESS.logo,
      width: 512,
      height: 512,
    },
    foundingDate: BUSINESS.foundingDate,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS.address,
    },
    sameAs: [
      'https://www.linkedin.com/company/golden-dollar-consultancy',
      'https://www.facebook.com/goldendollarconsultancy',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.telephone,
        contactType: 'customer service',
        areaServed: ['US', 'IN'],
        availableLanguage: ['English', 'Hindi'],
        hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
      },
    ],
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService', 'FinancialService'],
    '@id': `${BASE}/#localbusiness`,
    name: BUSINESS.name,
    image: BUSINESS.logo,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS.geo,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
      bestRating: '5',
    },
    hasMap: 'https://maps.google.com/?q=3730+Graham+Way+SW+Lilburn+GA+30047',
    areaServed: [
      { '@type': 'State', name: 'Georgia' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'City', name: 'Bangalore', containedIn: { '@type': 'Country', name: 'India' } },
    ],
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name: BUSINESS.name,
    url: BASE,
    description: 'Expert tax consulting, US immigration, visa services, and business registration for individuals and businesses worldwide.',
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  price?: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': `${BASE}/#organization` },
    serviceType: opts.category,
    areaServed: { '@type': 'Country', name: 'United States' },
    ...(opts.price && { offers: { '@type': 'Offer', description: opts.price } }),
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function reviewSchema(reviews: Array<{ author: string; rating: number; body: string; date: string }>) {
  return reviews.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.body,
    datePublished: r.date,
    itemReviewed: { '@id': `${BASE}/#organization` },
  }));
}
