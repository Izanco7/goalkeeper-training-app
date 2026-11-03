'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { apiGet, apiDelete } from '@/lib/utils/api';
import PenaltyGrid from '@/components/penalties/PenaltyGrid';

interface Penalty {
  id: number;
  goalkeeper_id: number;
  goalkeeper_name: string;
  opponent_name: string;
  match_date: string | null;
  competition: string | null;
  penalty_taker: string;
  taker_foot: string | null;
  shot_direction: 'left' | 'center' | 'right';
  shot_height: 'low' | 'mid' | 'high';
  result: 'saved' | 'goal' | 'missed' | 'post';
  goalkeeper_direction: string | null;
  notes: string | null;
  video_url: string | null;
  created_at: string;
}

const getResultBadge = (result: string) => {
  switch (result) {
    case 'saved':
      return 'bg-lime-400/15 text-lime-300 border-lime-400/30';
    case 'goal':
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'missed':
      return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
    case 'post':
      return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    default:
      return 'bg-white/5 text-white/60 border-white/10';
  }
};

export default function PenaltyDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string; id: string }> 
}) {
  const [resolvedParams, setResolvedParams] = useState<{ locale: string; id: string } | null>(null);
  const [penalty, setPenalty] = useState<Penalty | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const t = useTranslations('penalties');
  const tCommon = useTranslations('common');

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      loadPenalty();
    }
  }, [resolvedParams]);

  const loadPenalty = async () => {
    try {
      const data = await apiGet<Penalty>(`/api/penalties/${resolvedParams!.id}`);
      setPenalty(data);
    } catch (error) {
      console.error('Error loading penalty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    setDeleting(true);
    try {
      await apiDelete(`/api/penalties/${resolvedParams!.id}`);
      router.push(`/${resolvedParams!.locale}/penalties`);
    } catch (error) {
      console.error('Error deleting penalty:', error);
      alert(tCommon('error'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return tCommon('noDate');
    return new Date(dateString).toLocaleDateString(resolvedParams!.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!penalty) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-white/50 mb-4">{t('noPenalties')}</p>
          <Link
            href={`/${resolvedParams.locale}/penalties`}
            className="text-lime-300 hover:text-lime-200 font-bold inline-flex items-center gap-1"
          >
            <ArrowLeftIcon className="h-4 w-4" /> {tCommon('back')}
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
          href={`/${resolvedParams.locale}/penalties`}
          className="text-lime-300 hover:text-lime-200 font-bold mb-4 inline-flex items-center gap-1"
        >
          <ArrowLeftIcon className="h-4 w-4" /> {tCommon('back')}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">{t('penaltyDetails')}</h1>
            <p className="text-white/50">{formatDate(penalty.match_date)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/${resolvedParams.locale}/penalties/${penalty.id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300 rounded-full font-bold transition-all"
            >
              <PencilIcon className="h-4 w-4" />
              {tCommon('edit')}
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-500/40 text-red-300 hover:bg-red-500/10 rounded-full font-bold transition-all disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              {deleting ? tCommon('deleting') : tCommon('delete')}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Match Info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold text-white mb-4">{tCommon('information')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-bold text-white/50 mb-1">{tCommon('goalkeeper')}</p>
              <p className="font-semibold text-white">{penalty.goalkeeper_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white/50 mb-1">{t('opponent')}</p>
              <p className="font-semibold text-white">{penalty.opponent_name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-white/50 mb-1">{t('penaltyTaker')}</p>
              <p className="font-semibold text-white">{penalty.penalty_taker}</p>
            </div>
            {penalty.taker_foot && (
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('takerFoot')}</p>
                <p className="font-semibold text-white">{t(`feet.${penalty.taker_foot}`)}</p>
              </div>
            )}
            {penalty.competition && (
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('competition')}</p>
                <p className="font-semibold text-white">{penalty.competition}</p>
              </div>
            )}
          </div>
        </div>

        {/* Shot Visualization */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('grid.title')}</h2>
          <PenaltyGrid
            direction={penalty.shot_direction}
            height={penalty.shot_height}
            showResult={true}
            result={penalty.result}
            readOnly={true}
          />
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold text-white mb-4">{tCommon('details')}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('shotDirection')}</p>
                <p className="font-semibold text-white">{t(`directions.${penalty.shot_direction}`)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('shotHeight')}</p>
                <p className="font-semibold text-white">{t(`heights.${penalty.shot_height}`)}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('result')}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getResultBadge(penalty.result)}`}>
                  {t(`results.${penalty.result}`)}
                </span>
              </div>
              {penalty.goalkeeper_direction && (
                <div>
                  <p className="text-sm font-bold text-white/50 mb-1">{t('goalkeeperDirection')}</p>
                  <p className="font-semibold text-white">{t(`directions.${penalty.goalkeeper_direction}`)}</p>
                </div>
              )}
            </div>

            {penalty.notes && (
              <div>
                <p className="text-sm font-bold text-white/50 mb-1">{t('notes')}</p>
                <p className="text-white/80 whitespace-pre-wrap">{penalty.notes}</p>
              </div>
            )}

            {penalty.video_url && (
              <div>
                <p className="text-sm font-bold text-white/50 mb-2">{t('videoUrl')}</p>
                <a
                  href={penalty.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime-300 hover:text-lime-200 underline font-bold break-all"
                >
                  {penalty.video_url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
