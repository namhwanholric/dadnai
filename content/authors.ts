import type { Author } from '@/lib/types';

/**
 * 달빛서고에서 연재하는 작가들.
 *
 * 새 작가를 추가하려면
 *   1) 여기에 항목을 하나 넣고
 *   2) public/authors/<slug>.svg 프로필 도형을 넣고
 *   3) content/series.ts 의 작품에 author: '<slug>' 을 적으면 된다.
 *
 * 작가 정보는 전부 이 파일에서만 고친다. 여러 곳에 흩어 두지 않는다.
 */
export const AUTHORS: Author[] = [
  {
    slug: 'sonndad',
    name: 'sonNdad',
    nameEn: 'sonNdad',
    tagline: '아이에게 정답보다 배우는 힘을 남기고 싶습니다.',
    bio: `아이의 공부를 곁에서 지켜보며 부모가 무엇을 채우고 무엇을 비워두어야 하는지 기록합니다.

성적과 입시를 외면하지 않으면서도, 시험이 끝난 뒤까지 남는 배움을 고민합니다.`,
    avatar: '/authors/sonndad.svg',
    avatarAlt: '큰 원과 작은 원이 나란히 길을 바라보는 추상 도형',
    accent: '#79c7b3',
    joinedAt: '2026-08-03',
    links: [],
  },
  {
    slug: 'nemesis-n',
    name: '네메시스N',
    nameEn: 'Nemesis N',
    tagline: '마법과 기술이 충돌하는 세계를 씁니다.',
    bio: `마법과 기술, 서로 다른 힘이 한 세계에서 만날 때 생기는 이야기를 씁니다.

《루미나 유니버시티》를 연재합니다.`,
    avatar: '/authors/nemesis-n.svg',
    avatarAlt: '붉고 푸른 두 빛이 교차하는 이중 나선 문양',
    accent: '#8b7cff',
    joinedAt: '2026-08-03',
    links: [],
  },
  {
    slug: 'yun-jaeha',
    name: '윤재하',
    nameEn: 'Yun Jaeha',
    tagline: '밤에 쓰고 새벽에 고칩니다.',
    bio: `2019년부터 웹에 소설을 쓰고 있습니다. 커다란 세계보다 그 세계에서 하루를 버티는 사람 쪽에 관심이 많아서, 결말이 정해진 이야기 안에서도 인물이 끝까지 선택할 수 있게 두는 편입니다.

작업은 대체로 밤에 합니다. 초고를 한 번에 쓰고, 다음 날 새벽에 소리 내어 읽으면서 고칩니다. 그래서 문장이 조금 길더라도 읽었을 때 걸리지 않는 리듬을 우선합니다.

회차마다 그때 듣던 곡이나 직접 만든 짧은 영상을 함께 올립니다. 본문을 다 읽은 뒤에 눌러 보시면 그 회차를 쓸 때의 공기가 조금 전해질지도 모르겠습니다.

연재 주기는 작품마다 다르지만 대체로 주 1~2회입니다. 오래 걸리더라도 시작한 이야기는 끝냅니다.`,
    avatar: '/authors/yun-jaeha.svg',
    avatarAlt: '달과 종탑을 등지고 선 인물의 실루엣 초상',
    accent: '#e9bb77',
    joinedAt: '2026-05-12',
    links: [{ label: '이메일', href: 'mailto:jaeha@example.com' }],
  },
  {
    slug: 'do-yeonseo',
    name: '도연서',
    nameEn: 'Do Yeonseo',
    tagline: '아무 일도 일어나지 않는 장면을 오래 씁니다.',
    bio: `사건보다 사건 사이의 시간에 관심이 있습니다. 누가 죽고 누가 이기는 이야기는 이미 많으니까, 저는 그 사이에 밥을 차리고 불을 끄고 창밖을 보는 쪽을 씁니다.

배경은 주로 우주입니다. 우주가 좋아서가 아니라, 사람을 아주 좁고 조용한 데에 몰아넣기에 그만한 장소가 없어서입니다. 열일곱 명이 사는 정거장이면 충분합니다.

한 화에 큰일이 하나도 없어도 괜찮다고 생각하며 씁니다. 대신 마지막 줄에서는 뭔가 하나가 반드시 달라져 있게 합니다.

연재는 느립니다. 짧은 이야기를 묶음으로 올리고, 묶음 사이에는 좀 쉽니다.`,
    avatar: '/authors/do-yeonseo.svg',
    avatarAlt: '정거장 둥근 창의 불빛을 옆에 두고 앉은 인물의 실루엣 초상',
    accent: '#7fd6c4',
    joinedAt: '2026-06-02',
    links: [{ label: '이메일', href: 'mailto:yeonseo@example.com' }],
  },
  {
    slug: 'han-mugyeol',
    name: '한무결',
    nameEn: 'Han Mugyeol',
    tagline: '무서운 건 사건이 아니라 계약서라고 생각합니다.',
    bio: `괴담을 씁니다. 다만 귀신은 잘 안 나옵니다. 제가 무섭다고 느끼는 쪽은 읽지 않고 서명하게 만드는 문장, 거절할 수 없게 짜인 조항 같은 것들입니다.

이야기를 시작하기 전에 결말을 먼저 정합니다. 결말을 모르는 채로 쓰면 중간에 인물에게 미안한 짓을 하게 되더라고요.

짧게 씁니다. 세 화나 다섯 화로 끝나는 연작을 주로 올리고, 한 편이 끝나면 다음 편은 완전히 다른 이야기입니다.

읽고 나서 하루쯤 지나 문득 다시 생각나는 이야기가 되면 성공이라고 봅니다.`,
    avatar: '/authors/han-mugyeol.svg',
    avatarAlt: '붉은 교정선이 그어진 원고지를 뒤에 두고 선 인물의 실루엣 초상',
    accent: '#e08a8a',
    joinedAt: '2026-03-04',
    links: [{ label: '이메일', href: 'mailto:mugyeol@example.com' }],
  },
];
