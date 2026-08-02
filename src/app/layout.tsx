import type { Metadata, Viewport } from 'next';

import { SITE } from '@content/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MobileTabBar } from '@/components/MobileTabBar';
import { ThemeBootstrap } from '@/components/ThemeBootstrap';
import { assetPath } from '@/lib/routes';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.author.name} 웹소설`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author.name }],
  // metadata 의 아이콘 경로에는 Next 가 basePath 를 붙여 주지 않는다.
  icons: { icon: assetPath('/favicon.svg') },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // 읽기 화면에서 확대해서 보는 독자가 있으므로 확대를 막지 않는다.
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        {/*
          한국어 본문용 웹폰트는 CDN에서 "점진적 향상"으로만 불러온다.
          네트워크가 없거나 CDN이 죽어도 시스템 폰트로 정상 렌더링되며, 빌드는 절대 실패하지 않는다.
        */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&display=swap"
        />
        <ThemeBootstrap />
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <a href="#main" className="sr-only-focusable">
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        <main id="main" className="pb-24 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
