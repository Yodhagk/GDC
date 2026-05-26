'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.');
      } else {
        setCustomerId(data.customerId);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyId = () => {
    if (customerId) {
      navigator.clipboard.writeText(customerId);
      toast.success('Customer ID copied!');
    }
  };

  if (customerId) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-navy-800 mb-2">Account Created!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Save your unique Customer ID — you'll need it to reference your account.
            </p>

            <div className="bg-navy-50 border-2 border-navy-200 rounded-xl p-5 mb-6">
              <p className="text-xs text-navy-500 uppercase tracking-widest mb-2 font-semibold">
                Your Customer ID
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-serif text-3xl font-bold text-navy-800 tracking-wider">
                  {customerId}
                </span>
                <button
                  onClick={copyId}
                  className="text-navy-400 hover:text-gold-500 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-400 text-xs mb-6">
              Screenshot or write this down. You can also find it in your portal dashboard.
            </p>

            <Link
              href="/portal/login"
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              Sign In to Your Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-800">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-2">
            Join 2,500+ clients who trust Golden Dollar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Full Name</label>
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
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-800 placeholder-gray-400 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/portal/login" className="text-gold-500 hover:text-gold-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
