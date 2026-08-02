'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SITE } from '@content/site';
import { Icon, type IconName } from '@/components/Icon';
import { isReaderPath } from '@/lib/routes';

/**
 * 모바일 하단 탐색. 엄지로 닿는 위치에 두고, 읽기 화면에서는 숨겨서 본문에 집중시킨다.
 * (읽기 화면에는 이전/다음·목록이 있는 전용 하단바가 따로 있다)
 */
export function MobileTabBar() {
  const pathname = usePathname() ?? '/';
  if (isReaderPath(pathname)) return null;

  return (
    <nav
      aria-label="모바일 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md">
        {SITE.nav.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? 'text-accent' : 'text-ink-subtle'
                }`}
              >
                <Icon name={item.icon as IconName} size={21} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
