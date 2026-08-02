import type { VideoKind } from './types';

/**
 * YouTube 영상 ID는 11자, [A-Za-z0-9_-] 로만 이뤄진다.
 * 이 검사를 통과한 값만 임베드 URL에 넣기 때문에 임의의 문자열이 iframe src 로 흘러들 수 없다.
 */
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** 이 호스트에서 온 주소만 처리한다. 그 외에는 전부 null. */
const ALLOWED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
  'www.youtu.be',
]);

/** /shorts/ID, /embed/ID, /live/ID, /v/ID 처럼 "경로 첫 조각 + ID" 형태 */
const PATH_PREFIXES = new Set(['shorts', 'embed', 'live', 'v', 'e']);

/**
 * 사용자가 붙여넣은 YouTube 주소에서 영상 ID만 안전하게 뽑아낸다.
 * iframe 코드 전체는 입력받지 않으며, 형식이 맞지 않으면 예외 대신 null 을 돌려준다.
 *
 * 지원 형태:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/shorts/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/live/ID
 *   프로토콜이 없는 youtu.be/ID 같은 축약형
 */
export function extractYouTubeId(rawUrl: string): string | null {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // 프로토콜이 없으면 붙여준다. (youtu.be/xxxx 처럼 복사되는 경우가 흔하다)
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = url.pathname.split('/').filter(Boolean);

  // 1) youtu.be/ID
  if (url.hostname.toLowerCase().endsWith('youtu.be')) {
    return validate(segments[0]);
  }

  // 2) /watch?v=ID
  if (segments[0] === 'watch') {
    return validate(url.searchParams.get('v'));
  }

  // 3) /shorts/ID · /embed/ID · /live/ID · /v/ID
  if (segments.length >= 2 && PATH_PREFIXES.has(segments[0])) {
    return validate(segments[1]);
  }

  // 4) 그 외에도 ?v= 가 붙어 있으면 인정한다.
  return validate(url.searchParams.get('v'));
}

function validate(value: string | null | undefined): string | null {
  if (!value) return null;
  return VIDEO_ID_PATTERN.test(value) ? value : null;
}

/**
 * 임베드 주소. youtube-nocookie.com(개인정보 보호 강화 모드)을 사용하고
 * 관련 동영상을 같은 채널로 제한한다. autoplay 는 사용자가 재생을 누른 뒤에만 붙인다.
 */
export function buildEmbedUrl(videoId: string, options?: { autoplay?: boolean }): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (options?.autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

/** 새 탭에서 열기용 원본 주소 (임베드가 막힌 영상 대비) */
export function buildWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export const VIDEO_KIND_LABEL: Record<VideoKind, string> = {
  ost: 'OST',
  trailer: '트레일러',
  worldbuilding: '세계관 영상',
  animation: '애니메이션',
};

/** front matter 에서 온 값이 VideoKind 인지 확인. 아니면 기본값 ost. */
export function normalizeVideoKind(value: unknown): VideoKind {
  return value === 'ost' || value === 'trailer' || value === 'worldbuilding' || value === 'animation'
    ? value
    : 'ost';
}
