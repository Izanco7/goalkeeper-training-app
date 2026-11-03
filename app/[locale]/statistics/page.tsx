'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChartBarIcon, PlusIcon, TrophyIcon, UsersIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { GoalkeeperStatistics } from '@/lib/db/models/GoalkeeperStatisticsModel';
import StatsGrid from '@/components/statistics/StatsGrid';
import { apiGet } from '@/lib/utils/api';

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
}

export default function StatisticsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('statistics');

  const [statistics, setStatistics] = useState<GoalkeeperStatistics[]>([]);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [seasons, setSeasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar porteros
      const gkData = await apiGet<Goalkeeper[] | { goalkeepers: Goalkeeper[] }>('/api/goalkeepers');
      const goalkeeperArray = Array.isArray(gkData) ? gkData : gkData.goalkeepers || [];
      setGoalkeepers(goalkeeperArray);

      // Cargar temporadas
      const seasonsData = await apiGet<string[]>('/api/statistics?action=seasons');
      setSeasons(Array.isArray(seasonsData) ? seasonsData : []);

      // Si hay temporada seleccionada, usar esa; sino, la más reciente
      let seasonToUse = selectedSeason;
      if (!seasonToUse && seasonsData.length > 0) {
        seasonToUse = seasonsData[0];
        setSelectedSeason(seasonToUse);
      }

      // Cargar estadísticas según los filtros
      let url = '/api/statistics?';
      if (selectedGoalkeeper) {
        url += `goalkeeper_id=${selectedGoalkeeper}`;
      } else if (seasonToUse) {
        url += `season=${seasonToUse}`;
      }

      if (url !== '/api/statistics?') {
        const statsData = await apiGet<GoalkeeperStatistics[]>(url);
        setStatistics(Array.isArray(statsData) ? statsData : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedGoalkeeper, selectedSeason]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGoalkeeperChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoalkeeper(e.target.value);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-white/50">{t('loadingStatistics')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-lime-400" />
          {t('title')}
        </h1>
        <Link
          href={`/${resolvedParams.locale}/statistics/new`}
          className="inline-flex items-center gap-2 bg-lime-400 text-black font-extrabold rounded-full px-5 py-2.5 hover:bg-lime-300 transition-all"
        >
          <PlusIcon className="h-5 w-5" />
          {t('newStatistics')}
        </Link>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-white/70 mb-2">
              {t('filters.byGoalkeeper')}
            </label>
            <select
              value={selectedGoalkeeper}
              onChange={handleGoalkeeperChange}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 focus:outline-none transition-colors"
            >
              <option value="">{t('filters.all')}</option>
              {goalkeepers.map((gk) => (
                <option key={gk.id} value={gk.id}>
                  {gk.first_name} {gk.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70 mb-2">
              {t('filters.bySeason')}
            </label>
            <select
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 focus:outline-none transition-colors disabled:opacity-50"
              disabled={!!selectedGoalkeeper}
            >
              <option value="">{t('filters.all')}</option>
              {seasons.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de estadísticas */}
      {statistics.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-lg text-white/50">{t('noStatistics')}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {statistics.map((stat) => (
            <div key={stat.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    {stat.goalkeeper_name}
                  </h2>
                  <div className="flex gap-4 mt-2 text-sm text-white/50">
                    <span className="inline-flex items-center gap-1.5">
                      <TrophyIcon className="h-4 w-4 text-amber-300" />
                      {stat.season}
                    </span>
                    {stat.team_name && (
                      <span className="inline-flex items-center gap-1.5">
                        <UsersIcon className="h-4 w-4 text-sky-300" />
                        {stat.team_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/${resolvedParams.locale}/statistics/${stat.id}`}
                    className="px-4 py-2 bg-lime-400 text-black font-extrabold rounded-full hover:bg-lime-300 transition-all text-sm"
                  >
                    {t('actions.view')}
                  </Link>
                </div>
              </div>

              <StatsGrid statistics={stat} />
            </div>
          ))}
        </div>
      )}

      {/* Enlaces rápidos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/${resolvedParams.locale}/statistics/compare`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-lime-400/40 transition-all"
        >
          <ArrowsRightLeftIcon className="h-10 w-10 text-lime-400 mx-auto mb-3" />
          <div className="text-xl font-extrabold text-white">{t('comparison.title')}</div>
          <div className="text-sm text-white/50 mt-1">{t('comparison.selectGoalkeepers')}</div>
        </Link>

        <Link
          href={`/${resolvedParams.locale}/statistics/top-performers`}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center hover:border-lime-400/40 transition-all"
        >
          <TrophyIcon className="h-10 w-10 text-lime-400 mx-auto mb-3" />
          <div className="text-xl font-extrabold text-white">{t('topPerformers.title')}</div>
          <div className="text-sm text-white/50 mt-1">{t('topPerformers.subtitle')}</div>
        </Link>
      </div>
    </div>
  );
}
