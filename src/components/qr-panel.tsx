"use client";

/**
 * "Same code, different profile" proof panel.
 *
 * The visitor picks a profile; the phone swaps; the QR code does not. Making
 * the code visibly static while the content changes is the clearest way to
 * answer the question the concepts raised but never demonstrated.
 */

import { useState } from "react";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { typeMeta } from "@/lib/catalog";
import { useOrigin } from "@/lib/use-origin";

const IDS = ["pr_work", "pr_personal", "pr_dating", "pr_social"];

export function QRPanel() {
  const [active, setActive] = useState(0);
  const origin = useOrigin();
  const profiles = IDS.map((id) => DEMO_PROFILES.find((p) => p.id === id)!);
  const profile = profiles[active];

  return (
    <div className="card card-p" style={{ background: "#fff" }}>
      <div className="row g6 small" style={{ fontWeight: 700, marginBottom: 14 }}>
        <Icon name="scan" size={16} style={{ color: "var(--brand-600)" }} />
        Pick a profile — watch the code stay the same
      </div>

      <div className="row wrapped g6" style={{ marginBottom: 18 }}>
        {profiles.map((p, i) => {
          const meta = typeMeta(p.type);
          return (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className="pill-tab"
              data-active={i === active}
              style={i === active ? { background: meta.accent } : undefined}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="row g20 wrapped" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="stack g8" style={{ alignItems: "center" }}>
          <div className="qr-card" style={{ boxShadow: "none", border: "1px solid var(--line)" }}>
            <QRCode value={`${origin}/q/emma-t`} size={150} />
            <span className="qr-scan-label">SCAN ME</span>
          </div>
          <span className="badge badge-neutral">
            <Icon name="lock" size={12} />
            Identical every time
          </span>
        </div>

        <Icon name="right" size={22} style={{ color: "var(--ink-300)" }} />

        <div key={profile.id} style={{ animation: "fade 340ms cubic-bezier(.22,1,.36,1)" }}>
          <Phone width={176} statusOnImage lightHome>
            <ProfileView profile={profile} interactive={false} />
          </Phone>
        </div>
      </div>

      <p className="tiny muted center" style={{ marginTop: 16 }}>
        This code is real — scan it with your phone and it opens the active profile.
      </p>
    </div>
  );
}
