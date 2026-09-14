"use client";

import Link from "next/link";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { typeMeta } from "@/lib/catalog";
import type { Profile } from "@/lib/types";

/** Gallery tile for an example profile. Tapping anywhere opens the full example. */
export function ExampleCard({ profile, width = 148 }: { profile: Profile; width?: number }) {
  const meta = typeMeta(profile.type);

  return (
    <Link
      href={`/examples/${profile.slug}`}
      className="card card-hover"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <div
        className="row g8"
        style={{
          padding: "12px 14px",
          background: `color-mix(in srgb, ${meta.accent} 9%, transparent)`,
          borderBottom: "1px solid var(--line)",
        }}
      >
        <span
          style={{
            width: 26, height: 26, borderRadius: 8, flex: "none",
            background: meta.accent, color: "#fff", display: "grid", placeItems: "center",
          }}
        >
          <Icon name={meta.icon} size={14} />
        </span>
        <span className="small truncate" style={{ fontWeight: 700 }}>{meta.label} Profile</span>
      </div>

      {/* Preview is cropped to the top of the device and faded out — a gallery
          tile should tease the profile, not reproduce it at unreadable size. */}
      <div
        style={{
          position: "relative",
          height: width * 1.42,
          overflow: "hidden",
          display: "grid",
          justifyItems: "center",
          paddingTop: 18,
          background: `linear-gradient(180deg, color-mix(in srgb, ${meta.accent} 7%, transparent), transparent 80%)`,
        }}
      >
        <div style={{ pointerEvents: "none" }}>
          <Phone width={width} statusOnImage lightHome>
            <ProfileView profile={profile} interactive={false} />
          </Phone>
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 56,
            background: "linear-gradient(to top, var(--surface) 12%, transparent)",
          }}
        />
      </div>

      <div style={{ padding: "12px 14px 16px", marginTop: "auto" }}>
        <p className="small" style={{ fontWeight: 700 }}>{profile.name}</p>
        <p className="tiny muted clamp-2" style={{ marginTop: 3 }}>{meta.blurb}</p>
        <span className="row g4 tiny" style={{ marginTop: 10, color: meta.accent, fontWeight: 700 }}>
          View example
          <Icon name="chevR" size={12} />
        </span>
      </div>
    </Link>
  );
}
