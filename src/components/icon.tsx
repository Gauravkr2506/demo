/**
 * Inline SVG icon set — no icon-library dependency.
 * UI icons are 24px stroke glyphs; brand marks are filled.
 */
import type { JSX } from "react";

const S: Record<string, JSX.Element> = {
  // ----- Contact / core
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  message: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l2-5.2A8.4 8.4 0 0 1 4.1 12a8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.5 8.5Z" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,

  // ----- Nav / dashboard
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM21 14v3M18 21h3M14 21h1" /></>,
  chart: <path d="M3 3v16a2 2 0 0 0 2 2h16M7 15l3.5-4 3 2.5L20 7" />,
  palette: <><circle cx="13.5" cy="6.5" r=".6" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".6" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".6" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".6" fill="currentColor" /><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2h1.9A4.9 4.9 0 0 0 22 10.6 10 10 0 0 0 12 2Z" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></>,
  help: <><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0 1 14 0M17 4.5a3.5 3.5 0 0 1 0 7M18 21h4a6 6 0 0 0-4-5.7" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  search: <><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.3-4.3" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,

  // ----- Actions
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  pencil: <><path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></>,
  trash: <><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  external: <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />,
  grip: <path d="M4 7h16M4 12h16M4 17h16" />,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" /><circle cx="12" cy="13" r="4" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  refresh: <path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" />,
  filter: <path d="M22 3H2l8 9.5V20l4 2v-9.5Z" />,

  // ----- Arrows
  right: <path d="M5 12h14M13 6l6 6-6 6" />,
  left: <path d="M19 12H5M11 18l-6-6 6-6" />,
  chevR: <path d="m9 6 6 6-6 6" />,
  chevL: <path d="m15 6-6 6 6 6" />,
  chevD: <path d="m6 9 6 6 6-6" />,
  chevU: <path d="m18 15-6-6-6 6" />,
  up: <path d="M12 19V5M5 12l7-7 7 7" />,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
  trendUp: <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />,
  trendDown: <path d="m3 7 6 6 4-4 8 8M15 17h6v-6" />,

  // ----- Concept / marketing
  sparkle: <path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5L3.5 11 10 9ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />,
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  infinity: <path d="M18.2 8.8a4.5 4.5 0 0 0-6.4 0L12 9l-.2.2a4.5 4.5 0 1 1 0 5.6l.2-.2.2-.2a4.5 4.5 0 1 0 6.4-6.4Z" />,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20" /></>,
  heart: <path d="M12 21s-8-4.7-8-10.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 3.8C20 16.3 12 21 12 21Z" />,
  tag: <><path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.3" /></>,
  bag: <><path d="M5 7h14l1 14H4Z" /><path d="M9 11V6a3 3 0 0 1 6 0v5" /></>,
  ticket: <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" /><path d="M14 6v12" strokeDasharray="2 3" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  paw: <><ellipse cx="7" cy="9" rx="2" ry="2.6" /><ellipse cx="12" cy="7" rx="2" ry="2.8" /><ellipse cx="17" cy="9" rx="2" ry="2.6" /><path d="M12 12c3 0 5 2.2 5 4.6S15 21 12 21s-5-2-5-4.4S9 12 12 12Z" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  star: <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9Z" />,
  phoneDevice: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18.5h2" /></>,
  monitor: <><rect x="2" y="4" width="20" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  tablet: <><rect x="4" y="2" width="16" height="20" rx="2.5" /><path d="M11.5 18.5h1" /></>,
  scan: <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3M3 12h18" />,
  play: <path d="M6 3.5 20 12 6 20.5Z" />,
  wand: <path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4M12.2 6.2 10.8 4.8M3 21l9-9" />,
};

/** Brand marks (filled, no stroke). */
const BRAND: Record<string, JSX.Element> = {
  instagram: <><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.4" r="1.3" /></>,
  tiktok: <path d="M16.6 2h-3.1v13.4a2.6 2.6 0 1 1-2.2-2.6v-3.2a5.8 5.8 0 1 0 5.3 5.8V8.9a7 7 0 0 0 4.1 1.3V7a4.1 4.1 0 0 1-4.1-4.1V2Z" />,
  youtube: <><rect x="2" y="5" width="20" height="14" rx="4.5" /><path d="m10 9 5.5 3-5.5 3Z" fill="#fff" /></>,
  facebook: <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12Z" />,
  pinterest: <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.9 0 3.2-2.4 3.2-5.2 0-2.1-1.4-3.7-4-3.7a4.6 4.6 0 0 0-4.8 4.6c0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.5.2-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.3-6 6.8-6 3.6 0 6 2.6 6 5.4 0 3.7-2.1 6.5-5.1 6.5-1 0-2-.6-2.3-1.2l-.6 2.5c-.2.8-.7 1.8-1.1 2.4A10 10 0 1 0 12 2Z" />,
  x: <path d="M17.2 2.5h3.3l-7.2 8.2 8.4 11.1h-6.6l-5.1-6.8-5.9 6.8H.8l7.7-8.8L.4 2.5h6.8l4.6 6.2Zm-1.1 17.4h1.8L7.9 4.3H6Z" />,
  linkedin: <><rect x="2.5" y="2.5" width="19" height="19" rx="4" /><path d="M7.7 9.8v8M7.7 6.6v.1M11.4 17.8v-8M11.4 12.4c0-1.5 1-2.6 2.5-2.6s2.6 1.1 2.6 2.8v5.2" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" /></>,
  whatsapp: <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-5.7-5c-.4-.7-.9-1.6-.9-2.5s.5-1.4.7-1.6c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4c-.1.2-.3.3-.1.6a8.7 8.7 0 0 0 3.7 3.2c.3.1.4.1.6-.1l.8-1c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3 0 .1 0 .6-.2 1.2Z" />,
  spotify: <><circle cx="12" cy="12" r="10" /><path d="M7.2 9.4a11.5 11.5 0 0 1 9.4.8M8 12.6a9 9 0 0 1 7.3.7M8.8 15.6a6.8 6.8 0 0 1 5.6.5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></>,
  snapchat: <path d="M12 2c2.9 0 4.6 2.1 4.6 4.8v2.1c.5-.2 1-.4 1.4-.2.6.2.8.8.5 1.3-.3.6-1.3 1-1.8 1.3-.2.1-.3.3-.2.6.5 1.4 1.9 2.7 3.2 3 .5.1.6.6.3.9-.5.5-1.6.7-2.3.9-.2.4-.2 1-.7 1.1-.6.1-1.4-.2-2.2-.1-.9.1-1.5 1.2-2.8 1.2s-1.9-1.1-2.8-1.2c-.8-.1-1.6.2-2.2.1-.5-.1-.5-.7-.7-1.1-.7-.2-1.8-.4-2.3-.9-.3-.3-.2-.8.3-.9 1.3-.3 2.7-1.6 3.2-3 .1-.3 0-.5-.2-.6-.5-.3-1.5-.7-1.8-1.3-.3-.5-.1-1.1.5-1.3.4-.2.9 0 1.4.2V6.8C7.4 4.1 9.1 2 12 2Z" />,
};

export type IconName = keyof typeof S | keyof typeof BRAND;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
  style,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const brand = BRAND[name];
  const glyph = brand ?? S[name] ?? S.link;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      fill={brand ? "currentColor" : "none"}
      stroke={brand ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

export const isBrandIcon = (name: string) => name in BRAND;
