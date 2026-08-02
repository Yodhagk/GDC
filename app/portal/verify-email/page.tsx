'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, MailCheck } from 'lucide-react';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This link is missing its verification token.');
      return;
    }

    fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed.');
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. Please request a new link.');
      });
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      {status === 'verifying' && (
        <>
          <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Verifying your email…</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h2 className="font-semibold text-navy-800 mb-2">Email Verified</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <Link href="/portal/login" className="btn-gold inline-block">
            Sign In
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="font-semibold text-navy-800 mb-2">Verification Failed</h2>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <Link href="/portal/login" className="text-gold-500 hover:text-gold-600 font-medium text-sm">
            Back to Sign In
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MailCheck className="w-8 h-8 text-gold-400 mx-auto mb-3" />
          <h1 className="font-serif text-3xl font-bold text-navy-800">Email Verification</h1>
        </div>
        <Suspense fallback={null}>
          <VerifyEmailInner />
        </Suspense>
      </div>
    </div>
  );
}
