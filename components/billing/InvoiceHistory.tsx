'use client';

import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: number;
  stripe_invoice_id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_url?: string;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
  period_start?: string;
  period_end?: string;
  paid_at?: string;
  created_at: string;
}

interface InvoiceHistoryProps {
  invoices: Invoice[];
  locale?: string;
}

export function InvoiceHistory({ invoices, locale = 'es' }: InvoiceHistoryProps) {
  const texts = {
    es: {
      title: 'Historial de facturas',
      noInvoices: 'No hay facturas disponibles',
      date: 'Fecha',
      amount: 'Monto',
      status: 'Estado',
      actions: 'Acciones',
      view: 'Ver',
      download: 'Descargar',
      paid: 'Pagada',
      open: 'Pendiente',
      void: 'Anulada',
      uncollectible: 'Incobrable',
      draft: 'Borrador',
    },
    en: {
      title: 'Invoice history',
      noInvoices: 'No invoices available',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      actions: 'Actions',
      view: 'View',
      download: 'Download',
      paid: 'Paid',
      open: 'Open',
      void: 'Void',
      uncollectible: 'Uncollectible',
      draft: 'Draft',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.es;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { classes: string; label: string }> = {
      paid: { classes: 'bg-lime-400/15 text-lime-300 border-lime-400/30', label: t.paid },
      open: { classes: 'bg-amber-400/15 text-amber-300 border-amber-400/30', label: t.open },
      void: { classes: 'bg-white/10 text-white/50 border-white/10', label: t.void },
      uncollectible: { classes: 'bg-red-500/15 text-red-300 border-red-500/30', label: t.uncollectible },
      draft: { classes: 'bg-white/10 text-white/50 border-white/10', label: t.draft },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${config.classes}`}>
        {config.label}
      </span>
    );
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-white/30" />
        <p className="mt-4 text-white/50">{t.noInvoices}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-black tracking-tight text-white">{t.title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">
                {t.date}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">
                {t.amount}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">
                {t.status}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-widest">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-white/[0.04] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                  {formatDate(invoice.paid_at || invoice.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                  {formatAmount(invoice.amount, invoice.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    {invoice.hosted_invoice_url && (
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-300 hover:text-lime-200 font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <DocumentTextIcon className="h-4 w-4" />
                        {t.view}
                      </a>
                    )}
                    {invoice.invoice_pdf && (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        {t.download}
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
