"use client";

/**
 * The hero is the product pitch in one interaction.
 *
 * Product note: the concept boards explain "one QR code → multiple profiles"
 * in words. Visitors understand it far faster if they can *do* it, so the
 * profile chips switch the phone content live while the QR code beside it
 * visibly never changes. That single interaction is the whole value prop.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { DEMO_PROFILES } from "@/lib/demo-data";
import { typeMeta } from "@/lib/catalog";
import { useOrigin } from "@/lib/use-origin";

const SHOWCASE = ["pr_work", "pr_personal", "pr_dating", "pr_social"];

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const origin = useOrigin();

  const profiles = SHOWCASE.map((id) => DEMO_PROFILES.find((p) => p.id === id)!);
  const current = profiles[index];

  // Gentle rotation until the visitor takes over.
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % profiles.length), 3800);
    return () => window.clearInterval(t);
  }, [auto, profiles.length]);

  // The QR never changes — it always points at the account, not a profile.
  const qrValue = `${origin}/q/emma-t`;

  return (
    <section style={{ background: "var(--grad-brand-soft)", overflow: "hidden" }}>
      <div className="wrap hero-grid" style={{ paddingBlock: "clamp(40px, 6vw, 76px)" }}>
        {/* ---------- copy ---------- */}
        <div className="rise">
          <span className="badge" style={{ marginBottom: 18 }}>
            <Icon name="sparkle" size={13} />
            One code. Every version of you.
          </span>

          <h1 className="display">
            One QR Code.
            <br />
            <span className="grad-text">Endless Ways</span>
            <br />
            to Share.
          </h1>

          <p className="lead" style={{ marginTop: 20, maxWidth: "46ch" }}>
            Create multiple profiles for work, personal, dating, social media and more.
            You choose what to show — anytime, anywhere.
          </p>

          <div className="row wrapped g12" style={{ marginTop: 28, justifyContent: "inherit" }}>
            <Link href="/create" className="btn btn-primary btn-lg">
              Create Your Profile
              <Icon name="right" size={17} className="chev" />
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost btn-lg">
              <Icon name="play" size={13} />
              See how it works
            </Link>
          </div>

          {/* The chips double as the live switcher */}
          <div className="row wrapped g8" style={{ marginTop: 34 }}>
            {profiles.map((p, i) => {
              const meta = typeMeta(p.type);
              const active = i === index;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setIndex(i);
                    setAuto(false);
                  }}
                  className="row g8"
                  aria-pressed={active}
                  style={{
                    padding: "9px 15px 9px 9px",
                    borderRadius: 999,
                    background: active ? "#fff" : "rgba(255,255,255,.5)",
                    border: `1px solid ${active ? meta.accent : "transparent"}`,
                    boxShadow: active ? "var(--sh-sm)" : "none",
                    transition: "all 200ms cubic-bezier(.22,1,.36,1)",
                  }}
                >
                  <span
                    style={{
                      width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center",
                      background: active ? meta.accent : "rgba(255,255,255,.85)",
                      color: active ? "#fff" : meta.accent,
                      transition: "all 200ms",
                    }}
                  >
                    <Icon name={meta.icon} size={15} />
                  </span>
                  <span
                    className="small"
                    style={{ fontWeight: 680, color: active ? "var(--ink-900)" : "var(--ink-500)" }}
                  >
                    {meta.label}
                  </span>
                </button>
              );
            })}
            <Link href="/examples" className="row g6 small" style={{ padding: "9px 6px", color: "var(--ink-500)", fontWeight: 650 }}>
              & more
              <Icon name="chevR" size={14} />
            </Link>
          </div>
        </div>

        {/* ---------- device + QR ---------- */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <Phone width={288} statusOnImage lightHome>
              <div key={current.id} style={{ animation: "fade 380ms cubic-bezier(.22,1,.36,1)" }}>
                <ProfileView profile={current} interactive={false} />
              </div>
            </Phone>

            {/* QR floats beside the device — deliberately identical every switch */}
            <div
              className="hide-mobile"
              style={{ position: "absolute", right: -108, bottom: 54, textAlign: "center" }}
            >
              <div
                style={{
                  background: "#fff", padding: 10, borderRadius: 14,
                  boxShadow: "var(--sh-lg)", display: "inline-block",
                }}
              >
                <QRCode value={qrValue} size={116} />
                <div className="qr-scan-label" style={{ marginTop: 6 }}>SCAN ME</div>
              </div>
              <p className="tiny" style={{ marginTop: 8, color: "var(--ink-400)", fontWeight: 650, maxWidth: 130 }}>
                Same code every time
              </p>
            </div>

            <p
              className="scribble hide-mobile"
              style={{ position: "absolute", right: -132, top: 26, width: 150, textAlign: "left" }}
            >
              Same QR code.
              <br />
              Different profiles.
              <br />
              You choose.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-only QR row — the floating layout would overflow on phones */}
      <div className="only-mobile wrap" style={{ paddingBottom: 40 }}>
        <div className="card card-p row g16" style={{ alignItems: "center" }}>
          <QRCode value={qrValue} size={84} />
          <div>
            <p style={{ fontWeight: 720, letterSpacing: "-0.02em" }}>Same code every time</p>
            <p className="small muted" style={{ marginTop: 2 }}>
              Switch profiles as often as you like. Your printed code never changes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
