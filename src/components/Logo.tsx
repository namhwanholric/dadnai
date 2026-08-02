import Link from 'next/link';

import { SITE } from '@content/site';

/**
 * 사이트 로고. 초승달 + 서가(책등 세 권) 조합의 자체 제작 마크.
 * 어떤 플랫폼의 상표도 참고하지 않았고, 색은 테마 토큰을 따라간다.
 */
export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d="M40 12a20 20 0 1 0 0 40 23 23 0 0 1 0-40z" fill="currentColor" />
      <g fill="currentColor" opacity=".5">
        <rect x="12" y="45" width="4.5" height="9" rx="1.6" />
        <rect x="20" y="41" width="4.5" height="13" rx="1.6" />
        <rect x="28" y="46" width="4.5" height="8" rx="1.6" />
      </g>
      <rect x="9" y="56" width="46" height="2.6" rx="1.3" fill="currentColor" opacity=".75" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-lg py-1 pr-2 transition-opacity hover:opacity-85"
      aria-label={`${SITE.name} 홈으로`}
    >
      <span className="text-accent">
        <LogoMark size={compact ? 26 : 30} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-ink">{SITE.name}</span>
        {!compact && (
          <span className="mt-1 text-[10px] font-medium tracking-[0.22em] text-ink-subtle">
            {SITE.nameEn}
          </span>
        )}
      </span>
    </Link>
  );
}
