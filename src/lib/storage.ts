/**
 * localStorage 단일 창구.
 *
 * ⚠️ 이 사이트에는 서버도 데이터베이스도 없습니다.
 * 좋아요 수, 읽은 회차, 이어읽기 위치, 읽기 설정은 전부 **지금 보고 있는 브라우저 안에만**
 * 저장됩니다. 다른 기기·다른 브라우저·시크릿 모드에서는 보이지 않고, 브라우저 저장소를
 * 비우면 사라집니다. 여러 독자의 좋아요가 합산되는 서비스 기능이 아닙니다.
 *
 * localStorage 접근은 시크릿 모드나 저장공간 초과 시 예외를 던질 수 있으므로
 * 모든 호출을 여기서 try/catch 로 감싼다.
 */

const PREFIX = 'dalbit:';

export const STORAGE_KEYS = {
  readingSettings: `${PREFIX}reading-settings`,
  progress: `${PREFIX}progress`,
  likes: `${PREFIX}likes`,
} as const;

/** 저장 내용이 바뀌면 같은 탭의 다른 컴포넌트에도 알린다. (storage 이벤트는 다른 탭에서만 발생) */
export const STORAGE_EVENT = 'dalbit:storage';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
  } catch {
    // 저장 실패(시크릿 모드/용량 초과)는 조용히 무시한다. 읽기 자체는 계속 가능해야 한다.
  }
}

export function clearAll(): void {
  if (!isBrowser()) return;
  try {
    for (const key of Object.values(STORAGE_KEYS)) window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key: 'all' } }));
  } catch {
    /* noop */
  }
}

/* ------------------------------------------------------------------ */
/* 읽기 설정                                                            */
/* ------------------------------------------------------------------ */

export type ReadingTheme = 'light' | 'sepia' | 'dark';
export type ReadingFont = 'sans' | 'serif';

export interface ReadingSettings {
  theme: ReadingTheme;
  /** px */
  fontSize: number;
  /** 배수 */
  lineHeight: number;
  /** 본문 폭 (ch 단위 기준값) */
  measure: number;
  font: ReadingFont;
}

export const DEFAULT_READING_SETTINGS: ReadingSettings = {
  theme: 'dark',
  fontSize: 18,
  lineHeight: 1.9,
  measure: 40,
  font: 'sans',
};

export const READING_LIMITS = {
  fontSize: { min: 15, max: 26, step: 1 },
  lineHeight: { min: 1.5, max: 2.4, step: 0.1 },
  measure: { min: 32, max: 52, step: 4 },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSettings(raw: Partial<ReadingSettings> | null): ReadingSettings {
  const base = { ...DEFAULT_READING_SETTINGS, ...(raw ?? {}) };
  return {
    theme: base.theme === 'light' || base.theme === 'sepia' || base.theme === 'dark' ? base.theme : 'dark',
    font: base.font === 'serif' ? 'serif' : 'sans',
    fontSize: clamp(Number(base.fontSize) || DEFAULT_READING_SETTINGS.fontSize, READING_LIMITS.fontSize.min, READING_LIMITS.fontSize.max),
    lineHeight: clamp(Number(base.lineHeight) || DEFAULT_READING_SETTINGS.lineHeight, READING_LIMITS.lineHeight.min, READING_LIMITS.lineHeight.max),
    measure: clamp(Number(base.measure) || DEFAULT_READING_SETTINGS.measure, READING_LIMITS.measure.min, READING_LIMITS.measure.max),
  };
}

export function loadSettings(): ReadingSettings {
  return normalizeSettings(readJSON<Partial<ReadingSettings>>(STORAGE_KEYS.readingSettings, {}));
}

export function saveSettings(settings: ReadingSettings): void {
  writeJSON(STORAGE_KEYS.readingSettings, settings);
}

/* ------------------------------------------------------------------ */
/* 읽기 진행 상황                                                        */
/* ------------------------------------------------------------------ */

export interface EpisodeProgress {
  /** 0~1. 문서 높이 대비 비율로 저장해 글자 크기를 바꿔도 위치가 유지된다. */
  ratio: number;
  /** 90% 이상 읽으면 완독 처리 */
  completed: boolean;
  updatedAt: number;
}

export interface SeriesProgress {
  /** episodeSlug → 진행 상황 */
  episodes: Record<string, EpisodeProgress>;
  /** 마지막으로 읽던 회차 (이어 읽기) */
  lastEpisode?: string;
  lastReadAt?: number;
}

export type ProgressStore = Record<string, SeriesProgress>;

export function loadProgress(): ProgressStore {
  return readJSON<ProgressStore>(STORAGE_KEYS.progress, {});
}

export function saveEpisodeProgress(
  seriesSlug: string,
  episodeSlug: string,
  ratio: number,
): void {
  const store = loadProgress();
  const series: SeriesProgress = store[seriesSlug] ?? { episodes: {} };
  const previous = series.episodes[episodeSlug];
  const safeRatio = clamp(Number.isFinite(ratio) ? ratio : 0, 0, 1);

  series.episodes[episodeSlug] = {
    ratio: safeRatio,
    // 한 번 완독으로 표시된 회차는 다시 위로 스크롤해도 읽음 표시를 유지한다.
    completed: (previous?.completed ?? false) || safeRatio >= 0.9,
    updatedAt: Date.now(),
  };
  series.lastEpisode = episodeSlug;
  series.lastReadAt = Date.now();
  store[seriesSlug] = series;
  writeJSON(STORAGE_KEYS.progress, store);
}

/* ------------------------------------------------------------------ */
/* 좋아요 (이 브라우저 전용)                                             */
/* ------------------------------------------------------------------ */

/** `${seriesSlug}/${episodeSlug}` → true */
export type LikeStore = Record<string, boolean>;

export function likeKey(seriesSlug: string, episodeSlug: string): string {
  return `${seriesSlug}/${episodeSlug}`;
}

export function loadLikes(): LikeStore {
  return readJSON<LikeStore>(STORAGE_KEYS.likes, {});
}

export function toggleLike(seriesSlug: string, episodeSlug: string): boolean {
  const store = loadLikes();
  const key = likeKey(seriesSlug, episodeSlug);
  const next = !store[key];
  if (next) store[key] = true;
  else delete store[key];
  writeJSON(STORAGE_KEYS.likes, store);
  return next;
}
