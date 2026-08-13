import type { SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'browse'
  | 'library'
  | 'author'
  | 'sun'
  | 'moon'
  | 'paper'
  | 'type'
  | 'list'
  | 'arrow-left'
  | 'arrow-right'
  | 'heart'
  | 'heart-filled'
  | 'share'
  | 'play'
  | 'chevron-down'
  | 'chevron-right'
  | 'check'
  | 'close'
  | 'external'
  | 'alert'
  | 'bookmark'
  | 'code';

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />,
  browse: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="9" rx="1.5" />
      <path d="M14 17h7" />
    </>
  ),
  library: (
    <>
      <path d="M4 4.5h6a2 2 0 0 1 2 2V20a2.2 2.2 0 0 0-2-1.5H4z" />
      <path d="M20 4.5h-6a2 2 0 0 0-2 2V20a2.2 2.2 0 0 1 2-1.5h6z" />
    </>
  ),
  author: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.6 4.1-5.4 7.5-5.4S18.1 16.4 19.5 20" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2z" />,
  paper: (
    <>
      <path d="M5 4.5h9l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19z" />
      <path d="M14 4.5v5h5" />
    </>
  ),
  type: <path d="M4 6.5V5h16v1.5M12 5v14M8.5 19h7" />,
  list: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  'arrow-left': <path d="M15 5l-7 7 7 7" />,
  'arrow-right': <path d="M9 5l7 7-7 7" />,
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.9a4.1 4.1 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z" />
  ),
  'heart-filled': (
    <path
      d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.9a4.1 4.1 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"
      fill="currentColor"
      stroke="none"
    />
  ),
  share: (
    <>
      <path d="M12 15V4M12 4 8.5 7.5M12 4l3.5 3.5" />
      <path d="M5.5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-6.5" />
    </>
  ),
  play: <path d="M8.5 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  'chevron-down': <path d="M6 9.5l6 6 6-6" />,
  'chevron-right': <path d="M9.5 6l6 6-6 6" />,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  external: (
    <>
      <path d="M14 4.5h5.5V10" />
      <path d="M19.5 4.5 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16.2v.6" />
    </>
  ),
  bookmark: <path d="M6.5 4.5h11V20l-5.5-3.8L6.5 20z" />,
  code: (
    <>
      <path d="M8.5 7.5 3.5 12l5 4.5" />
      <path d="M15.5 7.5 20.5 12l-5 4.5" />
      <path d="M14 5l-4 14" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
