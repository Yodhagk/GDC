'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqSchema } from '@/lib/seo-schemas';

interface FAQ { question: string; answer: string }

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
}

export default function FAQSection({ faqs, title = 'Frequently Asked Questions', subtitle }: FAQSectionProps) {
  const [open, setOpen] = useState<number | null>(0);
  const jsonLd = faqSchema(faqs);

  return (
    <section className="py-20 relative" style={{ background: 'linear-gradient(160deg, #040B18 0%, #071228 60%, #040B18 100%)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-tag">FAQ</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mt-4 mb-3 leading-tight">{title}</h2>
          {subtitle && <p className="text-lg" style={{ color: 'rgba(255,255,255,0.50)' }}>{subtitle}</p>}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: open === i ? 'rgba(200,146,14,0.07)' : 'rgba(255,255,255,0.03)',
                border: open === i ? '1px solid rgba(200,146,14,0.25)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-white pr-4 text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-300"
                  style={{ color: '#E8C040', transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '500px' : '0px' }}
              >
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
