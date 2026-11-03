'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, subtitle, icon, color = 'blue', trend }: StatCardProps) {
  const accentClasses = {
    blue: 'text-sky-300',
    green: 'text-lime-300',
    yellow: 'text-amber-300',
    red: 'text-red-400',
    purple: 'text-violet-300',
    gray: 'text-white/70'
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-lime-400/30">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/50">{title}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-white/40">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`text-4xl ${accentClasses[color]}`}>{icon}</div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-sm font-bold ${trend.isPositive ? 'text-lime-300' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-white/40">vs temporada anterior</span>
        </div>
      )}
    </div>
  );
}
