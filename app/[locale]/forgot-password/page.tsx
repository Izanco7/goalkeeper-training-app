'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const t = useTranslations('auth');

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || t('resetEmailSent'));
        setEmail(''); // Limpiar el campo
      } else {
        throw new Error(data.error || t('resetError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('resetError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-white p-4 relative overflow-hidden antialiased">
      {/* glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-lime-400/10 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_32px_rgba(163,230,53,0.3)]">
                <span className="text-black font-black text-2xl tracking-tight">GK</span>
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {t('forgotPassword')}
            </h1>
            <p className="text-white/50">
              {t('forgotPasswordDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-white/70 mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-xl bg-lime-400/10 border border-lime-400/30">
                <p className="text-sm font-medium text-lime-200">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full bg-lime-400 text-black font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_28px_rgba(163,230,53,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('sending') : t('sendResetLink')}
            </button>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-1.5 text-sm text-lime-300 hover:text-lime-200 font-bold transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
