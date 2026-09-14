"use client";

/**
 * The four mockups from the concept boards, rebuilt as live components so the
 * marketing pages and the real app share one visual language.
 */

import { useState } from "react";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { Logo } from "./site-chrome";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { typeMeta } from "@/lib/catalog";
import { useOrigin } from "@/lib/use-origin";

const LIST = ["pr_work", "pr_personal", "pr_dating", "pr_social"];

function ScreenPad({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "4% 6% 8%" }}>{children}</div>;
}

/** Step 1 — the profile list inside the app. */
export function MockProfileList({ width = 200 }: { width?: number }) {
  const profiles = LIST.map((id) => DEMO_PROFILES.find((p) => p.id === id)!);
  return (
    <Phone width={width}>
      <ScreenPad>
        <div className="row g6" style={{ marginBottom: "6%" }}>
          <Logo size={width * 0.075} />
        </div>
        <p style={{ fontSize: width * 0.062, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "5%" }}>
          My Profiles
        </p>
        <div className="stack" style={{ gap: width * 0.032 }}>
          {profiles.map((p) => {
            const meta = typeMeta(p.type);
            return (
              <div
                key={p.id}
                className="row"
                style={{
                  gap: width * 0.04,
                  padding: width * 0.038,
                  borderRadius: width * 0.05,
                  border: "1px solid var(--line)",
                  background: "#fff",
                  boxShadow: "var(--sh-xs)",
                }}
              >
                <span
                  style={{
                    width: width * 0.1, height: width * 0.1, borderRadius: "50%",
                    background: meta.accent, color: "#fff", display: "grid", placeItems: "center", flex: "none",
                  }}
                >
                  <Icon name={meta.icon} size={width * 0.052} />
                </span>
                <span style={{ fontSize: width * 0.047, fontWeight: 680 }}>{meta.label}</span>
              </div>
            );
          })}
          <div
            className="row"
            style={{
              gap: width * 0.04, padding: width * 0.038, color: "var(--brand-600)",
              fontSize: width * 0.047, fontWeight: 680,
            }}
          >
            <Icon name="plus" size={width * 0.055} />
            Create New Profile
          </div>
        </div>
      </ScreenPad>
    </Phone>
  );
}

/** Step 2 — choosing which profile the QR code resolves to. */
export function MockShareSelect({ width = 200 }: { width?: number }) {
  const [picked, setPicked] = useState("pr_personal");
  const profiles = LIST.map((id) => DEMO_PROFILES.find((p) => p.id === id)!);
  return (
    <Phone width={width}>
      <ScreenPad>
        <p style={{ fontSize: width * 0.058, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6%", textAlign: "center" }}>
          Share Profile
        </p>
        <div className="stack" style={{ gap: width * 0.028 }}>
          {profiles.map((p) => {
            const active = picked === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPicked(p.id)}
                className="row"
                style={{
                  gap: width * 0.04,
                  padding: width * 0.04,
                  borderRadius: width * 0.045,
                  background: active ? "var(--bg-lilac)" : "transparent",
                  border: `1px solid ${active ? "var(--brand-500)" : "var(--line)"}`,
                  width: "100%",
                }}
              >
                <span
                  style={{
                    width: width * 0.055, height: width * 0.055, borderRadius: "50%", flex: "none",
                    border: `${width * 0.009}px solid ${active ? "var(--brand-600)" : "var(--line-strong)"}`,
                    background: active ? "var(--brand-600)" : "#fff",
                    display: "grid", placeItems: "center", color: "#fff",
                  }}
                >
                  {active && <Icon name="check" size={width * 0.03} strokeWidth={4} />}
                </span>
                <span style={{ fontSize: width * 0.046, fontWeight: 650 }}>{typeMeta(p.type).label}</span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "7%", padding: width * 0.04, borderRadius: 999,
            background: "var(--grad-brand)", color: "#fff", textAlign: "center",
            fontSize: width * 0.045, fontWeight: 700,
          }}
        >
          Activate This Profile
        </div>
        <p style={{ fontSize: width * 0.036, color: "var(--ink-400)", marginTop: "4%", textAlign: "center" }}>
          Your QR code will show the selected profile.
        </p>
      </ScreenPad>
    </Phone>
  );
}

/** Step 3 — the QR screen. */
export function MockQRScreen({ width = 200 }: { width?: number }) {
  const origin = useOrigin();
  return (
    <Phone width={width}>
      <ScreenPad>
        <div className="row g6" style={{ marginBottom: "7%", justifyContent: "center" }}>
          <Logo size={width * 0.075} />
        </div>
        <p style={{ fontSize: width * 0.055, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6%", textAlign: "center" }}>
          Your QR Code
        </p>
        <div style={{ display: "grid", placeItems: "center" }}>
          <QRCode value={`${origin}/q/emma-t`} size={width * 0.62} />
        </div>
        <div
          style={{
            marginTop: "8%", padding: width * 0.04, borderRadius: 999,
            background: "var(--grad-brand)", color: "#fff", textAlign: "center",
            fontSize: width * 0.044, fontWeight: 700,
          }}
        >
          Download QR Code
        </div>
        <p style={{ fontSize: width * 0.042, color: "var(--ink-500)", marginTop: "5%", textAlign: "center", fontWeight: 620 }}>
          Print Options
        </p>
      </ScreenPad>
    </Phone>
  );
}

/** Step 4 — what the visitor sees. */
export function MockVisitor({ width = 200, profileId = "pr_work" }: { width?: number; profileId?: string }) {
  const profile = DEMO_PROFILES.find((p) => p.id === profileId) ?? DEMO_PROFILES[0];
  return (
    <Phone width={width} statusOnImage lightHome>
      <ProfileView profile={profile} interactive={false} />
    </Phone>
  );
}
