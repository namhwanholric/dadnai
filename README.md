# 달빛서고 (MOONLIT SHELF)

> **이 저장소에는 사이트가 두 개 있습니다.**
>
> | 사이트 | 폴더 | 주소 |
> | --- | --- | --- |
> | 달빛서고 (웹소설) — 이 문서 | 저장소 루트 | https://namhwanholric.github.io/dadnai/ |
> | 아빠표 AI 학습법 | [`ai-study/`](ai-study/) | https://namhwanholric.github.io/dadnai/ai-study/ |
>
> `ai-study/`는 빌드 도구 없는 순수 HTML 사이트입니다. 규칙이 다르니 그 폴더를 고칠 때는
> [`ai-study/CLAUDE.md`](ai-study/CLAUDE.md)를 먼저 보세요.

한 명의 작가가 자기 작품만 연재하는 **개인 웹소설 사이트**입니다.
서버도 데이터베이스도 없이, 마크다운 원고를 정적 HTML로 빌드해서 GitHub Pages 같은 정적 호스팅에 올립니다.

- 원고 = 마크다운 파일 한 개 = 회차 한 개
- 회차마다 YouTube 영상(OST·예고편·세계관·애니메이션)을 붙일 수 있음
- 읽기 화면: 3가지 테마 / 서체 · 글자 크기 · 줄간격 · 본문 폭 조절 / 읽던 위치 자동 복귀
- 좋아요 · 읽은 회차 · 읽기 설정은 **브라우저에만** 저장 (서버 전송 없음)

기술 스택: Next.js 15 (App Router, `output: 'export'`) · React 19 · TypeScript · Tailwind CSS v4

---

## 로컬에서 실행하기

Node.js 20 이상이 필요합니다. (개발에 쓴 버전: Node 24 / npm 11)

```bash
npm install
```

```bash
npm run dev
```

`http://localhost:3000` 에서 열립니다.

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 (원고를 고치면 즉시 반영) |
| `npm run typecheck` | 타입 검사만 |
| `npm run build` | 정적 사이트를 `out/` 폴더로 빌드 (+ `ai-study/`를 `out/ai-study/`로 복사) |
| `npm run serve` | 빌드 결과(`out/`)를 4173 포트로 띄워서 확인 |

> **알아두기 —** 개발 서버(`npm run dev`)에서 `/browse` 페이지의 필터 영역이 회색 상자로 멈춰 보일 수 있습니다.
> `output: 'export'` 설정과 `useSearchParams`가 겹칠 때 개발 모드에서만 생기는 현상이고,
> `npm run build` 결과물에서는 정상적으로 나옵니다. 확인하려면 `npm run build && npm run serve` 를 쓰세요.

---

## 폴더 구조

```
ai-study/                     아빠표 AI 학습법 사이트 (순수 HTML, 빌드 안 함)
scripts/
  copy-ai-study.mjs           위 폴더를 out/ai-study/ 로 복사
content/
  site.ts                     사이트명 · 작가 프로필 · 내비게이션
  series.ts                   작품 목록과 메타데이터
  episodes/<작품slug>/         회차 원고 (NN-slug.md)
public/
  covers/<작품slug>.svg        표지 (세로 2:3)
  favicon.svg, .nojekyll
src/
  app/                        페이지 (홈 · 둘러보기 · 내 서재 · 작가 · 작품 · 읽기)
  components/                 UI 컴포넌트
  lib/                        원고 로더 · YouTube 파서 · 저장소 · 포맷 유틸
```

---

## 회차 추가하는 법

1. `content/episodes/<작품slug>/` 폴더에 `NN-영문slug.md` 파일을 만듭니다.
   - 앞의 `NN`이 **회차 번호**, 뒤의 `영문slug`가 **URL 주소**가 됩니다.
   - 예: `content/episodes/gray-bell-tower/06-first-snow.md` → `/series/gray-bell-tower/first-snow/`
2. 파일 맨 위에 front matter를 씁니다.

```markdown
---
title: 6화 · 첫눈
publishedAt: 2026-08-11
summary: 목록과 홈에 노출되는 한 줄 요약입니다.
authorNote: |
  작가 후기입니다. 여러 문단을 쓸 수 있습니다.

  빈 줄로 문단을 나눕니다.
videos:
  - url: https://www.youtube.com/watch?v=VIDEO_ID
    title: 메인 테마 「첫눈」
    description: 영상 아래에 붙는 설명입니다. 생략해도 됩니다.
    kind: ost      # ost / trailer / worldbuilding / animation
---

본문을 여기서부터 씁니다.

*기울임은 인물의 속마음에 씁니다.*

---

`---` 한 줄은 장면 전환(· · ·)으로 표시됩니다.
```

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `title` | O | 회차 제목 |
| `publishedAt` | O | `YYYY-MM-DD` |
| `summary` | | 목록에 뜨는 한 줄 요약 |
| `authorNote` | | 본문 아래 작가 후기 |
| `videos` | | YouTube 영상 목록 (없으면 영역 자체가 안 뜸) |

3. 작품의 `updatedAt`을 `content/series.ts`에서 새 회차 날짜로 고칩니다.
4. `npm run build`로 확인합니다. (파일만 추가하면 목록·이웃 회차·읽기 시간은 자동 계산됩니다)

### 본문에서 쓸 수 있는 표기

| 쓰면 | 나오는 것 |
| --- | --- |
| `---` (빈 줄 사이) | 장면 전환 구분선 `· · ·` |
| `*문장*` | 기울임 (속마음) |
| `> 문장` | 인용 — 편지·계약서 조항 등 |
| ` ```…``` ` | 고정폭 상자 — 영수증·쪽지 등 인쇄물. 글자가 넘치면 상자 안에서만 가로로 스크롤됩니다 |
| `~~문장~~` | 취소선 |

### 작품 추가하는 법

1. `content/series.ts`에 항목을 하나 추가 (`slug`은 영문 소문자와 하이픈만)
2. `public/covers/<slug>.svg` 표지 추가 (세로 2:3)
3. `content/episodes/<slug>/01-....md` 부터 회차 작성

### 영상 주소

`youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`, `m.youtube.com` 형태를 모두 인식합니다.
주소를 인식하지 못하면 **재생기 대신 안내 문구**가 뜨고 본문 읽기에는 아무 영향이 없습니다.

영상은 **재생 버튼을 누르기 전까지 iframe을 만들지 않습니다.** 그전까지 YouTube로 나가는 요청은 0건이고,
임베드는 `youtube-nocookie.com`으로 합니다.

---

## GitHub Pages에 배포하기

`.github/workflows/deploy.yml`이 이미 들어 있습니다. `main` 브랜치에 푸시하면 자동으로 빌드·배포됩니다.

**⚠️ 최초 1회 설정 — 이걸 안 하면 배포가 안 됩니다**

이 저장소는 원래 `main / (root)` 브랜치 배포였습니다. Next.js 빌드가 필요해졌으므로 방식을 바꿔야 합니다.

**순서대로 하세요.**

1. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꿉니다.
   (이 시점부터 첫 배포가 끝날 때까지 몇 분간 사이트가 안 열립니다)
2. `main`에 푸시합니다. Actions 탭에서 빌드가 돌고, 1~2분 뒤 새 사이트가 열립니다.

설정을 안 바꾸고 푸시만 하면 배포 단계에서 실패합니다. (`Get Pages site failed`)
그때는 설정을 바꾼 뒤 Actions 탭에서 **Re-run jobs**를 누르면 됩니다.

**basePath에 대해**

프로젝트 페이지(`github.io/<저장소이름>/`)에 올리면 CSS·JS 경로 앞에 저장소 이름이 붙어야 합니다.
워크플로가 빌드할 때 `NEXT_PUBLIC_BASE_PATH=/<저장소이름>` 를 자동으로 넣어 줍니다.

- 사용자 페이지(`<사용자명>.github.io`)나 커스텀 도메인을 쓴다면 워크플로의 `NEXT_PUBLIC_BASE_PATH` 줄을 지우세요.
- Jekyll이 `_next` 폴더를 무시하지 않도록 `public/.nojekyll`을 넣어 두었습니다. 지우지 마세요.

**다른 곳에 올릴 때**

`npm run build` 결과인 `out/` 폴더를 통째로 올리면 됩니다. Netlify · Vercel · Cloudflare Pages · 웹호스팅 어디든 동작합니다.
이 경우 `NEXT_PUBLIC_BASE_PATH`는 필요 없습니다.

---

## 이 사이트가 못 하는 것

정적 사이트라서 생기는 한계입니다. 알고 쓰는 편이 낫습니다.

- **좋아요 수가 합산되지 않습니다.** 좋아요·읽은 회차·읽기 설정은 각자 브라우저의 localStorage에만 남습니다.
  브라우저를 바꾸거나 기록을 지우면 사라지고, 작가도 그 수를 알 수 없습니다.
- **댓글이 없습니다.**
- **조회수·통계가 없습니다.**
- **웹에서 글을 쓸 수 없습니다.** 원고는 마크다운 파일로 커밋해야 합니다.
- **검색이 없습니다.** 지금은 장르·태그 필터만 있습니다.

### 나중에 붙이고 싶다면

| 하고 싶은 것 | 방법 |
| --- | --- |
| 댓글 | [giscus](https://giscus.app) — GitHub Discussions를 댓글로 씁니다. 정적 사이트에 스크립트 한 줄로 붙습니다 |
| 좋아요 수 합산 | 정적 사이트로는 불가능합니다. Supabase·Firebase 같은 외부 저장소나 서버가 필요합니다 |
| 검색 | 빌드할 때 회차 색인 JSON을 만들어 두고 클라이언트에서 찾는 방식이 가볍습니다 |
| 웹에서 원고 작성 | GitHub의 웹 편집기로 마크다운을 직접 고치는 방법이 제일 간단합니다. 별도 관리자 화면을 만들려면 서버가 필요합니다 |
| RSS | 빌드 스크립트에서 `out/rss.xml`을 같이 생성하면 됩니다 |

---

## 저작권

작품 원고와 표지는 예시로 작성된 창작물입니다.
회차에 연결된 샘플 영상은 Blender Foundation의 *Big Buck Bunny*(CC-BY)이며, 실제 영상으로 교체할 자리입니다.
