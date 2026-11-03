'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { apiGet, apiPost } from '@/lib/utils/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
}

const selectClass =
  'w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 outline-none transition-all [&>option]:bg-[#0a0f0d]';
const labelClass = 'block text-sm font-bold text-white/70 mb-2';
const textareaClass =
  'w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white placeholder-white/25 rounded-xl focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/60 outline-none transition-all';

export default function NewMatchPage({ params }: { params: Promise<{ locale: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string } | null>(null);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const t = useTranslations('matches');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    goalkeeper_id: '',
    match_date: '',
    opponent: '',
    competition: '',
    result: '',
    minutes_played: '',
    goals_conceded: '',
    saves: '',
    high_balls: '',
    crosses_caught: '',
    distribution_success_rate: '',
    rating: '',
    strengths: '',
    areas_for_improvement: '',
    notes: '',
    video_url: ''
  });

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      loadGoalkeepers();
    }
  }, [resolvedParams]);

  const loadGoalkeepers = async () => {
    try {
      const data = await apiGet<Goalkeeper[]>('/api/goalkeepers');
      setGoalkeepers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading goalkeepers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: Record<string, unknown> = {
        goalkeeper_id: parseInt(formData.goalkeeper_id),
        match_date: formData.match_date,
        opponent: formData.opponent
      };

      if (formData.competition) data.competition = formData.competition;
      if (formData.result) data.result = formData.result;
      if (formData.minutes_played) data.minutes_played = parseInt(formData.minutes_played);
      if (formData.goals_conceded) data.goals_conceded = parseInt(formData.goals_conceded);
      if (formData.saves) data.saves = parseInt(formData.saves);
      if (formData.high_balls) data.high_balls = parseInt(formData.high_balls);
      if (formData.crosses_caught) data.crosses_caught = parseInt(formData.crosses_caught);
      if (formData.distribution_success_rate) data.distribution_success_rate = parseFloat(formData.distribution_success_rate);
      if (formData.rating) data.rating = parseFloat(formData.rating);
      if (formData.strengths) data.strengths = formData.strengths;
      if (formData.areas_for_improvement) data.areas_for_improvement = formData.areas_for_improvement;
      if (formData.notes) data.notes = formData.notes;
      if (formData.video_url) data.video_url = formData.video_url;

      const match = await apiPost<{ id: number }>('/api/matches', data);

      router.push(`/${resolvedParams!.locale}/matches/${match.id}`);
    } catch (error: unknown) {
      setError((error as Error).message || tCommon('errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  if (!resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${resolvedParams.locale}/matches`}
          className="inline-flex items-center gap-1.5 text-lime-300 hover:text-lime-200 font-bold mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {tCommon('back')}
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('newAnalysis')}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-extrabold text-white mb-4">{t('matchDetails')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>
                {tCommon('goalkeeper')} *
              </label>
              <select
                required
                value={formData.goalkeeper_id}
                onChange={(e) => setFormData({ ...formData, goalkeeper_id: e.target.value })}
                className={selectClass}
              >
                <option value="">{tCommon('select')}</option>
                {goalkeepers.map((gk) => (
                  <option key={gk.id} value={gk.id}>
                    {gk.first_name} {gk.last_name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={`${t('matchDate')} *`}
              type="date"
              required
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={`${t('opponent')} *`}
              type="text"
              required
              value={formData.opponent}
              onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
              placeholder={t('placeholders.opponent')}
            />

            <Input
              label={t('competition')}
              type="text"
              value={formData.competition}
              onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
              placeholder={t('placeholders.competition')}
            />

            <Input
              label={t('result')}
              type="text"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              placeholder={t('placeholders.result')}
            />

            <Input
              label={t('minutesPlayed')}
              type="number"
              min="0"
              max="120"
              value={formData.minutes_played}
              onChange={(e) => setFormData({ ...formData, minutes_played: e.target.value })}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-extrabold text-white mb-4">{t('metrics')}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label={t('goalsConceded')}
              type="number"
              min="0"
              value={formData.goals_conceded}
              onChange={(e) => setFormData({ ...formData, goals_conceded: e.target.value })}
            />

            <Input
              label={t('saves')}
              type="number"
              min="0"
              value={formData.saves}
              onChange={(e) => setFormData({ ...formData, saves: e.target.value })}
            />

            <Input
              label={t('highBalls')}
              type="number"
              min="0"
              value={formData.high_balls}
              onChange={(e) => setFormData({ ...formData, high_balls: e.target.value })}
            />

            <Input
              label={t('crossesCaught')}
              type="number"
              min="0"
              value={formData.crosses_caught}
              onChange={(e) => setFormData({ ...formData, crosses_caught: e.target.value })}
            />

            <Input
              label={`${t('distributionRate')} (%)`}
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.distribution_success_rate}
              onChange={(e) => setFormData({ ...formData, distribution_success_rate: e.target.value })}
            />

            <Input
              label={`${t('rating')} (0-10)`}
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            />
          </div>
        </div>

        {/* Analysis */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-extrabold text-white mb-4">{t('performance')}</h2>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                {t('strengths')}
              </label>
              <textarea
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                placeholder={t('placeholders.strengths')}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('areasForImprovement')}
              </label>
              <textarea
                value={formData.areas_for_improvement}
                onChange={(e) => setFormData({ ...formData, areas_for_improvement: e.target.value })}
                placeholder={t('placeholders.improvements')}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('placeholders.notes')}
                rows={3}
                className={textareaClass}
              />
            </div>

            <Input
              label={t('videoUrl')}
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder={t('placeholders.videoUrl')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? tCommon('saving') : tCommon('save')}
          </Button>
          <Link
            href={`/${resolvedParams.locale}/matches`}
            className="px-6 py-3 border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-full font-bold text-center transition-all"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
