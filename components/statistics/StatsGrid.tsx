'use client';

import { useTranslations } from 'next-intl';
import { GoalkeeperStatistics } from '@/lib/db/models/GoalkeeperStatisticsModel';

interface StatsGridProps {
  statistics: GoalkeeperStatistics;
}

export default function StatsGrid({ statistics }: StatsGridProps) {
  const t = useTranslations('statistics');

  const stats = [
    {
      label: t('fields.matchesPlayed'),
      value: statistics.matches_played,
      color: 'blue' as const
    },
    {
      label: t('fields.minutesPlayed'),
      value: statistics.minutes_played,
      color: 'purple' as const
    },
    {
      label: t('fields.goalsConceded'),
      value: statistics.goals_conceded,
      color: 'red' as const
    },
    {
      label: t('fields.cleanSheets'),
      value: statistics.clean_sheets,
      color: 'green' as const
    },
    {
      label: t('fields.saves'),
      value: statistics.saves,
      color: 'blue' as const
    },
    {
      label: t('calculated.goalsPerMatch'),
      value: typeof statistics.goals_per_match === 'number'
        ? statistics.goals_per_match.toFixed(2)
        : parseFloat(statistics.goals_per_match || '0').toFixed(2),
      color: 'yellow' as const
    },
    {
      label: t('calculated.cleanSheetPercentage'),
      value: typeof statistics.clean_sheet_percentage === 'number'
        ? `${statistics.clean_sheet_percentage.toFixed(1)}%`
        : `${parseFloat(statistics.clean_sheet_percentage || '0').toFixed(1)}%`,
      color: 'green' as const
    },
    {
      label: t('calculated.savePercentage'),
      value: typeof statistics.save_percentage === 'number'
        ? `${statistics.save_percentage.toFixed(1)}%`
        : `${parseFloat(statistics.save_percentage || '0').toFixed(1)}%`,
      color: 'blue' as const
    }
  ];

  const accentClasses = {
    blue: 'text-sky-300',
    green: 'text-lime-300',
    yellow: 'text-amber-300',
    red: 'text-red-400',
    purple: 'text-violet-300',
    gray: 'text-white/70'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-lime-400/30"
        >
          <p className={`text-2xl font-black mb-1 ${accentClasses[stat.color]}`}>{stat.value}</p>
          <p className="text-sm text-white/50">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
