'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { apiGet, apiPost } from '@/lib/utils/api';
import { Input } from '@/components/ui/Input';
import PenaltyGrid from '@/components/penalties/PenaltyGrid';

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
}

const selectClasses =
  "w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/60 outline-none transition-all [&_option]:bg-[#101714] [&_option]:text-white";
const textareaClasses =
  "w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/25 focus:ring-2 focus:ring-lime-400/30 focus:border-lime-400/60 outline-none transition-all";
const labelClasses = "block text-sm font-bold text-white/70 mb-2";

export default function NewPenaltyPage({ params }: { params: Promise<{ locale: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string } | null>(null);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const t = useTranslations('penalties');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = useState({
    goalkeeper_id: '',
    opponent_name: '',
    match_date: '',
    competition: '',
    penalty_taker: '',
    taker_foot: '',
    shot_direction: 'center' as 'left' | 'center' | 'right',
    shot_height: 'mid' as 'low' | 'mid' | 'high',
    result: 'goal' as 'saved' | 'goal' | 'missed' | 'post',
    goalkeeper_direction: '',
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
      // Prepare data
      const data: Record<string, unknown> = {
        goalkeeper_id: parseInt(formData.goalkeeper_id),
        opponent_name: formData.opponent_name,
        penalty_taker: formData.penalty_taker,
        shot_direction: formData.shot_direction,
        shot_height: formData.shot_height,
        result: formData.result
      };

      if (formData.match_date) data.match_date = formData.match_date;
      if (formData.competition) data.competition = formData.competition;
      if (formData.taker_foot) data.taker_foot = formData.taker_foot;
      if (formData.goalkeeper_direction) data.goalkeeper_direction = formData.goalkeeper_direction;
      if (formData.notes) data.notes = formData.notes;
      if (formData.video_url) data.video_url = formData.video_url;

      const penalty = await apiPost<{ id: number }>('/api/penalties', data);
      
      router.push(`/${resolvedParams!.locale}/penalties/${penalty.id}`);
    } catch (error: unknown) {
      setError((error as Error).message || tCommon('errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  const handleGridSelect = (direction: 'left' | 'center' | 'right', height: 'low' | 'mid' | 'high') => {
    setFormData(prev => ({
      ...prev,
      shot_direction: direction,
      shot_height: height
    }));
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
    <div >
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/${resolvedParams.locale}/penalties`}
          className="text-lime-300 hover:text-lime-200 font-bold mb-4 inline-flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" /> {tCommon('back')}
        </Link>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('registerPenalty')}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {/* Goalkeeper */}
          <div className="mb-6">
            <label className={labelClasses}>
              {tCommon('goalkeeper')} *
            </label>
            <select
              required
              value={formData.goalkeeper_id}
              onChange={(e) => setFormData({ ...formData, goalkeeper_id: e.target.value })}
              className={selectClasses}
            >
              <option value="">{tCommon('select')}</option>
              {goalkeepers.map((gk) => (
                <option key={gk.id} value={gk.id}>
                  {gk.first_name} {gk.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              type="text"
              required
              label={`${t('opponent')} *`}
              value={formData.opponent_name}
              onChange={(e) => setFormData({ ...formData, opponent_name: e.target.value })}
              placeholder={t('placeholders.opponent')}
            />

            <Input
              type="date"
              label={t('matchDate')}
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
            />
          </div>

          {/* Penalty Taker Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              type="text"
              required
              label={`${t('penaltyTaker')} *`}
              value={formData.penalty_taker}
              onChange={(e) => setFormData({ ...formData, penalty_taker: e.target.value })}
              placeholder={t('placeholders.penaltyTaker')}
            />

            <div>
              <label className={labelClasses}>
                {t('takerFoot')}
              </label>
              <select
                value={formData.taker_foot}
                onChange={(e) => setFormData({ ...formData, taker_foot: e.target.value })}
                className={selectClasses}
              >
                <option value="">{tCommon('select')}</option>
                <option value="left">{t('feet.left')}</option>
                <option value="right">{t('feet.right')}</option>
              </select>
            </div>
          </div>

          {/* Competition */}
          <div className="mb-6">
            <Input
              type="text"
              label={t('competition')}
              value={formData.competition}
              onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
              placeholder={t('placeholders.competition')}
            />
          </div>
        </div>

        {/* Shot Grid */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('grid.title')}</h2>
          <PenaltyGrid
            direction={formData.shot_direction}
            height={formData.shot_height}
            onSelect={handleGridSelect}
          />
        </div>

        {/* Result & Goalkeeper Direction */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={labelClasses}>
                {t('result')} *
              </label>
              <select
                required
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value as any })}
                className={selectClasses}
              >
                <option value="saved">{t('results.saved')}</option>
                <option value="goal">{t('results.goal')}</option>
                <option value="missed">{t('results.missed')}</option>
                <option value="post">{t('results.post')}</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>
                {t('goalkeeperDirection')}
              </label>
              <select
                value={formData.goalkeeper_direction}
                onChange={(e) => setFormData({ ...formData, goalkeeper_direction: e.target.value })}
                className={selectClasses}
              >
                <option value="">{tCommon('select')}</option>
                <option value="left">{t('directions.left')}</option>
                <option value="center">{t('directions.center')}</option>
                <option value="right">{t('directions.right')}</option>
                <option value="stayed">{t('directions.stayed')}</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className={labelClasses}>
              {t('notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('placeholders.notes')}
              rows={4}
              className={textareaClasses}
            />
          </div>

          {/* Video URL */}
          <div>
            <Input
              type="url"
              label={t('videoUrl')}
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder={t('placeholders.videoUrl')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-lime-400 text-black font-extrabold px-6 py-3 rounded-full hover:bg-lime-300 transition-all disabled:opacity-50"
          >
            {loading ? tCommon('saving') : tCommon('save')}
          </button>
          <Link
            href={`/${resolvedParams.locale}/penalties`}
            className="px-6 py-3 border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-full font-bold text-center transition-all"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
