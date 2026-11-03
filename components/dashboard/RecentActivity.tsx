'use client';

import Link from 'next/link';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

interface RecentMatch {
  id: number;
  match_date: string;
  opponent: string;
  result: string;
  rating: number | null;
  goalkeeper_name: string;
}

interface RecentActivityProps {
  recentMatches: RecentMatch[];
  locale: string;
}

export default function RecentActivity({ recentMatches, locale }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-white/10 text-white/60 border border-white/15';
    if (rating >= 8) return 'bg-lime-400/15 text-lime-300 border border-lime-400/30';
    if (rating >= 6) return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
    if (rating >= 4) return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
    return 'bg-red-500/15 text-red-300 border border-red-500/30';
  };

  if (recentMatches.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
          <VideoCameraIcon className="w-5 h-5 text-lime-400" />
          Actividad Reciente
        </h2>
        <p className="text-white/40 text-center py-8">No hay actividad reciente</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <VideoCameraIcon className="w-5 h-5 text-lime-400" />
          Análisis de Partidos Recientes
        </h2>
        <Link
          href={`/${locale}/matches`}
          className="text-sm font-bold text-lime-300 hover:text-lime-200 transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      <div className="space-y-3">
        {recentMatches.map((match) => (
          <Link
            key={match.id}
            href={`/${locale}/matches/${match.id}`}
            className="block p-4 rounded-xl border border-white/10 bg-black/30 hover:border-lime-400/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white">{match.goalkeeper_name}</span>
                  <span className="text-white/30">vs</span>
                  <span className="text-white/70">{match.opponent}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/50">{formatDate(match.match_date)}</span>
                  {match.result && (
                    <>
                      <span className="text-white/25">•</span>
                      <span className="text-white/70 font-bold">{match.result}</span>
                    </>
                  )}
                  {match.rating !== null && (
                    <>
                      <span className="text-white/25">•</span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getRatingColor(match.rating)}`}>
                        {typeof match.rating === 'number'
                          ? match.rating.toFixed(1)
                          : parseFloat(match.rating).toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
