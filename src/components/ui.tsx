import Link from 'next/link';

import { Icon } from '@/components/Icon';
import { STATUS_LABEL, STATUS_TONE } from '@/lib/format';
import type { SeriesStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: SeriesStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] text-ink-muted">
      {children}
    </span>
  );
}

export function TagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/browse/?tag=${encodeURIComponent(tag)}`}
      className="inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
    >
      #{tag}
    </Link>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, description, action, children, className = '' }: SectionProps) {
  return (
    <section className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-bold tracking-tight text-ink sm:text-xl">{title}</h2>
          {description && (
            <p className="mt-1 text-[13px] text-ink-subtle sm:text-sm">{description}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 whitespace-nowrap text-[13px] font-medium text-ink-muted transition-colors hover:text-accent"
          >
            {action.label}
            <Icon name="chevron-right" size={14} className="ml-0.5 inline align-middle" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
