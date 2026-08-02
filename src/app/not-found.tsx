import Link from 'next/link';

import { Icon } from '@/components/Icon';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-surface text-ink-subtle">
        <Icon name="alert" size={26} />
      </span>
      <h1 className="mt-5 text-xl font-bold text-ink">찾으시는 쪽이 없습니다</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
        주소가 바뀌었거나 아직 공개되지 않은 회차일 수 있습니다.
      </p>
      <div className="mt-6 flex gap-2">
        <Link
          href={routes.home}
          className="rounded-xl bg-accent px-5 py-3 text-[13.5px] font-semibold text-accent-ink transition-opacity hover:opacity-90"
        >
          홈으로
        </Link>
        <Link
          href={routes.browse}
          className="rounded-xl border border-line bg-surface px-5 py-3 text-[13.5px] font-medium text-ink transition-colors hover:border-accent/40"
        >
          작품 둘러보기
        </Link>
      </div>
    </div>
  );
}
