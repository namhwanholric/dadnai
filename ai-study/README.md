# 아빠표 AI 학습법

교재가 뼈대를 잡고, 아이가 먼저 생각하고, AI는 질문과 힌트만 주는 학습법의 실전 자료입니다.

## 올리는 법 (깃허브 페이지)

1. github.com에서 새 저장소를 만듭니다. 이름은 `dadnai-study` 정도로 하고 **Public**으로 둡니다.
2. 이 폴더의 파일을 전부 올립니다. (저장소 페이지 → Add file → Upload files → 드래그)
3. 저장소의 **Settings → Pages**로 갑니다.
4. Source를 **Deploy from a branch**, Branch를 **main / (root)** 으로 두고 Save.
5. 1~2분 뒤 `https://아이디.github.io/dadnai-study/` 로 열립니다.

나중에 도메인을 사면 같은 Settings → Pages 화면의 **Custom domain**에 입력하면 됩니다.

## 파일 구성

| 파일 | 성격 | 내용 |
|---|---|---|
| `index.html` | 공개 | 메인 페이지 |
| `tutor-prompt-v2.html` | 공개 | 답을 알려주지 않는 AI 지시문 |
| `sign-errors.html` | 공개 | 중1 부호 오류 8문항 |
| `two-paths.html` | 공개 | 같은 20분, 두 갈래 (판별 카드) |
| `session-card.html` | 공개 | 저녁 20분 진행 카드 |
| `study-log.html` | **비공개 권장** | 기록 도구 (아이 데이터가 들어감) |
| `unity-first-door.html` | 반공개 | 유니티 첫 세션 카드 |
| `four-parts.html` | 작업용 | 에이전트 네 부품 정리 (책 1장 초안) |
| `book2-plan.html` | 작업용 | 2권 《아빠표 AI 업무활용》 편집 기획서 |
| `book2-plan.md` | 작업용 | 2권 기획서 내용 원본 (마크다운) |
| `book2-plan-alt-design.html` | 작업용 | 2권 기획서의 다른 디자인 안 (비교용) |
| `tools.html` | 작업용 | 전체 도구 목록 |

`study-log.html`은 브라우저에만 저장되므로 서버로 데이터가 가지는 않습니다. 다만 메인 메뉴에 링크를 걸지는 마세요.

## 고칠 때

- 색과 글꼴은 각 파일 맨 위 `:root` 부분에 모여 있습니다.
- 링크가 같은 폴더 기준(`./파일명.html`)이라, 폴더째 옮겨도 그대로 작동합니다.
- `.nojekyll` 파일은 지우지 마세요. 깃허브가 파일을 임의로 처리하지 않게 합니다.

## 다음에 채울 것

- [ ] 1회차 실전 기록 (날짜 + 실패한 지점)
- [ ] 문자와 식 8문항
- [ ] og.png (공유했을 때 뜨는 이미지, 1200×630)
