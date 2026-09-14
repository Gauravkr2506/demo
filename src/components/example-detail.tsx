"use client";

/**
 * A single example profile — the layout from concept boards #4 and #5:
 * live phone on the left, what-you-get list on the right, QR beneath it.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { ExampleCard } from "./example-card";
import { EXAMPLE_PROFILES } from "@/lib/demo-data";
import { buttonMeta, typeMeta } from "@/lib/catalog";
import { useOrigin } from "@/lib/use-origin";
import { useToast } from "@/lib/store";
import type { Profile } from "@/lib/types";

const HIGHLIGHTS: Record<string, { icon: string; title: string; body: string }[]> = {
  default: [
    { icon: "camera", title: "Custom Photo & Background", body: "Make it your own." },
    { icon: "share", title: "Add Your Links", body: "Anything you want people to reach." },
    { icon: "image", title: "Share More About You", body: "Add a bio, interests, photos and more." },
    { icon: "pencil", title: "Change Anytime", body: "Update your links whenever you want." },
    { icon: "gear", title: "Show Only What You Want", body: "Choose and customise your buttons." },
  ],
};

export function ExampleDetail({ profile }: { profile: Profile }) {
  const meta = typeMeta(profile.type);
  const origin = useOrigin();
  const router = useRouter();
  const toast = useToast();

  const related = EXAMPLE_PROFILES.filter((p) => p.id !== profile.id).slice(0, 5);
  const highlights = HIGHLIGHTS[profile.type] ?? HIGHLIGHTS.default;

  return (
    <>
      <section
        className="section-tight"
        style={{ background: `color-mix(in srgb, ${meta.accent} 6%, var(--bg))` }}
      >
        <div className="wrap">
          <Link href="/examples" className="row g6 small" style={{ color: "var(--ink-500)", fontWeight: 650 }}>
            <Icon name="chevL" size={15} />
            All examples
          </Link>

          <div className="split" style={{ marginTop: 22, alignItems: "flex-start" }}>
            {/* ---------------- device ---------------- */}
            <div style={{ display: "grid", placeItems: "center" }}>
              <Phone width={306} statusOnImage lightHome>
                <ProfileView
                  profile={profile}
                  onButtonTap={(id) => {
                    const btn = profile.buttons.find((b) => b.id === id);
                    toast(`Opening "${btn?.label}" — demo only`, "share");
                  }}
                />
              </Phone>
              <p className="tiny muted center" style={{ marginTop: 14, maxWidth: 300 }}>
                This preview is live — tap any button to see what a visitor would trigger.
              </p>
            </div>

            {/* ---------------- copy ---------------- */}
            <div>
              <span
                className="badge"
                style={{ background: `color-mix(in srgb, ${meta.accent} 14%, transparent)`, color: meta.accent }}
              >
                <Icon name={meta.icon} size={13} />
                Example
              </span>

              <h1 className="h1" style={{ marginTop: 14 }}>
                {meta.label} Profile
              </h1>
              <p className="lead" style={{ marginTop: 12, maxWidth: "42ch" }}>{meta.blurb}</p>

              <div
                className="stack g4"
                style={{
                  marginTop: 24, padding: 18, borderRadius: "var(--r-lg)",
                  background: `color-mix(in srgb, ${meta.accent} 7%, #fff)`,
                }}
              >
                {highlights.map((h) => (
                  <div key={h.title} className="row g12" style={{ padding: "9px 0", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: 36, height: 36, borderRadius: "50%", flex: "none",
                        background: meta.accent, color: "#fff", display: "grid", placeItems: "center",
                      }}
                    >
                      <Icon name={h.icon} size={17} />
                    </span>
                    <div>
                      <p style={{ fontWeight: 700, letterSpacing: "-0.015em" }}>{h.title}</p>
                      <p className="small muted">{h.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ---------------- QR for this profile ---------------- */}
              <div className="row wrapped g20" style={{ marginTop: 24, alignItems: "center" }}>
                <div className="qr-card">
                  <QRCode value={`${origin}/p/${profile.slug}`} size={142} color={meta.accent} />
                  <span className="qr-scan-label" style={{ background: meta.accent }}>SCAN ME</span>
                </div>
                <div style={{ maxWidth: 210 }}>
                  <p className="scribble" style={{ color: meta.accent }}>
                    This is the QR code
                    <br />
                    for this profile!
                  </p>
                  <p className="small muted" style={{ marginTop: 14 }}>
                    Every profile also gets its own direct code — handy for a pet tag or a
                    single event.
                  </p>
                </div>
              </div>

              <div className="row wrapped g10" style={{ marginTop: 26 }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => router.push(`/p/${profile.slug}`)}
                >
                  Open as a visitor
                  <Icon name="external" size={16} />
                </button>
                <Link href={`/create?type=${profile.type}`} className="btn btn-ghost btn-lg">
                  Build one like this
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- what's on this profile ---------------- */}
      <section className="section-tight">
        <div className="wrap">
          <h2 className="h3">What&apos;s on this profile</h2>
          <p className="small muted" style={{ marginTop: 6 }}>
            Every button is optional. This is the set {profile.name} chose to switch on.
          </p>
          <div className="grid grid-4" style={{ marginTop: 20, gap: 14 }}>
            {profile.buttons.map((btn) => {
              const bm = buttonMeta(btn.kind);
              return (
                <div key={btn.id} className="card row g10" style={{ padding: 14 }}>
                  <span
                    style={{
                      width: 34, height: 34, borderRadius: 10, flex: "none",
                      background: bm.color, color: "#fff", display: "grid", placeItems: "center",
                    }}
                  >
                    <Icon name={bm.icon} size={17} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p className="small truncate" style={{ fontWeight: 680 }}>{btn.label}</p>
                    <p className="tiny muted truncate">{btn.sublabel || btn.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- related ---------------- */}
      <section className="section-tight section-alt" style={{ marginTop: 40 }}>
        <div className="wrap">
          <div className="between wrapped" style={{ marginBottom: 20 }}>
            <h2 className="h3">Other profile types</h2>
            <Link href="/examples" className="row g6 small" style={{ color: "var(--brand-600)", fontWeight: 700 }}>
              See all
              <Icon name="chevR" size={14} />
            </Link>
          </div>
          <div className="grid grid-5">
            {related.map((p) => (
              <ExampleCard key={p.id} profile={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
