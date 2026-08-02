# HANDOFF — 달빛서고

**갱신:** 2026-08-02
**저장소:** `namhwanholric/dadnai` · 작업 폴더 `C:\Users\A\source\repos\dadnai`
**공개 주소:** https://namhwanholric.github.io/dadnai/

사용법·회차 추가·배포는 [README.md](README.md), 저장소 규칙은 [CLAUDE.md](CLAUDE.md)에 있습니다.
이 문서는 **작업 상태**만 적습니다.

---

## 1. 지금 상태 — 배포까지 끝

| 주소 | 내용 |
| --- | --- |
| `/dadnai/` | 달빛서고 (웹소설, Next.js 정적 사이트) |
| `/dadnai/ai-study/` | 아빠표 AI 학습법 (기존 사이트. 순수 HTML) |
| `/dadnai/tools.html` 등 옛 주소 10개 | `/ai-study/...` 로 리다이렉트 |

- 작품 3편 · 회차 11편 · 작가 3명
- Pages 배포 방식: **GitHub Actions** (`main` 에 푸시하면 자동)
- 라이브 확인 완료: 홈 / 함께 쓰기 / 연재 작가 / 작가 3페이지 / ai-study / 리다이렉트 / 표지·프로필 SVG 전부 200

## 2. 검증한 것

**빌드** — `npm run typecheck`, `npm run build` 통과. `NEXT_PUBLIC_BASE_PATH=/dadnai` 로도 빌드해
`out/` 안의 모든 절대경로가 `/dadnai` 로 시작하는지 확인했습니다.

**브라우저 (375px)** — 가로 스크롤 없음. 둘러보기 필터, 내 서재 이어읽기, 영상 파사드(클릭 전 iframe 0개 →
클릭 시 `youtube-nocookie` 1개), 잘못된 영상 주소 폴백, 본문 코드블록 가로 스크롤.

**읽기 화면 스크롤 동작** — 이전 인계 때 "미확인"으로 남겨 뒀던 항목입니다. 전부 확인했습니다.

- 진행률 바가 차오름 (스크롤 1000px 지점에서 17%)
- 아래로 내리면 상·하단 바가 숨고, 위로 올리면 다시 나옴
- 새로고침하면 읽던 자리로 복귀 (1000px → 1000px)

**투고 자동화** — `scripts/episode-from-issue.mjs` 를 로컬에서 6가지 경우로 돌렸습니다.

| 경우 | 결과 |
| --- | --- |
| 승인 안 된 계정 | 거절 |
| 승인된 계정 | 원고 파일 생성 |
| 같은 slug 중복 | 거절 |
| 경로 조작 (`../../../etc/evil`) | 거절 |
| 없는 작품 | 거절 |
| 본문 200자 미만 | 거절 |

**`npm run new`** — 파이프 입력으로도 확인. (`npm run new < answers.txt` 도 됩니다)

## 3. 아직 안 해 본 것

**이슈 폼 → PR 자동화를 GitHub 위에서 실제로 돌려보지 않았습니다.** 변환 스크립트는 로컬에서
검증했지만, 워크플로 전체(체크아웃 → 빌드 → 브랜치 푸시 → PR 생성 → 댓글)는 첫 이슈가 올라와야
돌아갑니다. 시험 회차를 하나 올려 보고, PR 이 열리면 병합하지 말고 닫으면 됩니다.

- 폼: https://github.com/namhwanholric/dadnai/issues/new?template=new-episode.yml
- 실패하면 Actions 탭의 "이슈로 올린 회차 받기" 로그를 보면 됩니다.

## 4. 남은 일

### 내용 교체 (샘플 → 실제)

- **작가 3명과 작품 11편은 전부 지어낸 것입니다.** 프로필·소개·이메일(`example.com`)이 가짜입니다.
- 모든 회차의 영상이 Big Buck Bunny(`aqz-KE-bpKQ`) 샘플입니다. 설명란에 "예시 영상"이라고 적어 두었습니다.
- `04-what-i-paid.md` 의 두 번째 영상은 **일부러 깨뜨린 주소**입니다 (폴백 시연용). 실제 운영 전에 지우거나 교체하세요.
- 서고 공통 문의처(`content/site.ts` 의 `contact`)도 `example.com` 입니다.

### 카페 쪽

작가 등급 신청 게시판과 안내글이 필요합니다. 사이트의 `/write/` 가 카페로 보내고 있으므로
받는 쪽이 준비돼 있어야 합니다.

### 나중에 (지금 급하지 않음)

- 댓글(giscus), 검색, RSS — README 마지막 표 참고
- 좋아요 수 합산·조회수·회원 기능은 **정적 사이트로 불가능**합니다. 이게 필요해지는 시점이 이사 시점입니다.
  원고가 전부 마크다운이라 옮기는 비용은 쌉니다.

## 5. 함정 모음 (다시 안 밟으려고 적어 둠)

- **`output: export` + `images.unoptimized` + `basePath`** — `next/image` 와 metadata 아이콘에는
  Next 가 basePath 를 안 붙입니다. `assetPath()` 를 반드시 거치세요. 로컬 빌드에서는 안 드러나고
  배포하고 나서야 404 로 나타납니다.
- **`content.ts` 는 `server-only`** 입니다. 클라이언트 컴포넌트(둘러보기·내 서재·읽기 화면)에서 쓰면
  빌드가 깨집니다. 파일을 안 읽는 순수 조회는 `lib/authors.ts` 처럼 따로 둡니다.
- **`next dev` 는 반드시 이 폴더 안에서** — 원고 로더가 `process.cwd()` 기준이라, 밖에서 띄우면
  에러 없이 전 작품이 "총 0화" 가 됩니다.
- **개발 서버에서 `/browse` 필터가 회색 상자로 멈춤** — `output: export` + `useSearchParams` 의
  개발 모드 한정 현상입니다. 빌드 결과물은 정상이니 고치려 들지 마세요.
- **Windows: `out/` 을 서버가 잡고 있으면 빌드가 `EBUSY`** 로 실패합니다. 미리보기 서버를 끄고 빌드하세요.
- **readline 파이프 입력** — `rl.question()` 만 쓰면 한꺼번에 도착한 줄을 잃습니다.
  `scripts/new-episode.mjs` 의 줄 대기열 방식을 유지하세요.
