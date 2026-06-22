import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/providers';
import { organizationSchema, webSiteSchema } from '@/lib/seo-schemas';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

const BASE = 'https://goldendollarconsulting.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Golden Dollar Consultancy | Tax & Immigration Consultant USA',
    template: '%s | Golden Dollar Consultancy',
  },
  description:
    'Expert tax consulting, US immigration services, visa assistance, and business registration. IRS-enrolled agents serving 5,000+ clients in 30+ countries. Free consultation.',
  keywords: [
    'tax consultant USA',
    'US immigration consultant',
    'visa consultant',
    'IRS enrolled agent',
    'tax filing service',
    'H-1B visa consultant',
    'business registration USA',
    'NRI tax consultant',
    'tax consultant Lilburn GA',
    'immigration consultant Georgia',
    'US visa consultant Bangalore',
    'tax consultant Atlanta',
    'golden dollar consultancy',
  ],
  authors: [{ name: 'Golden Dollar Consultancy', url: BASE }],
  creator: 'Golden Dollar Consultancy',
  publisher: 'Golden Dollar Consultancy',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE,
    siteName: 'Golden Dollar Consultancy',
    title: 'Golden Dollar Consultancy | Tax & Immigration Consultant USA',
    description: 'Expert tax consulting, US immigration services, visa assistance, and business registration. 5,000+ clients. Free consultation.',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: 'Golden Dollar Consultancy — Tax & Immigration Experts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Golden Dollar Consultancy | Tax & Immigration Consultant USA',
    description: 'Expert tax consulting, US immigration services, visa assistance. 5,000+ clients. Free consultation.',
    images: [`${BASE}/og-image.png`],
  },
  alternates: {
    canonical: BASE,
    languages: { 'en-US': BASE, 'en-IN': `${BASE}/in` },
  },
  verification: {
    google: 'GOOGLE_SITE_VERIFICATION_TOKEN',
  },
  category: 'financial services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Organization + WebSite schemas — global across all pages */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }}
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon chain */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="US-GA" />
        <meta name="geo.placename" content="Lilburn, Georgia" />
        <meta name="geo.position" content="33.8899;-84.1399" />
        <meta name="ICBM" content="33.8899, -84.1399" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
