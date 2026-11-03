'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { apiGet } from '@/lib/utils/api';
import PenaltyCard from '@/components/penalties/PenaltyCard';

interface Penalty {
  id: number;
  opponent_name: string;
  match_date: string | null;
  penalty_taker: string;
  shot_direction: string;
  shot_height: string;
  result: string;
  goalkeeper_direction: string | null;
  goalkeeper_name?: string;
}

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
}

export default function PenaltiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string } | null>(null);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<string>('');
  const [selectedResult, setSelectedResult] = useState<string>('');

  const t = useTranslations('penalties');
  const tCommon = useTranslations('common');

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      loadData();
    }
  }, [resolvedParams, selectedGoalkeeper, selectedResult]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load goalkeepers for filter
      if (goalkeepers.length === 0) {
        const gkData = await apiGet<Goalkeeper[]>('/api/goalkeepers');
        setGoalkeepers(Array.isArray(gkData) ? gkData : []);
      }

      // Load penalties with filters
      let url = '/api/penalties';
      const params = new URLSearchParams();
      
      if (selectedGoalkeeper) {
        params.append('goalkeeper_id', selectedGoalkeeper);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      let penaltiesData = await apiGet<Penalty[]>(url);

      // Filter by result on client side
      if (selectedResult) {
        penaltiesData = penaltiesData.filter((p) => p.result === selectedResult);
      }

      setPenalties(penaltiesData);
    } catch (error) {
      console.error('Error loading penalties:', error);
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('title')}</h1>
          <p className="mt-2 text-white/50">{t('subtitle')}</p>
        </div>
        <Link
          href={`/${resolvedParams.locale}/penalties/new`}
          className="inline-flex items-center gap-2 bg-lime-400 text-black font-extrabold px-6 py-3 rounded-full hover:bg-lime-300 transition-all"
        >
          <PlusIcon className="h-5 w-5" />
          {t('registerPenalty')}
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goalkeeper filter */}
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2">
              {t('filters.byGoalkeeper')}
            </label>
            <select
              value={selectedGoalkeeper}
              onChange={(e) => setSelectedGoalkeeper(e.target.value)}
              className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50 outline-none [&_option]:bg-[#101714] [&_option]:text-white"
            >
              <option value="">{t('filters.all')}</option>
              {goalkeepers.map((gk) => (
                <option key={gk.id} value={gk.id}>
                  {gk.first_name} {gk.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Result filter */}
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2">
              {t('filters.byResult')}
            </label>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="w-full px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50 outline-none [&_option]:bg-[#101714] [&_option]:text-white"
            >
              <option value="">{t('filters.all')}</option>
              <option value="saved">{t('results.saved')}</option>
              <option value="goal">{t('results.goal')}</option>
              <option value="missed">{t('results.missed')}</option>
              <option value="post">{t('results.post')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Penalties List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{tCommon('loading')}</p>
        </div>
      ) : penalties.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-white/10 bg-white/[0.03]">
          <p className="text-white/50 mb-4">{t('noPenalties')}</p>
          <Link
            href={`/${resolvedParams.locale}/penalties/new`}
            className="text-lime-300 hover:text-lime-200 font-bold"
          >
            {t('registerPenalty')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {penalties.map((penalty) => (
            <PenaltyCard
              key={penalty.id}
              penalty={penalty}
              locale={resolvedParams.locale}
              showGoalkeeper={!selectedGoalkeeper}
            />
          ))}
        </div>
      )}
    </div>
  );
}
