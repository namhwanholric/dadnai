# CLAUDE.md — dadnai 저장소

이 저장소 하나가 **사이트 두 개**를 담고 있습니다. 작업 전에 어느 쪽인지 먼저 확인하세요.

| 사이트 | 폴더 | 주소 | 성격 |
| --- | --- | --- | --- |
| **달빛서고** (웹소설) | 저장소 루트 | `https://namhwanholric.github.io/dadnai/` | Next.js 정적 사이트. 빌드 필요 |
| **아빠표 AI 학습법** | `ai-study/` | `https://namhwanholric.github.io/dadnai/ai-study/` | 순수 HTML. 빌드 도구 없음 |

**두 사이트의 규칙은 완전히 다릅니다. 섞지 마세요.**

- `ai-study/` 안에서 작업할 때는 **[ai-study/CLAUDE.md](ai-study/CLAUDE.md)를 먼저 읽으세요.** 디자인 시스템·콘텐츠 규칙이 거기 있고, 그 폴더에는 npm 의존성을 추가하지 않습니다.
- 루트에서 작업할 때는 이 문서와 [README.md](README.md)를 따릅니다.

---

## 배포

`main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드해서 GitHub Pages에 올립니다.
(저장소 Settings → Pages → Source = **GitHub Actions**)

```
npm run build
  ├ next build                    → out/          (웹소설)
  └ node scripts/copy-ai-study.mjs → out/ai-study/ (AI 학습법 폴더 통째로 복사)
```

- **`ai-study/`는 Next.js가 건드리지 않습니다.** 복사 스크립트가 그대로 옮깁니다. 로컬 빌드와 배포 결과가 같습니다.
- `public/*.html` 중 몇 개는 **옛 주소 리다이렉트 스텁**입니다 (`/dadnai/tools.html` → `/dadnai/ai-study/tools.html`).
  ai-study에 새 페이지를 추가할 때 옛 주소가 없으면 스텁도 필요 없습니다.
- `public/.nojekyll`을 지우지 마세요. 없으면 GitHub Pages가 `_next` 폴더를 무시합니다.
- 커밋 메시지는 한국어로 간결하게. 예: `부록 B에 문자와 식 8문항 추가`

## 웹소설 사이트 (루트) 규칙

- 원고는 `content/episodes/<작품slug>/NN-slug.md`. 파일 하나가 회차 하나입니다.
- 작품은 `content/series.ts`, **작가는 `content/authors.ts`**, 사이트 정보는 `content/site.ts`에서만 고칩니다.
- 여러 작가가 함께 쓰는 서고입니다. 작품마다 `author` slug이 있어야 하고, 없는 slug이면 빌드가 실패합니다.
- 작가 프로필 이미지는 **사람 사진을 쓰지 않습니다.** `public/authors/<slug>.svg` 추상 도형으로 통일합니다.
- 회차를 추가하면 `content/series.ts`의 `updatedAt`도 같이 고칩니다.
- 좋아요·읽은 회차·읽기 설정은 **localStorage 전용**입니다. 서버로 보내는 코드를 넣지 마세요.
- 영상은 클릭 전까지 iframe을 만들지 않습니다(파사드). 이 동작을 깨지 마세요.
- 회차는 `npm run new` 로 만듭니다. 손으로 파일을 만들 때도 형식은 같아야 합니다.
- front matter 의 `hidden: true` 는 **내려간 글**이라는 뜻입니다. `getEpisodes()` 에서 걸러지므로
  페이지도 안 만들어집니다. 이 필터를 우회해서 회차를 읽는 코드를 만들지 마세요.
  내리기·되살리기는 `npm run takedown` 또는 Actions 의 "회차 내리기" 로 합니다.
- 외부에서 올라온 회차(이슈 폼)는 **승인목록 `.github/writers.yml` 에 있는 계정만** 통과합니다.
  이슈 본문은 믿을 수 없는 입력이므로 `scripts/episode-from-issue.mjs` 의 검사(경로 정규식, front matter 직접 생성)를 약화시키지 마세요.
- 자세한 사용법은 [README.md](README.md), 작업 상태는 [HANDOFF.md](HANDOFF.md), 설계 근거는 [PROJECT_PLAN.md](PROJECT_PLAN.md)에 있습니다.
