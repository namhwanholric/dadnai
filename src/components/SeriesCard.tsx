import Image from 'next/image';
import Link from 'next/link';

import { StatusBadge } from '@/components/ui';
import { assetPath, routes } from '@/lib/routes';
import type { SeriesWithEpisodes } from '@/lib/types';

/**
 * 세로형(2:3) 표지 카드.
 * 테두리와 그림자를 최소화하고 표지 자체가 주인공이 되게 한다.
 */
export function SeriesCard({
  series,
  showTagline = true,
}: {
  series: SeriesWithEpisodes;
  showTagline?: boolean;
}) {
  return (
    <Link href={routes.series(series.slug)} className="group block">
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface">
        <Image
          src={assetPath(series.cover)}
          alt={series.coverAlt}
          width={400}
          height={600}
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-2 top-2">
          <StatusBadge status={series.status} />
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent sm:text-[15px]">
          {series.title}
        </h3>
        {showTagline && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-ink-subtle sm:text-[13px]">
            {series.tagline}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-ink-subtle">
          {series.genre} · 총 {series.episodes.length}화
        </p>
      </div>
    </Link>
  );
}

/** 가로형 목록용 (최근 업데이트 등) */
export function SeriesRow({
  series,
  children,
}: {
  series: SeriesWithEpisodes;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <Link href={routes.series(series.slug)} className="shrink-0">
        <Image
          src={assetPath(series.cover)}
          alt={series.coverAlt}
          width={200}
          height={300}
          className="w-16 rounded-lg border border-line object-cover sm:w-20"
        />
      </Link>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
