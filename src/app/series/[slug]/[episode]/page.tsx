import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ReaderShell } from '@/components/reader/ReaderShell';
import {
  getAllSeries,
  getEpisode,
  getEpisodeNeighbors,
  getEpisodeSummaries,
  getEpisodes,
  getSeries,
} from '@/lib/content';

interface PageProps {
  params: Promise<{ slug: string; episode: string }>;
}

/** 모든 작품 × 모든 회차 조합을 빌드 타임에 정적 HTML 로 만든다. */
export function generateStaticParams() {
  return getAllSeries().flatMap((series) =>
    getEpisodes(series.slug).map((episode) => ({
      slug: series.slug,
      episode: episode.slug,
    })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, episode: episodeSlug } = await params;
  const series = getSeries(slug);
  const episode = getEpisode(slug, episodeSlug);
  if (!series || !episode) return { title: '회차를 찾을 수 없습니다' };

  return {
    title: `${episode.title} — ${series.title}`,
    description: episode.summary ?? series.tagline,
  };
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug, episode: episodeSlug } = await params;
  const series = getSeries(slug);
  const episode = getEpisode(slug, episodeSlug);
  if (!series || !episode) notFound();

  const { html, ...meta } = episode;
  const { prev, next } = getEpisodeNeighbors(slug, episodeSlug);

  return (
    <ReaderShell
      series={series}
      episode={meta}
      episodes={getEpisodeSummaries(slug)}
      prev={prev}
      next={next}
    >
      {/*
        본문은 저장소 안의 Markdown 파일에서만 온다. 사용자 입력이 아니라
        작가가 커밋한 원고이며, 빌드 타임에 한 번 HTML 로 변환해 정적으로 출력한다.
      */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ReaderShell>
  );
}
