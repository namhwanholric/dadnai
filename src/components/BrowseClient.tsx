'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { SeriesCard } from '@/components/SeriesCard';
import type { SeriesWithEpisodes } from '@/lib/types';

type StatusFilter = 'all' | 'ongoing' | 'completed';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '연재 중' },
  { value: 'completed', label: '완결' },
];

interface Props {
  series: SeriesWithEpisodes[];
  genres: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

/**
 * 둘러보기 필터.
 * 정적 사이트라 서버 필터링이 없으므로 전체 목록을 받아 클라이언트에서 좁힌다.
 * 홈에서 넘어온 ?genre= / ?tag= 쿼리를 초기값으로 반영한다.
 */
export function BrowseClient({ series, genres, tags }: Props) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<StatusFilter>('all');
  const [genre, setGenre] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    setGenre(searchParams.get('genre'));
    setTag(searchParams.get('tag'));
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      series.filter((item) => {
        if (status === 'ongoing' && item.status === 'completed') return false;
        if (status === 'completed' && item.status !== 'completed') return false;
        if (genre && item.genre !== genre) return false;
        if (tag && !item.tags.includes(tag)) return false;
        return true;
      }),
    [series, status, genre, tag],
  );

  const hasFilter = status !== 'all' || genre !== null || tag !== null;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
      active
        ? 'border-accent bg-accent text-accent-ink'
        : 'border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink'
    }`;

  return (
    <div>
      <div className="space-y-3.5">
        <FilterRow label="연재 상태">
          {STATUS_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={status === option.value}
              className={chip(status === option.value)}
            >
              {option.label}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="장르">
          <button
            type="button"
            onClick={() => setGenre(null)}
            aria-pressed={genre === null}
            className={chip(genre === null)}
          >
            전체
          </button>
          {genres.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setGenre(genre === item.name ? null : item.name)}
              aria-pressed={genre === item.name}
              className={chip(genre === item.name)}
            >
              {item.name}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="태그">
          <button
            type="button"
            onClick={() => setTag(null)}
            aria-pressed={tag === null}
            className={chip(tag === null)}
          >
            전체
          </button>
          {tags.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setTag(tag === item.name ? null : item.name)}
              aria-pressed={tag === item.name}
              className={chip(tag === item.name)}
            >
              #{item.name}
            </button>
          ))}
        </FilterRow>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
        <p aria-live="polite" className="text-[13px] text-ink-muted">
          작품 {filtered.length}편
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setStatus('all');
              setGenre(null);
              setTag(null);
            }}
            className="text-[13px] text-ink-subtle underline underline-offset-4 transition-colors hover:text-accent"
          >
            필터 초기화
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => (
            <SeriesCard key={item.slug} series={item} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-line bg-surface/40 px-4 py-10 text-center text-[13px] text-ink-muted">
          조건에 맞는 작품이 없습니다. 필터를 하나씩 풀어 보세요.
        </p>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="shrink-0 text-[12px] font-semibold text-ink-subtle sm:w-14">{label}</span>
      <div
        role="group"
        aria-label={label}
        className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {children}
      </div>
    </div>
  );
}
