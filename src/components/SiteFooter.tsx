'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SITE } from '@content/site';
import { LogoMark } from '@/components/Logo';
import { isReaderPath } from '@/lib/routes';

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  if (isReaderPath(pathname)) return null;

  return (
    <footer className="mt-16 border-t border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-accent">
              <LogoMark size={22} />
              <span className="text-sm font-bold text-ink">{SITE.name}</span>
            </div>
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-subtle">
              {SITE.tagline}. 세 작가가 각자의 이야기를 올립니다. 회원가입 없이 읽을 수 있습니다.
            </p>
          </div>

          <nav aria-label="바닥글 메뉴">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {SITE.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[13px] text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-line pt-6 text-[12px] leading-relaxed text-ink-subtle">
          이 사이트는 서버와 데이터베이스 없이 동작하는 정적 사이트입니다. 좋아요·읽은 회차·읽기
          설정은 <strong className="font-semibold text-ink-muted">지금 사용 중인 브라우저에만</strong>{' '}
          저장되며 어디에도 전송되지 않습니다.
          <br />© {new Date().getFullYear()} {SITE.name}. 모든 작품의 저작권은 각 작가에게 있습니다.
        </p>
      </div>
    </footer>
  );
}
