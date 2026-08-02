import type { SeriesStatus } from './types';

export const STATUS_LABEL: Record<SeriesStatus, string> = {
  ongoing: '연재 중',
  completed: '완결',
  hiatus: '휴재',
};

/** 상태 배지 색. 세 테마 모두에서 대비가 확보되도록 CSS 변수 기반 클래스를 쓴다. */
export const STATUS_TONE: Record<SeriesStatus, string> = {
  ongoing: 'bg-accent/15 text-accent border-accent/30',
  completed: 'bg-ink/10 text-ink-muted border-line',
  hiatus: 'bg-ink/5 text-ink-subtle border-line',
};

/** "2026-05-12" → "2026년 5월 12일" */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[1]}년 ${Number(match[2])}월 ${Number(match[3])}일`;
}

/** "2026-05-12" → "26.05.12" (목록에서 폭을 아끼는 짧은 형태) */
export function formatDateShort(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return `${match[1].slice(2)}.${match[2]}.${match[3]}`;
}

/** 한국어 산문 기준 분당 약 550자로 계산 */
export function readingMinutes(charCount: number): number {
  return Math.max(1, Math.round(charCount / 550));
}

export function formatCount(value: number): string {
  return value.toLocaleString('ko-KR');
}
