'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface SessionTaskItemProps {
  task: {
    id: number;
    task_id: number;
    order_number: number;
    duration: number | null;
    intensity: string | null;
    notes: string | null;
    task_title?: string;
    task_category?: string;
    task_difficulty?: string;
    design_id?: number | null;
    design_img?: string | null;
  };
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const getIntensityColor = (intensity: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-lime-400',
    medium: 'bg-yellow-400',
    high: 'bg-orange-400',
    very_high: 'bg-red-500'
  };
  return colors[intensity] || 'bg-white/40';
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    technical: 'bg-sky-400/15 text-sky-300 border border-sky-400/30',
    tactical: 'bg-purple-400/15 text-purple-300 border border-purple-400/30',
    physical: 'bg-lime-400/15 text-lime-300 border border-lime-400/30',
    psychological: 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/30',
    goalkeeper_specific: 'bg-red-500/15 text-red-300 border border-red-500/30'
  };
  return colors[category] || 'bg-white/10 text-white/60 border border-white/15';
};

export function SessionTaskItem({ task, onEdit, onDelete }: SessionTaskItemProps) {
  const t = useTranslations('sessions');
  const tTasks = useTranslations('tasks');

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-black text-white/40">
              #{task.order_number}
            </span>
            <h4 className="text-md font-bold text-white">
              {task.task_title || 'Tarea sin título'}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {task.task_category && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(
                  task.task_category
                )}`}
              >
                {tTasks(task.task_category as any)}
              </span>
            )}
            {task.intensity && (
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${getIntensityColor(
                    task.intensity
                  )}`}
                />
                <span className="text-xs text-white/60">
                  {t(task.intensity as any)}
                </span>
              </div>
            )}
            {task.duration && (
              <span className="text-xs text-white/60">
                {task.duration} {tTasks('minutes')}
              </span>
            )}
            {task.task_difficulty && (
              <span className="text-xs text-white/60">
                {tTasks(task.task_difficulty as any)}
              </span>
            )}
            {task.design_id && task.design_img && (
              <div className="flex items-center gap-1 bg-purple-400/15 text-purple-300 border border-purple-400/30 px-2 py-1 rounded-full">
                <PhotoIcon className="w-3 h-3" />
                <span className="text-xs font-medium">Diagrama</span>
              </div>
            )}
          </div>

          {task.notes && (
            <p className="text-sm text-white/60 mt-2">{task.notes}</p>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(task.id)}
              className="text-sm py-1 px-2"
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="text-sm py-1 px-2 border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
