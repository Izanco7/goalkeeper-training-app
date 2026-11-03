'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { SessionCard } from '@/components/sessions/SessionCard';
import { Button } from '@/components/ui/Button';
import { apiGet, apiDelete } from '@/lib/utils/api';

interface Session {
  id: number;
  title: string;
  description: string | null;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  team_id: number;
  session_type: string;
  status: string;
  team_name?: string;
  task_count?: number;
}

interface Team {
  id: number;
  name: string;
}

export default function SessionsPage() {
  const t = useTranslations('sessions');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const types = ['training', 'match', 'recovery', 'tactical', 'physical'];
  const statuses = ['planned', 'completed', 'cancelled'];

  useEffect(() => {
    loadTeams();
    loadSessions();
  }, [selectedTeam, dateFilter]);

  const loadTeams = async () => {
    try {
      const data = await apiGet<Team[]>('/api/teams');
      setTeams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTeam) params.append('team_id', selectedTeam);
      if (dateFilter === 'upcoming') params.append('upcoming', 'true');

      const data = await apiGet<Session[]>(`/api/sessions?${params.toString()}`);
      let filteredSessions = Array.isArray(data) ? data : [];

      if (dateFilter === 'past') {
        const today = new Date().toISOString().split('T')[0];
        filteredSessions = filteredSessions.filter(s => s.session_date < today);
      }

      if (selectedStatus) {
        filteredSessions = filteredSessions.filter(s => s.status === selectedStatus);
      }

      if (selectedType) {
        filteredSessions = filteredSessions.filter(s => s.session_type === selectedType);
      }

      setSessions(filteredSessions);
    } catch (error) {
      console.error(t('errorLoading'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await apiDelete(`/api/sessions/${id}`);
      setSessions(sessions.filter(s => s.id !== id));
    } catch (error) {
      console.error(t('errorDeleting'), error);
      alert(t('errorDeleting'));
    }
  };

  const selectClass =
    'bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2 outline-none focus:border-lime-400/60 [&>option]:bg-black';

  return (    
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('title')}</h1>
        <p className="text-white/50 mt-2">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className={selectClass}
          >
            <option value="">{t('allTeams')}</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={selectClass}
          >
            <option value="">{t('allTypes')}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {t(type as any)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={selectClass}
          >
            <option value="">{t('allStatuses')}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {t(status as any)}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className={selectClass}
          >
            <option value="all">Todas las fechas</option>
            <option value="upcoming">{t('upcomingSessions')}</option>
            <option value="past">{t('pastSessions')}</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => router.push(`/${locale}/sessions/new`)}>
            + {t('createSession')}
          </Button>
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/50">Cargando...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-white/70 mb-2">{t('noSessions')}</p>
          <p className="text-sm text-white/50 mb-6">{t('noSessionsDescription')}</p>
          <Button onClick={() => router.push(`/${locale}/sessions/new`)}>
            + {t('createSession')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>    
  );
}
