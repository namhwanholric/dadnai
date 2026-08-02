'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Icon } from '@/components/Icon';
import { useLikes, useProgressStore } from '@/lib/hooks/useProgress';
import { clearAll } from '@/lib/storage';
import { assetPath, routes } from '@/lib/routes';
import type { SeriesWithEpisodes } from '@/lib/types';

/**
 * 내 서재 — localStorage 에 쌓인 개인 기록만 보여주는 화면.
 * 서버에 저장된 것이 아니라는 점을 화면에서도 계속 상기시킨다.
 */
export function LibraryClient({ series }: { series: SeriesWithEpisodes[] }) {
  const { store, hydrated } = useProgressStore();
  const { likes } = useLikes();
  const [confirming, setConfirming] = useState(false);

  const findSeries = (slug: string) => series.find((item) => item.slug === slug);

  const reading = Object.entries(store)
    .map(([slug, record]) => {
      const found = findSeries(slug);
      if (!found || !record.lastEpisode) return null;
      const episode = found.episodes.find((item) => item.slug === record.lastEpisode);
      if (!episode) return null;
      const read = Object.values(record.episodes).filter((item) => item.completed).length;
      return {
        series: found,
        episode,
        ratio: record.episodes[episode.slug]?.ratio ?? 0,
        readCount: read,
        lastReadAt: record.lastReadAt ?? 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.lastReadAt - a.lastReadAt);

  const likedEpisodes = Object.keys(likes)
    .map((key) => {
      const [seriesSlug, episodeSlug] = key.split('/');
      const found = findSeries(seriesSlug);
      const episode = found?.episodes.find((item) => item.slug === episodeSlug);
      if (!found || !episode) return null;
      return { series: found, episode };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort(
      (a, b) =>
        a.series.title.localeCompare(b.series.title, 'ko') || a.episode.number - b.episode.number,
    );

  if (!hydrated) {
    return <div className="h-48 animate-pulse rounded-xl border border-line bg-surface/40" />;
  }

  const empty = reading.length === 0 && likedEpisodes.length === 0;

  if (empty) {
    return (
      <div className="rounded-xl border border-line bg-surface/40 px-6 py-14 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-raised text-ink-subtle">
          <Icon name="library" size={24} />
        </span>
        <p className="mt-4 text-[14px] font-medium text-ink">아직 읽은 기록이 없습니다</p>
        <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-subtle">
          회차를 열어 읽기 시작하면 여기에 이어 읽을 지점이 저장됩니다. 기록은 이 브라우저에만
          남습니다.
        </p>
        <Link
          href={routes.browse}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[13.5px] font-semibold text-accent-ink transition-opacity hover:opacity-90"
        >
          작품 둘러보기
          <Icon name="chevron-right" size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {reading.length > 0 && (
        <section aria-labelledby="reading-heading">
          <h2 id="reading-heading" className="mb-3 text-[15px] font-bold text-ink">
            이어 읽기
          </h2>
          <ul className="space-y-2.5">
            {reading.map((item) => (
              <li key={item.series.slug}>
                <Link
                  href={routes.episode(item.series.slug, item.episode.slug)}
                  className="flex gap-3.5 rounded-xl border border-line bg-surface/40 p-3 transition-colors hover:border-accent/40"
                >
                  <Image
                    src={assetPath(item.series.cover)}
                    alt=""
                    width={200}
                    height={300}
                    className="w-14 shrink-0 rounded-lg border border-line object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-ink-subtle">{item.series.title}</p>
                    <p className="mt-0.5 truncate text-[14px] font-medium text-ink">
                      {item.episode.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="h-1 flex-1 overflow-hidden rounded-full bg-raised"
                        role="progressbar"
                        aria-label={`${item.episode.title} 진행률`}
                        aria-valuenow={Math.round(item.ratio * 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span
                          className="block h-full rounded-full bg-accent"
                          style={{ width: `${Math.max(3, Math.round(item.ratio * 100))}%` }}
                        />
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-ink-subtle">
                        {Math.round(item.ratio * 100)}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] text-ink-subtle">
                      전체 {item.series.episodes.length}화 중 {item.readCount}화 읽음
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {likedEpisodes.length > 0 && (
        <section aria-labelledby="liked-heading">
          <h2 id="liked-heading" className="mb-3 flex items-center gap-1.5 text-[15px] font-bold text-ink">
            <Icon name="heart-filled" size={15} className="text-accent" />
            좋아요한 회차
            <span className="text-[12px] font-normal text-ink-subtle">
              {likedEpisodes.length}개
            </span>
          </h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
            {likedEpisodes.map(({ series: item, episode }) => (
              <li key={`${item.slug}/${episode.slug}`}>
                <Link
                  href={routes.episode(item.slug, episode.slug)}
                  className="flex items-center gap-3 bg-surface/30 px-4 py-3 transition-colors hover:bg-surface"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-ink-subtle">{item.title}</p>
                    <p className="mt-0.5 truncate text-[13.5px] font-medium text-ink">
                      {episode.title}
                    </p>
                  </div>
                  <Icon name="chevron-right" size={16} className="shrink-0 text-ink-subtle" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-line bg-surface/40 p-4">
        <p className="text-[12px] leading-relaxed text-ink-subtle">
          이 화면의 기록은 <strong className="font-semibold text-ink-muted">이 브라우저</strong>에만
          저장되어 있습니다. 다른 기기에서는 보이지 않으며 어디에도 전송되지 않습니다.
        </p>
        {confirming ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] text-ink-muted">
              읽기 기록·좋아요·읽기 설정을 모두 지웁니다. 되돌릴 수 없습니다.
            </span>
            <button
              type="button"
              onClick={() => {
                clearAll();
                setConfirming(false);
              }}
              className="rounded-lg border border-accent bg-accent/10 px-3.5 py-2 text-[12.5px] font-semibold text-accent"
            >
              지우기
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-line px-3.5 py-2 text-[12.5px] text-ink-muted"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-3 rounded-lg border border-line px-3.5 py-2 text-[12.5px] text-ink-muted transition-colors hover:text-ink"
          >
            이 브라우저의 기록 지우기
          </button>
        )}
      </section>
    </div>
  );
}
