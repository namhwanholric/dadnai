'use client';

import { useState } from 'react';

import { Icon } from '@/components/Icon';
import { VIDEO_KIND_LABEL, buildEmbedUrl, buildWatchUrl, extractYouTubeId } from '@/lib/youtube';
import type { EpisodeVideo } from '@/lib/types';

const KIND_TONE: Record<string, string> = {
  ost: 'bg-accent/15 text-accent',
  trailer: 'bg-accent/15 text-accent',
  worldbuilding: 'bg-accent/15 text-accent',
  animation: 'bg-accent/15 text-accent',
};

/**
 * 회차에 붙는 유튜브 영상 카드.
 *
 * - 재생 버튼을 누르기 전에는 iframe 을 만들지 않는다. → 유튜브로 나가는 요청이 0건이고
 *   본문 스크롤도 무거워지지 않는다. (자동재생은 사용자가 누른 뒤에만 붙는다)
 * - 임베드는 youtube-nocookie.com(개인정보 보호 강화 모드)을 쓴다.
 * - 주소에서 11자리 영상 ID를 뽑지 못하면 카드만 안내로 바뀌고 본문은 그대로 유지된다.
 */
export function VideoCard({ video }: { video: EpisodeVideo }) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(video.url);
  const kindLabel = VIDEO_KIND_LABEL[video.kind];

  // 주소를 해석할 수 없는 경우 — 본문 읽기를 방해하지 않는 조용한 안내로 대체한다.
  if (!videoId) {
    return (
      <div className="rounded-xl border border-line bg-surface/50 p-4">
        <div className="flex items-start gap-2.5">
          <Icon name="alert" size={17} className="mt-0.5 shrink-0 text-ink-subtle" />
          <div className="min-w-0">
            <p className="text-[13.5px] font-medium text-ink-muted">
              {video.title}
              <span className="ml-1.5 text-[11px] text-ink-subtle">({kindLabel})</span>
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-subtle">
              영상 주소를 확인할 수 없어 재생기를 표시하지 않았습니다. 본문은 그대로 읽으실 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface/50">
      {/* 16:9 비율 유지 — 화면 폭이 바뀌어도 레이아웃이 흔들리지 않는다 */}
      <div className="relative aspect-video w-full bg-raised">
        {playing ? (
          <iframe
            src={buildEmbedUrl(videoId, { autoplay: true })}
            title={`${video.title} — YouTube 영상`}
            className="absolute inset-0 size-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${video.title} 재생`}
            className="group absolute inset-0 grid size-full place-items-center overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(100% 100% at 50% 0%, color-mix(in oklab, var(--c-accent) 22%, transparent) 0%, transparent 70%), linear-gradient(160deg, var(--c-raised) 0%, var(--c-surface) 100%)',
              }}
            />
            <span className="relative flex flex-col items-center gap-2.5">
              <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-200 group-hover:scale-105">
                <Icon name="play" size={24} className="ml-0.5" />
              </span>
              <span className="text-[11.5px] text-ink-subtle">
                누르면 YouTube 영상이 재생됩니다
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${KIND_TONE[video.kind] ?? KIND_TONE.ost}`}
          >
            {kindLabel}
          </span>
          <h4 className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink">
            {video.title}
          </h4>
        </div>

        {video.description && (
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{video.description}</p>
        )}

        <a
          href={buildWatchUrl(videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-[12px] text-ink-subtle transition-colors hover:text-accent"
        >
          YouTube에서 보기
          <Icon name="external" size={12} />
        </a>
      </div>
    </div>
  );
}
