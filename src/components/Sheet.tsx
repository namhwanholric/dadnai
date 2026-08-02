'use client';

import { useEffect, useRef } from 'react';

import { Icon } from '@/components/Icon';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** 회차 목록처럼 내용이 긴 시트는 높이를 더 준다 */
  tall?: boolean;
}

/**
 * 모바일에서는 하단 시트, 데스크톱에서는 가운데 모달로 뜨는 공용 컨테이너.
 * ESC 닫기 · 배경 클릭 닫기 · 열릴 때 포커스 이동 · 닫힐 때 포커스 복귀를 처리한다.
 */
export function Sheet({ open, onClose, title, children, tall = false }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    // 시트가 열려 있는 동안 뒤쪽 본문이 스크롤되지 않게 한다.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex w-full flex-col rounded-t-2xl border border-line bg-canvas outline-none sm:max-w-md sm:rounded-2xl ${
          tall ? 'max-h-[82vh] sm:max-h-[76vh]' : 'max-h-[88vh]'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-[14px] font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-8 place-items-center rounded-lg text-ink-subtle transition-colors hover:bg-surface hover:text-ink"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
      </div>
    </div>
  );
}
