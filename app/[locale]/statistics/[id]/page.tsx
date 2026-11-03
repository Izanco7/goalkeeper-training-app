'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrophyIcon, UsersIcon, TrashIcon, ExclamationTriangleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { GoalkeeperStatistics } from '@/lib/db/models/GoalkeeperStatisticsModel';
import StatsGrid from '@/components/statistics/StatsGrid';
import { apiGet, apiDelete } from '@/lib/utils/api';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function StatisticsDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const t = useTranslations('statistics');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [statistics, setStatistics] = useState<GoalkeeperStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await apiGet<GoalkeeperStatistics>(`/api/statistics/${resolvedParams.id}`);
        setStatistics(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar estas estadísticas?')) return;

    try {
      await apiDelete(`/api/statistics/${resolvedParams.id}`);
      router.push(`/${resolvedParams.locale}/statistics`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar las estadísticas');
    }
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

  if (!statistics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-lg text-white/50">{t('noStatistics')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/${resolvedParams.locale}/statistics`}
          className="text-lime-300 hover:text-lime-200 font-bold mb-4 inline-block"
        >
          ← {tCommon('back')}
        </Link>
      </div>

      {/* Encabezado */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
              {statistics.goalkeeper_name}
            </h1>
            <div className="flex gap-4 text-white/60">
              <span className="inline-flex items-center gap-2">
                <TrophyIcon className="h-5 w-5 text-amber-300" />
                <strong className="text-white">{statistics.season}</strong>
              </span>
              {statistics.team_name && (
                <span className="inline-flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-sky-300" />
                  {statistics.team_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/15 text-red-300 border border-red-500/30 rounded-full font-bold hover:bg-red-500/25 transition-all"
            >
              <TrashIcon className="h-5 w-5" />
              {t('actions.delete')}
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <h2 className="text-2xl font-black tracking-tight text-white mb-6">Estadísticas</h2>
        <StatsGrid statistics={statistics} />
      </div>

      {/* Detalles adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Penaltis */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Penaltis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl">
              <span className="text-white/60">{t('fields.penaltiesFaced')}</span>
              <span className="font-bold text-lg text-white">{statistics.penalties_faced}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl">
              <span className="text-white/60">{t('fields.penaltiesSaved')}</span>
              <span className="font-bold text-lg text-lime-300">{statistics.penalties_saved}</span>
            </div>
            {statistics.penalty_save_percentage !== undefined && (
              <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl">
                <span className="text-white/60">{t('calculated.penaltySavePercentage')}</span>
                <span className="font-bold text-lg text-sky-300">
                  {typeof statistics.penalty_save_percentage === 'number'
                    ? statistics.penalty_save_percentage.toFixed(1)
                    : parseFloat(statistics.penalty_save_percentage || '0').toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Disciplina */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-300" />
            Disciplina
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl">
              <span className="text-white/60">{t('fields.yellowCards')}</span>
              <span className="font-bold text-lg text-amber-300">{statistics.yellow_cards}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/[0.04] rounded-xl">
              <span className="text-white/60">{t('fields.redCards')}</span>
              <span className="font-bold text-lg text-red-400">{statistics.red_cards}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fechas */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mt-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-lime-400" />
          Información del Registro
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-white/50">
          <div>
            <span className="font-bold text-white/70">Creado:</span>{' '}
            {new Date(statistics.created_at).toLocaleDateString()}
          </div>
          <div>
            <span className="font-bold text-white/70">Actualizado:</span>{' '}
            {new Date(statistics.updated_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
