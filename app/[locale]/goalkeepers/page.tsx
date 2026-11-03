'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { GoalkeeperCard } from '@/components/goalkeepers/GoalkeeperCard';
import { Button } from '@/components/ui/Button';
import { GoalkeeperWithTeam, Team } from '@/lib/types/database';
import { apiGet, apiDelete } from '@/lib/utils/api';

export default function GoalkeepersPage() {
  const locale = useLocale();
  const t = useTranslations('goalkeepers');
  
  const [goalkeepers, setGoalkeepers] = useState<GoalkeeperWithTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGoalkeepers = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = filterTeam === 'all' 
        ? '/api/goalkeepers'
        : `/api/goalkeepers?team_id=${filterTeam}`;
      
      const data = await apiGet<GoalkeeperWithTeam[] | { goalkeepers: GoalkeeperWithTeam[] }>(url);
      setGoalkeepers(Array.isArray(data) ? data : data.goalkeepers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorLoading'));
    } finally {
      setIsLoading(false);
    }
  }, [filterTeam, t]);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await apiGet<{ teams: Team[] }>('/api/teams');
      setTeams(data.teams || []);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  }, []);

  useEffect(() => {
    fetchGoalkeepers();
    fetchTeams();
  }, [fetchGoalkeepers, fetchTeams]);

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await apiDelete(`/api/goalkeepers/${id}`);
      setGoalkeepers(goalkeepers.filter(gk => gk.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorDeleting'));
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchGoalkeepers();
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiGet<GoalkeeperWithTeam[] | { goalkeepers: GoalkeeperWithTeam[] }>(
        `/api/goalkeepers?search=${encodeURIComponent(searchTerm)}`
      );
      setGoalkeepers(Array.isArray(data) ? data : data.goalkeepers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  return (    
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('title')}</h1>
            <p className="mt-1 text-white/50">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/goalkeepers/new`}>
            <Button variant="primary">
              {t('createGoalkeeper')}
            </Button>
          </Link>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/30 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/15 text-white focus:outline-none focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20 [&>option]:bg-zinc-900"
            >
              <option value="all">{t('allTeams')}</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div>
        </div>
      ) : goalkeepers.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 rounded-2xl border border-white/10 bg-white/[0.03]">
          <UserIcon className="w-16 h-16 mx-auto text-white/25 mb-4" />
          <h3 className="text-lg font-extrabold text-white mb-2">{t('noGoalkeepers')}</h3>
          <p className="text-white/50 mb-6">{t('noGoalkeepersDescription')}</p>
          <Link href={`/${locale}/goalkeepers/new`}>
            <Button variant="primary">{t('createGoalkeeper')}</Button>
          </Link>
        </div>
      ) : (
        /* Grid de Porteros */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goalkeepers.map(goalkeeper => (
            <GoalkeeperCard
              key={goalkeeper.id}
              goalkeeper={goalkeeper}
              onDelete={() => handleDelete(goalkeeper.id)}
            />
          ))}
        </div>
      )}
    </div>    
  );
}
