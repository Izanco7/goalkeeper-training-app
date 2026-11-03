'use client';

import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

interface UpcomingSession {
  id: number;
  session_date: string;
  start_time: string;
  end_time: string | null;
  team_name: string;
  session_type: string;
  status: string;
}

interface UpcomingSessionsProps {
  sessions: UpcomingSession[];
  locale: string;
}

export default function UpcomingSessions({ sessions, locale }: UpcomingSessionsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const formatTimeRange = (startTime: string, endTime?: string | null) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    return end ? `${start} - ${end}` : start;
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'training': return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
      case 'match': return 'bg-lime-400/15 text-lime-300 border border-lime-400/30';
      case 'recovery': return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
      default: return 'bg-white/10 text-white/60 border border-white/15';
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-lime-400" />
          Próximas Sesiones
        </h2>
        <p className="text-white/40 text-center py-8">No hay sesiones programadas</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <CalendarDaysIcon className="w-5 h-5 text-lime-400" />
          Próximas Sesiones
        </h2>
        <Link
          href={`/${locale}/sessions`}
          className="text-sm font-bold text-lime-300 hover:text-lime-200 transition-colors"
        >
          Ver todas →
        </Link>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/${locale}/sessions/${session.id}`}
            className="block p-4 rounded-xl border border-white/10 bg-black/30 hover:border-lime-400/40 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getSessionTypeColor(session.session_type)}`}>
                    {session.session_type}
                  </span>
                  {session.team_name && (
                    <span className="text-sm text-white/50">{session.team_name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="font-bold text-white">{formatDate(session.session_date)}</span>
                  <span className="text-white/25">•</span>
                  <span>{formatTimeRange(session.start_time, session.end_time)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
