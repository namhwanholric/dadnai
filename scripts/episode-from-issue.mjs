/**
 * GitHub 이슈(새 회차 올리기 폼) → 원고 파일.
 *
 *   node scripts/episode-from-issue.mjs
 *
 * 환경변수로 받는다.
 *   ISSUE_BODY    이슈 본문 (폼이 만들어 준 마크다운)
 *   ISSUE_AUTHOR  이슈를 연 사람의 GitHub 아이디
 *
 * 결과를 GITHUB_OUTPUT 에 적는다. (ok / path / series / title / reason)
 *
 * ── 보안 ──────────────────────────────────────────────
 * 이슈 본문은 **믿을 수 없는 입력**이다. 다음을 지킨다.
 *   - 허용목록(.github/writers.yml)에 없는 사람이면 아무것도 만들지 않는다.
 *   - front matter 는 이 스크립트가 만든다. 본문 값은 전부 따옴표로 감싸 넣는다.
 *     (제출자가 front matter 를 흉내 내도 값으로만 들어간다)
 *   - 파일 경로에 쓰이는 값(작품 slug, 회차 slug)은 정규식으로 검사한다.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const VIDEO_KINDS = new Set(['ost', 'trailer', 'worldbuilding', 'animation']);

/* ── 입력 ──────────────────────────────────────────── */

const issueBody = process.env.ISSUE_BODY ?? '';
const issueAuthor = (process.env.ISSUE_AUTHOR ?? '').trim();

/** 폼 결과 파싱: "### 라벨\n\n값" 묶음 */
function parseForm(body) {
  const fields = new Map();
  const sections = body.split(/^### /m).slice(1);
  for (const section of sections) {
    const newline = section.indexOf('\n');
    if (newline === -1) continue;
    const label = section.slice(0, newline).trim();
    const value = section.slice(newline + 1).trim();
    fields.set(label, value === '_No response_' ? '' : value);
  }
  return fields;
}

/** 승인된 사람 목록. 의존성 없이 읽으려고 형식을 단순하게 유지한다. */
function readWriters() {
  const file = path.join(ROOT, '.github', 'writers.yml');
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'))
    .map((line) => /^\s*-\s*github:\s*([A-Za-z0-9-]+)/.exec(line)?.[1])
    .filter(Boolean);
}

/** content/series.ts 에 실제로 있는 작품 slug */
function readSeriesSlugs() {
  const file = path.join(ROOT, 'content', 'series.ts');
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(/^\s{4}slug: '([a-z0-9-]+)',/gm)].map((m) => m[1]);
}

function fail(reason) {
  output({ ok: 'false', reason });
  console.error(`거절: ${reason}`);
  process.exit(0); // 워크플로를 빨갛게 만들지 않는다. 이슈에 이유를 댓글로 단다.
}

function output(values) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  const lines = Object.entries(values).map(([key, value]) =>
    String(value).includes('\n')
      ? `${key}<<__EOF__\n${value}\n__EOF__`
      : `${key}=${value}`,
  );
  fs.appendFileSync(file, lines.join('\n') + '\n');
}

/* ── 검사 ──────────────────────────────────────────── */

const writers = readWriters();
if (!issueAuthor) fail('제출자를 확인할 수 없습니다.');
if (!writers.includes(issueAuthor)) {
  fail(
    `@${issueAuthor} 님은 아직 승인된 작가가 아닙니다. ` +
      '네이버 카페(cafe.naver.com/dadnai)에서 작가 등급을 신청해 주세요.',
  );
}

const form = parseForm(issueBody);
const seriesField = form.get('어느 작품인가요') ?? '';
const seriesSlug = seriesField.split(' ')[0];
const title = form.get('회차 제목') ?? '';
const slug = (form.get('주소에 쓸 영문 이름') ?? '').toLowerCase();
const summary = form.get('한 줄 요약') ?? '';
const body = form.get('본문') ?? '';
const authorNote = form.get('작가 후기 (선택)') ?? '';
const videoUrl = form.get('유튜브 주소 (선택)') ?? '';
const videoTitle = form.get('영상 제목 (선택)') ?? '';
const videoKind = form.get('영상 종류 (선택)') ?? '';

const seriesSlugs = readSeriesSlugs();
if (!seriesSlugs.includes(seriesSlug)) {
  fail(
    seriesField.startsWith('새 작품')
      ? '새 작품은 서고지기가 먼저 작품 정보를 만들어야 합니다. 이 이슈에 소개를 남겨 주시면 등록해 드리겠습니다.'
      : `작품 "${seriesField}" 를 찾을 수 없습니다.`,
  );
}
if (!SLUG_RE.test(slug)) fail(`주소에 쓸 영문 이름 "${slug}" 은 소문자·숫자·하이픈만 쓸 수 있습니다.`);
if (!title.trim()) fail('회차 제목이 비어 있습니다.');
if (body.trim().length < 200) fail('본문이 너무 짧습니다. (200자 이상)');

const dir = path.join(ROOT, 'content', 'episodes', seriesSlug);
const existing = fs.existsSync(dir)
  ? fs.readdirSync(dir).filter((file) => file.toLowerCase().endsWith('.md'))
  : [];

if (existing.some((file) => file.replace(/^\d+-/, '').replace(/\.md$/, '') === slug)) {
  fail(`이미 "${slug}" 회차가 있습니다. 다른 영문 이름을 써 주세요.`);
}

const nextNumber = existing.reduce((max, file) => {
  const n = Number.parseInt(file.slice(0, file.indexOf('-')), 10);
  return Number.isNaN(n) ? max : Math.max(max, n);
}, 0) + 1;

/* ── 파일 만들기 ────────────────────────────────────── */

/** YAML 한 줄 값. 따옴표로 감싸 어떤 내용이 와도 값으로만 읽히게 한다. */
const quote = (value) => JSON.stringify(String(value).replace(/\r/g, '').trim());

/** YAML 블록 스칼라. 모든 줄을 두 칸 들여쓴다. */
const block = (value) =>
  String(value)
    .replace(/\r/g, '')
    .trim()
    .split('\n')
    .map((line) => `  ${line}`.trimEnd())
    .join('\n');

const today = new Date().toISOString().slice(0, 10);

const front = [
  '---',
  `title: ${quote(title)}`,
  `publishedAt: ${today}`,
  `summary: ${quote(summary)}`,
];

if (authorNote.trim()) front.push('authorNote: |', block(authorNote));

if (videoUrl.trim()) {
  front.push('videos:');
  front.push(`  - url: ${quote(videoUrl)}`);
  front.push(`    title: ${quote(videoTitle || '영상')}`);
  front.push(`    kind: ${VIDEO_KINDS.has(videoKind) ? videoKind : 'ost'}`);
}

front.push('---', '');

const fileName = `${String(nextNumber).padStart(2, '0')}-${slug}.md`;
const filePath = path.join(dir, fileName);

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, front.join('\n') + body.replace(/\r/g, '').trim() + '\n', 'utf8');

const relative = path.relative(ROOT, filePath).split(path.sep).join('/');
console.log(`만들었습니다: ${relative}`);

output({
  ok: 'true',
  path: relative,
  series: seriesSlug,
  slug,
  number: String(nextNumber),
  title,
});
