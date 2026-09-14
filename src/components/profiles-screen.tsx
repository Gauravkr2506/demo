"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { ProfileCard } from "./profile-card";
import { EmptyState, Segmented } from "./ui";
import { PROFILE_TYPES, typeMeta } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export function ProfilesScreen() {
  const { state } = useApp();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const usedTypes = Array.from(new Set(state.profiles.map((p) => p.type)));

  const profiles = state.profiles.filter((p) => {
    if (filter !== "all" && p.type !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.nickname.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.buttons.some((b) => b.label.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <PageHead
        title="My Profiles"
        subtitle="One account, one QR code, as many profiles as you need. The active one is what visitors currently see."
        actions={
          <Link href="/create" className="btn btn-primary">
            <Icon name="plus" size={16} />
            New profile
          </Link>
        }
      />

      {/* ---------------- filters ---------------- */}
      <div className="between wrapped g12" style={{ marginBottom: 18 }}>
        <div className="row g10 wrapped grow" style={{ minWidth: 0 }}>
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: 11, color: "var(--ink-300)" }}>
              <Icon name="search" size={16} />
            </span>
            <input
              className="input"
              style={{ paddingLeft: 38 }}
              placeholder="Search profiles or buttons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="row g8 hide-mobile">
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "grid", label: "Grid" },
              { value: "list", label: "List" },
            ]}
          />
        </div>
      </div>

      {/* Type filter scrolls horizontally rather than wrapping into rows */}
      <div className="scroll-x" style={{ gap: 6, marginBottom: 20, paddingBottom: 4 }}>
        <button className="pill-tab" data-active={filter === "all"} onClick={() => setFilter("all")}>
          All ({state.profiles.length})
        </button>
        {usedTypes.map((t) => {
          const meta = typeMeta(t);
          const count = state.profiles.filter((p) => p.type === t).length;
          return (
            <button
              key={t}
              className="pill-tab"
              data-active={filter === t}
              onClick={() => setFilter(t)}
              style={filter === t ? { background: meta.accent } : undefined}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {profiles.length === 0 ? (
        <EmptyState
          icon="search"
          title={state.profiles.length === 0 ? "No profiles yet" : "Nothing matches that"}
          body={
            state.profiles.length === 0
              ? "Create your first profile and your QR code will start working immediately."
              : "Try a different search term or clear the type filter."
          }
          action={
            state.profiles.length === 0 ? (
              <Link href="/create" className="btn btn-primary">
                <Icon name="plus" size={16} />
                Create a profile
              </Link>
            ) : (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            )
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-4">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      ) : (
        <ProfilesTable ids={profiles.map((p) => p.id)} />
      )}

      {/* ---------------- add another type ---------------- */}
      <div className="card card-p" style={{ marginTop: 28 }}>
        <h3 className="h4">Add another kind of profile</h3>
        <p className="small muted" style={{ marginTop: 4 }}>
          Each type comes with sensible starter buttons. You can change everything afterwards.
        </p>
        <div className="scroll-x" style={{ gap: 10, marginTop: 16, paddingBottom: 4 }}>
          {PROFILE_TYPES.map((t) => (
            <Link
              key={t.type}
              href={`/create?type=${t.type}`}
              className="card row g10"
              style={{ padding: "10px 14px", flex: "none" }}
            >
              <span
                style={{
                  width: 30, height: 30, borderRadius: 9, flex: "none",
                  background: `color-mix(in srgb, ${t.accent} 14%, transparent)`, color: t.accent,
                  display: "grid", placeItems: "center",
                }}
              >
                <Icon name={t.icon} size={16} />
              </span>
              <span className="small" style={{ fontWeight: 660 }}>{t.label}</span>
              <Icon name="plus" size={14} style={{ color: "var(--ink-300)" }} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/** Denser list view — useful once somebody has a dozen profiles. */
function ProfilesTable({ ids }: { ids: string[] }) {
  const { state, setActiveProfile } = useApp();
  const profiles = ids.map((id) => state.profiles.find((p) => p.id === id)!);

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
        <thead>
          <tr>
            {["Profile", "Type", "Buttons", "Scans", "Taps", ""].map((h, i) => (
              <th
                key={h || i}
                className="tiny"
                style={{
                  textAlign: i > 1 && i < 5 ? "right" : "left",
                  padding: "13px 16px",
                  color: "var(--ink-400)",
                  fontWeight: 700,
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => {
            const meta = typeMeta(p.type);
            const active = state.user.activeProfileId === p.id;
            return (
              <tr key={p.id}>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
                  <div className="row g10">
                    <span style={{ width: 30, height: 30, borderRadius: 9, background: p.theme.cover, flex: "none" }} />
                    <div style={{ minWidth: 0 }}>
                      <p className="small truncate" style={{ fontWeight: 680 }}>
                        {p.nickname}
                        {active && <span className="badge badge-ok" style={{ marginLeft: 8 }}>Active</span>}
                      </p>
                      <p className="tiny muted truncate">/p/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="small" style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
                  <span className="badge" style={{ background: `color-mix(in srgb, ${meta.accent} 13%, transparent)`, color: meta.accent }}>
                    {meta.label}
                  </span>
                </td>
                <td className="small" style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid var(--line)" }}>
                  {p.buttons.filter((b) => b.enabled).length}/{p.buttons.length}
                </td>
                <td className="small" style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid var(--line)" }}>
                  {p.scans}
                </td>
                <td className="small" style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid var(--line)" }}>
                  {p.taps}
                </td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
                  <div className="row g6" style={{ justifyContent: "flex-end" }}>
                    {!active && (
                      <button className="btn btn-sm btn-plain" onClick={() => setActiveProfile(p.id)}>
                        Activate
                      </button>
                    )}
                    <Link href={`/dashboard/profiles/${p.id}`} className="btn btn-sm btn-soft">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
