"use client";

/**
 * The visitor-facing profile — what somebody sees after scanning the QR code.
 *
 * One component serves three contexts (marketing phone mockups, the editor's
 * live preview, and the real /p/[slug] page) because all of its sizing comes
 * from container queries rather than the viewport.
 *
 * Only buttons with `enabled: true` are rendered. That rule is the whole
 * product promise — "only what you choose appears" — so it lives here.
 */

import { Icon } from "./icon";
import { buttonMeta, typeMeta } from "@/lib/catalog";
import type { Profile } from "@/lib/types";

export function Avatar({
  profile,
  className,
  style,
}: {
  profile: Pick<Profile, "avatar" | "name">;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isUpload = profile.avatar.startsWith("data:");
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`avatar${className ? ` ${className}` : ""}`}
      style={{
        ...style,
        background: isUpload ? undefined : profile.avatar,
        backgroundImage: isUpload ? `url(${profile.avatar})` : undefined,
      }}
    >
      {!isUpload && <span className="avatar-initials">{initials}</span>}
    </div>
  );
}

export function ProfileView({
  profile,
  onButtonTap,
  interactive = true,
}: {
  profile: Profile;
  onButtonTap?: (buttonId: string) => void;
  interactive?: boolean;
}) {
  const visible = profile.buttons.filter((b) => b.enabled);
  const meta = typeMeta(profile.type);
  const isUpload = profile.avatar.startsWith("data:");

  return (
    <div className="vp" data-style={profile.theme.buttonStyle} data-corners={profile.theme.corners}>
      <div className="vp-cover" style={{ background: profile.theme.cover }}>
        <div className="vp-avatar">
          <Avatar
            profile={profile}
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
          {!isUpload && null}
        </div>
        {profile.type === "dating" && (
          <span
            className="vp-avatar-badge"
            style={{
              background: profile.theme.accent,
              width: "9cqw",
              right: "32%",
              bottom: "-12cqw",
              left: "auto",
            }}
          >
            <Icon name="heart" size={12} strokeWidth={0} style={{ fill: "#fff" }} />
          </span>
        )}
      </div>

      <div className="vp-main">
        <h1 className="vp-name">{profile.name || "Your Name"}</h1>
        {profile.tagline && <p className="vp-tagline">{profile.tagline}</p>}
        {profile.bio && <p className="vp-bio">{profile.bio}</p>}

        <div className="vp-buttons">
          {visible.map((btn) => {
            const bm = buttonMeta(btn.kind);
            const color = profile.theme.buttonStyle === "filled" ? bm.color : profile.theme.accent;
            return (
              <button
                key={btn.id}
                type="button"
                className="vp-btn"
                style={{ ["--btn-color" as string]: color }}
                onClick={interactive ? () => onButtonTap?.(btn.id) : undefined}
                tabIndex={interactive ? 0 : -1}
                aria-label={btn.label}
              >
                <span className="vp-btn-icon">
                  <Icon name={bm.icon} size={14} strokeWidth={2.2} style={{ width: "62%", height: "62%" }} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="vp-btn-label" style={{ display: "block" }}>
                    {btn.label}
                  </span>
                  {btn.sublabel && (
                    <span className="vp-btn-sub" style={{ display: "block" }}>
                      {btn.sublabel}
                    </span>
                  )}
                </span>
                <svg className="vp-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            );
          })}

          {visible.length === 0 && (
            <p className="vp-empty">
              No buttons are switched on yet.
              <br />
              Turn one on and it appears here instantly.
            </p>
          )}
        </div>

        {profile.footerNote && <p className="vp-footer-note">{profile.footerNote}</p>}
        <p className="vp-powered">
          Powered by <strong style={{ color: meta.accent }}>QRSPACE</strong>
        </p>
      </div>
    </div>
  );
}
