'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, remember });
      router.push(`/${locale}/dashboard`);
    } catch {
      setError('Invalid credentials');
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
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_32px_rgba(163,230,53,0.3)]">
                <span className="text-black font-black text-2xl tracking-tight">GK</span>
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">{t('auth.welcome')}</h1>
            <p className="text-white/50">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white/70 mb-1.5">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/70 mb-1.5">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded accent-lime-400"
                />
                <span className="ml-2 text-white/60">{t('auth.remember')}</span>
              </label>
              <a
                href={`/${locale}/forgot-password`}
                className="font-bold text-lime-300 hover:text-lime-200 transition-colors"
              >
                {t('auth.forgotPassword')}
              </a>
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
              {isLoading ? '…' : t('auth.login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/50">
              {t('auth.noAccount')}{' '}
              <a
                href={`/${locale}/register`}
                className="font-bold text-lime-300 hover:text-lime-200 transition-colors"
              >
                {t('auth.register')}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/30">
          <p className="font-bold text-white/40">{t('app.title')}</p>
          <p className="mt-1">{t('app.description')}</p>
        </div>
      </div>
    </div>
  );
}
