import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal', '/api/', '/it-support'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/portal', '/api/', '/it-support'],
      },
    ],
    sitemap: 'https://goldendollarconsulting.com/sitemap.xml',
    host: 'https://goldendollarconsulting.com',
  };
}
