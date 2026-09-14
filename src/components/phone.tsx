"use client";

/** Device frame used for marketing mockups and editor previews. */
export function Phone({
  width = 300,
  children,
  statusOnImage = false,
  lightHome = false,
  className,
  style,
}: {
  width?: number;
  children: React.ReactNode;
  statusOnImage?: boolean;
  lightHome?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`phone${className ? ` ${className}` : ""}`}
      style={{ ["--phone-w" as string]: `${width}px`, ...style }}
    >
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-status" data-on-image={statusOnImage}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: "0.35em", alignItems: "center" }}>
            <Bars />
            <Wifi />
            <Battery />
          </span>
        </div>
        <div className="phone-body">{children}</div>
      </div>
      <div className="phone-home" data-light={lightHome} />
    </div>
  );
}

/** Status-bar glyphs sized in em so they scale with the frame. */
function Bars() {
  return (
    <svg width="1.15em" height="0.85em" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="10" y="3" width="3" height="9" rx="1" />
      <rect x="15" y="0" width="3" height="12" rx="1" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="1em" height="0.8em" viewBox="0 0 16 12" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M1.5 4.2a10 10 0 0 1 13 0M4 7a6.4 6.4 0 0 1 8 0" />
      <circle cx="8" cy="10" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function Battery() {
  return (
    <svg width="1.5em" height="0.8em" viewBox="0 0 24 12" fill="none" aria-hidden="true">
      <rect x="0.7" y="0.7" width="20" height="10.6" rx="3" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <rect x="2.4" y="2.4" width="16" height="7.2" rx="1.8" fill="currentColor" />
      <path d="M22.2 4.4v3.2a2 2 0 0 0 0-3.2Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
