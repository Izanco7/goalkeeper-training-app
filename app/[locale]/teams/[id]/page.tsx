'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon, TagIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { TeamWithStats } from '@/lib/types/database';
import { apiGet } from '@/lib/utils/api';

export default function TeamDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('teams');
  const tc = useTranslations('common');

  const [team, setTeam] = useState<TeamWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true);
        const data = await apiGet<{ team: TeamWithStats }>(`/api/teams/${params.id}`);
        setTeam(data.team);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTeam();
    }
  }, [params.id, t]);

  if (isLoading) {
    return (
      <div className="py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{tc('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300">{error || t('errorLoading')}</p>
          </div>
          <Link href={`/${locale}/teams`} className="mt-4 inline-block">
            <Button variant="outline">{tc('back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/teams`}
            className="inline-flex items-center text-sm font-bold text-white/50 hover:text-lime-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {tc('back')}
          </Link>
        </div>

        {/* Team Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {/* Color Bar */}
          <div
            className="h-2"
            style={{ backgroundColor: team.color }}
          />

          <div className="p-8">
            {/* Title Section */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                  {team.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center">
                    <TagIcon className="w-5 h-5 mr-1 text-lime-400" />
                    {team.category}
                  </span>
                  <span className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-1 text-lime-400" />
                    {team.season}
                  </span>
                </div>
              </div>
              <Link href={`/${locale}/teams/${team.id}/edit`}>
                <Button variant="primary">{tc('edit')}</Button>
              </Link>
            </div>

            {/* Description */}
            {team.description && (
              <div className="mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <p className="text-white/80">{team.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-4xl font-black text-lime-300 mb-2">
                  {team.total_goalkeepers || 0}
                </p>
                <p className="text-sm text-white/50">{t('totalGoalkeepers')}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-4xl font-black text-lime-300 mb-2">
                  {team.total_goalkeepers || 0}
                </p>
                <p className="text-sm text-white/50">{t('activePlayers')}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <p className="text-4xl font-black text-lime-300 mb-2">
                  0
                </p>
                <p className="text-sm text-white/50">{t('trainingSessions')}</p>
              </div>
            </div>

            {/* Coach Info */}
            {team.coach_name && (
              <div className="border-t border-white/10 pt-6">
                <h2 className="text-lg font-bold text-white mb-3">
                  {t('coachInfo')}
                </h2>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lime-400/15 text-lime-300 border border-lime-400/30 rounded-full flex items-center justify-center font-black text-lg mr-4">
                    {team.coach_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white">{team.coach_name}</p>
                    <p className="text-sm text-white/50">{t('headCoach')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Goalkeepers Section */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">
                  {t('goalkeepers')}
                </h2>
                <Button variant="outline" size="sm">
                  {t('addGoalkeeper')}
                </Button>
              </div>

              {team.total_goalkeepers === 0 ? (
                <div className="text-center py-12 bg-white/[0.03] border border-white/10 rounded-2xl">
                  <UserGroupIcon className="w-16 h-16 mx-auto text-white/20 mb-4" />
                  <p className="text-white/60">{t('noGoalkeepers')}</p>
                  <p className="text-sm text-white/40 mt-2">{t('addFirstGoalkeeper')}</p>
                </div>
              ) : (
                <div className="text-center py-8 bg-white/[0.03] border border-white/10 rounded-2xl">
                  <p className="text-white/60">{t('goalkeeperListComingSoon')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
