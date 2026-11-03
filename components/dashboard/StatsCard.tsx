'use client';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  link?: string;
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-lime-400 text-black',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all hover:border-lime-400/30 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-white/50 mb-1">{title}</p>
          <p className="text-3xl font-black tracking-tight">{value}</p>
        </div>
        <div className={`${colorClasses[color]} rounded-2xl p-4 text-white text-2xl font-black shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
