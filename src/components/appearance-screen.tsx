"use client";

/**
 * Appearance.
 *
 * Two levels, which the concepts didn't distinguish: a brand kit that applies
 * to every profile, and per-profile overrides. Without that split, "Appearance"
 * and "Edit profile" would just duplicate each other.
 */

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { AppearanceControls } from "./editor-parts";
import { typeMeta } from "@/lib/catalog";
import { useApp, useToast } from "@/lib/store";

export function AppearanceScreen() {
  const { state, updateProfile, activeProfile } = useApp();
  const toast = useToast();
  const [targetId, setTargetId] = useState<string>("");

  const target = state.profiles.find((p) => p.id === targetId) ?? activeProfile ?? state.profiles[0];

  const applyToAll = () => {
    if (!target) return;
    state.profiles.forEach((p) => updateProfile(p.id, { theme: { ...target.theme } }));
    toast("Applied to every profile", "check");
  };

  return (
    <>
      <PageHead
        title="Appearance"
        subtitle="Style a profile, or push one look across all of them."
        actions={
          <button className="btn btn-ghost" onClick={applyToAll} disabled={!target}>
            <Icon name="copy" size={16} />
            Apply to all profiles
          </button>
        }
      />

      {!target ? (
        <div className="card card-p center" style={{ padding: 48 }}>
          <p className="small muted">Create a profile first and its styling options appear here.</p>
          <Link href="/create" className="btn btn-primary" style={{ marginTop: 16 }}>
            Create a profile
          </Link>
        </div>
      ) : (
        <>
          {/* which profile am I styling */}
          <div className="scroll-x" style={{ gap: 6, marginBottom: 20 }}>
            {state.profiles.map((p) => {
              const meta = typeMeta(p.type);
              const selected = p.id === target.id;
              return (
                <button
                  key={p.id}
                  className="pill-tab row g6"
                  data-active={selected}
                  onClick={() => setTargetId(p.id)}
                  style={selected ? { background: meta.accent } : undefined}
                >
                  <span
                    style={{
                      width: 12, height: 12, borderRadius: 4,
                      background: selected ? "rgba(255,255,255,.8)" : p.theme.accent,
                    }}
                  />
                  {p.nickname}
                </button>
              );
            })}
          </div>

          <div className="editor-grid">
            <div className="stack g16" style={{ minWidth: 0 }}>
              <div className="card card-p">
                <h2 className="h4" style={{ marginBottom: 4 }}>
                  Styling “{target.nickname}”
                </h2>
                <p className="small muted" style={{ marginBottom: 20 }}>
                  Changes save as you make them.
                </p>
                <AppearanceControls
                  profile={target}
                  onChange={(patch) => updateProfile(target.id, patch)}
                />
              </div>

              <div className="card card-p">
                <h2 className="h4" style={{ marginBottom: 4 }}>Presets</h2>
                <p className="small muted" style={{ marginBottom: 16 }}>
                  A quick starting point — every value stays editable afterwards.
                </p>
                <div className="grid grid-3" style={{ gap: 10 }}>
                  {[
                    { name: "Professional", accent: "#2563eb", style: "card", corners: "sharp" },
                    { name: "Warm", accent: "#f97316", style: "filled", corners: "round" },
                    { name: "Bold", accent: "#4f46e5", style: "filled", corners: "soft" },
                    { name: "Minimal", accent: "#475569", style: "outline", corners: "sharp" },
                    { name: "Playful", accent: "#ec4899", style: "filled", corners: "round" },
                    { name: "Nature", accent: "#16a34a", style: "card", corners: "soft" },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      className="card"
                      style={{ padding: 12, textAlign: "left" }}
                      onClick={() => {
                        updateProfile(target.id, {
                          theme: {
                            ...target.theme,
                            accent: preset.accent,
                            buttonStyle: preset.style as never,
                            corners: preset.corners as never,
                          },
                        });
                        toast(`${preset.name} applied`, "check");
                      }}
                    >
                      <span className="row g6" style={{ marginBottom: 8 }}>
                        {[1, 0.7, 0.45].map((o) => (
                          <span
                            key={o}
                            style={{
                              height: 8, flex: 1,
                              borderRadius: preset.corners === "round" ? 999 : preset.corners === "sharp" ? 2 : 4,
                              background: preset.accent, opacity: o,
                            }}
                          />
                        ))}
                      </span>
                      <span className="small" style={{ fontWeight: 660 }}>{preset.name}</span>
                      <span className="tiny muted" style={{ display: "block" }}>
                        {preset.style} · {preset.corners}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card card-p row g12" style={{ background: "var(--bg-alt)" }}>
                <Icon name="sparkle" size={19} style={{ color: "var(--brand-600)", flex: "none" }} />
                <p className="small muted">
                  Recommendation for the production build: keep appearance per profile.
                  A pet tag and a work card genuinely need different looks, and forcing one
                  global theme is the most common complaint about link-in-bio tools.
                </p>
              </div>
            </div>

            <aside className="editor-preview hide-mobile">
              <div className="card card-p stack g12" style={{ alignItems: "center" }}>
                <span className="badge badge-live">
                  <span className="dot" />
                  Live preview
                </span>
                <Phone width={268} statusOnImage lightHome>
                  <ProfileView profile={target} interactive={false} />
                </Phone>
                <Link href={`/dashboard/profiles/${target.id}`} className="btn btn-ghost btn-sm btn-block">
                  <Icon name="pencil" size={14} />
                  Edit content
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
