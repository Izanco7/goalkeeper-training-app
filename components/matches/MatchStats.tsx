import { useTranslations } from 'next-intl';
import {
  TrophyIcon,
  ClockIcon,
  HandRaisedIcon,
  XCircleIcon,
  ShieldCheckIcon,
  StarIcon,
  PaperAirplaneIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

interface MatchStatsProps {
  stats: {
    total_matches: number;
    total_minutes: number;
    total_goals_conceded: number;
    total_saves: number;
    total_high_balls: number;
    total_crosses: number;
    avg_rating: number;
    avg_distribution: number;
    clean_sheets: number;
  };
}

export default function MatchStats({ stats }: MatchStatsProps) {
  const t = useTranslations('matches.stats');

  const statCards = [
    {
      label: t('totalMatches'),
      value: stats.total_matches,
      icon: TrophyIcon,
      iconClass: 'bg-lime-400/15 text-lime-300'
    },
    {
      label: t('totalMinutes'),
      value: stats.total_minutes,
      icon: ClockIcon,
      iconClass: 'bg-sky-400/15 text-sky-300'
    },
    {
      label: t('totalSaves'),
      value: stats.total_saves,
      icon: HandRaisedIcon,
      iconClass: 'bg-lime-400/15 text-lime-300'
    },
    {
      label: t('totalGoals'),
      value: stats.total_goals_conceded,
      icon: XCircleIcon,
      iconClass: 'bg-red-500/15 text-red-300'
    },
    {
      label: t('cleanSheets'),
      value: stats.clean_sheets,
      icon: ShieldCheckIcon,
      iconClass: 'bg-emerald-400/15 text-emerald-300'
    },
    {
      label: t('avgRating'),
      value: stats.avg_rating ? stats.avg_rating.toFixed(2) : 'N/A',
      icon: StarIcon,
      iconClass: 'bg-amber-400/15 text-amber-300'
    },
    {
      label: t('avgDistribution'),
      value: stats.avg_distribution ? `${stats.avg_distribution.toFixed(1)}%` : 'N/A',
      icon: PaperAirplaneIcon,
      iconClass: 'bg-violet-400/15 text-violet-300'
    },
    {
      label: 'Balones Aéreos',
      value: stats.total_high_balls,
      icon: ArrowUpIcon,
      iconClass: 'bg-orange-400/15 text-orange-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-lime-400/30 hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`h-9 w-9 rounded-full flex items-center justify-center ${stat.iconClass}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
            <p className="text-sm font-medium text-white/50">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
