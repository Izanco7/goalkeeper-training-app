'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Feature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  elite: boolean | string;
}

interface PlanFeaturesProps {
  locale?: string;
}

export function PlanFeatures({ locale = 'es' }: PlanFeaturesProps) {
  const texts = {
    es: {
      title: 'Comparar características',
      subtitle: 'Encuentra el plan perfecto para tu equipo',
      free: 'Free',
      pro: 'Pro',
      elite: 'Elite',
      features: [
        { name: 'Equipos', free: '1', pro: '10', elite: 'Ilimitados' },
        { name: 'Porteros', free: '3', pro: '50', elite: 'Ilimitados' },
        { name: 'Tareas personalizadas', free: '5', pro: 'Ilimitadas', elite: 'Ilimitadas' },
        { name: 'Sesiones de entrenamiento', free: '10/mes', pro: 'Ilimitadas', elite: 'Ilimitadas' },
        { name: 'Editor táctico', free: false, pro: true, elite: true },
        { name: 'Estadísticas avanzadas', free: false, pro: true, elite: true },
        { name: 'Análisis de partidos', free: false, pro: true, elite: true },
        { name: 'Seguimiento de penaltis', free: false, pro: true, elite: true },
        { name: 'Exportar a PDF', free: false, pro: true, elite: true },
        { name: 'Soporte prioritario', free: false, pro: false, elite: true },
        { name: 'Acceso API', free: false, pro: false, elite: true },
        { name: 'Onboarding personalizado', free: false, pro: false, elite: true },
      ] as Feature[],
    },
    en: {
      title: 'Compare features',
      subtitle: 'Find the perfect plan for your team',
      free: 'Free',
      pro: 'Pro',
      elite: 'Elite',
      features: [
        { name: 'Teams', free: '1', pro: '10', elite: 'Unlimited' },
        { name: 'Goalkeepers', free: '3', pro: '50', elite: 'Unlimited' },
        { name: 'Custom tasks', free: '5', pro: 'Unlimited', elite: 'Unlimited' },
        { name: 'Training sessions', free: '10/month', pro: 'Unlimited', elite: 'Unlimited' },
        { name: 'Tactical editor', free: false, pro: true, elite: true },
        { name: 'Advanced statistics', free: false, pro: true, elite: true },
        { name: 'Match analysis', free: false, pro: true, elite: true },
        { name: 'Penalty tracking', free: false, pro: true, elite: true },
        { name: 'Export to PDF', free: false, pro: true, elite: true },
        { name: 'Priority support', free: false, pro: false, elite: true },
        { name: 'API access', free: false, pro: false, elite: true },
        { name: 'Personalized onboarding', free: false, pro: false, elite: true },
      ] as Feature[],
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className="mx-auto h-5 w-5 text-lime-400" />
      ) : (
        <XMarkIcon className="mx-auto h-5 w-5 text-white/20" />
      );
    }
    return <span className="text-white font-bold">{value}</span>;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black tracking-tight text-white">{t.title}</h2>
        <p className="mt-2 text-white/50">{t.subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {/* Header */}
        <div className="grid grid-cols-4 border-b border-white/10">
          <div className="p-4"></div>
          <div className="p-4 text-center font-bold text-white/60">{t.free}</div>
          <div className="p-4 text-center font-black text-lime-300 bg-lime-400/[0.06]">{t.pro}</div>
          <div className="p-4 text-center font-bold text-white/60">{t.elite}</div>
        </div>

        {/* Features */}
        {t.features.map((feature, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 border-b border-white/5 last:border-b-0 ${
              index % 2 === 0 ? '' : 'bg-white/[0.02]'
            }`}
          >
            <div className="p-4 text-sm text-white/80">{feature.name}</div>
            <div className="p-4 text-center text-sm">{renderValue(feature.free)}</div>
            <div className="p-4 text-center text-sm bg-lime-400/[0.06]">{renderValue(feature.pro)}</div>
            <div className="p-4 text-center text-sm">{renderValue(feature.elite)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
