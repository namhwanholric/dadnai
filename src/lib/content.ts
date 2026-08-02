import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

import { SERIES } from '@content/series';
import type { Episode, EpisodeSummary, EpisodeVideo, Series, SeriesWithEpisodes } from './types';
import { normalizeVideoKind } from './youtube';

/**
 * 이 파일은 빌드 타임(서버 컴포넌트)에서만 실행된다.
 * content/episodes/<series-slug>/NN-<episode-slug>.md 를 읽어 정적 HTML로 변환한다.
 * 브라우저 번들에는 포함되지 않으므로 원고 원문이 클라이언트로 넘어가지 않는다.
 */

const EPISODES_DIR = path.join(process.cwd(), 'content', 'episodes');

marked.setOptions({
  gfm: true,
  breaks: false, // 웹소설 원고는 빈 줄로 문단을 나눈다. 한 줄 개행을 <br>로 바꾸지 않는다.
});

/** "01-first-night.md" → { number: 1, slug: "first-night" } */
function parseFileName(fileName: string): { number: number; slug: string } | null {
  const base = fileName.replace(/\.md$/i, '');
  const match = /^(\d+)-(.+)$/.exec(base);
  if (!match) return null;
  return { number: Number.parseInt(match[1], 10), slug: match[2] };
}

function parseVideos(raw: unknown): EpisodeVideo[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      url: typeof item.url === 'string' ? item.url : '',
      title: typeof item.title === 'string' ? item.title : '제목 없는 영상',
      description: typeof item.description === 'string' ? item.description : undefined,
      kind: normalizeVideoKind(item.kind),
    }))
    // url 이 비어 있는 항목은 데이터 실수이므로 목록에서 제외한다.
    // (형식이 틀린 url 은 남겨둔다 — 화면에서 "확인할 수 없는 주소"로 안내한다.)
    .filter((video) => video.url.length > 0);
}

/** front matter 의 date 값은 gray-matter 가 Date 객체로 바꿔놓기도 한다. 항상 YYYY-MM-DD 문자열로 통일. */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value.trim().slice(0, 10);
  return '';
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, '');
}

function readEpisodeFile(seriesSlug: string, fileName: string): Episode | null {
  const parsed = parseFileName(fileName);
  if (!parsed) return null;

  const fullPath = path.join(EPISODES_DIR, seriesSlug, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  const html = marked.parse(content, { async: false }) as string;

  return {
    slug: parsed.slug,
    seriesSlug,
    number: parsed.number,
    title: typeof data.title === 'string' ? data.title : `${parsed.number}화`,
    publishedAt: toDateString(data.publishedAt),
    summary: typeof data.summary === 'string' ? data.summary : undefined,
    authorNote: typeof data.authorNote === 'string' ? data.authorNote.trim() : undefined,
    videos: parseVideos(data.videos),
    html,
    charCount: stripHtml(html).length,
  };
}

/** 캐시: 같은 빌드 안에서 여러 페이지가 같은 작품을 요청하므로 파일 읽기를 한 번만 한다. */
const episodeCache = new Map<string, Episode[]>();

export function getEpisodes(seriesSlug: string): Episode[] {
  const cached = episodeCache.get(seriesSlug);
  if (cached) return cached;

  const dir = path.join(EPISODES_DIR, seriesSlug);
  if (!fs.existsSync(dir)) {
    episodeCache.set(seriesSlug, []);
    return [];
  }

  const episodes = fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith('.md'))
    .map((file) => readEpisodeFile(seriesSlug, file))
    .filter((episode): episode is Episode => episode !== null)
    .sort((a, b) => a.number - b.number);

  episodeCache.set(seriesSlug, episodes);
  return episodes;
}

export function getEpisodeSummaries(seriesSlug: string): EpisodeSummary[] {
  return getEpisodes(seriesSlug).map(({ html: _html, ...rest }) => rest);
}

export function getEpisode(seriesSlug: string, episodeSlug: string): Episode | undefined {
  return getEpisodes(seriesSlug).find((episode) => episode.slug === episodeSlug);
}

/** 이전/다음 회차. 없으면 null. */
export function getEpisodeNeighbors(seriesSlug: string, episodeSlug: string) {
  const episodes = getEpisodes(seriesSlug);
  const index = episodes.findIndex((episode) => episode.slug === episodeSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? toSummary(episodes[index - 1]) : null,
    next: index < episodes.length - 1 ? toSummary(episodes[index + 1]) : null,
  };
}

function toSummary({ html: _html, ...rest }: Episode): EpisodeSummary {
  return rest;
}

export function getAllSeries(): Series[] {
  return SERIES;
}

export function getSeries(slug: string): Series | undefined {
  return SERIES.find((series) => series.slug === slug);
}

export function getSeriesWithEpisodes(slug: string): SeriesWithEpisodes | undefined {
  const series = getSeries(slug);
  if (!series) return undefined;
  return { ...series, episodes: getEpisodeSummaries(slug) };
}

export function getAllSeriesWithEpisodes(): SeriesWithEpisodes[] {
  return SERIES.map((series) => ({ ...series, episodes: getEpisodeSummaries(series.slug) }));
}

export function getFeaturedSeries(): SeriesWithEpisodes {
  const all = getAllSeriesWithEpisodes();
  return all.find((series) => series.featured) ?? all[0];
}

/** 최근 공개된 회차 — 홈의 "최근 업데이트" 영역용 */
export function getRecentEpisodes(limit = 6) {
  return getAllSeriesWithEpisodes()
    .flatMap((series) => series.episodes.map((episode) => ({ series, episode })))
    .sort((a, b) => {
      const byDate = b.episode.publishedAt.localeCompare(a.episode.publishedAt);
      return byDate !== 0 ? byDate : b.episode.number - a.episode.number;
    })
    .slice(0, limit);
}

/** 장르 · 태그 모음 (둘러보기 필터용) */
export function getGenreIndex() {
  const all = getAllSeriesWithEpisodes();
  const genres = new Map<string, number>();
  const tags = new Map<string, number>();
  for (const series of all) {
    genres.set(series.genre, (genres.get(series.genre) ?? 0) + 1);
    for (const tag of series.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }
  const sort = (map: Map<string, number>) =>
    [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ko'));
  return { genres: sort(genres), tags: sort(tags) };
}
