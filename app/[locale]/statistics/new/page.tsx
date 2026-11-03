'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPost } from '@/lib/utils/api';

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
}

export default function NewStatisticsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('statistics');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    goalkeeper_id: '',
    season: '',
    matches_played: 0,
    minutes_played: 0,
    goals_conceded: 0,
    clean_sheets: 0,
    saves: 0,
    penalties_saved: 0,
    penalties_faced: 0,
    yellow_cards: 0,
    red_cards: 0
  });

  useEffect(() => {
    loadGoalkeepers();
  }, []);

  const loadGoalkeepers = async () => {
    try {
      const data = await apiGet<Goalkeeper[] | { goalkeepers: Goalkeeper[] }>('/api/goalkeepers');
      const goalkeeperArray = Array.isArray(data) ? data : data.goalkeepers || [];
      setGoalkeepers(goalkeeperArray);
    } catch (error) {
      console.error('Error loading goalkeepers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiPost('/api/statistics', {
        ...formData,
        goalkeeper_id: parseInt(formData.goalkeeper_id)
      });

      router.push(`/${resolvedParams.locale}/statistics`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const labelClasses = 'block text-sm font-bold text-white/70 mb-2';
  const inputClasses =
    'w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 focus:outline-none transition-colors placeholder:text-white/30';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/${resolvedParams.locale}/statistics`}
          className="text-lime-300 hover:text-lime-200 font-bold mb-4 inline-block"
        >
          ← {tCommon('back')}
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-lime-400" />
          {t('newStatistics')}
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        {/* Información Básica */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Información Básica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                {t('goalkeeper')} *
              </label>
              <select
                value={formData.goalkeeper_id}
                onChange={(e) => setFormData({ ...formData, goalkeeper_id: e.target.value })}
                className={inputClasses}
                required
              >
                <option value="">{t('placeholders.selectGoalkeeper')}</option>
                {goalkeepers.map((gk) => (
                  <option key={gk.id} value={gk.id}>
                    {gk.first_name} {gk.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.season')} *
              </label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                placeholder={t('placeholders.season')}
                className={inputClasses}
                required
              />
            </div>
          </div>
        </div>

        {/* Estadísticas de Partidos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Estadísticas de Partidos</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClasses}>
                {t('fields.matchesPlayed')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.matches_played}
                onChange={(e) => setFormData({ ...formData, matches_played: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.minutesPlayed')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.minutes_played}
                onChange={(e) => setFormData({ ...formData, minutes_played: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.goalsConceded')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.goals_conceded}
                onChange={(e) => setFormData({ ...formData, goals_conceded: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.cleanSheets')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.clean_sheets}
                onChange={(e) => setFormData({ ...formData, clean_sheets: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.saves')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.saves}
                onChange={(e) => setFormData({ ...formData, saves: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Penaltis y Tarjetas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Penaltis y Disciplina</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>
                {t('fields.penaltiesFaced')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.penalties_faced}
                onChange={(e) => setFormData({ ...formData, penalties_faced: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.penaltiesSaved')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.penalties_saved}
                onChange={(e) => setFormData({ ...formData, penalties_saved: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.yellowCards')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.yellow_cards}
                onChange={(e) => setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {t('fields.redCards')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.red_cards}
                onChange={(e) => setFormData({ ...formData, red_cards: parseInt(e.target.value) || 0 })}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? tCommon('saving') : tCommon('save')}
          </Button>
          <Link
            href={`/${resolvedParams.locale}/statistics`}
            className="flex-1 border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-lg font-bold px-6 py-2 transition-all text-center"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
