/**
 * 하이드레이션 전에 실행되어 저장된 읽기 설정을 문서에 즉시 적용한다.
 * 이게 없으면 어두운 테마를 쓰는 독자가 페이지를 열 때마다 흰 화면이 한 번 번쩍인다.
 *
 * storage.ts 의 키/기본값과 짝을 이루므로 한쪽을 바꾸면 다른 쪽도 함께 바꿔야 한다.
 */
const BOOTSTRAP = `
(function () {
  try {
    var raw = localStorage.getItem('dalbit:reading-settings');
    var s = raw ? JSON.parse(raw) : {};
    var root = document.documentElement;
    var theme = (s && (s.theme === 'light' || s.theme === 'sepia' || s.theme === 'dark')) ? s.theme : 'dark';
    root.setAttribute('data-theme', theme);
    if (s) {
      if (typeof s.fontSize === 'number') root.style.setProperty('--reader-font-size', s.fontSize + 'px');
      if (typeof s.lineHeight === 'number') root.style.setProperty('--reader-line-height', String(s.lineHeight));
      if (typeof s.measure === 'number') root.style.setProperty('--reader-measure', s.measure + 'rem');
    }
  } catch (e) {
    /* localStorage 접근이 막힌 환경(시크릿 모드 등)에서는 기본 테마를 그대로 쓴다 */
  }
})();
`;

export function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
