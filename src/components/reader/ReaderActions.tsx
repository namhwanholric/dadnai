'use client';

import { useEffect, useState } from 'react';

import { Icon } from '@/components/Icon';
import { useLikes } from '@/lib/hooks/useProgress';

interface Props {
  seriesSlug: string;
  episodeSlug: string;
  seriesTitle: string;
  episodeTitle: string;
}

/**
 * 좋아요 · 공유.
 *
 * ⚠️ 좋아요는 서버로 전송되지 않습니다. 이 브라우저의 localStorage 에만 기록되는
 * 개인 표시이며, 다른 독자의 좋아요와 합산되는 집계가 아닙니다. (안내 문구를 함께 노출)
 */
export function ReaderActions({ seriesSlug, episodeSlug, seriesTitle, episodeTitle }: Props) {
  const { likes, isLiked, toggle, hydrated } = useLikes();
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const liked = hydrated && isLiked(seriesSlug, episodeSlug);
  const likedInSeries = hydrated
    ? Object.keys(likes).filter((key) => key.startsWith(`${seriesSlug}/`)).length
    : 0;

  useEffect(() => {
    if (shareState === 'idle') return;
    const timer = window.setTimeout(() => setShareState('idle'), 2400);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  async function share() {
    const url = window.location.href;
    const title = `${seriesTitle} — ${episodeTitle}`;

    // 모바일에서는 OS 공유 시트를, 데스크톱에서는 링크 복사를 쓴다.
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // 사용자가 공유 시트를 닫은 경우 — 아무 안내도 띄우지 않는다.
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch {
      setShareState('failed');
    }
  }

  return (
    <div className="mt-10 border-t border-line pt-7">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => toggle(seriesSlug, episodeSlug)}
          aria-pressed={liked}
          className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-[14px] font-semibold transition-colors ${
            liked
              ? 'border-accent bg-accent/12 text-accent'
              : 'border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink'
          }`}
        >
          <Icon name={liked ? 'heart-filled' : 'heart'} size={18} />
          {liked ? '좋아요 취소' : '좋아요'}
        </button>

        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-[14px] font-medium text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
        >
          <Icon name="share" size={17} />
          공유
        </button>
      </div>

      <p aria-live="polite" className="mt-3 text-center text-[12px] text-ink-subtle">
        {shareState === 'copied' && '링크를 복사했습니다.'}
        {shareState === 'failed' && '복사에 실패했습니다. 주소창의 주소를 직접 복사해 주세요.'}
        {shareState === 'idle' &&
          (likedInSeries > 0
            ? `이 작품에서 ${likedInSeries}개 회차에 좋아요를 눌렀습니다.`
            : '마음에 든 회차에 표시해 두면 내 서재에서 다시 찾을 수 있습니다.')}
      </p>

      <p className="mt-2 text-center text-[11px] leading-relaxed text-ink-subtle">
        좋아요는 서버로 전송되지 않고 이 브라우저에만 저장됩니다. 다른 독자의 수와 합산되지
        않습니다.
      </p>
    </div>
  );
}
