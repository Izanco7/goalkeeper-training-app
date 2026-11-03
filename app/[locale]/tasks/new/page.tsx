'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { apiPost } from '@/lib/utils/api';

const STORAGE_KEY = 'task-form-draft';

type TaskFormData = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  duration: string;
  difficulty: string;
  objectives: string;
  materials: string;
  instructions: string;
  video_url: string;
  image_url: string;
  design_id: number | null;
  is_public: boolean;
};

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  category: '',
  subcategory: '',
  duration: '',
  difficulty: '',
  objectives: '',
  materials: '',
  instructions: '',
  video_url: '',
  image_url: '',
  design_id: null,
  is_public: false
};

const selectClass =
  'w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20';
const textareaClass =
  'w-full bg-black/40 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/20';
const labelClass = 'block text-sm font-bold text-white/70 mb-1.5';
const sectionTitleClass = 'text-xl font-extrabold text-white tracking-tight mb-4';
const optionClass = 'bg-[#0a0f0d]';

export default function NewTaskPage() {
  const t = useTranslations('tasks');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(() => {
    // Intentar cargar datos guardados de sessionStorage
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<TaskFormData>;
          if (parsed && typeof parsed === 'object') {
            return { ...defaultFormData, ...parsed };
          }
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
    return defaultFormData;
  });

  // Guardar formData en sessionStorage cada vez que cambie
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Capturar design_id cuando se regresa del editor
  useEffect(() => {
    const designId = searchParams.get('design_id');
    if (designId) {
      setFormData(prev => ({ ...prev, design_id: parseInt(designId) }));
    }
  }, [searchParams]);

  const categories = [
    'technical',
    'tactical',
    'physical',
    'psychological',
    'goalkeeper_specific'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        design_id: formData.design_id
      };

      await apiPost('/api/tasks', payload);
      // Limpiar el draft guardado después de crear exitosamente
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/${locale}/tasks`);
    } catch (error: any) {
      console.error(t('errorCreating'), error);
      alert(error.message || t('errorCreating'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          {t('createTask')}
        </h1>
        <p className="text-white/50 mt-2">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card className="mb-6">
          <h2 className={sectionTitleClass}>{t('basicInfo')}</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                {t('taskTitle')} *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('titlePlaceholder')}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('descriptionPlaceholder')}
                rows={4}
                className={textareaClass}
              />
            </div>
          </div>
        </Card>

        {/* Task Setup */}
        <Card className="mb-6">
          <h2 className={sectionTitleClass}>{t('taskSetup')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('category')} *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={selectClass}
              >
                <option value="" className={optionClass}>{t('selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className={optionClass}>
                    {t(cat as any)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                {t('subcategory')}
              </label>
              <Input
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder={t('subcategoryPlaceholder')}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('duration')}
              </label>
              <Input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder={t('durationPlaceholder')}
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('difficulty')}
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={selectClass}
              >
                <option value="" className={optionClass}>{t('selectDifficulty')}</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className={optionClass}>
                    {t(diff as any)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className={labelClass}>
                {t('objectives')}
              </label>
              <textarea
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                placeholder={t('objectivesPlaceholder')}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('materials')}
              </label>
              <textarea
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder={t('materialsPlaceholder')}
                rows={3}
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('instructions')}
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder={t('instructionsPlaceholder')}
                rows={4}
                className={textareaClass}
              />
            </div>
          </div>
        </Card>

        {/* Additional Resources */}
        <Card className="mb-6">
          <h2 className={sectionTitleClass}>
            {t('additionalResources')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                {t('videoUrl')}
              </label>
              <Input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder={t('videoUrlPlaceholder')}
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('imageUrl')}
              </label>
              <Input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder={t('imageUrlPlaceholder')}
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <label className="block text-sm font-bold text-white/70 mb-2">
                {t('diagramSection')}
              </label>
              <p className="text-sm text-white/50 mb-3">
                {t('drawExerciseDescription')}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const returnUrl = encodeURIComponent(window.location.href);
                  // Solo pasar design_id si ya existe (para editarlo)
                  const editorUrl = formData.design_id 
                    ? `/${locale}/editor?design_id=${formData.design_id}&returnTo=${returnUrl}&mode=task`
                    : `/${locale}/editor?returnTo=${returnUrl}&mode=task`;
                  router.push(editorUrl);
                }}
              >
                {formData.design_id ? t('editDiagram') : t('drawExercise')}
              </Button>
              {formData.design_id && (
                <p className="text-sm text-lime-300 font-bold mt-2 flex items-center gap-1.5">
                  <CheckCircleIcon className="w-5 h-5" />
                  {t('diagramLinked')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-lime-400"
              />
              <label className="text-sm text-white/70">
                {t('makePublic')}
              </label>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : t('createTask')}
          </Button>
        </div>
      </form>
    </div>
  );
}
