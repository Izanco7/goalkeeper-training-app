'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { apiGet, apiDelete } from '@/lib/utils/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  duration: number | null;
  difficulty: string | null;
  design_id?: number | null;
  is_public: boolean;
  user_id: number;
}

const chipBase =
  'rounded-full border px-4 py-1.5 text-sm font-bold transition-all';
const chipActive = 'bg-lime-400/15 text-lime-300 border-lime-400/40';
const chipInactive = 'border-white/10 text-white/50 hover:text-white hover:border-white/25';

export default function TasksPage() {
  const t = useTranslations('tasks');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showMyTasks, setShowMyTasks] = useState(false);

  const categories = [
    'technical',
    'tactical',
    'physical',
    'psychological',
    'goalkeeper_specific'
  ];

  useEffect(() => {
    loadTasks();
  }, [selectedCategory, showMyTasks]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      if (showMyTasks) params.append('my_tasks', 'true');

      const data = await apiGet<Task[]>(`/api/tasks?${params.toString()}`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(t('errorLoading'), error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTasks();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await apiDelete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(t('errorDeleting'), error);
      alert(t('errorDeleting'));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{t('title')}</h1>
        <p className="text-white/50 mt-2">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-5">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11"
            />
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`${chipBase} ${selectedCategory === '' ? chipActive : chipInactive}`}
          >
            {t('allTasks')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${chipBase} ${selectedCategory === cat ? chipActive : chipInactive}`}
            >
              {t(cat as any)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* My Tasks Toggle */}
          <button
            type="button"
            onClick={() => setShowMyTasks(!showMyTasks)}
            className={`${chipBase} ${showMyTasks ? chipActive : chipInactive}`}
          >
            {t('myTasks')}
          </button>

          <Button onClick={() => router.push(`/${locale}/tasks/new`)}>
            <span className="flex items-center">
              <PlusIcon className="w-5 h-5 mr-1.5" />
              {t('createTask')}
            </span>
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-white/50">Cargando...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
          <p className="text-white/70 font-bold mb-2">{t('noTasks')}</p>
          <p className="text-sm text-white/40 mb-6">
            {t('noTasksDescription')}
          </p>
          <Button onClick={() => router.push(`/${locale}/tasks/new`)}>
            <span className="flex items-center">
              <PlusIcon className="w-5 h-5 mr-1.5" />
              {t('createTask')}
            </span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
