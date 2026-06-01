'use client';

import { useState, FormEvent } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const services = [
  'Tax Filing',
  'Immigration',
  'Bookkeeping',
  'Company Registrations',
  'Business Tax Planning',
  'Other',
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    // Simulate submission (replace with real API call / email service)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success('Message received! We\'ll be in touch within 24 hours.');
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-navy-800 mb-2">Message Sent!</h3>
        <p className="text-gray-500 max-w-xs">
          Thank you for reaching out. One of our consultants will contact you within 24 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="(555) 000-0000"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-800 mb-1.5">Service Needed</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 bg-white focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
          >
            <option value="">Select a service…</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-800 mb-1.5">
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your tax situation or questions…"
          rows={5}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 resize-none focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-center text-gray-400 text-xs">
        We typically respond within 24 business hours. Your information is kept strictly confidential.
      </p>
    </form>
  );
}
