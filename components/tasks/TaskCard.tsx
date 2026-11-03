'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    duration: number | null;
    difficulty: string | null;
    design_id?: number | null;
    is_public: boolean;
  };
  onDelete?: (id: number) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    technical: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
    tactical: 'bg-violet-400/15 text-violet-300 border-violet-400/30',
    physical: 'bg-lime-400/15 text-lime-300 border-lime-400/30',
    psychological: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
    goalkeeper_specific: 'bg-red-400/15 text-red-300 border-red-400/30'
  };
  return colors[category] || 'bg-white/10 text-white/60 border-white/10';
};

const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    beginner: 'bg-lime-400',
    intermediate: 'bg-amber-400',
    advanced: 'bg-red-400'
  };
  return colors[difficulty] || 'bg-white/30';
};

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const t = useTranslations('tasks');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const handleView = () => {
    router.push(`/${locale}/tasks/${task.id}`);
  };

  const handleEdit = () => {
    router.push(`/${locale}/tasks/${task.id}/edit`);
  };

  return (
    <Card className="hover:border-lime-400/40 transition-all">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-white tracking-tight mb-1">
              {task.title}
            </h3>
            {task.subcategory && (
              <p className="text-sm text-white/50">{task.subcategory}</p>
            )}
          </div>
          {task.is_public && (
            <span className="text-xs font-bold bg-blue-400/15 text-blue-300 border border-blue-400/30 px-2 py-1 rounded-full whitespace-nowrap">
              {t('publicTasks')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getCategoryColor(
              task.category
            )}`}
          >
            {t(task.category as any)}
          </span>
          {task.difficulty && (
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${getDifficultyColor(
                  task.difficulty
                )}`}
              />
              <span className="text-xs text-white/60">
                {t(task.difficulty as any)}
              </span>
            </div>
          )}
          {task.duration && (
            <span className="text-xs text-white/50">
              {task.duration} {t('minutes')}
            </span>
          )}
          {task.design_id && (
            <div className="flex items-center gap-1 bg-violet-400/10 text-violet-300 border border-violet-400/30 px-2 py-1 rounded-full" title={t('hasDiagram')}>
              <MapIcon className="w-3 h-3" />
              <span className="text-xs font-bold">{t('diagram')}</span>
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-white/60 mb-4 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="mt-auto flex gap-2">
          <Button variant="outline" onClick={handleView} className="flex-1">
            {t('taskDetails')}
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            {t('editTask')}
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="border-red-500/40 text-red-300 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-200"
            >
              {t('deleteTask')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
