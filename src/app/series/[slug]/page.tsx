import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/Icon';
import { EpisodeList } from '@/components/series/EpisodeList';
import { SeriesActions } from '@/components/series/SeriesActions';
import { StatusBadge, TagLink } from '@/components/ui';
import { getAllSeries, getAuthorOfSeries, getSeriesWithEpisodes } from '@/lib/content';
import { STATUS_LABEL, formatDate } from '@/lib/format';
import { assetPath, routes } from '@/lib/routes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 정적 export 를 위해 빌드 타임에 모든 작품 경로를 미리 알려준다. */
export function generateStaticParams() {
  return getAllSeries().map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesWithEpisodes(slug);
  if (!series) return { title: '작품을 찾을 수 없습니다' };
  return {
    title: series.title,
    description: series.tagline,
    authors: [{ name: getAuthorOfSeries(series).name }],
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeriesWithEpisodes(slug);
  if (!series) notFound();

  const latest = series.episodes[series.episodes.length - 1];
  const author = getAuthorOfSeries(series);

  return (
    <article className="pb-6">
      {/* ── 작품 헤더 ─────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(110% 80% at 50% 0%, ${series.accent}22 0%, transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-9">
          <nav aria-label="현재 위치" className="mb-5 text-[12.5px] text-ink-subtle">
            <Link href={routes.browse} className="transition-colors hover:text-accent">
              둘러보기
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-ink-muted">{series.genre}</span>
          </nav>

          <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
            <Image
              src={assetPath(series.cover)}
              alt={series.coverAlt}
              width={400}
              height={600}
              priority
              className="mx-auto w-36 shrink-0 rounded-2xl border border-line object-cover shadow-lg shadow-black/20 sm:mx-0 sm:w-44"
            />

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <StatusBadge status={series.status} />
                <span className="text-[12px] text-ink-subtle">{series.genre}</span>
              </div>

              <h1 className="mt-2.5 text-[24px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">
                {series.title}
              </h1>
              <p className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <Link
                  href={routes.author(author.slug)}
                  className="group inline-flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-accent"
                >
                  <Image
                    src={assetPath(author.avatar)}
                    alt=""
                    width={200}
                    height={200}
                    className="size-6 rounded-full border border-line object-cover"
                  />
                  {author.name}
                  <Icon
                    name="chevron-right"
                    size={13}
                    className="text-ink-subtle transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted sm:text-[15px]">
                {series.tagline}
              </p>

              <dl className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[12.5px] sm:justify-start">
                <div className="flex gap-1.5">
                  <dt className="text-ink-subtle">연재 상태</dt>
                  <dd className="text-ink-muted">{STATUS_LABEL[series.status]}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="text-ink-subtle">총 회차</dt>
                  <dd className="text-ink-muted">{series.episodes.length}화</dd>
                </div>
                {latest && (
                  <div className="flex gap-1.5">
                    <dt className="text-ink-subtle">최근 공개</dt>
                    <dd className="text-ink-muted">{formatDate(latest.publishedAt)}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {series.tags.map((tag) => (
                  <TagLink key={tag} tag={tag} />
                ))}
              </div>

              <div className="mt-6 flex justify-center sm:justify-start">
                <SeriesActions seriesSlug={series.slug} episodes={series.episodes} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* ── 줄거리 ─────────────────────────────── */}
        <section className="mt-8" aria-labelledby="synopsis-heading">
          <h2
            id="synopsis-heading"
            className="mb-3 flex items-center gap-1.5 text-[15px] font-bold text-ink"
          >
            <Icon name="paper" size={16} className="text-accent" />
            줄거리
          </h2>
          <div className="prose-basic max-w-2xl text-[14px] text-ink-muted sm:text-[15px]">
            {series.synopsis.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* ── 회차 목록 ─────────────────────────────── */}
        <section className="mt-10" aria-labelledby="episodes-heading">
          <h2
            id="episodes-heading"
            className="mb-3 flex items-center gap-1.5 text-[15px] font-bold text-ink"
          >
            <Icon name="list" size={16} className="text-accent" />
            회차 목록
          </h2>
          <EpisodeList seriesSlug={series.slug} episodes={series.episodes} />
        </section>

        <p className="mt-8 rounded-xl border border-line bg-surface/40 px-4 py-3.5 text-[12px] leading-relaxed text-ink-subtle">
          체크 표시와 진행률은 이 브라우저에 저장된 기록입니다. 다른 기기에서는 보이지 않으며,
          브라우저 저장소를 비우면 초기화됩니다.
        </p>
      </div>
    </article>
  );
}
