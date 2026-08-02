'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { Sheet } from '@/components/Sheet';
import { EpisodeList } from '@/components/series/EpisodeList';
import { ReaderActions } from '@/components/reader/ReaderActions';
import { ReaderSettings } from '@/components/reader/ReaderSettings';
import { VideoSection } from '@/components/video/VideoSection';
import { useReadingSettings } from '@/lib/hooks/useReadingSettings';
import { formatDate, readingMinutes } from '@/lib/format';
import { loadProgress, saveEpisodeProgress } from '@/lib/storage';
import { routes } from '@/lib/routes';
import type { Episode, EpisodeSummary, Series } from '@/lib/types';

interface Props {
  series: Series;
  episode: Omit<Episode, 'html'>;
  episodes: EpisodeSummary[];
  prev: EpisodeSummary | null;
  next: EpisodeSummary | null;
  /** 서버에서 미리 렌더링된 본문 (정적 HTML로 그대로 출력된다) */
  children: React.ReactNode;
}

/** 진행 상황을 localStorage 에 쓰는 최소 간격 (ms) */
const SAVE_INTERVAL = 700;

export function ReaderShell({ series, episode, episodes, prev, next, children }: Props) {
  const router = useRouter();
  const { settings } = useReadingSettings();

  const [ratio, setRatio] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [restored, setRestored] = useState(false);

  const lastScrollY = useRef(0);
  const lastSavedAt = useRef(0);
  const ticking = useRef(false);
  const anyDialogOpen = settingsOpen || listOpen;

  /* ── 스크롤 추적: 진행률 · 위치 저장 · 상단바 자동 숨김 ───────────── */
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const value = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      setRatio(value);

      // 아래로 내리면 상단/하단바를 접어 본문에 집중시키고, 위로 올리면 되돌린다.
      const delta = y - lastScrollY.current;
      if (y < 80) setChromeVisible(true);
      else if (delta > 8) setChromeVisible(false);
      else if (delta < -8) setChromeVisible(true);
      lastScrollY.current = y;

      const now = Date.now();
      if (now - lastSavedAt.current > SAVE_INTERVAL) {
        lastSavedAt.current = now;
        saveEpisodeProgress(series.slug, episode.slug, value);
      }
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        measure();
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [series.slug, episode.slug]);

  /* ── 페이지를 떠날 때 마지막 위치를 확실히 저장 ───────────── */
  useEffect(() => {
    const flush = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      saveEpisodeProgress(series.slug, episode.slug, value);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [series.slug, episode.slug]);

  /* ── 읽던 위치로 복귀 ───────────── */
  useEffect(() => {
    const saved = loadProgress()[series.slug]?.episodes[episode.slug]?.ratio ?? 0;
    // 거의 처음이거나 이미 끝까지 읽은 회차는 되돌리지 않는다.
    if (saved <= 0.03 || saved >= 0.97) return;

    // 이미지·폰트가 자리를 잡은 뒤에 계산해야 위치가 맞는다.
    const timer = window.setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      window.scrollTo({ top: saved * max, behavior: 'auto' });
      lastScrollY.current = saved * max;
      setRestored(true);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [series.slug, episode.slug]);

  /* ── 데스크톱 키보드 탐색 (← →) ───────────── */
  const go = useCallback(
    (target: EpisodeSummary | null) => {
      if (target) router.push(routes.episode(series.slug, target.slug));
    },
    [router, series.slug],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (anyDialogOpen || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'ArrowLeft') go(prev);
      if (event.key === 'ArrowRight') go(next);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyDialogOpen, go, prev, next]);

  const percent = Math.round(ratio * 100);

  return (
    <div className="min-h-dvh pb-20">
      {/* ── 진행률 ───────────── */}
      <div
        role="progressbar"
        aria-label="읽기 진행률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="fixed inset-x-0 top-0 z-50 h-[3px] bg-line/40"
      >
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* ── 상단바 ───────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md transition-transform duration-200 ${
          chromeVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto flex h-13 max-w-3xl items-center gap-2 px-3 py-2.5 sm:px-4">
          <Link
            href={routes.series(series.slug)}
            aria-label={`${series.title} 작품 정보로`}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="arrow-left" size={19} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[11.5px] text-ink-subtle">{series.title}</p>
            <p className="truncate text-[13px] font-semibold text-ink">{episode.title}</p>
          </div>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="읽기 설정 열기"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="type" size={19} />
          </button>
        </div>
      </header>

      {/* ── 본문 ───────────── */}
      <article className="mx-auto max-w-3xl px-5 pt-20 sm:px-6 sm:pt-24">
        <header className="mx-auto mb-9" style={{ maxWidth: 'var(--reader-measure)' }}>
          <Link
            href={routes.series(series.slug)}
            className="text-[12.5px] text-accent transition-opacity hover:opacity-80"
          >
            {series.title}
          </Link>
          <h1 className="mt-1.5 text-[22px] font-bold leading-snug tracking-tight text-ink sm:text-[26px]">
            {episode.title}
          </h1>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-subtle">
            <span>{episode.number}화</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(episode.publishedAt)} 공개</span>
            <span aria-hidden="true">·</span>
            <span>약 {readingMinutes(episode.charCount)}분 분량</span>
          </p>
        </header>

        <div className="reader-body" data-font={settings.font}>
          {children}
        </div>

        {/* ── 작가 후기 ───────────── */}
        {episode.authorNote && (
          <aside
            aria-label="작가 후기"
            className="mx-auto mt-12 rounded-xl border border-line bg-surface/50 p-4 sm:p-5"
            style={{ maxWidth: 'var(--reader-measure)' }}
          >
            <p className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
              <Icon name="author" size={14} />
              작가 후기
            </p>
            <div className="prose-basic text-[13.5px] text-ink-muted">
              {episode.authorNote.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </aside>
        )}

        {/* ── 영상 · OST ───────────── */}
        <div className="mx-auto" style={{ maxWidth: 'var(--reader-measure)' }}>
          <VideoSection videos={episode.videos} />

          <ReaderActions
            seriesSlug={series.slug}
            episodeSlug={episode.slug}
            seriesTitle={series.title}
            episodeTitle={episode.title}
          />

          {/* ── 이전/다음 (본문 하단 큰 버튼) ───────────── */}
          <nav aria-label="회차 이동" className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {prev ? (
              <Link
                href={routes.episode(series.slug, prev.slug)}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface/50 px-4 py-3.5 transition-colors hover:border-accent/40"
              >
                <Icon name="arrow-left" size={17} className="shrink-0 text-ink-subtle" />
                <span className="min-w-0">
                  <span className="block text-[11.5px] text-ink-subtle">이전 화</span>
                  <span className="block truncate text-[13.5px] font-medium text-ink">
                    {prev.title}
                  </span>
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {next ? (
              <Link
                href={routes.episode(series.slug, next.slug)}
                className="flex items-center justify-end gap-3 rounded-xl border border-line bg-surface/50 px-4 py-3.5 text-right transition-colors hover:border-accent/40"
              >
                <span className="min-w-0">
                  <span className="block text-[11.5px] text-ink-subtle">다음 화</span>
                  <span className="block truncate text-[13.5px] font-medium text-ink">
                    {next.title}
                  </span>
                </span>
                <Icon name="arrow-right" size={17} className="shrink-0 text-ink-subtle" />
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed border-line px-4 py-3.5 text-center text-[13px] text-ink-subtle">
                {series.status === 'completed'
                  ? '마지막 회차입니다. 끝까지 읽어 주셔서 고맙습니다.'
                  : '다음 회차를 준비하고 있습니다.'}
              </div>
            )}
          </nav>
        </div>
      </article>

      {/* ── 하단 고정바 ───────────── */}
      <nav
        aria-label="읽기 도구"
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md transition-transform duration-200 ${
          chromeVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-1 px-2 py-2">
          <ToolButton
            label="이전 화"
            icon="arrow-left"
            disabled={!prev}
            href={prev ? routes.episode(series.slug, prev.slug) : undefined}
          />
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:text-accent"
          >
            <Icon name="list" size={20} />
            회차 목록
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:text-accent"
          >
            <Icon name="type" size={20} />
            읽기 설정
          </button>
          <ToolButton
            label="다음 화"
            icon="arrow-right"
            disabled={!next}
            href={next ? routes.episode(series.slug, next.slug) : undefined}
          />
        </div>
      </nav>

      {/* ── 읽던 위치 복귀 안내 ───────────── */}
      {restored && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-20 z-50 mx-auto flex w-fit items-center gap-3 rounded-full border border-line bg-raised px-4 py-2.5 text-[12.5px] text-ink shadow-lg shadow-black/25"
        >
          읽던 위치로 이동했습니다
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setRestored(false);
            }}
            className="font-semibold text-accent underline underline-offset-2"
          >
            처음부터
          </button>
          <button
            type="button"
            onClick={() => setRestored(false)}
            aria-label="안내 닫기"
            className="text-ink-subtle transition-colors hover:text-ink"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      )}

      <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <Sheet open={listOpen} onClose={() => setListOpen(false)} title={series.title} tall>
        {/* 목록에서 회차를 고르면 시트를 닫는다 (링크 이동은 그대로 진행된다) */}
        <div role="presentation" onClick={() => setListOpen(false)}>
          <EpisodeList
            seriesSlug={series.slug}
            episodes={episodes}
            currentSlug={episode.slug}
            compact
          />
        </div>
      </Sheet>
    </div>
  );
}

function ToolButton({
  label,
  icon,
  href,
  disabled,
}: {
  label: string;
  icon: 'arrow-left' | 'arrow-right';
  href?: string;
  disabled: boolean;
}) {
  const className =
    'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors';

  if (disabled || !href) {
    return (
      <span aria-disabled="true" className={`${className} text-ink-subtle/40`}>
        <Icon name={icon} size={20} />
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={`${className} text-ink-muted hover:text-accent`}>
      <Icon name={icon} size={20} />
      {label}
    </Link>
  );
}
