import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TeamWithStats } from '@/lib/types/database';

interface TeamCardProps {
  team: TeamWithStats;
  onDelete: () => void;
}

export function TeamCard({ team, onDelete }: TeamCardProps) {
  const locale = useLocale();
  const t = useTranslations('teams');
  const tc = useTranslations('common');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-lime-400/30 transition-all">
      {/* Color Bar */}
      <div
        className="h-2"
        style={{ backgroundColor: team.color }}
      />

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-black tracking-tight text-white mb-1">
              {team.name}
            </h3>
            <p className="text-sm text-white/50">{team.category}</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-lime-400/15 text-lime-300 border border-lime-400/30">
            {team.season}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-2xl font-black text-lime-300">
              {team.total_goalkeepers || 0}
            </p>
            <p className="text-xs text-white/50 mt-1">{t('totalGoalkeepers')}</p>
          </div>
          <div className="text-center p-3 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-2xl font-black text-lime-300">
              {team.total_goalkeepers || 0}
            </p>
            <p className="text-xs text-white/50 mt-1">{t('activePlayers')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/${locale}/teams/${team.id}`}
            className="flex-1 text-center px-4 py-2 bg-lime-400 text-black font-extrabold rounded-full hover:bg-lime-300 transition-all text-sm"
          >
            {tc('view')}
          </Link>
          <Link
            href={`/${locale}/teams/${team.id}/edit`}
            className="flex-1 text-center px-4 py-2 border border-white/15 text-white/70 font-bold rounded-full hover:border-lime-400/50 hover:text-lime-300 transition-all text-sm"
          >
            {tc('edit')}
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-red-500/40 text-red-300 font-bold rounded-full hover:bg-red-500/10 transition-all text-sm cursor-pointer"
          >
            {tc('delete')}
          </button>
        </div>

        {/* Coach Name */}
        {team.coach_name && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50">
              Coach: <span className="font-bold text-white/80">{team.coach_name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
