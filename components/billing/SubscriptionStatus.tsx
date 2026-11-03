'use client';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

interface SubscriptionStatusProps {
  status: string;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  currentPeriodEnd?: Date | string;
  cancelAtPeriodEnd?: boolean;
  locale?: string;
}

export function SubscriptionStatus({
  status,
  planName,
  billingCycle,
  currentPeriodEnd,
  cancelAtPeriodEnd = false,
  locale = 'es',
}: SubscriptionStatusProps) {
  const texts = {
    es: {
      active: 'Activa',
      trialing: 'Período de prueba',
      past_due: 'Pago pendiente',
      cancelled: 'Cancelada',
      inactive: 'Inactiva',
      monthly: 'Mensual',
      yearly: 'Anual',
      renewsOn: 'Se renueva el',
      endsOn: 'Finaliza el',
      trialEndsOn: 'Prueba termina el',
      willCancel: 'Se cancelará al finalizar el período',
      updatePayment: 'Actualizar método de pago',
      reactivate: 'Reactivar suscripción',
    },
    en: {
      active: 'Active',
      trialing: 'Trial period',
      past_due: 'Payment due',
      cancelled: 'Cancelled',
      inactive: 'Inactive',
      monthly: 'Monthly',
      yearly: 'Yearly',
      renewsOn: 'Renews on',
      endsOn: 'Ends on',
      trialEndsOn: 'Trial ends on',
      willCancel: 'Will cancel at end of period',
      updatePayment: 'Update payment method',
      reactivate: 'Reactivate subscription',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircleIcon,
          iconColor: 'text-lime-400',
          badge: 'bg-lime-400/15 text-lime-300 border-lime-400/30',
          label: t.active,
        };
      case 'trialing':
        return {
          icon: ClockIcon,
          iconColor: 'text-sky-400',
          badge: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
          label: t.trialing,
        };
      case 'past_due':
        return {
          icon: ExclamationCircleIcon,
          iconColor: 'text-amber-400',
          badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
          label: t.past_due,
        };
      case 'cancelled':
        return {
          icon: XCircleIcon,
          iconColor: 'text-red-400',
          badge: 'bg-red-500/15 text-red-300 border-red-500/30',
          label: t.cancelled,
        };
      default:
        return {
          icon: XCircleIcon,
          iconColor: 'text-white/40',
          badge: 'bg-white/10 text-white/50 border-white/10',
          label: t.inactive,
        };
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-4">
        <Icon className={`h-10 w-10 ${config.iconColor} shrink-0`} />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black tracking-tight text-white">{planName}</h3>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${config.badge}`}>
              {config.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-white/50">
            {t[billingCycle as keyof typeof t]}
          </p>

          {currentPeriodEnd && (
            <p className="mt-3 text-sm text-white/70">
              {cancelAtPeriodEnd ? (
                <span className="text-amber-300 font-bold inline-flex items-center gap-1.5">
                  <ExclamationTriangleIcon className="h-4 w-4 text-amber-400 shrink-0" />
                  {t.willCancel}: {formatDate(currentPeriodEnd)}
                </span>
              ) : status === 'trialing' ? (
                <>
                  {t.trialEndsOn}: <span className="font-bold text-white">{formatDate(currentPeriodEnd)}</span>
                </>
              ) : (
                <>
                  {t.renewsOn}: <span className="font-bold text-white">{formatDate(currentPeriodEnd)}</span>
                </>
              )}
            </p>
          )}

          {status === 'past_due' && (
            <div className="mt-4">
              <button className="text-sm font-bold text-lime-300 hover:text-lime-200 underline">
                {t.updatePayment}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
