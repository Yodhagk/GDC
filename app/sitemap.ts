import type { MetadataRoute } from 'next';

const BASE = 'https://goldendollarconsulting.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/tax-filing`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/immigration`,        lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/visa`,               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/services/business-registration`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/services/bookkeeping`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/contact`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/blog`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
  ];

  // Local SEO landing pages — Atlanta metro (GA)
  const locations: MetadataRoute.Sitemap = [
    { url: `${BASE}/locations/atlanta-ga`,          lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/locations/lilburn-ga`,          lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/locations/norcross-ga`,         lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/locations/lawrenceville-ga`,    lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/locations/duluth-ga`,           lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/locations/alpharetta-ga`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/locations/johns-creek-ga`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  return [...core, ...locations];
}
