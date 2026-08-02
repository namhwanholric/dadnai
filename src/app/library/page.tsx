import type { Metadata } from 'next';

import { LibraryClient } from '@/components/LibraryClient';
import { getAllSeriesWithEpisodes } from '@/lib/content';

export const metadata: Metadata = {
  title: '내 서재',
  description: '이 브라우저에 저장된 이어 읽기 지점과 좋아요한 회차.',
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">내 서재</h1>
        <p className="mt-1.5 text-[13px] text-ink-muted sm:text-sm">
          읽던 지점과 좋아요한 회차가 이 브라우저에 저장되어 있습니다.
        </p>
      </header>

      <LibraryClient series={getAllSeriesWithEpisodes()} />
    </div>
  );
}
