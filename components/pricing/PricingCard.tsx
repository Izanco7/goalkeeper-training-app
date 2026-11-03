'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

interface PricingCardProps {
  name: string;
  slug: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency?: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  billingCycle: 'monthly' | 'yearly';
  onSelect: (planSlug: string, billingCycle: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
  disabled?: boolean;
  buttonText?: string;
  locale?: string;
}

export function PricingCard({
  name,
  slug,
  description,
  priceMonthly,
  priceYearly,
  currency = 'USD',
  features,
  isPopular = false,
  isCurrentPlan = false,
  billingCycle,
  onSelect,
  isLoading = false,
  disabled = false,
  buttonText,
  locale = 'es',
}: PricingCardProps) {
  const price = billingCycle === 'monthly' ? priceMonthly : priceYearly;
  const monthlyEquivalent = billingCycle === 'yearly' ? priceYearly / 12 : priceMonthly;
  const savings = billingCycle === 'yearly' ? Math.round((1 - priceYearly / (priceMonthly * 12)) * 100) : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const isFree = slug === 'free';

  const texts = {
    es: {
      perMonth: '/mes',
      perYear: '/año',
      billedYearly: 'facturado anualmente',
      save: 'Ahorra',
      popular: 'Más popular',
      currentPlan: 'Tu plan actual',
      getStarted: 'Comenzar gratis',
      subscribe: 'Suscribirse',
      manage: 'Gestionar plan',
    },
    en: {
      perMonth: '/month',
      perYear: '/year',
      billedYearly: 'billed yearly',
      save: 'Save',
      popular: 'Most popular',
      currentPlan: 'Your current plan',
      getStarted: 'Get started free',
      subscribe: 'Subscribe',
      manage: 'Manage plan',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  const getButtonText = () => {
    if (buttonText) return buttonText;
    if (isCurrentPlan) return t.manage;
    if (isFree) return t.getStarted;
    return t.subscribe;
  };

  const getButtonClasses = () => {
    const base = 'mt-8 w-full rounded-full py-3 px-4 text-center text-sm font-extrabold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';
    if (isPopular || isCurrentPlan) {
      return `${base} bg-lime-400 text-black hover:bg-lime-300`;
    }
    if (isFree) {
      return `${base} border border-white/15 text-white/70 hover:border-lime-400/50 hover:text-lime-300`;
    }
    return `${base} border border-lime-400/50 text-lime-300 hover:bg-lime-400/10`;
  };

  return (
    <div
      className={`relative rounded-2xl border p-8 transition-all duration-200 ${
        isPopular
          ? 'border-lime-400/50 bg-lime-400/[0.04] md:scale-105'
          : 'border-white/10 bg-white/[0.03]'
      } hover:border-white/20`}
    >
      {/* Badge Popular */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-4 py-1 text-sm font-extrabold text-black">
            <StarIcon className="h-4 w-4" />
            {t.popular}
          </span>
        </div>
      )}

      {/* Badge Plan Actual */}
      {isCurrentPlan && !isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-400/15 border border-lime-400/30 px-4 py-1 text-sm font-bold text-lime-300">
            <CheckIcon className="h-4 w-4" />
            {t.currentPlan}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-black tracking-tight text-white">
          {name}
        </h3>
        <p className="mt-2 text-sm text-white/50">
          {description}
        </p>
      </div>

      {/* Precio */}
      <div className="mt-6 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-black tracking-tight text-white">
            {isFree ? formatPrice(0) : formatPrice(monthlyEquivalent)}
          </span>
          {!isFree && (
            <span className="text-lg text-white/50">
              {t.perMonth}
            </span>
          )}
        </div>

        {!isFree && billingCycle === 'yearly' && (
          <div className="mt-2 space-y-1">
            <p className="text-sm text-white/50">
              {formatPrice(price)} {t.billedYearly}
            </p>
            {savings > 0 && (
              <span className="inline-flex rounded-full bg-lime-400/15 border border-lime-400/30 px-3 py-1 text-xs font-bold text-lime-300">
                {t.save} {savings}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="mt-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckIcon
              className="h-5 w-5 shrink-0 text-lime-400"
            />
            <span className="text-sm text-white/70">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Botón */}
      <button
        onClick={() => onSelect(slug, billingCycle)}
        disabled={disabled || isLoading}
        className={getButtonClasses()}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando...
          </span>
        ) : (
          getButtonText()
        )}
      </button>
    </div>
  );
}
