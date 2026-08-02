/**
 * ai-study/ (아빠표 AI 학습법, 순수 HTML 사이트)를 빌드 결과에 그대로 얹는다.
 *
 *   out/ai-study/...  →  https://<사용자>.github.io/dadnai/ai-study/
 *
 * Next.js는 이 폴더를 건드리지 않는다. `npm run build`가 next build 뒤에 이 스크립트를
 * 실행하므로, 로컬 빌드와 GitHub Actions 배포 결과가 항상 같다.
 *
 * 저장소에만 두고 웹에는 올리지 않을 파일은 SKIP 에 적는다.
 */
import { cp, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'ai-study');
const dest = path.join(root, 'out', 'ai-study');

/** 웹에 올리지 않을 파일 (작업용 문서) */
const SKIP = new Set(['CLAUDE.md', 'README.md']);

try {
  await access(src);
} catch {
  console.error('[copy-ai-study] ai-study 폴더가 없습니다. 건너뜁니다.');
  process.exit(0);
}

await cp(src, dest, {
  recursive: true,
  filter: (source) => !SKIP.has(path.basename(source)),
});

console.log(`[copy-ai-study] ai-study → out/ai-study 복사 완료`);
