'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage(t('noToken'));
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || t('emailVerified'));

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push(`/${locale}/login`);
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || t('verificationError'));
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setStatus('error');
        setMessage(t('verificationError'));
      }
    };

    verifyEmail();
  }, [searchParams, router, locale, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-white p-4 relative overflow-hidden antialiased">
      {/* glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-lime-400/10 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-5">
                  <ArrowPathIcon className="h-14 w-14 text-lime-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  {t('verifyingEmail')}
                </h2>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center mb-5">
                  <CheckCircleIcon className="h-14 w-14 text-lime-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-2">
                  {t('emailVerifiedTitle')}
                </h2>
                <p className="text-sm text-white/50">
                  {message}
                </p>
                <p className="mt-4 text-sm text-white/40">
                  {t('redirectingToLogin')}
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-5">
                  <XCircleIcon className="h-14 w-14 text-red-400" />
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-2">
                  {t('verificationFailedTitle')}
                </h2>
                <p className="text-sm text-white/50">
                  {message}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/${locale}/login`}
                    className="text-sm text-lime-300 hover:text-lime-200 font-bold transition-colors"
                  >
                    {t('goToLogin')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
