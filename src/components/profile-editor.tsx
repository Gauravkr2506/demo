"use client";

/**
 * Profile editor.
 *
 * Tabs (Content / Buttons / Appearance / Sharing) keep the panel short on
 * mobile while the live preview stays pinned beside it on desktop. Edits are
 * held in local state and committed on Save, so "unsaved changes" is a real
 * state the WordPress build will need to handle too.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { CopyRow, Field, Modal, Segmented } from "./ui";
import { AppearanceControls, ButtonLibrary, ButtonList, PhotoPicker } from "./editor-parts";
import { buttonMeta, typeMeta } from "@/lib/catalog";
import { useApp, useToast, uid } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";
import type { ButtonKind, Profile } from "@/lib/types";

type Tab = "content" | "buttons" | "appearance" | "sharing";

export function ProfileEditor({ id }: { id: string }) {
  const { state, updateProfile, setActiveProfile, deleteProfile } = useApp();
  const router = useRouter();
  const toast = useToast();
  const origin = useOrigin();

  const stored = state.profiles.find((p) => p.id === id);
  // `null` means "no local edits yet", so the saved record renders straight
  // away and edits only diverge once the user actually changes something.
  const [draft, setDraft] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>("content");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const view = draft ?? stored;

  const dirty = useMemo(
    () => !!draft && !!stored && JSON.stringify(draft) !== JSON.stringify(stored),
    [draft, stored],
  );

  // Warn before losing edits — the same guard production will need.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  if (!stored || !view) {
    return (
      <div className="card card-p center" style={{ padding: 56 }}>
        <Icon name="layers" size={28} style={{ margin: "0 auto 12px", color: "var(--ink-300)" }} />
        <h1 className="h3">Profile not found</h1>
        <p className="small muted" style={{ marginTop: 6 }}>It may have been deleted.</p>
        <Link href="/dashboard/profiles" className="btn btn-primary" style={{ marginTop: 18 }}>
          Back to My Profiles
        </Link>
      </div>
    );
  }

  const meta = typeMeta(view.type);
  const active = state.user.activeProfileId === view.id;
  const patch = (p: Partial<Profile>) => setDraft((d) => ({ ...(d ?? stored), ...p }));
  const enabled = view.buttons.filter((b) => b.enabled);

  const save = () => {
    updateProfile(view.id, { ...view });
    toast("Changes saved", "check");
  };

  return (
    <>
      <PageHead
        back={{ href: "/dashboard/profiles", label: "My Profiles" }}
        title={view.nickname || meta.label}
        subtitle={`/p/${view.slug} · ${enabled.length} of ${view.buttons.length} buttons visible`}
        actions={
          <>
            {dirty && <span className="badge badge-warn">Unsaved changes</span>}
            <button className="btn btn-ghost only-mobile" onClick={() => setPreviewOpen(true)}>
              <Icon name="eye" size={15} />
              Preview
            </button>
            <Link href={`/p/${view.slug}`} className="btn btn-ghost hide-mobile">
              <Icon name="eye" size={15} />
              Preview
            </Link>
            <button className="btn btn-primary" onClick={save} disabled={!dirty}>
              <Icon name="check" size={15} />
              Save
            </button>
          </>
        }
      />

      {!active && (
        <div
          className="card between wrapped g12"
          style={{ padding: "12px 16px", marginBottom: 18, background: "var(--bg-lilac)", borderColor: "transparent" }}
        >
          <span className="row g10 small">
            <Icon name="qr" size={17} style={{ color: "var(--brand-600)", flex: "none" }} />
            This profile isn&apos;t what your QR code currently shows.
          </span>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setActiveProfile(view.id);
              toast(`QR code now shows "${view.nickname}"`, "check");
            }}
          >
            Make it active
          </button>
        </div>
      )}

      <div className="editor-grid">
        <div style={{ minWidth: 0 }}>
          <div className="scroll-x" style={{ gap: 6, marginBottom: 16 }}>
            {([
              ["content", "Content", "user"],
              ["buttons", `Buttons (${view.buttons.length})`, "grid"],
              ["appearance", "Appearance", "palette"],
              ["sharing", "Sharing", "share"],
            ] as const).map(([value, label, icon]) => (
              <button
                key={value}
                className="pill-tab row g6"
                data-active={tab === value}
                onClick={() => setTab(value)}
              >
                <Icon name={icon} size={14} />
                {label}
              </button>
            ))}
          </div>

          {tab === "content" && (
            <div className="card card-p stack g20">
              <PhotoPicker profile={view} onChange={(avatar) => patch({ avatar })} />

              <div className="grid grid-2" style={{ gap: 16 }}>
                <Field label="Display name" hint="Shown to visitors">
                  <input
                    className="input"
                    value={view.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    maxLength={40}
                  />
                </Field>
                <Field label="Profile nickname" hint="Only you see this">
                  <input
                    className="input"
                    value={view.nickname}
                    onChange={(e) => patch({ nickname: e.target.value })}
                    maxLength={24}
                  />
                </Field>
              </div>

              <Field label="Tagline" counter={`${view.tagline.length}/60`}>
                <input
                  className="input"
                  value={view.tagline}
                  onChange={(e) => patch({ tagline: e.target.value.slice(0, 60) })}
                  placeholder="Adventure · Dogs · Travel"
                />
              </Field>

              <Field label="Bio" counter={`${view.bio.length}/220`}>
                <textarea
                  className="textarea"
                  value={view.bio}
                  onChange={(e) => patch({ bio: e.target.value.slice(0, 220) })}
                />
              </Field>

              <Field label="Closing line" hint="The hand-written note near the bottom">
                <input
                  className="input"
                  value={view.footerNote}
                  onChange={(e) => patch({ footerNote: e.target.value.slice(0, 40) })}
                  placeholder="Life is Better Outside"
                />
              </Field>

              <Field label="Profile link" hint="This is the address visitors land on">
                <div className="row g8 wrapped">
                  <span className="small muted" style={{ flex: "none" }}>{origin}/p/</span>
                  <input
                    className="input grow"
                    style={{ minWidth: 140 }}
                    value={view.slug}
                    onChange={(e) =>
                      patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                    }
                  />
                </div>
              </Field>
            </div>
          )}

          {tab === "buttons" && (
            <div className="card card-p">
              <div className="between wrapped g12" style={{ marginBottom: 16 }}>
                <div>
                  <h2 className="h4">Profile buttons</h2>
                  <p className="small muted" style={{ marginTop: 3 }}>
                    Reorder with the arrows or drag. Switch one off and it disappears from the
                    live profile immediately.
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setLibraryOpen(true)}>
                  <Icon name="plus" size={15} />
                  Add button
                </button>
              </div>

              <ButtonList
                buttons={view.buttons}
                onPatch={(bid, p) =>
                  patch({ buttons: view.buttons.map((b) => (b.id === bid ? { ...b, ...p } : b)) })
                }
                onRemove={(bid) => patch({ buttons: view.buttons.filter((b) => b.id !== bid) })}
                onMove={(from, to) => {
                  if (to < 0 || to >= view.buttons.length) return;
                  const next = view.buttons.slice();
                  const [moved] = next.splice(from, 1);
                  next.splice(to, 0, moved);
                  patch({ buttons: next });
                }}
              />

              <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={() => setLibraryOpen(true)}>
                <Icon name="plus" size={16} />
                Add another button
              </button>
            </div>
          )}

          {tab === "appearance" && (
            <div className="card card-p">
              <h2 className="h4" style={{ marginBottom: 4 }}>How this profile looks</h2>
              <p className="small muted" style={{ marginBottom: 20 }}>
                Appearance is per profile — your work profile can look completely different
                from your dating profile.
              </p>
              <AppearanceControls profile={view} onChange={patch} />
            </div>
          )}

          {tab === "sharing" && (
            <SharingTab profile={view} origin={origin} active={active} />
          )}

          {/* danger zone */}
          <div className="card card-p between wrapped g12" style={{ marginTop: 16 }}>
            <div>
              <p style={{ fontWeight: 700 }}>Delete this profile</p>
              <p className="small muted" style={{ maxWidth: "52ch" }}>
                Removes the profile and its buttons. Your account QR code keeps working.
              </p>
            </div>
            <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={15} />
              Delete
            </button>
          </div>
        </div>

        {/* ---------------- live preview ---------------- */}
        <aside className="editor-preview hide-mobile">
          <div className="card card-p stack g12" style={{ alignItems: "center" }}>
            <span className="badge badge-live">
              <span className="dot" />
              Live preview
            </span>
            <Phone width={268} statusOnImage lightHome>
              <ProfileView profile={view} interactive={false} />
            </Phone>
            <p className="tiny muted center">
              {enabled.length} button{enabled.length === 1 ? "" : "s"} visible
              {dirty && " · unsaved"}
            </p>
            {dirty && (
              <button className="btn btn-primary btn-block btn-sm" onClick={save}>
                Save changes
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ---------------- sticky save bar (mobile) ---------------- */}
      {dirty && (
        <div className="save-bar only-mobile">
          <button className="btn btn-ghost grow" onClick={() => setDraft(null)}>
            Discard
          </button>
          <button className="btn btn-primary grow" onClick={save}>
            <Icon name="check" size={15} />
            Save changes
          </button>
        </div>
      )}

      <ButtonLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        existing={view.buttons.map((b) => b.kind)}
        onAdd={(kind: ButtonKind) => {
          const bm = buttonMeta(kind);
          patch({
            buttons: [...view.buttons, { id: uid("bt"), kind, label: bm.label, value: "", enabled: true }],
          });
          setTab("buttons");
        }}
      />

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Live preview" width={400}>
        <div style={{ display: "grid", placeItems: "center" }}>
          <Phone width={258} statusOnImage lightHome>
            <ProfileView profile={view} interactive={false} />
          </Phone>
        </div>
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete "${view.nickname}"?`}
        width={420}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteProfile(view.id);
                toast("Profile deleted", "trash");
                router.push("/dashboard/profiles");
              }}
            >
              Delete profile
            </button>
          </>
        }
      >
        <p className="small muted">This cannot be undone in the prototype.</p>
      </Modal>
    </>
  );
}

function SharingTab({
  profile,
  origin,
  active,
}: {
  profile: Profile;
  origin: string;
  active: boolean;
}) {
  const [style, setStyle] = useState<"brand" | "black">("brand");
  const toast = useToast();
  const url = `${origin}/p/${profile.slug}`;

  return (
    <div className="stack g16">
      <div className="card card-p">
        <h2 className="h4">This profile&apos;s own QR code</h2>
        <p className="small muted" style={{ marginTop: 4, maxWidth: "58ch" }}>
          Links straight to this profile, regardless of which one is active. Useful for a
          pet tag, a single event, or a printed flyer.
        </p>

        <div className="row wrapped g24" style={{ marginTop: 20, alignItems: "flex-start" }}>
          <div className="stack g10" style={{ alignItems: "center" }}>
            <div className="qr-card">
              <QRCode
                value={url}
                size={172}
                color={style === "brand" ? profile.theme.accent : "#0b0b10"}
              />
              <span
                className="qr-scan-label"
                style={style === "brand" ? { background: profile.theme.accent } : undefined}
              >
                SCAN ME
              </span>
            </div>
            <Segmented
              value={style}
              onChange={setStyle}
              options={[
                { value: "brand", label: "Accent" },
                { value: "black", label: "Black" },
              ]}
            />
          </div>

          <div className="stack g12 grow" style={{ minWidth: 220 }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Profile link</p>
              <CopyRow value={url} label="Link" />
            </div>

            <div className="grid grid-2" style={{ gap: 8 }}>
              {["PNG", "SVG", "PDF", "Print sheet"].map((f) => (
                <button
                  key={f}
                  className="btn btn-ghost btn-sm"
                  onClick={() => toast(`${f} download — simulated`, "check")}
                >
                  <Icon name="download" size={14} />
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-2" style={{ gap: 8 }}>
              {[
                { label: "Message", icon: "message" },
                { label: "Email", icon: "mail" },
                { label: "WhatsApp", icon: "whatsapp" },
                { label: "More", icon: "share" },
              ].map((s) => (
                <button
                  key={s.label}
                  className="btn btn-ghost btn-sm"
                  onClick={() => toast(`Share via ${s.label} — simulated`, "share")}
                >
                  <Icon name={s.icon} size={14} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card card-p row g12" style={{ background: "var(--bg-alt)" }}>
        <Icon name="help" size={19} style={{ color: "var(--brand-600)", flex: "none" }} />
        <p className="small muted">
          {active
            ? "Your main account QR code is also pointing here right now."
            : "Your main account QR code is pointing at a different profile. Both codes can be in circulation at once."}{" "}
          <Link href="/dashboard/qr" style={{ color: "var(--brand-600)", fontWeight: 650 }}>
            Manage the account code →
          </Link>
        </p>
      </div>
    </div>
  );
}
