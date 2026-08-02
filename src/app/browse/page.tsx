import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BrowseClient } from '@/components/BrowseClient';
import { getAllSeriesWithEpisodes, getGenreIndex } from '@/lib/content';

export const metadata: Metadata = {
  title: '둘러보기',
  description: '연재 상태 · 장르 · 태그로 작품을 좁혀서 찾아보세요.',
};

export default function BrowsePage() {
  const series = getAllSeriesWithEpisodes();
  const { genres, tags } = getGenreIndex();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">둘러보기</h1>
        <p className="mt-1.5 text-[13px] text-ink-muted sm:text-sm">
          연재 상태와 장르, 태그로 작품을 골라 보세요.
        </p>
      </header>

      {/* useSearchParams 를 쓰는 클라이언트 컴포넌트는 정적 export 시 Suspense 경계가 필요하다. */}
      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-xl border border-line bg-surface/40" />
        }
      >
        <BrowseClient series={series} genres={genres} tags={tags} />
      </Suspense>
    </div>
  );
}
