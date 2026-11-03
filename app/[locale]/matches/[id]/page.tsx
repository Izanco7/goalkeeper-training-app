'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { apiGet, apiDelete } from '@/lib/utils/api';

interface MatchAnalysis {
  id: number;
  goalkeeper_id: number;
  goalkeeper_name: string;
  opponent: string;
  match_date: string;
  competition: string | null;
  result: string | null;
  minutes_played: number | null;
  goals_conceded: number;
  saves: number;
  high_balls: number;
  crosses_caught: number;
  distribution_success_rate: number | null;
  rating: number | null;
  strengths: string | null;
  areas_for_improvement: string | null;
  notes: string | null;
  video_url: string | null;
}

export default function MatchDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; id: string } | null>(null);
  const [match, setMatch] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const t = useTranslations('matches');
  const tCommon = useTranslations('common');

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const loadMatch = useCallback(async () => {
    try {
      const data = await apiGet<MatchAnalysis>(`/api/matches/${resolvedParams!.id}`);
      setMatch(data);
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams]);

  useEffect(() => {
    if (resolvedParams) {
      loadMatch();
    }
  }, [resolvedParams, loadMatch]);

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    setDeleting(true);
    try {
      await apiDelete(`/api/matches/${resolvedParams!.id}`);
      router.push(`/${resolvedParams!.locale}/matches`);
    } catch (error) {
      console.error('Error deleting match:', error);
      alert(tCommon('error'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(resolvedParams!.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-white/5 text-white/60 border-white/10';
    if (rating >= 8) return 'bg-lime-400/15 text-lime-300 border-lime-400/30';
    if (rating >= 6) return 'bg-sky-400/15 text-sky-300 border-sky-400/30';
    if (rating >= 4) return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
    return 'bg-red-500/15 text-red-300 border-red-500/30';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-white/50 mb-4">{t('noMatches')}</p>
          <Link
            href={`/${resolvedParams.locale}/matches`}
            className="inline-flex items-center gap-1.5 text-lime-300 hover:text-lime-200 font-bold"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {tCommon('back')}
          </Link>
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
              vs {match.opponent}
            </h1>
            <p className="text-white/50">{formatDate(match.match_date)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/${resolvedParams.locale}/matches/${match.id}/edit`}
              className="px-5 py-2.5 border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-full font-bold transition-all"
            >
              {tCommon('edit')}
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-5 py-2.5 border border-red-500/40 text-red-300 rounded-full font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              {deleting ? tCommon('deleting') : tCommon('delete')}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Match Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-extrabold text-white mb-4">{t('matchDetails')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/50 mb-1">{tCommon('goalkeeper')}</p>
              <p className="font-semibold text-white">{match.goalkeeper_name}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 mb-1">{t('opponent')}</p>
              <p className="font-semibold text-white">{match.opponent}</p>
            </div>
            {match.competition && (
              <div>
                <p className="text-sm text-white/50 mb-1">{t('competition')}</p>
                <p className="font-semibold text-white">{match.competition}</p>
              </div>
            )}
            {match.result && (
              <div>
                <p className="text-sm text-white/50 mb-1">{t('result')}</p>
                <p className="font-semibold text-white">{match.result}</p>
              </div>
            )}
            {match.minutes_played !== null && (
              <div>
                <p className="text-sm text-white/50 mb-1">{t('minutesPlayed')}</p>
                <p className="font-semibold text-white">{match.minutes_played}&apos;</p>
              </div>
            )}
            {match.rating !== null && (
              <div>
                <p className="text-sm text-white/50 mb-1">{t('rating')}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getRatingColor(match.rating)}`}>
                  {typeof match.rating === 'number'
                    ? match.rating.toFixed(1)
                    : parseFloat(match.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-extrabold text-white mb-4">{t('metrics')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <p className="text-3xl font-black text-red-300">{match.goals_conceded}</p>
              <p className="text-sm text-white/50 mt-1">{t('goalsConceded')}</p>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <p className="text-3xl font-black text-lime-300">{match.saves}</p>
              <p className="text-sm text-white/50 mt-1">{t('saves')}</p>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <p className="text-3xl font-black text-sky-300">{match.high_balls}</p>
              <p className="text-sm text-white/50 mt-1">{t('highBalls')}</p>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <p className="text-3xl font-black text-violet-300">{match.crosses_caught}</p>
              <p className="text-sm text-white/50 mt-1">{t('crossesCaught')}</p>
            </div>
          </div>
          {match.distribution_success_rate !== null && (
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
              <p className="text-sm text-white/50 mb-1">{t('distributionRate')}</p>
              <div className="flex items-center">
                <div className="flex-1 bg-white/10 rounded-full h-3 mr-3">
                  <div
                    className="bg-lime-400 h-3 rounded-full"
                    style={{ width: `${match.distribution_success_rate}%` }}
                  />
                </div>
                <span className="text-lg font-extrabold text-lime-300">
                  {typeof match.distribution_success_rate === 'number'
                    ? match.distribution_success_rate.toFixed(1)
                    : parseFloat(match.distribution_success_rate).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Analysis */}
        {(match.strengths || match.areas_for_improvement || match.notes) && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-extrabold text-white mb-4">{t('performance')}</h2>
            <div className="space-y-4">
              {match.strengths && (
                <div>
                  <p className="text-sm font-bold text-white/70 mb-2">{t('strengths')}</p>
                  <p className="text-white/80 whitespace-pre-wrap bg-lime-400/10 border border-lime-400/20 p-3 rounded-xl">
                    {match.strengths}
                  </p>
                </div>
              )}
              {match.areas_for_improvement && (
                <div>
                  <p className="text-sm font-bold text-white/70 mb-2">{t('areasForImprovement')}</p>
                  <p className="text-white/80 whitespace-pre-wrap bg-amber-400/10 border border-amber-400/20 p-3 rounded-xl">
                    {match.areas_for_improvement}
                  </p>
                </div>
              )}
              {match.notes && (
                <div>
                  <p className="text-sm font-bold text-white/70 mb-2">{t('notes')}</p>
                  <p className="text-white/80 whitespace-pre-wrap bg-white/5 border border-white/10 p-3 rounded-xl">
                    {match.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video */}
        {match.video_url && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-extrabold text-white mb-4">{t('videoUrl')}</h2>
            <a
              href={match.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-300 hover:text-lime-200 underline break-all font-bold"
            >
              {match.video_url}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
