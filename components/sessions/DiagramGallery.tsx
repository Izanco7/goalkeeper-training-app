'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

import { Modal } from '@/components/ui/Modal';

interface DiagramGalleryProps {
  tasks: Array<{
    id: number;
    order_number: number;
    task_title?: string;
    design_id?: number | null;
    design_img?: string | null;
  }>;
}

export function DiagramGallery({ tasks }: DiagramGalleryProps) {
  const t = useTranslations('sessions');
  const [selectedDiagram, setSelectedDiagram] = useState<{
    img: string;
    title: string;
  } | null>(null);

  // Filtrar solo las tareas que tienen diagrama
  const tasksWithDiagrams = tasks.filter(
    (task) => task.design_id && task.design_img
  );

  if (tasksWithDiagrams.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="print:break-inside-avoid mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{t('tacticalDiagrams')}</h2>
          <span className="text-sm text-white/50">
            {tasksWithDiagrams.length} {tasksWithDiagrams.length === 1 ? 'diagrama' : 'diagramas'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tasksWithDiagrams.map((task) => (
            <div
              key={task.id}
              className="relative group cursor-pointer border border-white/10 rounded-xl overflow-hidden hover:border-lime-400/40 transition-all print:break-inside-avoid"
              onClick={() =>
                setSelectedDiagram({
                  img: task.design_img!,
                  title: `#${task.order_number} - ${task.task_title || 'Sin título'}`,
                })
              }
            >
              <div className="relative aspect-video bg-black/40">
                <Image
                  src={`/api/designs/${task.design_img}`}
                  alt={task.task_title || 'Diagrama táctico'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="p-2 bg-white/[0.03]">
                <p className="text-xs font-medium text-white/80 truncate">
                  #{task.order_number} {task.task_title}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-opacity flex items-center justify-center print:hidden">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MagnifyingGlassPlusIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Versión para impresión: muestra los diagramas en tamaño completo */}
        <div className="hidden print:block mt-8 space-y-8">
          {tasksWithDiagrams.map((task) => (
            <div key={`print-${task.id}`} className="break-inside-avoid">
              <h3 className="text-lg font-semibold mb-3 print:text-black">
                #{task.order_number} - {task.task_title || 'Sin título'}
              </h3>
              <div className="relative w-full" style={{ height: '500px' }}>
                <img
                  src={`/api/designs/${task.design_img}`}
                  alt={task.task_title || 'Diagrama táctico'}                  
                  className="object-contain border rounded"                  
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal para ver diagrama en pantalla completa */}
      {selectedDiagram && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDiagram(null)}
          title={selectedDiagram.title}
          size="full"
        >
          <div className="w-full h-full p-4 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={`/api/designs/${selectedDiagram.img}`}
                alt={selectedDiagram.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
