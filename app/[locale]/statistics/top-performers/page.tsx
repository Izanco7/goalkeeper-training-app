'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { StarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { GoalkeeperStatistics } from '@/lib/db/models/GoalkeeperStatisticsModel';
import { apiGet } from '@/lib/utils/api';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function TopPerformersPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('statistics');
  const tCommon = useTranslations('common');

  const [topPerformers, setTopPerformers] = useState<GoalkeeperStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState<string>('');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const data = await apiGet<string[]>('/api/statistics?action=seasons');
        setSeasons(data);
        if (data.length > 0) {
          setSeason(data[0]); // Temporada más reciente
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadSeasons();
  }, []);

  useEffect(() => {
    if (!season) return;

    const loadTopPerformers = async () => {
      setLoading(true);
      try {
        const data = await apiGet<GoalkeeperStatistics[]>(
          `/api/statistics?action=top-performers&season=${season}&limit=${limit}`
        );
        setTopPerformers(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopPerformers();
  }, [season, limit]);

  const thClasses =
    'px-6 py-3 text-xs font-bold text-white/40 uppercase tracking-widest';

  const selectClasses =
    'w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white rounded-xl focus:border-lime-400/60 focus:outline-none transition-colors';

  const rankIcon = (index: number) => {
    if (index === 0) return <TrophyIcon className="h-6 w-6 text-amber-300" />;
    if (index === 1) return <TrophyIcon className="h-6 w-6 text-slate-300" />;
    if (index === 2) return <TrophyIcon className="h-6 w-6 text-amber-600" />;
    return <span className="text-white/40 font-bold">{index + 1}.</span>;
  };

  const rowHighlight = (index: number) => {
    if (index === 0) return 'bg-amber-400/[0.07]';
    if (index === 1) return 'bg-white/[0.04]';
    if (index === 2) return 'bg-orange-400/[0.05]';
    return '';
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <StarIcon className="h-8 w-8 text-lime-400" />
                {t('topPerformers.title')}
              </h1>
              <p className="text-white/50 mt-2">{t('topPerformers.subtitle')}</p>
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
                className={selectClasses}
              >
                {seasons.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-48">
              <label className="block text-sm font-bold text-white/70 mb-2">
                {tCommon('limit')}
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className={selectClasses}
              >
                <option value="5">Top 5</option>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <div className="text-white/50">{tCommon('loading')}</div>
          </div>
        ) : (
          <>
            {/* Tabla de mejores porteros */}
            {topPerformers.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
                <div className="text-white/50">{t('noStatistics')}</div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className={`${thClasses} text-left`}>
                          #
                        </th>
                        <th className={`${thClasses} text-left`}>
                          {tCommon('goalkeeper')}
                        </th>
                        <th className={`${thClasses} text-left`}>
                          {tCommon('team')}
                        </th>
                        <th className={`${thClasses} text-center`}>
                          {t('fields.matchesPlayed')}
                        </th>
                        <th className={`${thClasses} text-center`}>
                          {t('fields.cleanSheets')}
                        </th>
                        <th className={`${thClasses} text-center`}>
                          {t('calculated.cleanSheetPercentage')}
                        </th>
                        <th className={`${thClasses} text-center`}>
                          {t('calculated.savePercentage')}
                        </th>
                        <th className={`${thClasses} text-center`}>
                          {t('calculated.goalsPerMatch')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPerformers.map((stat, index) => (
                        <tr
                          key={stat.id}
                          className={`border-b border-white/5 hover:bg-white/[0.04] transition-colors ${rowHighlight(index)}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {rankIcon(index)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/${resolvedParams.locale}/statistics/${stat.id}`}
                              className="text-lime-300 hover:text-lime-200 font-bold"
                            >
                              {stat.goalkeeper_name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white/50">
                            {stat.team_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                            {stat.matches_played}
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
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-sky-400/15 text-sky-300 border border-sky-400/30">
                              {Number(stat.save_percentage ?? 0).toFixed(1)}
                              %
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-white/80">
                            {Number(stat.goals_per_match ?? 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
