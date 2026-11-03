'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t('noToken'));
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 3000);
      } else {
        throw new Error(data.error || t('resetPasswordError'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('resetPasswordError'));
    } finally {
      setIsLoading(false);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-white p-4 relative overflow-hidden antialiased">
      {/* glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-lime-400/10 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl text-center">
          {children}
        </div>
      </div>
    </div>
  );

  if (!token) {
    return shell(
      <>
        <div className="flex justify-center mb-5">
          <XCircleIcon className="h-14 w-14 text-red-400" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          {t('invalidResetLink')}
        </h2>
        <Link
          href={`/${locale}/forgot-password`}
          className="text-sm text-lime-300 hover:text-lime-200 font-bold transition-colors"
        >
          {t('requestNewLink')}
        </Link>
      </>
    );
  }

  if (success) {
    return shell(
      <>
        <div className="flex justify-center mb-5">
          <CheckCircleIcon className="h-14 w-14 text-lime-400" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          {t('passwordResetSuccess')}
        </h2>
        <p className="text-sm text-white/50">
          {t('redirectingToLogin')}
        </p>
      </>
    );
  }

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
              {t('resetPassword')}
            </h1>
            <p className="text-white/50">
              {t('resetPasswordDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-white/70 mb-1.5">
                {t('newPassword')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                placeholder={t('passwordPlaceholder')}
              />
              <p className="mt-1.5 text-xs text-white/40">{t('passwordRequirement')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-white/70 mb-1.5">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder={t('confirmPasswordPlaceholder')}
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full bg-lime-400 text-black font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_28px_rgba(163,230,53,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('resettingPassword') : t('resetPassword')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
