"use client";

/**
 * Analytics.
 *
 * The concepts only listed "Analytics" as a menu item. The questions a user of
 * this product actually has are: is my code being scanned, which profile is
 * pulling its weight, and which buttons do people press? Those three questions
 * shape this screen.
 */

import { useMemo, useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { BarChart, MeterRow, Segmented, StatCard } from "./ui";
import { buttonMeta, typeMeta } from "@/lib/catalog";
import { DEVICE_SPLIT, SCAN_SOURCES, TOP_LOCATIONS, scanSeries } from "@/lib/demo-data";
import { useApp } from "@/lib/store";

const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const;

export function AnalyticsScreen() {
  const { state } = useApp();
  const [range, setRange] = useState<"7" | "30" | "90">("30");
  const [profileId, setProfileId] = useState<string>("all");

  const days = Number(range);
  const profiles = state.profiles;
  const scoped = profileId === "all" ? profiles : profiles.filter((p) => p.id === profileId);

  const series = useMemo(
    () => scanSeries(days, profileId === "all" ? 7 : profileId.length, profileId === "all" ? 16 : 6),
    [days, profileId],
  );

  const totalScans = series.reduce((n, d) => n + d.scans, 0);
  const totalTaps = Math.round(totalScans * 0.74);
  const uniqueVisitors = Math.round(totalScans * 0.82);
  const tapRate = totalScans ? Math.round((totalTaps / totalScans) * 100) : 0;

  // Button popularity, weighted so the demo reads like real behaviour:
  // buttons nearer the top get pressed more.
  const buttonRows = useMemo(() => {
    const rows: { label: string; kind: string; profile: string; taps: number }[] = [];
    scoped.forEach((p, pi) => {
      p.buttons
        .filter((b) => b.enabled)
        .forEach((b, bi) => {
          rows.push({
            label: b.label,
            kind: b.kind,
            profile: p.nickname,
            taps: Math.max(3, Math.round((p.taps || 40) / (bi + 1.6)) - pi * 2),
          });
        });
    });
    return rows.sort((a, b) => b.taps - a.taps).slice(0, 8);
  }, [scoped]);

  const maxButtonTaps = Math.max(...buttonRows.map((r) => r.taps), 1);
  const maxProfileScans = Math.max(...profiles.map((p) => p.scans), 1);

  return (
    <>
      <PageHead
        title="Analytics"
        subtitle="Sample data for the prototype — the shape of the reporting, not real numbers."
        actions={
          <button className="btn btn-ghost">
            <Icon name="download" size={16} />
            Export CSV
          </button>
        }
      />

      {/* ---------------- filters ---------------- */}
      <div className="between wrapped g12" style={{ marginBottom: 20 }}>
        <div className="scroll-x" style={{ gap: 6, minWidth: 0 }}>
          <button className="pill-tab" data-active={profileId === "all"} onClick={() => setProfileId("all")}>
            All profiles
          </button>
          {profiles.map((p) => (
            <button
              key={p.id}
              className="pill-tab"
              data-active={profileId === p.id}
              onClick={() => setProfileId(p.id)}
            >
              {p.nickname}
            </button>
          ))}
        </div>
        <Segmented value={range} onChange={setRange} options={[...RANGES]} />
      </div>

      {/* ---------------- headline stats ---------------- */}
      <div className="grid grid-4" style={{ gap: 14 }}>
        <StatCard label="Scans" value={totalScans.toLocaleString()} delta={14} icon="scan" />
        <StatCard label="Unique visitors" value={uniqueVisitors.toLocaleString()} delta={9} icon="users" accent="#8b5cf6" />
        <StatCard label="Button taps" value={totalTaps.toLocaleString()} delta={11} icon="zap" accent="#f59e0b" />
        <StatCard label="Tap-through rate" value={`${tapRate}%`} delta={-2} icon="trendUp" accent="#16a34a" />
      </div>

      {/* ---------------- trend ---------------- */}
      <div className="card card-p" style={{ marginTop: 16 }}>
        <div className="between wrapped g12" style={{ marginBottom: 18 }}>
          <div>
            <h2 className="h4">Scans over time</h2>
            <p className="tiny muted" style={{ marginTop: 3 }}>
              {profileId === "all" ? "All profiles" : profiles.find((p) => p.id === profileId)?.nickname} ·
              last {days} days
            </p>
          </div>
        </div>
        <BarChart data={series} height={190} />
      </div>

      {/* ---------------- breakdowns ---------------- */}
      <div className="dash-split" style={{ marginTop: 16 }}>
        <div className="card card-p">
          <h2 className="h4" style={{ marginBottom: 4 }}>Most-tapped buttons</h2>
          <p className="small muted" style={{ marginBottom: 18 }}>
            What visitors actually do once they land — the most useful signal for deciding
            what to keep switched on.
          </p>
          <div className="stack g14">
            {buttonRows.map((row, i) => {
              const meta = buttonMeta(row.kind as never);
              return (
                <div key={`${row.profile}-${row.label}-${i}`} className="row g12">
                  <span
                    style={{
                      width: 32, height: 32, borderRadius: 9, flex: "none",
                      background: meta.color, color: "#fff",
                      display: "grid", placeItems: "center",
                    }}
                  >
                    <Icon name={meta.icon} size={16} />
                  </span>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="between" style={{ marginBottom: 5 }}>
                      <span className="small truncate" style={{ fontWeight: 650 }}>
                        {row.label}
                        {profileId === "all" && (
                          <span className="tiny muted"> · {row.profile}</span>
                        )}
                      </span>
                      <span className="small muted" style={{ flex: "none" }}>{row.taps}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(row.taps / maxButtonTaps) * 100}%`, background: meta.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {buttonRows.length === 0 && (
              <p className="small muted">No buttons are switched on for this profile yet.</p>
            )}
          </div>
        </div>

        <div className="stack g16">
          <div className="card card-p">
            <h2 className="h4" style={{ marginBottom: 14 }}>Devices</h2>
            <div className="stack g12">
              {DEVICE_SPLIT.map((d) => (
                <MeterRow key={d.label} label={d.label} value={d.value} max={100} suffix="%" color={d.color} />
              ))}
            </div>
          </div>

          <div className="card card-p">
            <h2 className="h4" style={{ marginBottom: 14 }}>Where scans happen</h2>
            <div className="stack g12">
              {TOP_LOCATIONS.map((l) => (
                <MeterRow key={l.label} label={l.label} value={l.value} max={100} suffix="%" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- per profile + sources ---------------- */}
      <div className="dash-split" style={{ marginTop: 16 }}>
        <div className="card card-p">
          <h2 className="h4" style={{ marginBottom: 4 }}>Scans by profile</h2>
          <p className="small muted" style={{ marginBottom: 18 }}>
            Which version of you is getting the most attention.
          </p>
          <div className="stack g14">
            {profiles.map((p) => {
              const meta = typeMeta(p.type);
              const isActive = state.user.activeProfileId === p.id;
              return (
                <div key={p.id}>
                  <div className="between small" style={{ marginBottom: 6 }}>
                    <span className="row g8" style={{ fontWeight: 640, minWidth: 0 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: meta.accent, flex: "none" }} />
                      <span className="truncate">{p.nickname}</span>
                      {isActive && <span className="badge badge-ok tiny">Active</span>}
                    </span>
                    <span className="muted" style={{ flex: "none" }}>{p.scans}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(p.scans / maxProfileScans) * 100}%`, background: meta.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card card-p">
          <h2 className="h4" style={{ marginBottom: 4 }}>Where your code lives</h2>
          <p className="small muted" style={{ marginBottom: 16 }}>
            Tag each printed code so you know what is working.
          </p>
          <div className="stack g10">
            {SCAN_SOURCES.map((s) => (
              <div key={s.label} className="row g12">
                <span
                  style={{
                    width: 34, height: 34, borderRadius: 10, flex: "none",
                    background: "var(--bg-lilac)", color: "var(--brand-600)",
                    display: "grid", placeItems: "center",
                  }}
                >
                  <Icon name={s.icon} size={16} />
                </span>
                <span className="grow small" style={{ fontWeight: 620 }}>{s.label}</span>
                <span className="small muted">{s.value}%</span>
              </div>
            ))}
          </div>
          <p className="hint" style={{ marginTop: 14 }}>
            Suggested feature: let people label each downloaded code so this table fills
            itself in.
          </p>
        </div>
      </div>
    </>
  );
}
