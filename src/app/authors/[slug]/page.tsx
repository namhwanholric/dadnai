import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/Icon';
import { SeriesCard } from '@/components/SeriesCard';
import { getAllAuthors, getAuthorWithSeries } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { assetPath, routes } from '@/lib/routes';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** 정적 export 를 위해 빌드 타임에 모든 작가 경로를 미리 알려준다. */
export function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorWithSeries(slug);
  if (!author) return { title: '작가를 찾을 수 없습니다' };
  return {
    title: author.name,
    description: `${author.name} 작가 소개와 연재 작품 목록. ${author.tagline}`,
    authors: [{ name: author.name }],
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorWithSeries(slug);
  if (!author) notFound();

  const ongoing = author.series.filter((item) => item.status !== 'completed').length;

  return (
    <div className="pb-6">
      <header className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `radial-gradient(110% 80% at 50% 0%, ${author.accent}22 0%, transparent 65%)`,
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-9">
          <nav aria-label="현재 위치" className="mb-6 text-[12.5px] text-ink-subtle">
            <Link href={routes.about} className="transition-colors hover:text-accent">
              연재 작가
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-ink-muted">{author.name}</span>
          </nav>

          <div className="flex flex-col items-center text-center">
            <Image
              src={assetPath(author.avatar)}
              alt={author.avatarAlt}
              width={200}
              height={200}
              priority
              className="size-20 rounded-full border border-line object-cover sm:size-24"
            />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {author.name}
            </h1>
            <p className="mt-1 text-[12px] tracking-[0.2em] text-ink-subtle">
              {author.nameEn.toUpperCase()}
            </p>
            <p className="mt-3 text-[14px] text-ink-muted sm:text-[15px]">{author.tagline}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <dl className="grid grid-cols-3 gap-3">
          {[
            { label: '작품', value: `${author.series.length}편` },
            { label: '공개 회차', value: `${author.episodeCount}화` },
            { label: '연재 중', value: `${ongoing}편` },
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
          {author.bio.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        {author.links.length > 0 && (
          <section className="mt-8" aria-labelledby="links-heading">
            <h2 id="links-heading" className="mb-3 text-[13px] font-semibold text-ink-subtle">
              연락 · 링크
            </h2>
            <ul className="flex flex-wrap gap-2">
              {author.links.map((link) => (
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
          {author.series.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3">
              {author.series.map((item) => (
                <SeriesCard key={item.slug} series={item} showAuthor={false} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-line bg-surface/40 px-4 py-6 text-center text-[13px] text-ink-subtle">
              아직 공개된 작품이 없습니다.
            </p>
          )}
        </section>

        <p className="mt-12 rounded-xl border border-line bg-surface/40 px-4 py-4 text-[12.5px] leading-relaxed text-ink-subtle">
          {author.name} 작가는 {formatDate(author.joinedAt)}부터 달빛서고에서 연재하고 있습니다.
          작품의 저작권은 작가에게 있으며, 무단 전재와 재배포, 인공지능 학습 데이터로의 사용을
          허락하지 않습니다.
        </p>
      </div>
    </div>
  );
}
