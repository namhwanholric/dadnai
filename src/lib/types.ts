/** 작품 연재 상태. content/series.ts 에서 이 세 값만 쓸 수 있다. */
export type SeriesStatus = 'ongoing' | 'completed' | 'hiatus';

/** 회차에 붙는 영상 종류. UI 배지 라벨과 1:1로 대응한다. */
export type VideoKind = 'ost' | 'trailer' | 'worldbuilding' | 'animation';

export interface Series {
  /** URL 경로에 쓰이는 식별자. content/episodes/<slug>/ 폴더명과 반드시 일치해야 한다. */
  slug: string;
  title: string;
  /** 한 줄 소개 */
  tagline: string;
  /** 상세 줄거리. 빈 줄로 문단을 나눈다. */
  synopsis: string;
  genre: string;
  tags: string[];
  status: SeriesStatus;
  /** public/ 기준 절대 경로. 세로형(2:3) SVG. */
  cover: string;
  /** 표지 대체 텍스트 (접근성) */
  coverAlt: string;
  /** 표지에서 뽑은 강조색. 상세 페이지 헤더 그라데이션에 쓴다. */
  accent: string;
  /** 홈 상단 대표작 배너에 노출할 작품 (한 편만 true 로 둔다) */
  featured?: boolean;
  startedAt: string;
  updatedAt: string;
}

/** front matter 의 videos 항목. url 은 원문 그대로 보관하고 ID 추출은 렌더링 시점에 한다. */
export interface EpisodeVideo {
  url: string;
  title: string;
  description?: string;
  kind: VideoKind;
}

export interface Episode {
  /** 파일명에서 확장자와 정렬용 번호 접두사를 뺀 값 (URL 경로) */
  slug: string;
  seriesSlug: string;
  /** 파일명 접두사(01-, 02-…)로 정해지는 회차 번호 */
  number: number;
  title: string;
  /** YYYY-MM-DD */
  publishedAt: string;
  summary?: string;
  authorNote?: string;
  videos: EpisodeVideo[];
  /** marked 로 변환된 본문 HTML (빌드 타임 생성) */
  html: string;
  /** 공백 기준 대략적인 글자 수 — 예상 읽기 시간 계산용 */
  charCount: number;
}

/** 목록에서만 쓰는 가벼운 회차 정보 (본문 HTML 제외) */
export type EpisodeSummary = Omit<Episode, 'html'>;

export interface SeriesWithEpisodes extends Series {
  episodes: EpisodeSummary[];
}
