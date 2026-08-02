/**
 * 새 회차 파일 만들기.
 *
 *   npm run new
 *
 * 질문에 답하면 content/episodes/<작품>/NN-slug.md 가 생긴다.
 * 회차 번호는 폴더를 보고 알아서 매긴다. 외부 패키지를 쓰지 않는다.
 *
 * 본문은 나중에 편집기로 채우면 된다. 뼈대만 만들어 주는 도구다.
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'),
  '..',
);

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
const VIDEO_KINDS = ['ost', 'trailer', 'worldbuilding', 'animation'];

const rl = readline.createInterface({ input: stdin, output: stdout });

/** 파이프로 넘어온 입력 앞에 BOM 이 붙는 경우가 있어 떼어낸다. (한글 입력이 깨지는 원인) */
const clean = (value) => value.replace(/^﻿/, '').trim();

async function ask(question, { required = false, defaultValue = '' } = {}) {
  for (;;) {
    const hint = defaultValue ? ` (${defaultValue})` : '';
    const answer = clean(await rl.question(`${question}${hint}: `));
    if (answer) return answer;
    if (defaultValue) return defaultValue;
    if (!required) return '';
    console.log('  → 꼭 필요한 항목입니다.');
  }
}

async function askChoice(question, choices) {
  console.log(`\n${question}`);
  choices.forEach((choice, index) => console.log(`  ${index + 1}) ${choice.label}`));
  for (;;) {
    const answer = clean(await rl.question('번호: '));
    const index = Number.parseInt(answer, 10) - 1;
    if (choices[index]) return choices[index].value;
    const byName = choices.find((choice) => choice.value === answer);
    if (byName) return byName.value;
    console.log('  → 목록에 있는 번호를 골라 주세요.');
  }
}

/** content/series.ts 에서 작품 목록을 읽는다. */
function readSeries() {
  const source = fs.readFileSync(path.join(ROOT, 'content', 'series.ts'), 'utf8');
  const slugs = [...source.matchAll(/^\s{4}slug: '([a-z0-9-]+)',/gm)].map((m) => m[1]);
  const titles = [...source.matchAll(/^\s{4}title: '([^']+)',/gm)].map((m) => m[1]);
  return slugs.map((slug, index) => ({ value: slug, label: `${titles[index] ?? slug} (${slug})` }));
}

const quote = (value) => JSON.stringify(String(value).trim());

async function main() {
  console.log('\n달빛서고 — 새 회차 만들기\n');

  const seriesSlug = await askChoice('어느 작품인가요?', readSeries());

  const dir = path.join(ROOT, 'content', 'episodes', seriesSlug);
  const existing = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.toLowerCase().endsWith('.md'))
    : [];
  const nextNumber =
    existing.reduce((max, file) => {
      const n = Number.parseInt(file.slice(0, file.indexOf('-')), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0) + 1;

  console.log(`\n지금까지 ${existing.length}화. 이번은 ${nextNumber}화입니다.\n`);

  const titleText = await ask('회차 제목 (화수 빼고)', { required: true });
  const title = `${nextNumber}화 · ${titleText}`;

  let slug = '';
  for (;;) {
    slug = (await ask('주소에 쓸 영문 이름 (예 first-snow)', { required: true })).toLowerCase();
    if (!SLUG_RE.test(slug)) {
      console.log('  → 소문자·숫자·하이픈만 쓸 수 있습니다.');
      continue;
    }
    if (existing.some((file) => file.replace(/^\d+-/, '').replace(/\.md$/, '') === slug)) {
      console.log('  → 이미 같은 이름의 회차가 있습니다.');
      continue;
    }
    break;
  }

  const summary = await ask('한 줄 요약', { required: true });
  const today = new Date().toISOString().slice(0, 10);
  const publishedAt = await ask('공개일', { defaultValue: today });
  const authorNote = await ask('작가 후기 (없으면 그냥 엔터)');
  const videoUrl = await ask('유튜브 주소 (없으면 그냥 엔터)');

  let videoTitle = '';
  let videoKind = 'ost';
  if (videoUrl) {
    videoTitle = await ask('영상 제목', { required: true });
    videoKind = await askChoice(
      '영상 종류는?',
      VIDEO_KINDS.map((kind) => ({ value: kind, label: kind })),
    );
  }

  const front = [
    '---',
    `title: ${quote(title)}`,
    `publishedAt: ${publishedAt}`,
    `summary: ${quote(summary)}`,
  ];
  if (authorNote) front.push('authorNote: |', `  ${authorNote}`);
  if (videoUrl) {
    front.push('videos:');
    front.push(`  - url: ${quote(videoUrl)}`);
    front.push(`    title: ${quote(videoTitle)}`);
    front.push(`    kind: ${videoKind}`);
  }
  front.push('---', '');

  const skeleton = [
    '여기서부터 본문을 씁니다.',
    '',
    '문단은 빈 줄로 나눕니다.',
    '',
    '---',
    '',
    '위처럼 줄 하나에 --- 만 적으면 장면 전환 구분선이 됩니다.',
    '',
    '*기울임은 인물의 속마음에 씁니다.*',
    '',
  ].join('\n');

  const fileName = `${String(nextNumber).padStart(2, '0')}-${slug}.md`;
  const filePath = path.join(dir, fileName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, front.join('\n') + skeleton, 'utf8');

  const relative = path.relative(ROOT, filePath).split(path.sep).join('/');
  console.log(`\n만들었습니다 → ${relative}`);
  console.log('이 파일을 열어 본문을 채운 뒤 다음을 실행하세요.\n');
  console.log('  npm run dev      (브라우저에서 확인)');
  console.log(`  git add "${relative}" && git commit -m "${seriesSlug} ${nextNumber}화 추가" && git push\n`);
}

main()
  .catch((error) => {
    console.error(`\n오류: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
