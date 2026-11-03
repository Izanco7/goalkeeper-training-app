'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { GoalkeeperWithTeam } from '@/lib/types/database';
import { apiGet } from '@/lib/utils/api';

export default function GoalkeeperDetailPage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('goalkeepers');
  const tc = useTranslations('common');
  
  const [goalkeeper, setGoalkeeper] = useState<GoalkeeperWithTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoalkeeper = async () => {
      try {
        setIsLoading(true);
        const data = await apiGet<{ goalkeeper: GoalkeeperWithTeam }>(`/api/goalkeepers/${params.id}`);
        setGoalkeeper(data.goalkeeper);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errorLoading'));
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchGoalkeeper();
    }
  }, [params.id, t]);

  const calculateAge = (dob: Date | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{tc('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !goalkeeper) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4">
            <p className="text-red-300">{error || t('errorLoading')}</p>
          </div>
          <Link href={`/${locale}/goalkeepers`} className="mt-4 inline-block">
            <Button variant="secondary">{tc('back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${goalkeeper.first_name} ${goalkeeper.last_name}`;
  const initials = `${goalkeeper.first_name.charAt(0)}${goalkeeper.last_name.charAt(0)}`.toUpperCase();
  const age = calculateAge(goalkeeper.date_of_birth);

  return (
    
      <div>
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/goalkeepers`}
            className="inline-flex items-center text-sm font-bold text-white/50 hover:text-lime-300 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {tc('back')}
          </Link>
        </div>

        {/* Goalkeeper Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-lime-400/15 via-lime-400/5 to-transparent border-b border-white/10 p-8">
            <div className="flex items-center gap-6">
              {goalkeeper.photo ? (
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white/20 object-cover bg-cover bg-center"
                  style={{ backgroundImage: `url(${goalkeeper.photo})` }}
                  role="img"
                  aria-label={fullName}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-lime-400/15 flex items-center justify-center text-lime-300 font-black text-4xl">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-black tracking-tight text-white mb-2">{fullName}</h1>
                {goalkeeper.jersey_number && (
                  <p className="text-2xl font-extrabold text-lime-300">#{goalkeeper.jersey_number}</p>
                )}
                {goalkeeper.team_name && (
                  <p className="text-lg text-white/60 mt-2">{goalkeeper.team_name}</p>
                )}
              </div>
              <Link href={`/${locale}/goalkeepers/${goalkeeper.id}/edit`}>
                <Button variant="primary" className="cursor-pointer">
                  {tc('edit')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {age && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="text-3xl font-black text-lime-300">{age}</p>
                  <p className="text-sm text-white/50 mt-1">{t('years')}</p>
                </div>
              )}
              {goalkeeper.height && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="text-3xl font-black text-lime-300">{goalkeeper.height}</p>
                  <p className="text-sm text-white/50 mt-1">{t('cm')}</p>
                </div>
              )}
              {goalkeeper.weight && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="text-3xl font-black text-lime-300">{goalkeeper.weight}</p>
                  <p className="text-sm text-white/50 mt-1">{t('kg')}</p>
                </div>
              )}
              {goalkeeper.dominant_hand && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                  <p className="text-sm font-extrabold text-lime-300">
                    {goalkeeper.dominant_hand === 'left' && t('leftHand')}
                    {goalkeeper.dominant_hand === 'right' && t('rightHand')}
                    {goalkeeper.dominant_hand === 'both' && t('bothHands')}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{t('dominantHand')}</p>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {goalkeeper.nationality && (
                <div>
                  <p className="text-sm text-white/40 mb-1">{t('nationality')}</p>
                  <p className="text-lg font-semibold text-white">{goalkeeper.nationality}</p>
                </div>
              )}
              {goalkeeper.date_of_birth && (
                <div>
                  <p className="text-sm text-white/40 mb-1">{t('dateOfBirth')}</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date(goalkeeper.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            {goalkeeper.notes && (
              <div className="border-t border-white/10 pt-6 mb-6">
                <h2 className="text-lg font-extrabold text-white mb-3">{t('additionalNotes')}</h2>
                <p className="text-white/70 whitespace-pre-wrap">{goalkeeper.notes}</p>
              </div>
            )}

            {/* Attendance History */}
            <div className="border-t border-white/10 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white">Historial de Asistencia</h2>
                <Link href={`/${locale}/goalkeepers/${goalkeeper.id}/attendance`}>
                  <Button variant="outline" className="text-sm cursor-pointer">Ver Todo</Button>
                </Link>
              </div>
              <p className="text-sm text-white/50">Accede al historial completo de asistencia del portero</p>
            </div>

            {/* Penalties Section */}
            <div className="border-t border-white/10 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white">Penaltis</h2>
                <Link href={`/${locale}/penalties?goalkeeper_id=${goalkeeper.id}`}>
                  <Button variant="outline" className="text-sm cursor-pointer">Ver Todos</Button>
                </Link>
              </div>
              <p className="text-sm text-white/50">Registro y análisis de penaltis del portero</p>
            </div>

            {/* Match Analysis Section */}
            <div className="border-t border-white/10 pt-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white">Análisis de Partidos</h2>
                <Link href={`/${locale}/matches?goalkeeper_id=${goalkeeper.id}`}>
                  <Button variant="outline" className="text-sm cursor-pointer">Ver Todos</Button>
                </Link>
              </div>
              <p className="text-sm text-white/50">Registro de rendimiento y análisis post-partido</p>
            </div>

            {/* Statistics Section */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-lime-400" />
                  Estadísticas por Temporada
                </h2>
                <Link href={`/${locale}/statistics?goalkeeper_id=${goalkeeper.id}`}>
                  <Button variant="outline" className="text-sm cursor-pointer">Ver Todas</Button>
                </Link>
              </div>
              <p className="text-sm text-white/50">Estadísticas detalladas de rendimiento por temporada</p>
            </div>
          </div>
        </div>
      </div>
    
  );
}
