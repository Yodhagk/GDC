import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach out to Golden Dollar Consultancy for a free tax consultation. We respond within 24 hours.',
};

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (469) 269-9784',
    href: 'tel:+14692699784',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'priti@goldendollarconsulting.com',
    href: 'mailto:priti@goldendollarconsulting.com',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: '3730 Graham Way SW\nLilburn, GA 30047',
    href: null,
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Fri: 9 AM – 6 PM ET\nSat: 10 AM – 2 PM ET',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-800 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="section-tag">Get In Touch</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white leading-tight mt-4 mb-4">
              Let&apos;s Talk About <span className="text-gold-400">Your Taxes</span>
            </h1>
            <p className="text-white/55 text-lg">
              Whether you have a quick question or need comprehensive tax assistance, our team
              is here to help. All initial consultations are completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left – contact info */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-bold text-navy-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-navy-800 text-sm font-medium hover:text-gold-500 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-navy-800 text-sm font-medium whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* IRS checklist */}
              <div className="mt-10 bg-gold-50 border border-gold-200 rounded-2xl p-6">
                <h3 className="font-serif font-bold text-navy-800 mb-3">Documents to Have Ready</h3>
                <ul className="space-y-2">
                  {[
                    "Last year's tax return",
                    'W-2 or 1099 forms',
                    'Social Security numbers',
                    'Bank statements',
                    'Receipts for deductions',
                    'Health insurance info',
                  ].map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right – form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                <h2 className="font-serif text-2xl font-bold text-navy-800 mb-1">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 text-sm mb-7">
                  We respond within 24 business hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
