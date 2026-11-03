'use client';

import Link from 'next/link';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface TopGoalkeeper {
  goalkeeper_name: string;
  team_name: string | null;
  matches_played: number;
  clean_sheets: number;
  clean_sheet_percentage: number;
}

interface TopGoalkeepersProps {
  goalkeepers: TopGoalkeeper[];
  locale: string;
}

export default function TopGoalkeepers({ goalkeepers, locale }: TopGoalkeepersProps) {
  if (goalkeepers.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-lime-400" />
          Top Porteros
        </h2>
        <p className="text-white/40 text-center py-8">No hay datos suficientes</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-lime-400" />
          Top Porteros (Temporada Actual)
        </h2>
        <Link
          href={`/${locale}/statistics`}
          className="text-sm font-bold text-lime-300 hover:text-lime-200 transition-colors"
        >
          Ver estadísticas →
        </Link>
      </div>

      <div className="space-y-3">
        {goalkeepers.map((goalkeeper, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-black/30 hover:border-lime-400/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                index === 0 ? 'bg-lime-400 text-black shadow-[0_0_16px_rgba(163,230,53,0.4)]' :
                index === 1 ? 'bg-white/15 text-white' :
                index === 2 ? 'bg-amber-500/80 text-black' :
                'bg-white/5 text-white/40'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-bold text-white">{goalkeeper.goalkeeper_name}</p>
                <p className="text-sm text-white/45">
                  {goalkeeper.team_name || 'Sin equipo'} • {goalkeeper.matches_played} partidos
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-lime-300">
                {goalkeeper.clean_sheet_percentage.toFixed(0)}%
              </p>
              <p className="text-xs text-white/40">{goalkeeper.clean_sheets} porterías a cero</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
