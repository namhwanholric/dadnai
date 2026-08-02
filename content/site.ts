/**
 * 사이트 전역 설정. 사이트 이름 / 작가 프로필 / 외부 링크를 여기서만 고친다.
 */

export const SITE = {
  name: '달빛서고',
  nameEn: 'MOONLIT SHELF',
  /** 브라우저 탭 · 검색 결과에 쓰이는 설명 */
  description:
    '윤재하가 쓰는 판타지 · SF · 미스터리 웹소설을 한곳에서 읽는 개인 연재 서고입니다.',
  author: {
    name: '윤재하',
    nameEn: 'Yun Jaeha',
    /** 한 줄 소개 */
    tagline: '밤에 쓰고 새벽에 고칩니다.',
    /** 작가 소개 본문. 빈 줄로 문단을 나눈다. */
    bio: `2019년부터 웹에 소설을 쓰고 있습니다. 커다란 세계보다 그 세계에서 하루를 버티는 사람 쪽에 관심이 많아서, 결말이 정해진 이야기 안에서도 인물이 끝까지 선택할 수 있게 두는 편입니다.

작업은 대체로 밤에 합니다. 초고를 한 번에 쓰고, 다음 날 새벽에 소리 내어 읽으면서 고칩니다. 그래서 문장이 조금 길더라도 읽었을 때 걸리지 않는 리듬을 우선합니다.

회차마다 그때 듣던 곡이나 직접 만든 짧은 영상을 함께 올립니다. 본문을 다 읽은 뒤에 눌러 보시면 그 회차를 쓸 때의 공기가 조금 전해질지도 모르겠습니다.

연재 주기는 작품마다 다르지만 대체로 주 1~2회입니다. 오래 걸리더라도 시작한 이야기는 끝냅니다.`,
    /** 외부 링크. 빈 배열이면 링크 영역이 렌더링되지 않는다. */
    links: [
      { label: '이메일', href: 'mailto:jaeha@example.com' },
      { label: 'GitHub', href: 'https://github.com/' },
    ] as { label: string; href: string }[],
  },
  /** 상단/하단 탐색 메뉴 */
  nav: [
    { href: '/', label: '홈', icon: 'home' },
    { href: '/browse/', label: '둘러보기', icon: 'browse' },
    { href: '/library/', label: '내 서재', icon: 'library' },
    { href: '/about/', label: '작가', icon: 'author' },
  ] as const,
} as const;

export type NavItem = (typeof SITE.nav)[number];
