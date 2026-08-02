'use client';

import Link from 'next/link';

import { Icon } from '@/components/Icon';
import { useSeriesProgress } from '@/lib/hooks/useProgress';
import { routes } from '@/lib/routes';
import type { EpisodeSummary } from '@/lib/types';

interface Props {
  seriesSlug: string;
  episodes: EpisodeSummary[];
  /** 홈 배너에서는 버튼을 줄여서 보여준다 */
  variant?: 'full' | 'compact';
}

/**
 * 첫 화부터 읽기 / 이어 읽기 / 최신 화.
 *
 * "이어 읽기"는 이 브라우저의 localStorage 기록을 기준으로 한다.
 * 기록이 없으면 버튼 자체를 숨긴다 — 눌러도 아무 일이 없는 가짜 버튼을 남기지 않기 위해서다.
 */
export function SeriesActions({ seriesSlug, episodes, variant = 'full' }: Props) {
  const { progress, hydrated } = useSeriesProgress(seriesSlug);

  if (episodes.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-surface px-4 py-3 text-[13px] text-ink-muted">
        아직 공개된 회차가 없습니다.
      </p>
    );
  }

  const first = episodes[0];
  const latest = episodes[episodes.length - 1];

  const lastSlug = progress.lastEpisode;
  const lastEpisode = lastSlug ? episodes.find((e) => e.slug === lastSlug) : undefined;
  const lastRatio = lastSlug ? (progress.episodes[lastSlug]?.ratio ?? 0) : 0;

  // 완독한 회차라면 그다음 회차로 이어준다.
  const resumeTarget = (() => {
    if (!lastEpisode) return undefined;
    const done = progress.episodes[lastEpisode.slug]?.completed;
    if (!done) return lastEpisode;
    const index = episodes.findIndex((e) => e.slug === lastEpisode.slug);
    return episodes[index + 1] ?? lastEpisode;
  })();

  const showResume = hydrated && resumeTarget !== undefined;
  const resumeIsNext = showResume && resumeTarget!.slug !== lastEpisode?.slug;

  const primary =
    'inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-accent-ink transition-opacity hover:opacity-90';
  const secondary =
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent';

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {showResume ? (
          <>
            <Link href={routes.episode(seriesSlug, resumeTarget!.slug)} className={primary}>
              <Icon name="bookmark" size={16} />
              이어 읽기
            </Link>
            <Link href={routes.episode(seriesSlug, first.slug)} className={secondary}>
              첫 화부터
            </Link>
          </>
        ) : (
          <Link href={routes.episode(seriesSlug, first.slug)} className={primary}>
            <Icon name="play" size={15} />첫 화부터 읽기
          </Link>
        )}

        {variant === 'full' && latest.slug !== first.slug && (
          <Link href={routes.episode(seriesSlug, latest.slug)} className={secondary}>
            최신 화 ({latest.number}화)
          </Link>
        )}
      </div>

      {showResume && (
        <p className="mt-2.5 text-[12px] text-ink-subtle">
          {resumeIsNext ? (
            <>
              {lastEpisode!.number}화를 끝까지 읽었습니다 · 다음은 {resumeTarget!.number}화
            </>
          ) : (
            <>
              {resumeTarget!.number}화 {Math.round(lastRatio * 100)}% 지점부터
            </>
          )}
        </p>
      )}
    </div>
  );
}
