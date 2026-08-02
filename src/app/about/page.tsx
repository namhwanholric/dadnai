import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE } from '@content/site';
import { Icon } from '@/components/Icon';
import { SeriesCard } from '@/components/SeriesCard';
import { getAllSeriesWithEpisodes } from '@/lib/content';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: '작가 소개',
  description: `${SITE.author.name} 작가 소개와 연재 작품 목록.`,
};

export default function AboutPage() {
  const series = getAllSeriesWithEpisodes();
  const totalEpisodes = series.reduce((sum, item) => sum + item.episodes.length, 0);
  const firstDate = series.map((s) => s.startedAt).sort()[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent/15 text-accent">
          <Icon name="author" size={32} />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {SITE.author.name}
        </h1>
        <p className="mt-1 text-[12px] tracking-[0.2em] text-ink-subtle">
          {SITE.author.nameEn.toUpperCase()}
        </p>
        <p className="mt-3 text-[14px] text-ink-muted sm:text-[15px]">{SITE.author.tagline}</p>
      </header>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: '연재 작품', value: `${series.length}편` },
          { label: '공개 회차', value: `${totalEpisodes}화` },
          { label: '첫 연재', value: formatDate(firstDate).replace(/일$/, '') },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-surface/40 px-3 py-4 text-center"
          >
            <dt className="text-[11px] text-ink-subtle">{stat.label}</dt>
            <dd className="mt-1 text-[15px] font-semibold text-ink sm:text-base">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="prose-basic mt-9 text-[14.5px] text-ink-muted sm:text-[15px]">
        {SITE.author.bio.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </section>

      {SITE.author.links.length > 0 && (
        <section className="mt-8" aria-labelledby="links-heading">
          <h2 id="links-heading" className="mb-3 text-[13px] font-semibold text-ink-subtle">
            연락 · 링크
          </h2>
          <ul className="flex flex-wrap gap-2">
            {SITE.author.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                  {...(link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                  {link.href.startsWith('http') && <Icon name="external" size={13} />}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12" aria-labelledby="works-heading">
        <h2 id="works-heading" className="mb-4 text-[17px] font-bold tracking-tight text-ink">
          연재 작품
        </h2>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3">
          {series.map((item) => (
            <SeriesCard key={item.slug} series={item} />
          ))}
        </div>
      </section>

      <p className="mt-12 rounded-xl border border-line bg-surface/40 px-4 py-4 text-[12.5px] leading-relaxed text-ink-subtle">
        이 사이트의 모든 글과 표지 이미지는 {SITE.author.name}가 직접 쓰고 만들었습니다. 무단 전재와
        재배포, 인공지능 학습 데이터로의 사용을 허락하지 않습니다. 문의는{' '}
        <Link href={SITE.author.links[0]?.href ?? '#'} className="text-accent underline underline-offset-2">
          {SITE.author.links[0]?.label ?? '연락처'}
        </Link>
        로 부탁드립니다.
      </p>
    </div>
  );
}
