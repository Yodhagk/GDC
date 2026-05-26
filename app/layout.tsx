import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: 'Golden Dollar Consultancy | Expert Tax Consulting USA',
    template: '%s | Golden Dollar Consultancy',
  },
  description:
    'Professional tax consulting, IRS compliance, bookkeeping, and audit support for individuals and businesses across the USA. Get your free consultation today.',
  keywords: ['tax consulting', 'IRS compliance', 'tax filing', 'bookkeeping', 'audit support', 'USA tax'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Golden Dollar Consultancy',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
