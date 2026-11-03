import { useTranslations, useLocale } from 'next-intl';
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  PencilSquareIcon,
  TrophyIcon,
  DocumentChartBarIcon,
  CloudIcon,
  BoltIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LandingPage() {
  const t = useTranslations('landing');
  const locale = useLocale();

  const features = [
    { icon: PencilSquareIcon, titleKey: 'tacticalEditor', descriptionKey: 'tacticalEditor' },
    { icon: ClipboardDocumentListIcon, titleKey: 'sessionPlanning', descriptionKey: 'sessionPlanning' },
    { icon: TrophyIcon, titleKey: 'penaltyTracking', descriptionKey: 'penaltyTracking' },
    { icon: DocumentChartBarIcon, titleKey: 'matchAnalysis', descriptionKey: 'matchAnalysis' },
    { icon: ChartBarIcon, titleKey: 'statistics', descriptionKey: 'statistics' },
    { icon: UserGroupIcon, titleKey: 'teamManagement', descriptionKey: 'teamManagement' },
  ];

  const benefits = [
    { icon: AcademicCapIcon, titleKey: 'professional', descriptionKey: 'professional' },
    { icon: BoltIcon, titleKey: 'efficient', descriptionKey: 'efficient' },
    { icon: ChartBarIcon, titleKey: 'datadriven', descriptionKey: 'datadriven' },
    { icon: CloudIcon, titleKey: 'cloud', descriptionKey: 'cloud' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white antialiased selection:bg-lime-400 selection:text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(163,230,53,0.35)]">
              <span className="text-black font-black text-lg tracking-tight">GK</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight">Goalkeeper Training</span>
          </div>
          <Link
            href={`/${locale}/login`}
            className="px-5 py-2 text-sm font-bold text-black bg-lime-400 rounded-full hover:bg-lime-300 transition-colors"
          >
            {t('hero.login')}
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        {/* glows */}
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full bg-lime-400/15 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute top-40 -right-32 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-lime-400 border border-lime-400/30 bg-lime-400/10 rounded-full px-4 py-1.5 mb-6">
              <BoltIcon className="w-4 h-4" />
              Goalkeeper Training
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/login`}
                className="px-8 py-4 bg-lime-400 text-black font-extrabold rounded-full hover:bg-lime-300 transition-all shadow-[0_0_32px_rgba(163,230,53,0.25)] hover:shadow-[0_0_44px_rgba(163,230,53,0.4)] text-center"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href={`/${locale}/login`}
                className="px-8 py-4 bg-transparent text-white font-bold rounded-full border border-white/20 hover:border-lime-400/60 hover:text-lime-300 transition-colors text-center"
              >
                {t('hero.login')}
              </Link>
            </div>
          </div>

          {/* Tactical board visual (decorative) */}
          <div aria-hidden className="relative hidden md:block">
            <div className="absolute -inset-8 bg-lime-400/10 blur-[80px] rounded-full" />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="relative aspect-[4/3] rounded-2xl border-2 border-lime-400/25 bg-[#0c1411] overflow-hidden">
                {/* halfway line */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-lime-400/20" />
                {/* center circle */}
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime-400/20" />
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/60" />
                {/* goal box */}
                <div className="absolute left-0 top-1/2 h-36 w-20 -translate-y-1/2 border-y-2 border-r-2 border-lime-400/40 rounded-r-lg" />
                <div className="absolute left-0 top-1/2 h-20 w-8 -translate-y-1/2 border-y-2 border-r-2 border-lime-400/40 rounded-r-md" />
                {/* cones */}
                <div className="absolute left-[30%] top-[30%] h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                <div className="absolute left-[45%] top-[60%] h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                <div className="absolute left-[60%] top-[35%] h-3.5 w-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                {/* goalkeeper */}
                <div className="absolute left-[12%] top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 shadow-[0_0_16px_rgba(163,230,53,0.9)] ring-4 ring-lime-400/20" />
                {/* ball */}
                <div className="absolute left-[70%] top-[55%] h-4 w-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
                {/* movement arrow */}
                <svg className="absolute left-[16%] top-[38%] w-40 h-24 text-lime-300/80" viewBox="0 0 160 96" fill="none">
                  <path d="M8 80 C 50 76, 90 60, 132 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6" />
                  <path d="M120 18 L134 22 L126 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* floating chips */}
              <div className="absolute -left-4 top-8 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 backdrop-blur px-4 py-2 shadow-xl">
                <PencilSquareIcon className="w-4 h-4 text-lime-400" />
                <span className="h-2 w-16 rounded-full bg-white/20" />
              </div>
              <div className="absolute -right-3 bottom-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 backdrop-blur px-4 py-2 shadow-xl">
                <ChartBarIcon className="w-4 h-4 text-lime-400" />
                <span className="h-2 w-12 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              {t('features.title')}
            </h2>
            <p className="text-lg text-white/50">{t('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-lime-400/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center mb-5 group-hover:bg-lime-400/20 transition-colors">
                    <Icon className="w-6 h-6 text-lime-400" />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight mb-2">
                    {t(`features.${feature.titleKey}.title`)}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {t(`features.${feature.descriptionKey}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 border-t border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-14 text-center">
            {t('benefits.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl border border-white/10 bg-black/40 hover:border-lime-400/40 transition-colors"
                >
                  <div className="w-14 h-14 rounded-2xl bg-lime-400 text-black flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(163,230,53,0.25)]">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-2">
                    {t(`benefits.${benefit.titleKey}.title`)}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {t(`benefits.${benefit.descriptionKey}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 bg-lime-400">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-black/10 blur-[80px]" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-black mb-5">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-black/60 mb-10 font-medium">
            {t('cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/login`}
            className="inline-block px-10 py-4 bg-black text-white font-extrabold rounded-full hover:bg-neutral-900 hover:scale-[1.03] transition-all shadow-2xl"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-lime-400 rounded-xl flex items-center justify-center">
                  <span className="text-black font-black">GK</span>
                </div>
                <span className="font-extrabold tracking-tight">Goalkeeper Training</span>
              </div>
              <p className="text-sm text-white/40 leading-relaxed">{t('hero.subtitle')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-white/60">{t('footer.product')}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.features')}</a></li>
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.pricing')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-white/60">{t('footer.company')}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.about')}</a></li>
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-white/60">{t('footer.legal')}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="text-white/40 hover:text-lime-300 transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/30">
            <p>&copy; 2025 Goalkeeper Training. {t('footer.rights')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
