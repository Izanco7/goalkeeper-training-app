'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { TrophyIcon, CheckIcon } from '@heroicons/react/24/outline';
import { GoalkeeperStatistics } from '@/lib/db/models/GoalkeeperStatisticsModel';
import { apiGet } from '@/lib/utils/api';

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
  team_id: number;
}

export default function CompareGoalkeepersPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('statistics');
  const tCommon = useTranslations('common');

  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [selectedGoalkeepers, setSelectedGoalkeepers] = useState<number[]>([]);
  const [season, setSeason] = useState<string>('');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [comparison, setComparison] = useState<GoalkeeperStatistics[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar temporadas
        const seasonsData = await apiGet<string[]>('/api/statistics?action=seasons');
        setSeasons(seasonsData);
        if (seasonsData.length > 0) {
          setSeason(seasonsData[0]);
        }

        // Cargar porteros
        const goalkeepersData = await apiGet<Goalkeeper[]>('/api/goalkeepers');
        setGoalkeepers(goalkeepersData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleCompare = async () => {
    if (selectedGoalkeepers.length < 2) {
      alert(t('comparison.selectAtLeastTwo'));
      return;
    }

    setLoading(true);
    try {
      const data = await apiGet<GoalkeeperStatistics[]>(
        `/api/statistics?action=compare&goalkeeper_ids=${selectedGoalkeepers.join(',')}&season=${season}`
      );
      setComparison(data);
    } catch (error) {
      console.error('Error:', error);
      alert(tCommon('error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalkeeper = (id: number) => {
    setSelectedGoalkeepers((prev) =>
      prev.includes(id) ? prev.filter((gkId) => gkId !== id) : [...prev, id]
    );
  };

  const thClasses =
    'px-6 py-3 text-xs font-bold text-white/40 uppercase tracking-widest';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <TrophyIcon className="h-8 w-8 text-lime-400" />
                {t('comparison.title')}
              </h1>
              <p className="text-white/50 mt-2">{t('comparison.selectGoalkeepers')}</p>
            </div>
            <Link
              href={`/${resolvedParams.locale}/statistics`}
              className="border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-full font-bold px-4 py-2 text-sm transition-all"
            >
              {tCommon('back')}
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex gap-4 mt-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-white/70 mb-2">
                {t('fields.season')}
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 focus:outline-none transition-colors"
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selección de porteros */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {t('comparison.selectGoalkeepers')} ({selectedGoalkeepers.length} {t('comparison.selected')})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goalkeepers.map((gk) => (
              <button
                key={gk.id}
                onClick={() => toggleGoalkeeper(gk.id)}
                className={`p-4 rounded-2xl border transition-all text-left ${
                  selectedGoalkeepers.includes(gk.id)
                    ? 'border-lime-400/70 bg-lime-400/10'
                    : 'border-white/15 bg-white/[0.02] hover:border-lime-400/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">
                    {gk.first_name} {gk.last_name}
                  </span>
                  {selectedGoalkeepers.includes(gk.id) && (
                    <CheckIcon className="h-5 w-5 text-lime-300" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleCompare}
            disabled={selectedGoalkeepers.length < 2 || loading}
            className="mt-6 w-full bg-lime-400 text-black font-extrabold px-6 py-3 rounded-full hover:bg-lime-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? tCommon('loading') : t('comparison.compare')}
          </button>
        </div>

        {/* Resultados de comparación */}
        {comparison.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className={`${thClasses} text-left`}>
                      {tCommon('goalkeeper')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.matchesPlayed')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.minutesPlayed')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.goalsConceded')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('calculated.goalsPerMatch')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.cleanSheets')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('calculated.cleanSheetPercentage')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.saves')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('calculated.savePercentage')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('fields.penaltiesSaved')}
                    </th>
                    <th className={`${thClasses} text-center`}>
                      {t('calculated.penaltySavePercentage')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((stat) => (
                    <tr key={stat.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/${resolvedParams.locale}/statistics/${stat.id}`}
                          className="text-lime-300 hover:text-lime-200 font-bold"
                        >
                          {stat.goalkeeper_name}
                        </Link>
                        <div className="text-sm text-white/40">{stat.team_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                        {stat.matches_played}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                        {stat.minutes_played}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-red-400 font-bold">
                        {stat.goals_conceded}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                        {Number(stat.goals_per_match ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-lime-300 font-semibold">
                        {stat.clean_sheets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-lime-400/15 text-lime-300 border border-lime-400/30">
                          {Number(stat.clean_sheet_percentage ?? 0).toFixed(1)}
                          %
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sky-300 font-semibold">
                        {stat.saves}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-sky-400/15 text-sky-300 border border-sky-400/30">
                          {Number(stat.save_percentage ?? 0).toFixed(1)}
                          %
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                        {stat.penalties_saved}/{stat.penalties_faced}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-violet-400/15 text-violet-300 border border-violet-400/30">
                          {Number(stat.penalty_save_percentage ?? 0).toFixed(1)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
