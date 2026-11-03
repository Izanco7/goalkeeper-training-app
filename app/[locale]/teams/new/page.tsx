'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiPost } from '@/lib/utils/api';

export default function NewTeamPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('teams');
  const tc = useTranslations('common');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    season: '',
    description: '',
    color: '#2563eb',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiPost('/api/teams', formData);
      router.push(`/${locale}/teams`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorCreating'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/teams`}
            className="inline-flex items-center text-sm font-bold text-white/50 hover:text-lime-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {tc('back')}
          </Link>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('createTeam')}</h1>
          <p className="mt-1 text-white/50">{t('subtitle')}</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Input
                label={t('name')}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('namePlaceholder')}
                required
              />
            </div>

            {/* Category & Season */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label={t('category')}
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder={t('categoryPlaceholder')}
                  required
                />
              </div>
              <div>
                <Input
                  label={t('season')}
                  name="season"
                  type="text"
                  value={formData.season}
                  onChange={handleChange}
                  placeholder={t('seasonPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">
                {t('color')}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-12 w-20 rounded-xl bg-transparent border border-white/15 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-lime-400/40 focus:border-lime-400/50 outline-none"
                  placeholder="#2563eb"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-lime-400/40 focus:border-lime-400/50 outline-none"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                {tc('create')}
              </Button>
              <Link href={`/${locale}/teams`} className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  {tc('cancel')}
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
