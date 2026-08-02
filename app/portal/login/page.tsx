'use client';

import { useState, useEffect, Suspense, FormEvent } from 'react';
import { signIn, useSession, getProviders } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

const MFA_ERRORS: Record<string, string> = {
  MFA_INVALID: 'Incorrect verification code. Please try again.',
  MFA_EXPIRED: 'That code has expired. Please request a new one.',
  MFA_LOCKED: 'Too many incorrect attempts. Please request a new code.',
  MFA_EMAIL_FAILED: 'We could not send your verification code. Please try again shortly.',
};

const OAUTH_ERRORS: Record<string, string> = {
  OAuthSignin: 'Could not start Microsoft sign-in. Please try again.',
  OAuthCallback: 'Microsoft sign-in failed. Please try again.',
  OAuthCreateAccount: 'We could not create your account from your Microsoft profile.',
  AccessDenied: 'Access was denied by Microsoft. Please try again.',
  Default: 'Sign-in failed. Please try again.',
};

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function LoginPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msLoading, setMsLoading] = useState(false);
  const [msAvailable, setMsAvailable] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const role = (session.user as any)?.role;
      if (role === 'admin') router.replace('/admin');
      else if (role === 'it_support') router.replace('/it-support');
      else router.replace('/portal');
    }
  }, [status, session, router]);

  useEffect(() => {
    getProviders().then((providers) => {
      if (providers && 'azure-ad' in providers) setMsAvailable(true);
    });
  }, []);

  useEffect(() => {
    const oauthError = searchParams?.get('error');
    if (oauthError) setError(OAUTH_ERRORS[oauthError] || OAUTH_ERRORS.Default);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error === 'MFA_REQUIRED') {
      setStep('otp');
      setOtp('');
      setInfo('We emailed you a 6-digit verification code. It expires in 10 minutes.');
    } else if (result?.error && MFA_ERRORS[result.error]) {
      setError(MFA_ERRORS[result.error]);
    } else if (result?.error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      otp: otp.trim(),
      redirect: false,
    });

    setLoading(false);

    if (result?.error === 'MFA_REQUIRED') {
      setError('Please enter the verification code sent to your email.');
    } else if (result?.error && MFA_ERRORS[result.error]) {
      setError(MFA_ERRORS[result.error]);
    } else if (result?.error) {
      setError('Sign-in failed. Please start over.');
      setStep('credentials');
    }
    // Success: role-based redirect handled by the useEffect above once session updates
  };

  const handleResend = async () => {
    setError('');
    setInfo('');
    setResending(true);

    // Re-running step 1 re-issues a code (server throttles to one email per minute)
    const result = await signIn('credentials', {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    });

    setResending(false);

    if (result?.error === 'MFA_REQUIRED') {
      setInfo('A new code has been sent if the previous one was older than a minute.');
    } else if (result?.error) {
      setError(MFA_ERRORS[result.error] || 'Could not resend the code. Please start over.');
    }
  };

  const handleMicrosoftSignIn = async () => {
    setError('');
    setInfo('');
    setMsLoading(true);
    // Full-page redirect to Microsoft — the browser leaves the app here.
    await signIn('azure-ad', { callbackUrl: '/portal/login' });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-navy-800">
            {step === 'otp' ? 'Verify It\'s You' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {step === 'otp'
              ? `Enter the code sent to ${form.email}`
              : 'Sign in to your client portal'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {info && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-xl px-4 py-3 mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {info}
            </div>
          )}

          {step === 'credentials' ? (
            <>
              {msAvailable && (
                <>
                  <button
                    type="button"
                    onClick={handleMicrosoftSignIn}
                    disabled={msLoading}
                    className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-navy-800 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {msLoading ? (
                      <div className="w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />
                    ) : (
                      <>
                        <MicrosoftIcon />
                        Continue with Microsoft
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                </>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-navy-800">Password</label>
                    <Link
                      href="/portal/forgot-password"
                      className="text-xs text-gold-500 hover:text-gold-600 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account?{' '}
                <Link href="/portal/register" className="text-gold-500 hover:text-gold-600 font-medium">
                  Create one free
                </Link>
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-1.5">
                    Verification Code
                  </label>
                  <input
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    autoFocus
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-semibold text-navy-800 placeholder-gray-300 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-navy-800/30 border-t-navy-800 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Verify & Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between mt-6 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setOtp('');
                    setError('');
                    setInfo('');
                  }}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-gold-500 hover:text-gold-600 font-medium disabled:opacity-60"
                >
                  {resending ? 'Sending…' : 'Resend code'}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Need help?{' '}
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
