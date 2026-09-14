"use client";

/**
 * Concept board #6 ("You Control What People See") made real.
 *
 * Toggling a row adds or removes the button from the phone on the right in the
 * same frame. Visitors grasp the on/off model instantly — and it previews the
 * editor they'll meet later, so the dashboard feels familiar on arrival.
 */

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { Switch } from "./ui";
import { buttonMeta } from "@/lib/catalog";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { useOrigin } from "@/lib/use-origin";
import type { Profile } from "@/lib/types";

const SEED: Profile = (() => {
  const base = DEMO_PROFILES.find((p) => p.id === "pr_work")!;
  return {
    ...base,
    name: "Your Name",
    tagline: "Outdoor Enthusiast | Dog Lover | Traveler",
    bio: "Exploring new places, great food and good company. Always up for a hike!",
    footerNote: "Life is Better Outside",
    buttons: [
      { id: "d1", kind: "phone", label: "Call Me", value: "+1 555 018 4420", enabled: true },
      { id: "d2", kind: "email", label: "Email Me", value: "you@example.com", enabled: true },
      { id: "d3", kind: "instagram", label: "Instagram", value: "@yourhandle", enabled: true },
      { id: "d4", kind: "tiktok", label: "TikTok", value: "@yourhandle", enabled: false },
      { id: "d5", kind: "website", label: "Visit My Website", value: "yoursite.com", enabled: true },
      { id: "d6", kind: "location", label: "Location", value: "Denver, CO", enabled: false },
      { id: "d7", kind: "calendar", label: "Calendar", value: "cal.com/you", enabled: false },
    ],
  };
})();

export function ControlDemo() {
  const [profile, setProfile] = useState<Profile>(SEED);
  const origin = useOrigin();
  const onCount = profile.buttons.filter((b) => b.enabled).length;

  const toggle = (id: string) =>
    setProfile((p) => ({
      ...p,
      buttons: p.buttons.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b)),
    }));

  return (
    <section className="section section-lilac">
      <div className="wrap">
        <div className="center" style={{ marginBottom: 12 }}>
          <h2 className="h1">
            <span className="grad-text">You Control</span> What People See
          </h2>
          <p className="lead" style={{ margin: "14px auto 0", maxWidth: "58ch" }}>
            Add the buttons you want. When someone scans your QR code, they only see the
            buttons you switched on. Try it — flip a switch.
          </p>
        </div>

        <div className="center" style={{ marginBottom: 34 }}>
          <span className="badge" style={{ background: "#fff" }}>
            Same QR code · Different profiles · Only your buttons appear
          </span>
        </div>

        <div className="grid grid-3" style={{ alignItems: "start", gap: 20 }}>
          {/* ---- 1. the control panel ---- */}
          <DemoCard n={1} title="Customize Your Profile" body="Add, remove or reorder buttons anytime.">
            <Phone width={230}>
              <div style={{ padding: "5% 5% 8%" }}>
                <div className="between" style={{ marginBottom: "6%" }}>
                  <span className="row g6" style={{ fontSize: 13, fontWeight: 700 }}>
                    <Icon name="chevL" size={14} />
                    Edit My Profile
                  </span>
                  <span
                    style={{
                      background: "var(--grad-brand)", color: "#fff", fontSize: 11,
                      fontWeight: 700, padding: "5px 12px", borderRadius: 999,
                    }}
                  >
                    Save
                  </span>
                </div>

                <p className="tiny" style={{ fontWeight: 700, color: "var(--ink-700)", marginBottom: "4%" }}>
                  Add or Remove Buttons
                </p>

                <div className="stack g6">
                  {profile.buttons.map((btn) => {
                    const meta = buttonMeta(btn.kind);
                    return (
                      <div key={btn.id} className="row g8" style={{ padding: "3px 0" }}>
                        <span
                          style={{
                            width: 26, height: 26, borderRadius: 7, flex: "none",
                            background: meta.color, color: "#fff",
                            display: "grid", placeItems: "center",
                            opacity: btn.enabled ? 1 : 0.4,
                            transition: "opacity 180ms",
                          }}
                        >
                          <Icon name={meta.icon} size={14} />
                        </span>
                        <span
                          className="grow truncate"
                          style={{
                            fontSize: 12.5, fontWeight: 620,
                            color: btn.enabled ? "var(--ink-900)" : "var(--ink-300)",
                          }}
                        >
                          {btn.label}
                        </span>
                        <Switch small on={btn.enabled} onChange={() => toggle(btn.id)} label={`Show ${btn.label}`} />
                        <Icon name="grip" size={14} style={{ color: "var(--ink-300)" }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Phone>
            <Note icon="gear" tone="lilac">
              <strong>Show only what you want.</strong> Turn buttons on or off anytime.
            </Note>
          </DemoCard>

          {/* ---- 2. the code ---- */}
          <DemoCard n={2} title="Share Your QR Code" body="Use it on business cards, dog tags, signs, or anywhere.">
            <div style={{ display: "grid", placeItems: "center", padding: "26px 0" }}>
              <div className="qr-card">
                <QRCode value={`${origin}/q/emma-t`} size={176} />
                <span className="qr-scan-label">SCAN ME</span>
              </div>
            </div>
            <Note icon="infinity" tone="lilac">
              <strong>One QR code.</strong> It always shows the buttons you have selected.
            </Note>
          </DemoCard>

          {/* ---- 3. the result ---- */}
          <DemoCard n={3} title="They Scan It" body="Visitors see ONLY the buttons you provided.">
            <Phone width={230} statusOnImage lightHome>
              <ProfileView profile={profile} interactive={false} />
            </Phone>
            <Note icon="check" tone="ok">
              <strong>{onCount} button{onCount === 1 ? "" : "s"} visible.</strong> If you don&apos;t add it, it won&apos;t show.
            </Note>
          </DemoCard>
        </div>

        <div className="center" style={{ marginTop: 38 }}>
          <Link href="/create" className="btn btn-primary btn-lg">
            Build your own profile
            <Icon name="right" size={17} className="chev" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DemoCard({
  n,
  title,
  body,
  children,
}: {
  n: number;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card card-p" style={{ background: "#fff" }}>
      <div className="row g10" style={{ alignItems: "flex-start", marginBottom: 16 }}>
        <span
          style={{
            width: 30, height: 30, borderRadius: "50%", flex: "none",
            background: "var(--grad-brand)", color: "#fff", fontWeight: 800, fontSize: 14,
            display: "grid", placeItems: "center",
          }}
        >
          {n}
        </span>
        <div>
          <h3 className="h4">{title}</h3>
          <p className="small muted" style={{ marginTop: 2 }}>{body}</p>
        </div>
      </div>
      <div style={{ display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

function Note({
  icon,
  tone,
  children,
}: {
  icon: string;
  tone: "lilac" | "ok";
  children: React.ReactNode;
}) {
  const bg = tone === "ok" ? "var(--ok-50)" : "var(--bg-lilac)";
  const fg = tone === "ok" ? "var(--ok-600)" : "var(--brand-600)";
  return (
    <div
      className="row g10"
      style={{ background: bg, borderRadius: "var(--r-md)", padding: "12px 14px", marginTop: 18, width: "100%" }}
    >
      <span style={{ color: fg, flex: "none" }}>
        <Icon name={icon} size={18} />
      </span>
      <span className="small" style={{ color: "var(--ink-700)", lineHeight: 1.4 }}>{children}</span>
    </div>
  );
}
