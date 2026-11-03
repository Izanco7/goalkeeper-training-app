'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20 sm:text-sm';
const labelClass = 'block text-sm font-bold text-white/70 mb-1.5';

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('registerError'));
      }

      setSuccess(data.message || t('registerSuccess'));

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      {/* glows */}
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full bg-lime-400/10 blur-[110px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_28px_rgba(163,230,53,0.3)]">
                <span className="text-black font-black text-xl tracking-tight">GK</span>
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tight">{t('register')}</h2>
            <p className="mt-2 text-sm text-white/50">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href={`/${locale}/login`}
                className="font-bold text-lime-300 hover:text-lime-200 transition-colors"
              >
                {t('loginHere')}
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className={labelClass}>
                {t('name')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                {t('password')}
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
              <p className="mt-1.5 text-xs text-white/35">{t('passwordRequirement')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
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

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-sm font-medium text-emerald-300">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full bg-lime-400 text-black font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_28px_rgba(163,230,53,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '…' : t('register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
