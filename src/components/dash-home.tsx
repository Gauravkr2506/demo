"use client";

/**
 * Dashboard overview.
 *
 * The concepts show a dashboard but not what belongs on it. The job of this
 * screen is to answer three questions in one glance:
 *   1. Which profile is my QR code showing right now?
 *   2. How is it performing?
 *   3. What do I do next?
 */

import Link from "next/link";
import { useMemo } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { ProfileCard } from "./profile-card";
import { BarChart, StatCard, EmptyState } from "./ui";
import { typeMeta } from "@/lib/catalog";
import { scanSeries } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";

export function DashboardHome() {
  const { state, activeProfile } = useApp();
  const origin = useOrigin();
  const series = useMemo(() => scanSeries(30, 7, 16), []);

  const totalScans = state.profiles.reduce((n, p) => n + p.scans, 0);
  const totalTaps = state.profiles.reduce((n, p) => n + p.taps, 0);
  const tapRate = totalScans ? Math.round((totalTaps / totalScans) * 100) : 0;

  return (
    <>
      <PageHead
        title={`Good to see you, ${state.user.name.split(" ")[0]}`}
        subtitle="Here's what your QR code is doing."
        actions={
          <>
            <Link href="/dashboard/qr" className="btn btn-ghost">
              <Icon name="qr" size={16} />
              My QR code
            </Link>
            <Link href="/create" className="btn btn-primary">
              <Icon name="plus" size={16} />
              New profile
            </Link>
          </>
        }
      />

      {/* ---------------- active profile spotlight ---------------- */}
      {activeProfile ? (
        <div className="card spotlight">
          <div className="spotlight-copy">
            <span className="badge badge-live">
              <span className="dot" />
              Currently active
            </span>
            <h2 className="h3" style={{ marginTop: 12 }}>
              Your QR code is showing <span style={{ color: activeProfile.theme.accent }}>{activeProfile.nickname}</span>
            </h2>
            <p className="small muted" style={{ marginTop: 8, maxWidth: "48ch" }}>
              Anyone who scans right now sees {activeProfile.name} and the{" "}
              {activeProfile.buttons.filter((b) => b.enabled).length} buttons you switched on.
              Change profile any time — the code stays the same.
            </p>

            <div className="row wrapped g8" style={{ marginTop: 18 }}>
              <Link href={`/dashboard/profiles/${activeProfile.id}`} className="btn btn-primary">
                <Icon name="pencil" size={15} />
                Edit
              </Link>
              <Link href={`/p/${activeProfile.slug}`} className="btn btn-ghost">
                <Icon name="eye" size={15} />
                Preview
              </Link>
              <Link href="/dashboard/qr" className="btn btn-ghost">
                <Icon name="share" size={15} />
                Share
              </Link>
            </div>

            <div className="row wrapped g24" style={{ marginTop: 22 }}>
              <MiniStat label="Scans" value={activeProfile.scans} />
              <MiniStat label="Button taps" value={activeProfile.taps} />
              <MiniStat label="Type" value={typeMeta(activeProfile.type).label} />
            </div>
          </div>

          <div className="spotlight-media">
            <Phone width={196} statusOnImage lightHome>
              <ProfileView profile={activeProfile} interactive={false} />
            </Phone>
            <div className="stack g8" style={{ alignItems: "center" }}>
              <div style={{ background: "#fff", padding: 9, borderRadius: 12, boxShadow: "var(--sh-sm)" }}>
                <QRCode value={`${origin}/q/${state.user.qrSlug}`} size={104} />
              </div>
              <span className="tiny muted center" style={{ maxWidth: 120 }}>
                Your permanent code
              </span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="layers"
          title="No active profile"
          body="Your QR code has nothing to show. Create a profile or activate an existing one."
          action={
            <Link href="/create" className="btn btn-primary">
              <Icon name="plus" size={16} />
              Create a profile
            </Link>
          }
        />
      )}

      {/* ---------------- stats ---------------- */}
      <div className="grid grid-4" style={{ marginTop: 22, gap: 14 }}>
        <StatCard label="Total scans" value={totalScans.toLocaleString()} delta={12} icon="scan" />
        <StatCard label="Button taps" value={totalTaps.toLocaleString()} delta={8} icon="zap" accent="#8b5cf6" />
        <StatCard label="Tap-through rate" value={`${tapRate}%`} delta={3} icon="trendUp" accent="#16a34a" />
        <StatCard label="Profiles" value={state.profiles.length} icon="layers" accent="#f59e0b" />
      </div>

      {/* ---------------- activity + shortcuts ---------------- */}
      <div className="dash-split" style={{ marginTop: 22 }}>
        <div className="card card-p">
          <div className="between wrapped g12" style={{ marginBottom: 18 }}>
            <div>
              <h3 className="h4">Scans over the last 30 days</h3>
              <p className="tiny muted" style={{ marginTop: 3 }}>Sample data for the prototype</p>
            </div>
            <Link href="/dashboard/analytics" className="btn btn-sm btn-ghost">
              Full analytics
              <Icon name="chevR" size={13} />
            </Link>
          </div>
          <BarChart data={series} />
        </div>

        <div className="card card-p">
          <h3 className="h4" style={{ marginBottom: 14 }}>Quick actions</h3>
          <div className="stack g6">
            {[
              { href: "/create", icon: "plus", label: "Create a new profile", hint: "Work, pet, event, anything" },
              { href: "/dashboard/qr", icon: "download", label: "Download my QR code", hint: "PNG, SVG or print sheet" },
              { href: "/dashboard/appearance", icon: "palette", label: "Change how profiles look", hint: "Colours and button styles" },
              { href: "/dashboard/help", icon: "help", label: "Get help", hint: "Guides and contact" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="row g12" style={{ padding: "10px 8px", borderRadius: "var(--r-sm)" }}>
                <span
                  style={{
                    width: 34, height: 34, borderRadius: 10, flex: "none",
                    background: "var(--bg-lilac)", color: "var(--brand-600)",
                    display: "grid", placeItems: "center",
                  }}
                >
                  <Icon name={a.icon} size={17} />
                </span>
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="small truncate" style={{ fontWeight: 660, display: "block" }}>{a.label}</span>
                  <span className="tiny muted truncate" style={{ display: "block" }}>{a.hint}</span>
                </span>
                <Icon name="chevR" size={15} style={{ color: "var(--ink-300)", flex: "none" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- profiles ---------------- */}
      <div className="between wrapped g12" style={{ marginTop: 34, marginBottom: 16 }}>
        <div>
          <h2 className="h3">My Profiles</h2>
          <p className="small muted" style={{ marginTop: 4 }}>
            One account, {state.profiles.length} profiles, one QR code.
          </p>
        </div>
        <Link href="/dashboard/profiles" className="btn btn-sm btn-ghost">
          See all
          <Icon name="chevR" size={13} />
        </Link>
      </div>

      <div className="grid grid-3">
        {state.profiles.slice(0, 3).map((p) => (
          <ProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="tiny muted">{label}</p>
      <p style={{ fontWeight: 780, fontSize: "1.15rem", letterSpacing: "-0.03em" }}>{value}</p>
    </div>
  );
}
