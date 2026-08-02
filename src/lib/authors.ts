import { AUTHORS } from '@content/authors';
import type { Author, Series } from './types';

/**
 * 작가 조회 헬퍼.
 *
 * content.ts 는 `server-only` 라서 클라이언트 컴포넌트에서 못 쓴다.
 * 작가 데이터는 파일을 읽지 않는 순수 데이터이므로 여기에 따로 두고
 * 서버·클라이언트 양쪽에서 쓴다. (둘러보기·내 서재가 클라이언트 컴포넌트다)
 */

export function getAllAuthors(): Author[] {
  return AUTHORS;
}

export function getAuthor(slug: string): Author | undefined {
  return AUTHORS.find((author) => author.slug === slug);
}

/** 작품에 달린 작가. slug 가 틀리면 조용히 넘어가지 않도록 여기서 잡는다. */
export function getAuthorOfSeries(series: Pick<Series, 'slug' | 'author'>): Author {
  const author = getAuthor(series.author);
  if (!author) {
    throw new Error(
      `작품 "${series.slug}" 의 author "${series.author}" 를 content/authors.ts 에서 찾을 수 없습니다.`,
    );
  }
  return author;
}
