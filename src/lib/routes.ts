/**
 * public/ 안의 파일을 가리키는 경로에 basePath 를 붙인다.
 *
 * `<Link>` 와 라우팅은 Next 가 알아서 basePath 를 붙여 주지만,
 * **`images.unoptimized` 인 `next/image` 와 metadata 의 아이콘 경로는 붙여 주지 않는다.**
 * (프로젝트 페이지 https://<user>.github.io/<repo>/ 에 올리면 표지·파비콘이 404 가 된다)
 * public/ 자산을 새로 참조할 때는 반드시 이 함수를 거친다.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** trailingSlash: true 이므로 내부 링크는 항상 끝에 슬래시를 붙인다. */
export const routes = {
  home: '/',
  browse: '/browse/',
  library: '/library/',
  about: '/about/',
  write: '/write/',
  author: (slug: string) => `/authors/${slug}/`,
  series: (slug: string) => `/series/${slug}/`,
  episode: (seriesSlug: string, episodeSlug: string) => `/series/${seriesSlug}/${episodeSlug}/`,
} as const;

/**
 * 읽기 화면인지 판별한다. (/series/<작품>/<회차>/)
 * 읽기 화면에서는 전역 헤더와 하단 탭바를 숨기고 본문에 집중시킨다.
 */
export function isReaderPath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 3 && segments[0] === 'series';
}
