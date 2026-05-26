import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-gold-400 to-gold-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Ready to Stop Overpaying on Taxes?
          </h2>
          <p className="text-navy-800/70 text-lg mb-10 max-w-xl mx-auto">
            Schedule your free 30-minute consultation with a certified tax professional today.
            No obligation, no pressure — just expert advice.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:-translate-y-0.5"
            >
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+12125551234"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-navy-900 font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              (212) 555-1234
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
