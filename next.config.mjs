/**
 * GitHub Pages 프로젝트 페이지(https://<user>.github.io/<repo>/)에 배포할 때는
 * 저장소 이름을 basePath로 넣어야 CSS/JS 경로가 깨지지 않는다.
 * 배포 워크플로에서 NEXT_PUBLIC_BASE_PATH=/<repo> 로 주입한다.
 * 사용자/조직 페이지(<user>.github.io)나 커스텀 도메인이면 빈 값 그대로 두면 된다.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 서버 없이 정적 HTML만 뽑는다. (out/ 폴더)
  output: 'export',
  basePath,
  // GitHub Pages는 /a/b -> /a/b/index.html 로 서빙한다. 슬래시를 붙여야 새로고침 시 404가 안 난다.
  trailingSlash: true,
  // next/image 최적화 서버가 없으므로 원본을 그대로 내보낸다.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
