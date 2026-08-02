'use client';

import { Icon, type IconName } from '@/components/Icon';
import { useReadingSettings } from '@/lib/hooks/useReadingSettings';
import type { ReadingTheme } from '@/lib/storage';

export const THEME_OPTIONS: { value: ReadingTheme; label: string; icon: IconName }[] = [
  { value: 'light', label: '밝은 화면', icon: 'sun' },
  { value: 'sepia', label: '세피아 화면', icon: 'paper' },
  { value: 'dark', label: '어두운 화면', icon: 'moon' },
];

/** 헤더용 3단 세그먼트 컨트롤. 읽기 화면 설정 패널과 같은 값을 공유한다. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { settings, update, hydrated } = useReadingSettings();

  return (
    <div
      role="radiogroup"
      aria-label="화면 밝기"
      className={`flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5 ${className}`}
    >
      {THEME_OPTIONS.map((option) => {
        const active = hydrated && settings.theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={() => update({ theme: option.value })}
            className={`grid size-8 place-items-center rounded-full transition-colors ${
              active
                ? 'bg-accent text-accent-ink'
                : 'text-ink-subtle hover:bg-raised hover:text-ink-muted'
            }`}
          >
            <Icon name={option.icon} size={16} />
          </button>
        );
      })}
    </div>
  );
}
