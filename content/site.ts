/**
 * 사이트 전역 설정. 사이트 이름 / 소개 / 내비게이션을 여기서만 고친다.
 * 작가 프로필은 content/authors.ts 에 있다.
 */

export const SITE = {
  name: '달빛서고',
  nameEn: 'MOONLIT SHELF',
  /** 브라우저 탭 · 검색 결과에 쓰이는 설명 */
  description: '판타지 · SF · 미스터리를 쓰는 세 작가가 함께 연재하는 웹소설 서고입니다.',
  /** 홈과 푸터에 쓰는 한 줄 소개 */
  tagline: '밤에 문을 여는 작은 연재 서고',
  /** 서고 소개 본문. 빈 줄로 문단을 나눈다. */
  intro: `달빛서고는 세 명의 작가가 각자의 이야기를 올리는 자리입니다. 편집부도 연재 순위도 없고, 마감을 재촉하는 사람도 없습니다. 쓴 사람이 다 됐다고 판단한 회차만 올라옵니다.

작품마다 속도가 다릅니다. 매주 올라오는 이야기가 있고, 한 묶음을 끝낸 뒤 한참 쉬는 이야기도 있습니다. 완결까지 다 쓴 뒤에 한 번에 여는 경우도 있습니다.

회원가입이 없습니다. 좋아요와 읽던 자리는 지금 쓰는 브라우저에만 남고 어디에도 전송되지 않습니다.`,
  /** 서고 공통 문의처 */
  contact: { label: '이메일', href: 'mailto:moonlit@example.com' },
  /** 상단/하단 탐색 메뉴 */
  nav: [
    { href: '/', label: '홈', icon: 'home' },
    { href: '/browse/', label: '둘러보기', icon: 'browse' },
    { href: '/library/', label: '내 서재', icon: 'library' },
    { href: '/about/', label: '작가', icon: 'author' },
  ] as const,
} as const;

export type NavItem = (typeof SITE.nav)[number];
