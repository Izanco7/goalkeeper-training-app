'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiGet, apiPost, apiPut } from '@/lib/utils/api';

interface Session {
  id: number;
  title: string;
  session_date: string;
  team_id: number;
  team_name?: string;
}

interface Goalkeeper {
  id: number;
  first_name: string;
  last_name: string;
  jersey_number: number | null;
  photo_url: string | null;
}

interface Attendance {
  id?: number;
  goalkeeper_id: number;
  status: 'present' | 'absent' | 'late' | 'injured' | 'excused';
  notes: string;
}

const statusColors = {
  present: 'bg-lime-400/10 border-lime-400/40 text-lime-300',
  absent: 'bg-red-500/10 border-red-500/40 text-red-300',
  late: 'bg-yellow-400/10 border-yellow-400/40 text-yellow-300',
  injured: 'bg-orange-400/10 border-orange-400/40 text-orange-300',
  excused: 'bg-sky-400/10 border-sky-400/40 text-sky-300'
};

export default function SessionAttendancePage() {
  const t = useTranslations('attendance');
  const tSessions = useTranslations('sessions');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [goalkeepers, setGoalkeepers] = useState<Goalkeeper[]>([]);
  const [attendances, setAttendances] = useState<Map<number, Attendance>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const sessionData = await apiGet<Session>(`/api/sessions/${sessionId}`);
      setSession(sessionData);

      // Obtener porteros del equipo
      const goalkeeperData = await apiGet<Goalkeeper[] | { goalkeepers: Goalkeeper[] }>(`/api/goalkeepers?team_id=${sessionData.team_id}`);
      const goalkeepersList = Array.isArray(goalkeeperData) ? goalkeeperData : goalkeeperData.goalkeepers || [];
      setGoalkeepers(goalkeepersList);

      // Obtener asistencias existentes
      const attendanceData = await apiGet<any[]>(`/api/sessions/${sessionId}/attendance`);
      const attendanceMap = new Map<number, Attendance>();
      
      if (Array.isArray(attendanceData)) {
        attendanceData.forEach((att) => {
          attendanceMap.set(att.goalkeeper_id, {
            id: att.id,
            goalkeeper_id: att.goalkeeper_id,
            status: att.status,
            notes: att.notes || ''
          });
        });
      }

      // Inicializar asistencias para porteros sin registro
      goalkeepersList.forEach((gk: Goalkeeper) => {
        if (!attendanceMap.has(gk.id)) {
          attendanceMap.set(gk.id, {
            goalkeeper_id: gk.id,
            status: 'present',
            notes: ''
          });
        }
      });

      setAttendances(attendanceMap);
    } catch (error) {
      console.error(t('errorLoading'), error);
      router.push(`/${locale}/sessions/${sessionId}`);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (goalkeeperId: number, field: 'status' | 'notes', value: string) => {
    const newAttendances = new Map(attendances);
    const current = newAttendances.get(goalkeeperId);
    if (current) {
      newAttendances.set(goalkeeperId, {
        ...current,
        [field]: value
      });
      setAttendances(newAttendances);
    }
  };

  const markAllPresent = () => {
    const newAttendances = new Map(attendances);
    goalkeepers.forEach((gk) => {
      const current = newAttendances.get(gk.id);
      if (current) {
        newAttendances.set(gk.id, { ...current, status: 'present' });
      }
    });
    setAttendances(newAttendances);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const attendanceArray = Array.from(attendances.values());

      await apiPost(`/api/sessions/${sessionId}/attendance`, {
        attendances: attendanceArray
      });

      alert(t('attendanceRegistered'));
      router.push(`/${locale}/sessions/${sessionId}`);
    } catch (error) {
      console.error(t('errorRegistering'), error);
      alert(t('errorRegistering'));
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    'w-full bg-black/40 border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-lime-400/60 [&>option]:bg-black';
  const inputClass =
    'w-full bg-black/40 border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-lime-400/60 placeholder:text-white/30';

  if (loading || !session) {
    return (
      <div className="py-8">
        <p className="text-center text-white/50">Cargando...</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (    
    <div>
      <Button
        variant="outline"
        onClick={() => router.push(`/${locale}/sessions/${sessionId}`)}
        className="mb-4"
      >
        ← Volver
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('takeAttendance')}</h1>
        <p className="text-white/50 mt-2">
          {session.title} - {formatDate(session.session_date)}
        </p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{t('quickActions')}</h2>
          <Button onClick={markAllPresent} variant="outline">
            {t('markAllPresent')}
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {goalkeepers.map((goalkeeper) => {
          const attendance = attendances.get(goalkeeper.id);
          if (!attendance) return null;

          return (
            <Card key={goalkeeper.id} className={`border-l-4 ${statusColors[attendance.status]}`}>
              <div className="flex items-center gap-4">
                {/* Foto */}
                <div className="w-16 h-16 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
                  {goalkeeper.photo_url ? (
                    <img
                      src={goalkeeper.photo_url}
                      alt={`${goalkeeper.first_name} ${goalkeeper.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {goalkeeper.first_name} {goalkeeper.last_name}
                    {goalkeeper.jersey_number && (
                      <span className="ml-2 text-white/50">#{goalkeeper.jersey_number}</span>
                    )}
                  </h3>
                </div>

                {/* Estado */}
                <div className="w-40">
                  <select
                    value={attendance.status}
                    onChange={(e) => updateAttendance(goalkeeper.id, 'status', e.target.value)}
                    className={selectClass}
                  >
                    <option value="present">{t('present')}</option>
                    <option value="absent">{t('absent')}</option>
                    <option value="late">{t('late')}</option>
                    <option value="injured">{t('injured')}</option>
                    <option value="excused">{t('excused')}</option>
                  </select>
                </div>

                {/* Notas */}
                <div className="w-64">
                  <input
                    type="text"
                    value={attendance.notes}
                    onChange={(e) => updateAttendance(goalkeeper.id, 'notes', e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    className={inputClass}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1"
        >
          {saving ? 'Guardando...' : t('saveAttendance')}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/sessions/${sessionId}`)}
          disabled={saving}
        >
          Cancelar
        </Button>
      </div>
    </div>    
  );
}
