'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface SessionCardProps {
  session: {
    id: number;
    title: string;
    description: string | null;
    session_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    team_name?: string;
    session_type: string;
    status: string;
    task_count?: number;
  };
  onDelete?: (id: number) => void;
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    planned: 'bg-sky-400/15 text-sky-300 border border-sky-400/30',
    completed: 'bg-lime-400/15 text-lime-300 border border-lime-400/30',
    cancelled: 'bg-red-500/15 text-red-300 border border-red-500/30'
  };
  return colors[status] || 'bg-white/10 text-white/60 border border-white/15';
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    training: 'bg-purple-400/15 text-purple-300 border border-purple-400/30',
    match: 'bg-orange-400/15 text-orange-300 border border-orange-400/30',
    recovery: 'bg-lime-400/15 text-lime-300 border border-lime-400/30',
    tactical: 'bg-sky-400/15 text-sky-300 border border-sky-400/30',
    physical: 'bg-red-500/15 text-red-300 border border-red-500/30'
  };
  return colors[type] || 'bg-white/10 text-white/60 border border-white/15';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};

const formatTime = (timeString: string | null): string => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // HH:MM
};

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const t = useTranslations('sessions');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const handleView = () => {
    router.push(`/${locale}/sessions/${session.id}`);
  };

  const handleEdit = () => {
    router.push(`/${locale}/sessions/${session.id}/edit`);
  };

  return (
    <Card className="hover:border-lime-400/30 transition-all">
      <div className="flex flex-col h-full">
        {/* Date Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-white/50 mb-1">
              {formatDate(session.session_date)}
              {session.start_time && (
                <span className="ml-2">
                  {formatTime(session.start_time)}
                  {session.end_time && ` - ${formatTime(session.end_time)}`}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">
              {session.title}
            </h3>
            {session.team_name && (
              <p className="text-sm text-white/60 mt-1">{session.team_name}</p>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(
              session.session_type
            )}`}
          >
            {t(session.session_type as any)}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
              session.status
            )}`}
          >
            {t(session.status as any)}
          </span>
          {session.location && (
            <span className="text-xs text-white/60 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 text-lime-400" />
              {session.location}
            </span>
          )}
          {session.task_count !== undefined && session.task_count > 0 && (
            <span className="text-xs text-white/60">
              {session.task_count} {session.task_count === 1 ? 'tarea' : 'tareas'}
            </span>
          )}
        </div>

        {/* Description */}
        {session.description && (
          <p className="text-sm text-white/60 mb-4 line-clamp-2">
            {session.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button variant="outline" onClick={handleView} className="flex-1">
            {t('sessionDetails')}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            {t('editSession')}
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(session.id)}
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              {t('deleteSession')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
