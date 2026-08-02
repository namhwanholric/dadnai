import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SITE } from '@content/site';
import { Icon } from '@/components/Icon';
import { getAllAuthorsWithSeries, getAllSeriesWithEpisodes } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { assetPath, routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: '연재 작가',
  description: `${SITE.name}에서 연재하는 작가들과 작품 목록.`,
};

export default function AboutPage() {
  const authors = getAllAuthorsWithSeries();
  const series = getAllSeriesWithEpisodes();
  const totalEpisodes = series.reduce((sum, item) => sum + item.episodes.length, 0);
  const firstDate = series.map((s) => s.startedAt).sort()[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="text-center">
        <p className="text-[12px] tracking-[0.2em] text-ink-subtle">{SITE.nameEn}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">연재 작가</h1>
        <p className="mt-3 text-[14px] text-ink-muted sm:text-[15px]">{SITE.tagline}</p>
      </header>

      <dl className="mt-8 grid grid-cols-3 gap-3">
        {[
          { label: '작가', value: `${authors.length}명` },
          { label: '연재 작품', value: `${series.length}편` },
          { label: '공개 회차', value: `${totalEpisodes}화` },
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

      <section className="mt-10" aria-labelledby="authors-heading">
        <h2 id="authors-heading" className="sr-only">
          작가 목록
        </h2>
        <ul className="flex flex-col gap-4">
          {authors.map((author) => (
            <li key={author.slug}>
              <Link
                href={routes.author(author.slug)}
                className="group flex gap-4 rounded-2xl border border-line bg-surface/40 p-4 transition-colors hover:border-accent/40 sm:p-5"
              >
                <Image
                  src={assetPath(author.avatar)}
                  alt={author.avatarAlt}
                  width={200}
                  height={200}
                  className="size-14 shrink-0 rounded-full border border-line object-cover sm:size-16"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[15px] font-bold text-ink sm:text-base">
                    {author.name}
                    <Icon
                      name="chevron-right"
                      size={14}
                      className="text-ink-subtle transition-transform group-hover:translate-x-0.5"
                    />
                  </p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">{author.tagline}</p>
                  <p className="mt-2 text-[12px] text-ink-subtle">
                    {author.series.map((item) => item.title).join(' · ')}
                    {author.series.length > 0 && ` — 총 ${author.episodeCount}화`}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="about-heading">
        <h2 id="about-heading" className="mb-3 text-[17px] font-bold tracking-tight text-ink">
          서고에 대하여
        </h2>
        <div className="prose-basic text-[14.5px] text-ink-muted sm:text-[15px]">
          {SITE.intro.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p>첫 연재는 {formatDate(firstDate)}에 시작했습니다.</p>
        </div>
      </section>

      <p className="mt-10 rounded-xl border border-line bg-surface/40 px-4 py-4 text-[12.5px] leading-relaxed text-ink-subtle">
        모든 작품의 저작권은 각 작가에게 있습니다. 무단 전재와 재배포, 인공지능 학습 데이터로의
        사용을 허락하지 않습니다. 서고 전체에 대한 문의는{' '}
        <a href={SITE.contact.href} className="text-accent underline underline-offset-2">
          {SITE.contact.label}
        </a>
        로, 개별 작품 문의는 각 작가 페이지의 연락처로 부탁드립니다.
      </p>
    </div>
  );
}
