# PROJECT_PLAN — 달빛서고 (개인 웹소설 연재 사이트)

한 명의 작가가 자신의 작품만 연재하는 개인 웹소설 사이트. 서버·DB·회원가입 없이
GitHub Pages에 배포되는 완전 정적 사이트로 만든다.

---

## 1. 요구사항 분석

### 만들어야 하는 것

| 영역 | 핵심 요구 |
| --- | --- |
| 홈 | 로고/작가명, 대표작 배너, 최근 업데이트, 연재중/완결, 장르·태그, 작가 소개, 모바일 탐색 |
| 작품 상세 | 표지·제목·한줄소개·줄거리·장르·태그·연재상태·총 회차, 첫화/이어읽기/최신화, 회차 목록(공개일·읽음 표시) |
| 읽기 | 본문, 이전/다음, 회차 목록, 진행률, 위치 자동저장, 글자크기·줄간격·본문폭, 밝은/세피아/어두운, 작가 후기, 좋아요, 공유 |
| 영상 | 회차별 YouTube(OST/트레일러/세계관/애니메이션), 안전한 ID 추출, 접기·펼치기, 반응형, 자동재생 금지, 오류 내성 |
| 배포 | Next.js + TS + Tailwind, 정적 export, GitHub Pages |

### 설계에 영향을 준 제약

1. **서버가 없다** → 좋아요·읽음·이어읽기·읽기설정은 전부 `localStorage`. 브라우저 로컬
   데이터임을 UI에서 명시해 "서비스 기능"으로 오해되지 않게 한다.
2. **정적 export** → 모든 동적 라우트에 `generateStaticParams`, 이미지 최적화 비활성,
   `trailingSlash: true`(GitHub Pages는 디렉터리 인덱스 방식), `basePath` 환경변수화.
3. **본문은 Markdown** → 빌드 타임에 파일시스템에서 읽어 HTML로 변환. 런타임 fetch 없음.
4. **긴 글을 오래 읽는다** → 장식보다 가독성. 카드/그림자/애니메이션 최소화.

---

## 2. 기술 선택과 근거

| 항목 | 선택 | 이유 |
| --- | --- | --- |
| 프레임워크 | Next.js 15 App Router + `output: "export"` | 요구 조건. 서버 컴포넌트에서 빌드 타임에 Markdown을 읽고 정적 HTML을 뽑아낸다 |
| 언어 | TypeScript (strict) | 작품/회차/영상 데이터 스키마를 타입으로 강제 |
| 스타일 | Tailwind CSS v4 | `@theme`로 CSS 변수 기반 3테마(밝은/세피아/어두운)를 한 곳에서 관리 |
| 작품 메타 | `content/series.ts` (TypeScript) | JSON보다 타입 안전. 오타·잘못된 상태값을 빌드 시점에 잡는다 |
| 회차 본문 | `content/episodes/<slug>/*.md` + YAML front matter | 회차 제목/공개일/작가후기/영상 목록을 본문과 같은 파일에서 관리 |
| MD 파싱 | `gray-matter` + `marked` | 가볍고 빌드 타임에만 동작. 런타임 번들에 포함되지 않음 |
| 표지 | 로컬 SVG (`public/covers/*.svg`) | 직접 제작한 추상 그래픽. 저작권 이슈 없음, 용량 작고 어떤 해상도에서도 선명 |
| 폰트 | 시스템 스택 + CDN(Pretendard / Noto Serif KR) 점진적 향상 | 폰트 CDN이 죽어도 **빌드와 렌더링이 절대 실패하지 않는다** |
| 상태 저장 | `localStorage` (`src/lib/storage.ts`에 단일 창구) | 키 관리·JSON 파싱 오류·SSR 가드를 한 곳에 모음 |

### 요구사항에서 합리적으로 조정한 부분

- **작품 정보는 JSON이 아니라 TypeScript**로 관리했다. 요구사항이 둘 중 하나를 허용하며,
  `status: "ongoing" | "completed"` 같은 값이 오타로 깨지는 것을 빌드에서 막을 수 있다.
- **회차 메타데이터를 별도 JSON이 아니라 Markdown front matter에 넣었다.** 회차를 추가할 때
  파일 하나만 만들면 되고, 본문과 메타가 분리되어 어긋나는 일이 없다.
- **`/library`(내 서재) 페이지를 추가**했다. 필수 목록에는 없지만 이어읽기·좋아요 데이터가
  이미 로컬에 있고, 이 데이터가 "어디에 저장되는지"를 사용자에게 보여줄 창구가 필요했다.

---

## 3. 폴더 구조

```
webnovel-site/
├─ content/                     ← 작가가 손대는 곳 (여기만 고치면 사이트가 바뀐다)
│  ├─ site.ts                     사이트명 · 작가 프로필 · 링크
│  ├─ series.ts                   작품 3편 메타데이터
│  └─ episodes/<series-slug>/     회차 Markdown (파일명 = 회차 slug)
├─ public/
│  ├─ covers/*.svg                직접 만든 세로형(2:3) 추상 표지
│  ├─ og.svg, favicon.svg
│  └─ .nojekyll                   GitHub Pages가 _next 폴더를 무시하지 않도록
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               헤더 · 모바일 탭바 · 테마 부트스트랩
│  │  ├─ page.tsx                 홈
│  │  ├─ browse/                  전체 작품 + 장르/태그 필터
│  │  ├─ library/                 내 서재 (로컬 데이터)
│  │  ├─ about/                   작가 소개
│  │  └─ series/[slug]/
│  │     ├─ page.tsx              작품 상세
│  │     └─ [episode]/page.tsx    읽기 화면
│  ├─ components/                 UI (reader/ 하위는 읽기 전용 컴포넌트)
│  └─ lib/
│     ├─ types.ts                 Series / Episode / EpisodeVideo
│     ├─ content.ts               빌드 타임 Markdown 로더 (server-only)
│     ├─ youtube.ts               URL → videoId 안전 추출
│     ├─ storage.ts               localStorage 단일 창구
│     └─ hooks/                   useReadingSettings · useReadingProgress · useLikes
└─ .github/workflows/deploy.yml   Pages 자동 배포
```

---

## 4. 데이터 구조

```ts
type SeriesStatus = "ongoing" | "completed" | "hiatus";

interface Series {
  slug: string; title: string; tagline: string; synopsis: string;
  genre: string; tags: string[]; status: SeriesStatus;
  cover: string;        // /covers/*.svg
  coverAlt: string;     // 접근성 대체 텍스트
  accent: string;       // 표지에서 뽑은 강조색 (상세 페이지 헤더에 사용)
  featured?: boolean;   // 홈 대표작 배너
  startedAt: string; updatedAt: string;
}
```

회차 Markdown front matter:

```yaml
---
title: 1화 · 종이 울리지 않는 밤
publishedAt: 2026-05-12
summary: 목록에 표시되는 한 줄 요약
authorNote: 회차 마지막에 나오는 작가 후기
videos:
  - url: https://youtu.be/VIDEO_ID
    title: 메인 테마 「잿빛 종탑」
    description: 이 회차를 쓰면서 계속 들었던 곡입니다.
    kind: ost           # ost | trailer | worldbuilding | animation
---
본문 Markdown…
```

회차 순서는 **파일명 접두사(`01-`, `02-`…)** 로 결정한다. 번호를 데이터에 중복 저장하지
않기 위해서다.

---

## 5. 읽기 경험 설계

- **테마 3종**은 사이트 전체에 적용된다(`<html data-theme>`). 읽다가 테마를 바꿨는데
  목록으로 나오면 눈이 부시는 문제를 없애기 위해서다. 기본값은 어두운 남색.
- **깜빡임 방지**: `layout.tsx`의 인라인 스크립트가 하이드레이션 전에 테마·글자크기를 적용.
- **본문 타이포그래피**는 CSS 변수(`--reader-font-size` / `--reader-line-height` /
  `--reader-measure`)로만 제어한다. 설정 UI는 이 변수만 바꾼다.
- **위치 저장**: 스크롤을 rAF로 스로틀해 `scrollY`가 아니라 **문서 대비 비율**로 저장한다.
  글자 크기를 바꿔 문서 높이가 달라져도 위치가 유지된다.
- **모바일 몰입**: 읽기 화면에서는 하단 탭바를 숨기고, 아래로 스크롤하면 상단바가 접히며,
  위로 스크롤하면 다시 나타난다.

## 6. YouTube 처리 설계

1. `extractYouTubeId(url)`는 `URL`로 파싱한 뒤 호스트를 화이트리스트로 검사하고
   (`youtube.com`, `m.`, `www.`, `youtu.be`, `youtube-nocookie.com`),
   경로 형태별로 ID를 뽑아 `^[A-Za-z0-9_-]{11}$`로 최종 검증한다.
   지원: `watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`.
2. 실패하면 `null` → 해당 영상 카드만 "주소를 확인할 수 없습니다"로 대체되고 **본문은 그대로**.
3. 임베드는 `youtube-nocookie.com`(개인정보 보호 강화 모드) + `rel=0`.
4. 기본 상태는 **iframe을 아예 렌더링하지 않는 파사드 카드**다. 사용자가 재생을 누르기
   전에는 YouTube로 나가는 요청이 0건이며, 자동재생 파라미터는 클릭 이후에만 붙는다.
5. 영상 영역 전체를 접기/펼치기 가능하게 하고, 회차에 영상이 없으면 섹션 자체를 렌더링하지 않는다.

---

## 7. 작업 순서

1. [x] 요구사항 분석 · 계획 작성
2. [ ] 프로젝트 스캐폴딩(next.config / tailwind / tsconfig)
3. [ ] 데이터 레이어(types, content, youtube, storage)
4. [ ] 디자인 토큰 & 레이아웃(헤더, 모바일 탭바, 테마)
5. [ ] 홈 / 둘러보기 / 작가 소개
6. [ ] 작품 상세 (이어읽기·읽음 표시)
7. [ ] 읽기 화면 (설정·진행률·좋아요·공유·회차 드로어)
8. [ ] 영상 섹션
9. [ ] 샘플 콘텐츠 3작품 11회차 + 표지 SVG
10. [ ] `npm run dev` / `npm run build` 실행 후 오류 수정
11. [ ] README에 배포 방법 작성 + GitHub Actions 워크플로

---

## 8. 이번 버전에서 하지 않는 것

- 회원가입·로그인·댓글·서버 저장. 좋아요와 읽음 표시는 **그 브라우저에만** 남는다.
- 검색 엔진용 동적 sitemap 이상의 SEO 작업.
- 관리자 작성 화면. 회차 추가는 Markdown 파일 추가 + 커밋으로 한다.
