'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { TeamCard } from '@/components/teams/TeamCard';
import { Button } from '@/components/ui/Button';
import { TeamWithStats } from '@/lib/types/database';
import { apiGet, apiDelete } from '@/lib/utils/api';

export default function TeamsPage() {
  const locale = useLocale();
  const t = useTranslations('teams');
  const tc = useTranslations('common');

  const [teams, setTeams] = useState<TeamWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSeason, setFilterSeason] = useState<string>('all');

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = filterSeason === 'all'
        ? '/api/teams'
        : `/api/teams?season=${filterSeason}`;

      const data = await apiGet<{ teams: TeamWithStats[] }>(url);
      setTeams(data.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorLoading'));
    } finally {
      setIsLoading(false);
    }
  }, [filterSeason, t]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await apiDelete(`/api/teams/${id}`);
      setTeams(teams.filter(team => team.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorDeleting'));
    }
  };

  const seasons = Array.from(new Set(teams.map(t => t.season)));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('title')}</h1>
            <p className="mt-1 text-white/50">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/teams/new`}>
            <Button variant="primary">
              {t('createTeam')}
            </Button>
          </Link>
        </div>

        {/* Filters */}
        {seasons.length > 0 && (
          <div className="flex gap-4">
            <select
              value={filterSeason}
              onChange={(e) => setFilterSeason(e.target.value)}
              className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-white/80 text-sm focus:ring-2 focus:ring-lime-400/40 focus:border-lime-400/50 outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#111816]">{tc('all')}</option>
              {seasons.map(season => (
                <option key={season} value={season} className="bg-[#111816]">{season}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
        </div>
      ) : teams.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] text-center py-12 px-6">
          <UserGroupIcon className="mx-auto h-12 w-12 text-white/20" />
          <h3 className="mt-2 text-base font-bold text-white">{t('noTeams')}</h3>
          <p className="mt-1 text-sm text-white/50">{t('noTeamsDescription')}</p>
          <div className="mt-6">
            <Link href={`/${locale}/teams/new`}>
              <Button variant="primary">{t('createTeam')}</Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Teams Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={() => handleDelete(team.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
