/**
 * 회차 내리기 / 되살리기 — 서고지기 전용.
 *
 *   node scripts/takedown.mjs --series <작품slug> --episode <회차slug> --mode hide
 *   node scripts/takedown.mjs --series <작품slug> --episode <회차slug> --mode show
 *   node scripts/takedown.mjs --series <작품slug> --episode <회차slug> --mode delete
 *   node scripts/takedown.mjs --list
 *
 * mode
 *   hide    front matter 에 hidden: true 를 넣는다. 사이트에서 사라지고 파일은 남는다. **되돌릴 수 있다.**
 *   show    hidden 을 지운다. 다시 공개된다.
 *   delete  파일을 지운다. git 기록에는 남지만 작업 폴더에서는 없어진다.
 *
 * 기본은 hide 다. 내려 달라는 요청은 대개 급하고, 판단은 나중에 해도 되기 때문이다.
 * GitHub Actions 의 "회차 내리기" 워크플로가 이 스크립트를 쓴다. (저장소 권한이 있어야 실행된다)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'),
  '..',
);
const EPISODES = path.join(ROOT, 'content', 'episodes');
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

/* ── 인자 ──────────────────────────────────────────── */

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const wantsList = args.includes('--list');
const seriesSlug = (flag('series') ?? '').trim();
const episodeSlug = (flag('episode') ?? '').trim();
const mode = (flag('mode') ?? 'hide').trim();

function die(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

/** 회차 파일 목록 (숨긴 것 포함) */
function listEpisodes(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.toLowerCase().endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      return {
        file,
        slug: file.replace(/^\d+-/, '').replace(/\.md$/, ''),
        title: /^title:\s*"?(.+?)"?\s*$/m.exec(raw)?.[1] ?? file,
        hidden: /^hidden:\s*true\s*$/m.test(raw),
      };
    });
}

/* ── --list ────────────────────────────────────────── */

if (wantsList) {
  const seriesDirs = fs.existsSync(EPISODES)
    ? fs.readdirSync(EPISODES).filter((name) => fs.statSync(path.join(EPISODES, name)).isDirectory())
    : [];
  for (const dir of seriesDirs) {
    console.log(`\n[${dir}]`);
    for (const episode of listEpisodes(path.join(EPISODES, dir))) {
      console.log(`  ${episode.hidden ? '내려짐' : '공개  '}  ${episode.slug.padEnd(24)} ${episode.title}`);
    }
  }
  console.log('');
  process.exit(0);
}

/* ── 검사 ──────────────────────────────────────────── */

if (!['hide', 'show', 'delete'].includes(mode)) die(`mode 는 hide / show / delete 중 하나여야 합니다. (받은 값: ${mode})`);
if (!SLUG_RE.test(seriesSlug)) die(`작품 slug 이 올바르지 않습니다: "${seriesSlug}"`);
if (!SLUG_RE.test(episodeSlug)) die(`회차 slug 이 올바르지 않습니다: "${episodeSlug}"`);

const dir = path.join(EPISODES, seriesSlug);
if (!fs.existsSync(dir)) die(`작품 "${seriesSlug}" 폴더가 없습니다.`);

const target = listEpisodes(dir).find((episode) => episode.slug === episodeSlug);
if (!target) {
  const available = listEpisodes(dir).map((episode) => episode.slug).join(', ');
  die(`"${seriesSlug}" 에 "${episodeSlug}" 회차가 없습니다.\n  있는 회차: ${available || '(없음)'}`);
}

const filePath = path.join(dir, target.file);

/* ── 실행 ──────────────────────────────────────────── */

if (mode === 'delete') {
  fs.unlinkSync(filePath);
  console.log(`\n✓ 삭제했습니다: ${seriesSlug}/${target.file}`);
  console.log(`  ${target.title}`);
  console.log('  git 기록에는 남아 있습니다. 되살리려면 이전 커밋에서 파일을 꺼내면 됩니다.\n');
} else {
  const raw = fs.readFileSync(filePath, 'utf8');
  const end = raw.indexOf('\n---', 3); // 여는 --- 다음의 닫는 ---
  if (!raw.startsWith('---') || end === -1) die(`${target.file} 에서 front matter 를 찾지 못했습니다.`);

  const head = raw.slice(0, end).replace(/\nhidden:\s*(true|false)\s*(?=\n|$)/g, '');
  const rest = raw.slice(end);

  if (mode === 'hide') {
    fs.writeFileSync(filePath, `${head}\nhidden: true${rest}`, 'utf8');
    console.log(`\n✓ 내렸습니다: ${seriesSlug}/${episodeSlug}`);
    console.log(`  ${target.title}`);
    console.log('  사이트에서 사라집니다. 파일은 그대로 있으니 언제든 되살릴 수 있습니다.');
    console.log(`  되살리기: node scripts/takedown.mjs --series ${seriesSlug} --episode ${episodeSlug} --mode show\n`);
  } else {
    fs.writeFileSync(filePath, head + rest, 'utf8');
    console.log(`\n✓ 다시 공개했습니다: ${seriesSlug}/${episodeSlug}`);
    console.log(`  ${target.title}\n`);
  }
}

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `title=${target.title}\nfile=${target.file}\n`,
  );
}
