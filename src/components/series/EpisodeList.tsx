'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Icon } from '@/components/Icon';
import { useSeriesProgress } from '@/lib/hooks/useProgress';
import { formatDateShort, readingMinutes } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { EpisodeSummary } from '@/lib/types';

interface Props {
  seriesSlug: string;
  episodes: EpisodeSummary[];
  /** 읽기 화면의 회차 드로어에서 쓸 때는 현재 회차를 강조한다 */
  currentSlug?: string;
  compact?: boolean;
}

export function EpisodeList({ seriesSlug, episodes, currentSlug, compact = false }: Props) {
  const { progress, hydrated } = useSeriesProgress(seriesSlug);
  const [descending, setDescending] = useState(false);

  const ordered = useMemo(
    () => (descending ? [...episodes].reverse() : episodes),
    [episodes, descending],
  );

  if (episodes.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface/40 px-4 py-8 text-center text-[13px] text-ink-muted">
        아직 공개된 회차가 없습니다.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[12.5px] text-ink-subtle">전체 {episodes.length}화</p>
        <button
          type="button"
          onClick={() => setDescending((value) => !value)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12.5px] text-ink-muted transition-colors hover:text-accent"
        >
          {descending ? '최신 화부터' : '첫 화부터'}
          <Icon name="chevron-down" size={13} />
        </button>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
        {ordered.map((episode) => {
          const record = progress.episodes[episode.slug];
          const read = hydrated && record?.completed;
          const reading = hydrated && !read && (record?.ratio ?? 0) > 0.02;
          const isCurrent = episode.slug === currentSlug;

          return (
            <li key={episode.slug}>
              <Link
                href={routes.episode(seriesSlug, episode.slug)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex items-start gap-3 px-3.5 py-3.5 transition-colors sm:px-4 ${
                  isCurrent ? 'bg-accent/10' : 'bg-surface/30 hover:bg-surface'
                }`}
              >
                <span
                  className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                    read
                      ? 'bg-accent/20 text-accent'
                      : isCurrent
                        ? 'bg-accent text-accent-ink'
                        : 'bg-raised text-ink-subtle'
                  }`}
                >
                  {read ? <Icon name="check" size={13} /> : episode.number}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[14px] font-medium ${
                      read ? 'text-ink-muted' : 'text-ink'
                    }`}
                  >
                    {episode.title}
                  </p>

                  {!compact && episode.summary && (
                    <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-subtle">
                      {episode.summary}
                    </p>
                  )}

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-subtle">
                    <span>{formatDateShort(episode.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>약 {readingMinutes(episode.charCount)}분</span>
                    {episode.videos.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-0.5 text-accent">
                          <Icon name="play" size={10} />
                          영상 {episode.videos.length}
                        </span>
                      </>
                    )}
                    {reading && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-accent">
                          {Math.round((record?.ratio ?? 0) * 100)}% 읽는 중
                        </span>
                      </>
                    )}
                    {read && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-ink-subtle">읽음</span>
                      </>
                    )}
                  </p>
                </div>

                <Icon name="chevron-right" size={16} className="mt-1 shrink-0 text-ink-subtle" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
