'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  STORAGE_EVENT,
  loadLikes,
  loadProgress,
  likeKey,
  toggleLike,
  type ProgressStore,
  type SeriesProgress,
} from '@/lib/storage';

/**
 * localStorage 에 저장된 읽기 기록을 구독한다.
 * SSR/정적 생성 시점에는 값이 없으므로 항상 "빈 기록"으로 시작하고,
 * 마운트 후에 실제 값으로 교체한다. (hydrated=false 동안 UI는 중립 상태를 보여준다)
 */
export function useProgressStore() {
  const [store, setStore] = useState<ProgressStore>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setStore(loadProgress());
    sync();
    setHydrated(true);
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { store, hydrated };
}

export function useSeriesProgress(seriesSlug: string) {
  const { store, hydrated } = useProgressStore();
  const series: SeriesProgress = store[seriesSlug] ?? { episodes: {} };
  return { progress: series, hydrated };
}

/** 좋아요 — 이 브라우저에만 저장된다. */
export function useLikes() {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setLikes(loadLikes());
    sync();
    setHydrated(true);
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isLiked = useCallback(
    (seriesSlug: string, episodeSlug: string) => Boolean(likes[likeKey(seriesSlug, episodeSlug)]),
    [likes],
  );

  const toggle = useCallback((seriesSlug: string, episodeSlug: string) => {
    toggleLike(seriesSlug, episodeSlug);
    setLikes(loadLikes());
  }, []);

  return { likes, isLiked, toggle, hydrated };
}
