import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface Penalty {
  id: number;
  opponent_name: string;
  match_date: string | null;
  penalty_taker: string;
  shot_direction: string;
  shot_height: string;
  result: string;
  goalkeeper_direction: string | null;
  goalkeeper_name?: string;
}

interface PenaltyCardProps {
  penalty: Penalty;
  locale: string;
  showGoalkeeper?: boolean;
}

export default function PenaltyCard({ penalty, locale, showGoalkeeper = false }: PenaltyCardProps) {
  const t = useTranslations('penalties');
  const tCommon = useTranslations('common');

  const getResultColor = (result: string) => {
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

  const getDirectionIcon = (direction: string) => {
    const iconClasses = 'h-5 w-5 text-lime-400';
    switch (direction) {
      case 'left':
        return <ArrowLeftIcon className={iconClasses} />;
      case 'right':
        return <ArrowRightIcon className={iconClasses} />;
      case 'center':
        return <ArrowDownIcon className={iconClasses} />;
      default:
        return <MinusIcon className={iconClasses} />;
    }
  };

  const getHeightIcon = (height: string) => {
    const iconClasses = 'h-5 w-5 text-lime-400';
    switch (height) {
      case 'high':
        return <ArrowUpIcon className={iconClasses} />;
      case 'mid':
        return <ArrowRightIcon className={iconClasses} />;
      case 'low':
        return <ArrowDownIcon className={iconClasses} />;
      default:
        return <MinusIcon className={iconClasses} />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return tCommon('noDate');
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/${locale}/penalties/${penalty.id}`}
      className="block rounded-2xl border border-white/10 bg-white/[0.03] hover:border-lime-400/40 hover:bg-white/[0.05] transition-all p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white mb-1">
            {penalty.opponent_name}
          </h3>
          {showGoalkeeper && penalty.goalkeeper_name && (
            <p className="text-sm text-white/60">
              {penalty.goalkeeper_name}
            </p>
          )}
          <p className="text-sm text-white/40">
            {formatDate(penalty.match_date)}
          </p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getResultColor(penalty.result)}`}>
          {t(`results.${penalty.result}`)}
        </span>
      </div>

      {/* Penalty Taker */}
      <div className="mb-3">
        <p className="text-sm font-bold text-white/70">
          {t('penaltyTaker')}: <span className="text-white">{penalty.penalty_taker}</span>
        </p>
      </div>

      {/* Shot Info */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2">
          <p className="text-xs text-white/50 mb-1">{t('shotDirection')}</p>
          <div className="flex items-center gap-1.5">
            {getDirectionIcon(penalty.shot_direction)}
            <span className="text-sm font-bold text-white">{t(`directions.${penalty.shot_direction}`)}</span>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-xl p-2">
          <p className="text-xs text-white/50 mb-1">{t('shotHeight')}</p>
          <div className="flex items-center gap-1.5">
            {getHeightIcon(penalty.shot_height)}
            <span className="text-sm font-bold text-white">{t(`heights.${penalty.shot_height}`)}</span>
          </div>
        </div>
      </div>

      {/* Goalkeeper Direction */}
      {penalty.goalkeeper_direction && (
        <div className="bg-lime-400/[0.06] border border-lime-400/20 rounded-xl p-2">
          <p className="text-xs text-white/50 mb-1">{t('goalkeeperDirection')}</p>
          <div className="flex items-center gap-1.5">
            {getDirectionIcon(penalty.goalkeeper_direction)}
            <span className="text-sm font-bold text-white">{t(`directions.${penalty.goalkeeper_direction}`)}</span>
          </div>
        </div>
      )}
    </Link>
  );
}
