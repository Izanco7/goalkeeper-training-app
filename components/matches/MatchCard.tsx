import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface MatchAnalysis {
  id: number;
  opponent: string;
  match_date: string;
  competition: string | null;
  result: string | null;
  goals_conceded: number;
  saves: number;
  rating: number | null;
  goalkeeper_name?: string;
}

interface MatchCardProps {
  match: MatchAnalysis;
  locale: string;
  showGoalkeeper?: boolean;
}

export default function MatchCard({ match, locale, showGoalkeeper = false }: MatchCardProps) {
  const t = useTranslations('matches');

  const getRatingColor = (rating: number | null) => {
    if (!rating) return 'bg-white/5 text-white/60 border-white/10';
    if (rating >= 8) return 'bg-lime-400/15 text-lime-300 border-lime-400/30';
    if (rating >= 6) return 'bg-sky-400/15 text-sky-300 border-sky-400/30';
    if (rating >= 4) return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
    return 'bg-red-500/15 text-red-300 border-red-500/30';
  };

  const getCleanSheetBadge = (goals: number) => {
    if (goals === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-lime-400/15 text-lime-300 border border-lime-400/30">
          <ShieldCheckIcon className="w-3.5 h-3.5" />
          Clean Sheet
        </span>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/${locale}/matches/${match.id}`}
      className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-lime-400/30 hover:-translate-y-0.5 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-extrabold text-lg text-white mb-1">
            vs {match.opponent}
          </h3>
          {showGoalkeeper && match.goalkeeper_name && (
            <p className="text-sm text-white/50">
              {match.goalkeeper_name}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-white/40">
              {formatDate(match.match_date)}
            </p>
            {match.competition && (
              <>
                <span className="text-white/30">•</span>
                <p className="text-sm text-white/40">{match.competition}</p>
              </>
            )}
          </div>
        </div>

        {match.rating && (
          <div className={`px-3 py-2 rounded-xl text-center border ${getRatingColor(match.rating)}`}>
            <div className="text-2xl font-black">
              {typeof match.rating === 'number'
                ? match.rating.toFixed(1)
                : parseFloat(match.rating).toFixed(1)}
            </div>
            <div className="text-xs">{t('rating')}</div>
          </div>
        )}
      </div>

      {/* Result */}
      {match.result && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-white/5 text-white/70 border border-white/10 rounded-full text-sm font-bold">
            {match.result}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center">
          <p className="text-2xl font-black text-lime-300">{match.saves}</p>
          <p className="text-xs text-white/50">{t('saves')}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-center">
          <p className={`text-2xl font-black ${match.goals_conceded === 0 ? 'text-lime-300' : 'text-red-300'}`}>
            {match.goals_conceded}
          </p>
          <p className="text-xs text-white/50">{t('goalsConceded')}</p>
        </div>
        <div className="flex items-center justify-center">
          {getCleanSheetBadge(match.goals_conceded)}
        </div>
      </div>
    </Link>
  );
}
