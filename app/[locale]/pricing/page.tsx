'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PlanFeatures } from '@/components/pricing/PlanFeatures';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  isPopular: boolean;
}

export default function PricingPage() {
  const locale = useLocale();
  const { user, token } = useAuth();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [currentPlanSlug, setCurrentPlanSlug] = useState<string>('free');
  const [error, setError] = useState<string | null>(null);

  // Cargar planes
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/stripe/plans');
        const data = await response.json();

        if (data.plans) {
          setPlans(data.plans);
        }
      } catch (err) {
        console.error('Error cargando planes:', err);
        setError('Error al cargar los planes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Cargar suscripción actual si el usuario está autenticado
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      if (!user || !token) return;

      try {
        const response = await fetch('/api/stripe/subscription', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.plan?.slug) {
          setCurrentPlanSlug(data.plan.slug);
        }
      } catch (err) {
        console.error('Error cargando suscripción:', err);
      }
    };

    fetchCurrentSubscription();
  }, [user, token]);

  const handleSelectPlan = async (planSlug: string, cycle: 'monthly' | 'yearly') => {
    // Si es el plan gratuito, redirigir al registro o dashboard
    if (planSlug === 'free') {
      if (user) {
        window.location.href = `/${locale}/dashboard`;
      } else {
        window.location.href = `/${locale}/register`;
      }
      return;
    }

    // Si no está autenticado, redirigir al login
    if (!user || !token) {
      sessionStorage.setItem('redirectAfterLogin', `/${locale}/pricing?plan=${planSlug}&cycle=${cycle}`);
      window.location.href = `/${locale}/login`;
      return;
    }

    // Si ya tiene este plan, ir a billing
    if (planSlug === currentPlanSlug) {
      window.location.href = `/${locale}/billing`;
      return;
    }

    setProcessingPlan(planSlug);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-locale': locale,
        },
        body: JSON.stringify({
          planSlug,
          billingCycle: cycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear sesión de pago');
      }

      // Redirigir a Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProcessingPlan(null);
    }
  };

  const texts = {
    es: {
      title: 'Elige tu plan',
      subtitle: 'Escoge el plan que mejor se adapte a tus necesidades de entrenamiento',
      monthly: 'Mensual',
      yearly: 'Anual',
      savePercent: 'Ahorra hasta 17%',
      loading: 'Cargando planes...',
      errorLoading: 'Error al cargar los planes',
      tryAgain: 'Intentar de nuevo',
      faq: {
        title: 'Preguntas frecuentes',
        questions: [
          {
            q: '¿Puedo cambiar de plan en cualquier momento?',
            a: 'Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se aplicarán inmediatamente y se prorratearán.',
          },
          {
            q: '¿Qué métodos de pago aceptan?',
            a: 'Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express).',
          },
          {
            q: '¿Hay período de prueba?',
            a: 'Sí, el plan Pro incluye 7 días de prueba gratuita. No se te cobrará hasta que termine el período de prueba.',
          },
          {
            q: '¿Puedo cancelar mi suscripción?',
            a: 'Puedes cancelar tu suscripción en cualquier momento. Seguirás teniendo acceso hasta el final del período de facturación.',
          },
        ],
      },
    },
    en: {
      title: 'Choose your plan',
      subtitle: 'Pick the plan that best fits your training needs',
      monthly: 'Monthly',
      yearly: 'Yearly',
      savePercent: 'Save up to 17%',
      loading: 'Loading plans...',
      errorLoading: 'Error loading plans',
      tryAgain: 'Try again',
      faq: {
        title: 'Frequently asked questions',
        questions: [
          {
            q: 'Can I change plans at any time?',
            a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be applied immediately and prorated.',
          },
          {
            q: 'What payment methods do you accept?',
            a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express).',
          },
          {
            q: 'Is there a free trial?',
            a: 'Yes, the Pro plan includes a 7-day free trial. You won\'t be charged until the trial period ends.',
          },
          {
            q: 'Can I cancel my subscription?',
            a: 'You can cancel your subscription at any time. You\'ll continue to have access until the end of the billing period.',
          },
        ],
      },
    },
  };

  const pageTexts = texts[locale as keyof typeof texts] || texts.es;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
          <p className="mt-4 text-white/50">{pageTexts.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {pageTexts.title}
          </h1>
          <p className="mt-4 text-xl text-white/50 max-w-2xl mx-auto">
            {pageTexts.subtitle}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-wrap items-center justify-center mb-12">
          <div className="relative flex items-center gap-1 p-1 bg-white/[0.06] border border-white/10 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-lime-400 text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {pageTexts.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-lime-400 text-black'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {pageTexts.yearly}
            </button>
          </div>
          {billingCycle === 'yearly' && (
            <span className="ml-3 mt-2 sm:mt-0 inline-flex items-center rounded-full bg-lime-400/15 border border-lime-400/30 px-3 py-1 text-xs font-bold text-lime-300">
              {pageTexts.savePercent}
            </span>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              slug={plan.slug}
              description={plan.description}
              priceMonthly={plan.priceMonthly}
              priceYearly={plan.priceYearly}
              currency={plan.currency}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={plan.slug === currentPlanSlug}
              billingCycle={billingCycle}
              onSelect={handleSelectPlan}
              isLoading={processingPlan === plan.slug}
              disabled={processingPlan !== null && processingPlan !== plan.slug}
              locale={locale}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <PlanFeatures locale={locale} />
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight text-white text-center mb-8">
            {pageTexts.faq.title}
          </h2>
          <div className="space-y-4">
            {pageTexts.faq.questions.map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                <p className="text-white/50">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
