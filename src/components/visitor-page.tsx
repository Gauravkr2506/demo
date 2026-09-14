"use client";

/**
 * The visitor experience — the page a stranger lands on after scanning.
 *
 * Deliberately NOT wrapped in a phone frame: this is the real page, so it is
 * mobile-first and simply centres itself on wider screens. A dismissible strip
 * at the top marks it as the visitor view for anyone clicking through the
 * prototype; it is prototype chrome, not part of the product.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "./icon";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { Modal } from "./ui";
import { EXAMPLE_PROFILES } from "@/lib/demo-data";
import { resolveAction } from "@/lib/links";
import { buttonMeta } from "@/lib/catalog";
import { useApp, useToast } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";
import type { Profile, ProfileButton } from "@/lib/types";

export function VisitorPage({ slug }: { slug: string }) {
  const { state, hydrated, updateProfile } = useApp();
  const params = useSearchParams();
  const origin = useOrigin();
  const toast = useToast();

  const [tapped, setTapped] = useState<ProfileButton | null>(null);
  const [showChrome, setShowChrome] = useState(true);
  const [showQr, setShowQr] = useState(false);

  const viaScan = params.get("via") === "qr";
  const owned = state.profiles.find((p) => p.slug === slug);
  const profile: Profile | undefined = owned ?? EXAMPLE_PROFILES.find((p) => p.slug === slug);

  // Count the visit once, the way the production page would.
  useEffect(() => {
    if (!hydrated || !owned || !viaScan) return;
    updateProfile(owned.id, { scans: owned.scans + 1 });
    // Intentionally runs once per arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, viaScan, slug]);

  // Examples are static data, so they render on the server straight away.
  // A profile that exists in neither place may still be loading from storage.
  if (!profile && !hydrated) return <VisitorSkeleton />;

  if (!profile) {
    return (
      <div className="visitor-shell" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div className="center card card-p" style={{ maxWidth: 380 }}>
          <Icon name="scan" size={30} style={{ margin: "0 auto 12px", color: "var(--ink-300)" }} />
          <h1 className="h3">Profile unavailable</h1>
          <p className="small muted" style={{ marginTop: 8 }}>
            This profile has been deactivated or the link is incorrect.
          </p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: 18 }}>
            Go to QRSPACE
          </Link>
        </div>
      </div>
    );
  }

  const action = tapped ? resolveAction(tapped) : null;
  const meta = tapped ? buttonMeta(tapped.kind) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-alt)" }}>
      {/* ---- prototype chrome ---- */}
      {showChrome && (
        <div
          style={{
            background: "var(--ink-900)", color: "#fff",
            padding: "9px 16px", position: "sticky", top: 0, zIndex: 40,
          }}
        >
          <div className="between g12" style={{ maxWidth: 760, margin: "0 auto" }}>
            <span className="row g8 tiny" style={{ color: "rgba(255,255,255,.82)", minWidth: 0 }}>
              <Icon name="eye" size={14} style={{ flex: "none" }} />
              <span className="truncate">
                {viaScan ? "Scanned — this is the visitor view" : "Visitor view"}
              </span>
            </span>
            <span className="row g8" style={{ flex: "none" }}>
              <Link
                href={owned ? "/dashboard" : "/examples"}
                className="tiny"
                style={{ color: "#fff", fontWeight: 650 }}
              >
                {owned ? "Back to dashboard" : "Back to examples"}
              </Link>
              <button onClick={() => setShowChrome(false)} aria-label="Hide banner" style={{ color: "rgba(255,255,255,.6)" }}>
                <Icon name="x" size={15} />
              </button>
            </span>
          </div>
        </div>
      )}

      {/* ---- the profile itself ---- */}
      <div className="visitor-shell">
        <div className="visitor-card">
          <ProfileView profile={profile} onButtonTap={(id) => setTapped(profile.buttons.find((b) => b.id === id) ?? null)} />

          {/* Actions a visitor wants but the concepts didn't show:
              saving the contact and passing the profile on. */}
          <div className="visitor-actions">
            <button
              className="btn btn-dark btn-block"
              onClick={() => toast("Contact card downloaded (demo)", "check")}
            >
              <Icon name="download" size={16} />
              Save to contacts
            </button>
            <div className="row g8">
              <button
                className="btn btn-ghost grow"
                onClick={() => {
                  navigator.clipboard?.writeText(`${origin}/p/${profile.slug}`).catch(() => {});
                  toast("Profile link copied", "copy");
                }}
              >
                <Icon name="link" size={15} />
                Copy link
              </button>
              <button className="btn btn-ghost grow" onClick={() => setShowQr(true)}>
                <Icon name="qr" size={15} />
                QR code
              </button>
            </div>
          </div>
        </div>

        <p className="tiny muted center" style={{ padding: "18px 20px 34px" }}>
          Want your own?{" "}
          <Link href="/create" style={{ color: "var(--brand-600)", fontWeight: 700 }}>
            Create a free QRSPACE profile
          </Link>
        </p>
      </div>

      {/* ---- what this button would do ---- */}
      <Modal
        open={!!tapped}
        onClose={() => setTapped(null)}
        title={tapped?.label}
        subtitle="What this button does"
        width={420}
      >
        {tapped && action && meta && (
          <>
            <div
              className="row g12"
              style={{ padding: 14, borderRadius: "var(--r-md)", background: "var(--bg-alt)" }}
            >
              <span
                style={{
                  width: 42, height: 42, borderRadius: 12, flex: "none",
                  background: meta.color, color: "#fff", display: "grid", placeItems: "center",
                }}
              >
                <Icon name={meta.icon} size={20} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700 }}>{action.verb}</p>
                <p className="small muted truncate">{action.target}</p>
              </div>
            </div>

            <div
              className="stack g6"
              style={{ marginTop: 14, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--bg-lilac)" }}
            >
              <p className="tiny" style={{ fontWeight: 750, color: "var(--brand-700)" }}>
                For the production build
              </p>
              <code className="tiny" style={{ wordBreak: "break-all", color: "var(--ink-700)" }}>
                {action.href}
              </code>
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              onClick={() => {
                if (owned) updateProfile(owned.id, { taps: owned.taps + 1 });
                setTapped(null);
                toast(`${action.verb} — simulated`, "check");
              }}
            >
              {action.verb}
            </button>
          </>
        )}
      </Modal>

      <Modal open={showQr} onClose={() => setShowQr(false)} title="Share this profile" width={380}>
        <div className="center">
          <div className="qr-card" style={{ margin: "0 auto" }}>
            <QRCode value={`${origin}/p/${profile.slug}`} size={190} color={profile.theme.accent} />
            <span className="qr-scan-label" style={{ background: profile.theme.accent }}>SCAN ME</span>
          </div>
          <p className="small muted" style={{ marginTop: 14 }}>
            This code links directly to {profile.name}&apos;s {profile.nickname.toLowerCase()} profile.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function VisitorSkeleton() {
  return (
    <div className="visitor-shell">
      <div className="visitor-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ height: 210, background: "var(--bg-lilac)" }} />
        <div className="stack g12" style={{ padding: "48px 24px 32px" }}>
          {[60, 40, 100, 100, 100, 100].map((w, i) => (
            <div
              key={i}
              style={{
                height: i < 2 ? 16 : 46,
                width: `${w}%`,
                margin: i < 2 ? "0 auto" : undefined,
                borderRadius: 10,
                background: "var(--bg-alt)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
