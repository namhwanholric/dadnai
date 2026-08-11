import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@/components/Icon';
import { SeriesCard } from '@/components/SeriesCard';
import { SeriesActions } from '@/components/series/SeriesActions';
import { Section, StatusBadge, Tag } from '@/components/ui';
import {
  getAllAuthorsWithSeries,
  getAllSeriesWithEpisodes,
  getFeaturedSeries,
  getGenreIndex,
  getRecentEpisodes,
} from '@/lib/content';
import { formatDateShort, readingMinutes } from '@/lib/format';
import { assetPath, routes } from '@/lib/routes';

export default function HomePage() {
  const featured = getFeaturedSeries();
  const authors = getAllAuthorsWithSeries();
  const all = getAllSeriesWithEpisodes();
  const ongoing = all.filter((s) => s.status !== 'completed');
  const completed = all.filter((s) => s.status === 'completed');
  const recent = getRecentEpisodes(5);
  const { genres, tags } = getGenreIndex();

  return (
    <div className="pb-4">
      {/* ── 대표 작품 배너 ─────────────────────────────── */}
      <section aria-labelledby="featured-heading" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(120% 90% at 12% 0%, ${featured.accent}26 0%, transparent 62%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
          <p className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-semibold tracking-wide text-accent">
            <Icon name="bookmark" size={12} />
            대표 작품
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-9">
            <Link
              href={routes.series(featured.slug)}
              className="group mx-auto w-40 shrink-0 sm:mx-0 sm:w-52"
            >
              <Image
                src={assetPath(featured.cover)}
                alt={featured.coverAlt}
                width={400}
                height={600}
                priority
                className="aspect-[2/3] w-full rounded-2xl border border-line object-cover shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <StatusBadge status={featured.status} />
                <span className="text-[12px] text-ink-subtle">
                  {featured.genre} · 총 {featured.episodes.length}화
                </span>
              </div>

              <h1
                id="featured-heading"
                className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-ink sm:text-4xl"
              >
                {featured.title}
              </h1>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted sm:text-base">
                {featured.tagline}
              </p>

              <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-ink-subtle sm:mx-0 sm:text-sm">
                {featured.synopsis.split('\n\n')[0]}
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                {featured.tags.slice(0, 4).map((tag) => (
                  <Tag key={tag}>#{tag}</Tag>
                ))}
              </div>

              <div className="mt-6 flex justify-center sm:justify-start">
                <SeriesActions
                  seriesSlug={featured.slug}
                  episodes={featured.episodes}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 최근 업데이트 ─────────────────────────────── */}
      <Section
        title="최근 업데이트"
        description="가장 최근에 올라온 회차부터"
        action={{ href: routes.browse, label: '전체 보기' }}
        className="mt-4"
      >
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
          {recent.map(({ series, episode }) => (
            <li key={`${series.slug}/${episode.slug}`}>
              <Link
                href={routes.episode(series.slug, episode.slug)}
                className="flex items-center gap-3.5 bg-surface/40 px-3.5 py-3 transition-colors hover:bg-surface sm:px-4"
              >
                <Image
                  src={assetPath(series.cover)}
                  alt=""
                  width={200}
                  height={300}
                  className="w-11 shrink-0 rounded-md border border-line object-cover sm:w-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] text-ink-subtle">{series.title}</p>
                  <p className="mt-0.5 truncate text-[14px] font-medium text-ink">
                    {episode.title}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[12px] text-ink-subtle">{formatDateShort(episode.publishedAt)}</p>
                  <p className="mt-0.5 text-[11px] text-ink-subtle">
                    약 {readingMinutes(episode.charCount)}분
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 파이썬 탈출 FPS ─────────────────────────────── */}
      <Section title="쉬어가기" description="읽다가 지치면 잠깐 딴짓" className="mt-12">
        <a
          href={assetPath('/python100/')}
          className="group flex items-center gap-4 rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-accent/50 sm:p-5"
        >
          <div
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-2xl sm:size-16"
          >
            🐍
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-ink transition-colors group-hover:text-accent sm:text-base">
              PYTHON 100 — 파이썬 탈출 FPS
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
              방 100개를 통과하며 파이썬을 배우는 3D 게임. 정답 문을 쏘면 다음 방으로 넘어갑니다.
            </p>
            <p className="mt-1.5 text-[12px] text-ink-subtle">
              브라우저에서 바로 실행 · 설치 없음
            </p>
          </div>
          <Icon
            name="chevron-right"
            size={18}
            className="shrink-0 text-ink-subtle transition-colors group-hover:text-accent"
          />
        </a>
      </Section>

      {/* ── 연재 중 ─────────────────────────────── */}
      <Section title="연재 중인 작품" className="mt-12">
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {ongoing.map((series) => (
            <SeriesCard key={series.slug} series={series} />
          ))}
        </div>
      </Section>

      {/* ── 완결 ─────────────────────────────── */}
      {completed.length > 0 && (
        <Section
          title="완결 작품"
          description="처음부터 끝까지 한 번에 읽을 수 있습니다"
          className="mt-12"
        >
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {completed.map((series) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        </Section>
      )}

      {/* ── 장르와 태그 ─────────────────────────────── */}
      <Section title="장르와 태그" description="관심 있는 분위기부터 골라 보세요" className="mt-12">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 text-[12px] font-semibold tracking-wide text-ink-subtle">장르</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Link
                  key={genre.name}
                  href={`${routes.browse}?genre=${encodeURIComponent(genre.name)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {genre.name}
                  <span className="text-[11px] text-ink-subtle">{genre.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <h3 className="mb-3 text-[12px] font-semibold tracking-wide text-ink-subtle">태그</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`${routes.browse}?tag=${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-[12px] text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── 연재 작가 ─────────────────────────────── */}
      <Section
        title="연재 작가"
        description="세 명이 각자의 이야기를 올립니다"
        action={{ href: routes.about, label: '전체 보기' }}
        className="mt-12"
      >
        <ul className="grid gap-3 sm:grid-cols-3">
          {authors.map((author) => (
            <li key={author.slug}>
              <Link
                href={routes.author(author.slug)}
                className="group flex h-full flex-col rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-accent/40 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={assetPath(author.avatar)}
                    alt={author.avatarAlt}
                    width={200}
                    height={200}
                    className="size-11 shrink-0 rounded-full border border-line object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-ink transition-colors group-hover:text-accent">
                      {author.name}
                    </p>
                    <p className="truncate text-[12px] text-ink-subtle">
                      {author.series.length}편 · {author.episodeCount}화
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
                  {author.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
