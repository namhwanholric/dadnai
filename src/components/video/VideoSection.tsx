'use client';

import { useId, useState } from 'react';

import { Icon } from '@/components/Icon';
import { VideoCard } from '@/components/video/VideoCard';
import type { EpisodeVideo } from '@/lib/types';

/**
 * 회차 본문 아래에 붙는 "이번 회차의 영상" 영역.
 * 영상 종류(OST·예고편·세계관·애니메이션)는 카드마다 배지로 표시하므로 제목은 중립적으로 둔다.
 * 영상이 없는 회차에서는 아무것도 렌더링하지 않는다.
 */
export function VideoSection({ videos }: { videos: EpisodeVideo[] }) {
  const [open, setOpen] = useState(true);
  const panelId = useId();

  if (videos.length === 0) return null;

  return (
    <section aria-labelledby={`${panelId}-heading`} className="mt-10">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface/50 px-4 py-3.5 text-left transition-colors hover:border-accent/40"
      >
        <span className="flex items-center gap-2">
          <Icon name="play" size={15} className="text-accent" />
          <span id={`${panelId}-heading`} className="text-[14px] font-bold text-ink">
            이번 회차의 영상
          </span>
          <span className="rounded-full bg-raised px-1.5 py-0.5 text-[11px] text-ink-subtle">
            {videos.length}
          </span>
        </span>
        <Icon
          name="chevron-down"
          size={17}
          className={`shrink-0 text-ink-subtle transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div id={panelId} className="mt-3 space-y-3">
          {videos.map((video, index) => (
            <VideoCard key={`${video.url}-${index}`} video={video} />
          ))}
          <p className="px-1 text-[11.5px] leading-relaxed text-ink-subtle">
            영상은 재생 버튼을 누를 때만 불러옵니다. 자동으로 재생되지 않으며,
            youtube-nocookie.com(개인정보 보호 강화 모드)으로 임베드합니다.
          </p>
        </div>
      )}
    </section>
  );
}
