'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeftIcon,
  PrinterIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { apiGet, apiDelete } from '@/lib/utils/api';

const DesignPreview = dynamic(() => import('@/components/editor/DesignPreview'), { ssr: false });
const DiagramModal = dynamic(() => import('@/components/editor/DiagramModal').then(m => ({ default: m.DiagramModal })), { ssr: false });

interface Task {
  id: number;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  duration: number | null;
  difficulty: string | null;
  objectives: string | null;
  materials: string | null;
  instructions: string | null;
  video_url: string | null;
  image_url: string | null;
  design_id: number | null;
  is_public: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
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

const getCategoryLabel = (category: string, t: any): string => {
  const labels: Record<string, string> = {
    technical: t('technical'),
    tactical: t('tactical'),
    physical: t('physical'),
    psychological: t('psychological'),
    goalkeeper_specific: t('goalkeeper_specific')
  };
  return labels[category] || category;
};

const getDifficultyLabel = (difficulty: string, t: any): string => {
  const labels: Record<string, string> = {
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced')
  };
  return labels[difficulty] || difficulty;
};

export default function TaskDetailPage() {
  const t = useTranslations('tasks');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDiagramModal, setShowDiagramModal] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const handlePrint = () => {
    window.print();
  };

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await apiGet<{ task: Task }>(`/api/tasks/${taskId}`);
      setTask(data.task);
    } catch (error) {
      console.error(t('errorLoading'), error);
      alert(t('errorLoading'));
      router.push(`/${locale}/tasks`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await apiDelete(`/api/tasks/${taskId}`);
      router.push(`/${locale}/tasks`);
    } catch (error) {
      console.error(t('errorDeleting'), error);
      alert(t('errorDeleting'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-white/50">Cargando...</p>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/tasks`)}
          className="mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 inline-block" />
          Volver
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{task.title}</h1>
            {task.subcategory && (
              <p className="text-white/50 mt-1">{task.subcategory}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="print:hidden"
            >
              <PrinterIcon className="w-4 h-4 mr-1.5 inline-block" />
              {t('print')}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/tasks/${taskId}/edit`)}
              className="print:hidden"
            >
              {t('editTask')}
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-500/40 text-red-300 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-200 print:hidden"
            >
              {t('deleteTask')}
            </Button>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={`text-sm px-3 py-1.5 rounded-full font-bold border ${getCategoryColor(
            task.category
          )}`}
        >
          {getCategoryLabel(task.category, t)}
        </span>
        {task.difficulty && (
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full">
            <div
              className={`w-2.5 h-2.5 rounded-full ${getDifficultyColor(
                task.difficulty
              )}`}
            />
            <span className="text-sm text-white/70">
              {getDifficultyLabel(task.difficulty, t)}
            </span>
          </div>
        )}
        {task.duration && (
          <span className="text-sm bg-white/[0.04] border border-white/10 text-white/70 px-3 py-1.5 rounded-full">
            {task.duration} {t('minutes')}
          </span>
        )}
        {task.is_public && (
          <span className="text-sm bg-blue-400/15 text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-full font-bold">
            {t('publicTasks')}
          </span>
        )}
      </div>

      {/* Image */}
      {task.image_url && (
        <Card className="mb-6 p-0 overflow-hidden">
          <img
            src={task.image_url}
            alt={task.title}
            className="w-full"
          />
        </Card>
      )}

      {/* Tactical Diagram */}
      {task.design_id && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight">{t('diagramSection')}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiagramModal(true)}
                className="print:hidden"
              >
                <ArrowsPointingOutIcon className="w-4 h-4 mr-1.5 inline-block" />
                {t('viewFullscreen')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const returnUrl = encodeURIComponent(window.location.href);
                  router.push(`/${locale}/editor?design_id=${task.design_id}&returnTo=${returnUrl}`);
                }}
                className="print:hidden"
              >
                {t('editDiagram')}
              </Button>
            </div>
          </div>

          <DesignPreview designId={task.design_id} className="w-full h-full rounded-xl border border-white/10" />

        </Card>
      )}

      {/* Description */}
      {task.description && (
        <Card className="mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">
            {t('description')}
          </h2>
          <p className="text-white/70 whitespace-pre-wrap">
            {task.description}
          </p>
        </Card>
      )}

      {/* Objectives */}
      {task.objectives && (
        <Card className="mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">{t('objectives')}</h2>
          <p className="text-white/70 whitespace-pre-wrap">
            {task.objectives}
          </p>
        </Card>
      )}

      {/* Materials */}
      {task.materials && (
        <Card className="mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">{t('materials')}</h2>
          <p className="text-white/70 whitespace-pre-wrap">
            {task.materials}
          </p>
        </Card>
      )}

      {/* Instructions */}
      {task.instructions && (
        <Card className="mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">
            {t('instructions')}
          </h2>
          <p className="text-white/70 whitespace-pre-wrap">
            {task.instructions}
          </p>
        </Card>
      )}

      {/* Video */}
      {task.video_url && (
        <Card className="mb-6">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">{t('videoUrl')}</h2>
          <div className="aspect-video">
            <iframe
              src={task.video_url.replace('watch?v=', 'embed/')}
              className="w-full h-full rounded-xl"
              allowFullScreen
            />
          </div>
        </Card>
      )}

      {/* Diagram Modal */}
      {showDiagramModal && task.design_id && (
        <DiagramModal
          designId={task.design_id}
          title={`${t('diagramSection')} - ${task.title}`}
          onClose={() => setShowDiagramModal(false)}
        />
      )}
    </div>
  );
}
