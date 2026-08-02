import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE } from '@content/site';
import { Icon } from '@/components/Icon';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: '함께 쓰기',
  description: `${SITE.name}에 작가로 참여하는 방법.`,
};

const STEPS = [
  {
    title: '카페에서 작가로 신청합니다',
    body: '네이버 카페에 가입한 뒤 작가 등급을 신청해 주세요. 어떤 이야기를 쓰고 싶은지 짧게 적어 주시면 됩니다. 완성된 원고가 없어도 괜찮습니다.',
    action: { label: '카페로 가기', href: SITE.community.cafe, external: true },
  },
  {
    title: '서고지기가 확인합니다',
    body: '카페에서 작가 등급을 올려 드립니다. 승인되면 이름과 한 줄 소개를 받아 작가 페이지를 만들어 드립니다.',
  },
  {
    title: '글을 올립니다',
    body: '아래 폼에 제목과 본문을 붙여 넣으면 끝입니다. 마크다운을 몰라도 되고, 휴대폰에서도 됩니다. 올린 글은 서고지기가 한 번 확인한 뒤 사이트에 공개됩니다.',
    action: { label: '회차 올리는 폼', href: SITE.community.submit, external: true },
  },
];

export default function WritePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="text-center">
        <p className="text-[12px] tracking-[0.2em] text-ink-subtle">{SITE.nameEn}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">함께 쓰기</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-muted sm:text-[15px]">
          달빛서고는 여러 사람이 각자의 이야기를 올리는 자리입니다.
          <br className="hidden sm:block" /> 쓰고 싶은 이야기가 있다면 같이 하시죠.
        </p>
      </header>

      <ol className="mt-10 flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-2xl border border-line bg-surface/40 p-5 sm:flex sm:gap-5 sm:p-6"
          >
            <span className="mb-3 grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-[15px] font-bold text-accent sm:mb-0">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-bold text-ink sm:text-base">{step.title}</h2>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted sm:text-sm">
                {step.body}
              </p>
              {step.action && (
                <a
                  href={step.action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-[13px] font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  {step.action.label}
                  <Icon name="external" size={13} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-10" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="mb-3 text-[17px] font-bold tracking-tight text-ink">
          몇 가지 약속
        </h2>
        <ul className="flex flex-col gap-2.5 text-[13.5px] leading-relaxed text-ink-muted sm:text-sm">
          {[
            '올린 글의 저작권은 쓴 사람에게 있습니다. 서고는 싣기만 합니다.',
            '내리고 싶으면 언제든 말씀해 주세요. 바로 내립니다.',
            '남의 글을 옮겨 오지 않습니다. 직접 쓴 글만 올립니다.',
            '실존 인물의 실명·연락처·사진을 넣지 않습니다.',
            '연재 속도는 각자 정합니다. 마감도, 순위도 없습니다.',
          ].map((rule) => (
            <li key={rule} className="flex gap-2.5">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-accent" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 rounded-xl border border-line bg-surface/40 px-4 py-4 text-[12.5px] leading-relaxed text-ink-subtle">
        글을 올리는 폼은 GitHub을 씁니다. 계정이 없으면 무료로 만들 수 있습니다. 만들기 어려우시면
        카페에 원고를 올려 주셔도 됩니다 — 서고지기가 대신 등록해 드립니다. 어느 쪽이든{' '}
        <strong className="font-semibold text-ink-muted">
          이 사이트가 따로 받아 보관하는 개인정보는 없습니다.
        </strong>{' '}
        지금 연재 중인 작가들은{' '}
        <Link href={routes.about} className="text-accent underline underline-offset-2">
          연재 작가
        </Link>{' '}
        페이지에서 볼 수 있습니다.
      </p>
    </div>
  );
}
