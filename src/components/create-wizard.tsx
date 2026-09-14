"use client";

/**
 * Create Profile — the full flow the brief asks for:
 * type → information → photo → buttons → customise → preview → save → QR → share.
 *
 * Product decisions worth flagging to the client:
 *  · The live preview is on screen at every step, not just the "Preview" step.
 *    People edit far more confidently when they can see the result.
 *  · On mobile the preview becomes a bottom sheet triggered by a persistent
 *    "Preview" bar, because a side-by-side layout is unusable under ~900px.
 *  · Step 6 is a success state, not a dead end: it routes onward to the QR
 *    code, the visitor view, or the dashboard.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "./icon";
import { Logo } from "./site-chrome";
import { Phone } from "./phone";
import { ProfileView } from "./profile-view";
import { QRCode } from "./qr-code";
import { Field, Modal } from "./ui";
import {
  AppearanceControls,
  ButtonLibrary,
  ButtonList,
  PhotoPicker,
} from "./editor-parts";
import { COVERS, PROFILE_TYPES, avatarGradient, buttonMeta, typeMeta } from "@/lib/catalog";
import { suggestedName } from "@/lib/demo-data";
import { useApp, useToast, uid } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";
import type { ButtonKind, Profile, ProfileButton, ProfileType } from "@/lib/types";

const STEP_LABELS = ["Type", "Information", "Buttons", "Appearance", "Preview", "Done"];

function blankProfile(type: ProfileType, userName: string): Profile {
  const meta = typeMeta(type);
  return {
    id: "draft",
    slug: "",
    type,
    nickname: meta.label,
    name: suggestedName(type, userName),
    tagline: "",
    bio: "",
    avatar: avatarGradient(meta.accent),
    theme: {
      accent: meta.accent,
      buttonStyle: type === "dating" || type === "pet" ? "card" : "filled",
      corners: "soft",
      cover: COVERS[meta.defaultCover],
    },
    buttons: meta.suggested.map((kind) => {
      const bm = buttonMeta(kind);
      return { id: uid("bt"), kind, label: bm.label, value: "", enabled: true } as ProfileButton;
    }),
    footerNote: "",
    createdAt: new Date().toISOString().slice(0, 10),
    scans: 0,
    taps: 0,
  };
}

export function CreateWizard() {
  const params = useSearchParams();
  const { state, createProfile, setActiveProfile, signIn } = useApp();
  const toast = useToast();
  const origin = useOrigin();

  const presetType = params.get("type") as ProfileType | null;
  const validPreset = PROFILE_TYPES.some((t) => t.type === presetType);

  const [step, setStep] = useState(validPreset ? 1 : 0);
  const [draft, setDraft] = useState<Profile>(() =>
    blankProfile(validPreset ? (presetType as ProfileType) : "work", state.user.name),
  );
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState<Profile | null>(null);
  const [makeActive, setMakeActive] = useState(true);

  const patch = (p: Partial<Profile>) => setDraft((d) => ({ ...d, ...p }));

  const enabledCount = draft.buttons.filter((b) => b.enabled).length;
  const missingValues = draft.buttons.filter((b) => b.enabled && !b.value.trim()).length;

  const canAdvance = useMemo(() => {
    if (step === 1) return draft.name.trim().length > 0;
    if (step === 2) return enabledCount > 0;
    return true;
  }, [step, draft.name, enabledCount]);

  const chooseType = (type: ProfileType) => {
    setDraft(blankProfile(type, state.user.name));
    setStep(1);
  };

  const save = () => {
    const created = createProfile({
      ...draft,
      slug: `${draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile"}-${draft.type}`,
    });
    if (makeActive) setActiveProfile(created.id);
    signIn();
    setSaved(created);
    setStep(5);
    toast("Profile saved", "check");
  };

  /* ------------------------------------------------------------ rendering */

  const preview = <ProfileView profile={saved ?? draft} interactive={false} />;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-alt)", display: "flex", flexDirection: "column" }}>
      {/* ---------------- wizard chrome ---------------- */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 40,
          background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap between" style={{ height: 64 }}>
          <Link href="/"><Logo size={28} /></Link>

          <ol className="row g6 hide-mobile" aria-label="Progress">
            {STEP_LABELS.map((label, i) => (
              <li key={label} className="row g6">
                <span
                  className="tiny"
                  style={{
                    padding: "5px 11px", borderRadius: 999, fontWeight: 700,
                    background: i === step ? "var(--ink-900)" : i < step ? "var(--bg-lilac)" : "transparent",
                    color: i === step ? "#fff" : i < step ? "var(--brand-700)" : "var(--ink-300)",
                  }}
                >
                  {i < step ? "✓ " : ""}{label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <span style={{ width: 8, height: 1, background: "var(--line-strong)" }} />
                )}
              </li>
            ))}
          </ol>

          <div className="row g8">
            <span className="tiny muted only-mobile">
              Step {Math.min(step + 1, 6)} of 6
            </span>
            <Link href={state.signedIn ? "/dashboard" : "/"} className="btn btn-sm btn-plain">
              {saved ? "Close" : "Exit"}
            </Link>
          </div>
        </div>
        {/* Mobile progress bar */}
        <div className="only-mobile" style={{ height: 3, background: "var(--line)" }}>
          <div
            style={{
              height: "100%", width: `${((step + 1) / 6) * 100}%`,
              background: "var(--grad-brand)", transition: "width 300ms cubic-bezier(.22,1,.36,1)",
            }}
          />
        </div>
      </header>

      {/* ---------------- body ---------------- */}
      <div className="wrap" style={{ paddingBlock: "28px 120px", flex: 1 }}>
        {step === 0 ? (
          <TypeStep onPick={chooseType} />
        ) : (
          <div className="editor-grid">
            <div className="stack g20" style={{ minWidth: 0 }}>
              {step === 1 && <InfoStep draft={draft} patch={patch} />}
              {step === 2 && (
                <ButtonsStep
                  draft={draft}
                  patch={patch}
                  onOpenLibrary={() => setLibraryOpen(true)}
                  missingValues={missingValues}
                />
              )}
              {step === 3 && (
                <StepCard
                  title="Customise the look"
                  body="Colours and styles are per profile — your work profile can look nothing like your dating profile."
                >
                  <AppearanceControls profile={draft} onChange={patch} />
                </StepCard>
              )}
              {step === 4 && (
                <PreviewStep
                  draft={draft}
                  makeActive={makeActive}
                  setMakeActive={setMakeActive}
                  missingValues={missingValues}
                  onEdit={setStep}
                />
              )}
              {step === 5 && saved && (
                <DoneStep profile={saved} origin={origin} madeActive={makeActive} />
              )}
            </div>

            {/* sticky live preview (desktop) */}
            <aside className="editor-preview hide-mobile">
              <div className="card card-p stack g12" style={{ alignItems: "center" }}>
                <span className="badge badge-live">
                  <span className="dot" />
                  Live preview
                </span>
                <Phone width={272} statusOnImage lightHome>{preview}</Phone>
                <p className="tiny muted center">
                  {enabledCount} button{enabledCount === 1 ? "" : "s"} visible to visitors
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* ---------------- sticky footer nav ---------------- */}
      {step < 5 && step > 0 && (
        <div className="wizard-bar">
          <div className="wrap between g12">
            <button className="btn btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              <Icon name="chevL" size={15} />
              Back
            </button>

            <div className="row g8">
              <button className="btn btn-soft only-mobile" onClick={() => setPreviewOpen(true)}>
                <Icon name="eye" size={15} />
                Preview
              </button>
              {step < 4 ? (
                <button
                  className="btn btn-primary"
                  disabled={!canAdvance}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continue
                  <Icon name="right" size={15} className="chev" />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={save}>
                  <Icon name="check" size={15} />
                  Save profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 0 && (
        <div className="wizard-bar">
          <div className="wrap between g12">
            <Link href="/" className="btn btn-ghost">
              <Icon name="chevL" size={15} />
              Cancel
            </Link>
            <p className="small muted hide-mobile">Pick a type to begin — you can change it later.</p>
          </div>
        </div>
      )}

      {/* ---------------- mobile preview sheet ---------------- */}
      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Live preview" width={400}>
        <div style={{ display: "grid", placeItems: "center" }}>
          <Phone width={260} statusOnImage lightHome>{preview}</Phone>
          <p className="tiny muted center" style={{ marginTop: 12 }}>
            {enabledCount} button{enabledCount === 1 ? "" : "s"} visible to visitors
          </p>
        </div>
      </Modal>

      <ButtonLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        existing={draft.buttons.map((b) => b.kind)}
        onAdd={(kind: ButtonKind) => {
          const bm = buttonMeta(kind);
          patch({
            buttons: [
              ...draft.buttons,
              { id: uid("bt"), kind, label: bm.label, value: "", enabled: true },
            ],
          });
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ steps */

function StepCard({
  title,
  body,
  children,
  aside,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="card card-p">
      <div className="between wrapped g12" style={{ marginBottom: 18 }}>
        <div>
          <h2 className="h3">{title}</h2>
          <p className="small muted" style={{ marginTop: 4, maxWidth: "58ch" }}>{body}</p>
        </div>
        {aside}
      </div>
      {children}
    </div>
  );
}

function TypeStep({ onPick }: { onPick: (t: ProfileType) => void }) {
  return (
    <div>
      <div className="center" style={{ marginBottom: 30 }}>
        <p className="eyebrow">Step 1 of 6</p>
        <h1 className="h1" style={{ marginTop: 10 }}>What kind of profile is this?</h1>
        <p className="lead" style={{ margin: "12px auto 0", maxWidth: "52ch" }}>
          This sets your starting buttons and colours. Everything stays editable, and you
          can add more profiles later.
        </p>
      </div>

      <div className="grid grid-5">
        {PROFILE_TYPES.map((t) => (
          <button
            key={t.type}
            className="card card-hover"
            style={{ padding: 18, textAlign: "left" }}
            onClick={() => onPick(t.type)}
          >
            <span
              style={{
                width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center",
                background: `color-mix(in srgb, ${t.accent} 13%, transparent)`, color: t.accent,
              }}
            >
              <Icon name={t.icon} size={21} />
            </span>
            <h3 className="h4" style={{ marginTop: 12 }}>{t.label}</h3>
            <p className="tiny muted clamp-2" style={{ marginTop: 5 }}>{t.blurb}</p>
            <span className="row g6 tiny" style={{ marginTop: 12, color: t.accent, fontWeight: 700 }}>
              {t.suggested.length} starter buttons
              <Icon name="chevR" size={12} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoStep({ draft, patch }: { draft: Profile; patch: (p: Partial<Profile>) => void }) {
  const meta = typeMeta(draft.type);
  return (
    <StepCard
      title="Tell visitors who you are"
      body="This is the top of your profile — the first thing somebody sees after scanning."
      aside={
        <span className="badge" style={{ background: `color-mix(in srgb, ${meta.accent} 13%, transparent)`, color: meta.accent }}>
          <Icon name={meta.icon} size={13} />
          {meta.label}
        </span>
      }
    >
      <div className="stack g20">
        <PhotoPicker profile={draft} onChange={(avatar) => patch({ avatar })} />

        <div className="grid grid-2" style={{ gap: 16 }}>
          <Field label="Display name" hint="Shown large under your photo">
            <input
              className="input"
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="Emma Taylor"
              maxLength={40}
            />
          </Field>

          <Field label="Profile nickname" hint="Only you see this — it labels the profile in your dashboard">
            <input
              className="input"
              value={draft.nickname}
              onChange={(e) => patch({ nickname: e.target.value })}
              placeholder={meta.label}
              maxLength={24}
            />
          </Field>
        </div>

        <Field
          label="Tagline"
          hint="A short line under your name — separate items with ·"
          counter={`${draft.tagline.length}/60`}
        >
          <input
            className="input"
            value={draft.tagline}
            onChange={(e) => patch({ tagline: e.target.value.slice(0, 60) })}
            placeholder="Adventure · Dogs · Travel · Good Vibes"
          />
        </Field>

        <Field label="Bio" hint="Two or three lines works best" counter={`${draft.bio.length}/220`}>
          <textarea
            className="textarea"
            value={draft.bio}
            onChange={(e) => patch({ bio: e.target.value.slice(0, 220) })}
            placeholder="Exploring new places with my best friend. Sharing life, travel tips and dog-friendly spots."
          />
        </Field>

        <Field label="Closing line" hint="The hand-written note above “Powered by QRSPACE”">
          <input
            className="input"
            value={draft.footerNote}
            onChange={(e) => patch({ footerNote: e.target.value.slice(0, 40) })}
            placeholder="Life is Better Outside"
          />
        </Field>
      </div>
    </StepCard>
  );
}

function ButtonsStep({
  draft,
  patch,
  onOpenLibrary,
  missingValues,
}: {
  draft: Profile;
  patch: (p: Partial<Profile>) => void;
  onOpenLibrary: () => void;
  missingValues: number;
}) {
  const enabled = draft.buttons.filter((b) => b.enabled).length;

  return (
    <StepCard
      title="Choose your buttons"
      body="Switch on what you want visitors to see, fill in the details, and drag to reorder. Anything switched off simply doesn't appear."
      aside={
        <button className="btn btn-primary btn-sm" onClick={onOpenLibrary}>
          <Icon name="plus" size={15} />
          Add button
        </button>
      }
    >
      <div className="row wrapped g8" style={{ marginBottom: 14 }}>
        <span className="badge badge-ok">
          <Icon name="check" size={12} />
          {enabled} visible
        </span>
        <span className="badge badge-neutral">
          {draft.buttons.length - enabled} switched off
        </span>
        {missingValues > 0 && (
          <span className="badge badge-warn">
            <Icon name="bell" size={12} />
            {missingValues} still need a value
          </span>
        )}
      </div>

      <ButtonList
        buttons={draft.buttons}
        onPatch={(id, p) =>
          patch({ buttons: draft.buttons.map((b) => (b.id === id ? { ...b, ...p } : b)) })
        }
        onRemove={(id) => patch({ buttons: draft.buttons.filter((b) => b.id !== id) })}
        onMove={(from, to) => {
          if (to < 0 || to >= draft.buttons.length) return;
          const next = draft.buttons.slice();
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          patch({ buttons: next });
        }}
      />

      <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={onOpenLibrary}>
        <Icon name="plus" size={16} />
        Add another button
      </button>

      <p className="hint" style={{ marginTop: 12 }}>
        Values can stay empty while you experiment — the prototype won&apos;t block you,
        but the live profile would prompt before publishing.
      </p>
    </StepCard>
  );
}

function PreviewStep({
  draft,
  makeActive,
  setMakeActive,
  missingValues,
  onEdit,
}: {
  draft: Profile;
  makeActive: boolean;
  setMakeActive: (v: boolean) => void;
  missingValues: number;
  onEdit: (step: number) => void;
}) {
  const meta = typeMeta(draft.type);
  const enabled = draft.buttons.filter((b) => b.enabled);

  return (
    <div className="stack g16">
      <StepCard
        title="Check it over"
        body="This is exactly what a visitor sees after scanning. Nothing else from your account is visible to them."
      >
        <div className="stack g12">
          <SummaryRow label="Profile type" value={meta.label} onEdit={() => onEdit(0)} />
          <SummaryRow label="Display name" value={draft.name || "—"} onEdit={() => onEdit(1)} />
          <SummaryRow label="Tagline" value={draft.tagline || "Not set"} onEdit={() => onEdit(1)} />
          <SummaryRow
            label="Visible buttons"
            value={enabled.map((b) => b.label).join(", ") || "None"}
            onEdit={() => onEdit(2)}
          />
          <SummaryRow
            label="Appearance"
            value={`${draft.theme.buttonStyle} · ${draft.theme.corners} corners`}
            onEdit={() => onEdit(3)}
            swatch={draft.theme.accent}
          />
        </div>

        {missingValues > 0 && (
          <div
            className="row g10"
            style={{
              marginTop: 16, padding: "12px 14px", borderRadius: "var(--r-sm)",
              background: "var(--warn-50)", color: "var(--warn-600)",
            }}
          >
            <Icon name="bell" size={17} style={{ flex: "none" }} />
            <span className="small">
              {missingValues} visible button{missingValues === 1 ? " has" : "s have"} no value yet.
              You can still save and fill them in later.
            </span>
          </div>
        )}
      </StepCard>

      <div className="card card-p between wrapped g12">
        <div className="row g12">
          <span
            style={{
              width: 40, height: 40, borderRadius: 12, flex: "none",
              background: "var(--bg-lilac)", color: "var(--brand-600)",
              display: "grid", placeItems: "center",
            }}
          >
            <Icon name="qr" size={20} />
          </span>
          <div>
            <p style={{ fontWeight: 700 }}>Make this my active profile</p>
            <p className="small muted" style={{ maxWidth: "46ch" }}>
              Your existing QR code will start showing this profile straight away.
            </p>
          </div>
        </div>
        <label className="row g10" style={{ cursor: "pointer" }}>
          <span className="switch" data-on={makeActive} onClick={() => setMakeActive(!makeActive)} role="switch" aria-checked={makeActive} />
        </label>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
  swatch,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  swatch?: string;
}) {
  return (
    <div className="between g12" style={{ paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
      <div style={{ minWidth: 0 }}>
        <p className="tiny muted">{label}</p>
        <p className="small truncate row g8" style={{ fontWeight: 620, marginTop: 2 }}>
          {swatch && (
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: swatch, flex: "none" }} />
          )}
          {value}
        </p>
      </div>
      <button className="btn btn-sm btn-plain" onClick={onEdit}>
        <Icon name="pencil" size={13} />
        Edit
      </button>
    </div>
  );
}

function DoneStep({
  profile,
  origin,
  madeActive,
}: {
  profile: Profile;
  origin: string;
  madeActive: boolean;
}) {
  const toast = useToast();
  const meta = typeMeta(profile.type);
  const url = `${origin}/p/${profile.slug}`;

  return (
    <div className="card card-p center">
      <span
        style={{
          width: 58, height: 58, borderRadius: "50%", margin: "0 auto 16px",
          background: "var(--ok-50)", color: "var(--ok-600)",
          display: "grid", placeItems: "center",
        }}
      >
        <Icon name="check" size={28} strokeWidth={2.6} />
      </span>

      <h2 className="h2">Your {meta.label.toLowerCase()} profile is live</h2>
      <p className="lead" style={{ margin: "10px auto 0", maxWidth: "46ch" }}>
        {madeActive
          ? "Your QR code now opens this profile. Nothing to reprint — it took effect immediately."
          : "It's saved and ready. Activate it whenever you want your QR code to show it."}
      </p>

      <div className="qr-card" style={{ margin: "26px auto 0" }}>
        <QRCode value={url} size={186} color={profile.theme.accent} />
        <span className="qr-scan-label" style={{ background: profile.theme.accent }}>SCAN ME</span>
      </div>
      <p className="tiny muted" style={{ marginTop: 10 }}>
        Scan it — this code really works.
      </p>

      <div className="row wrapped g10" style={{ justifyContent: "center", marginTop: 24 }}>
        <Link href={`/p/${profile.slug}`} className="btn btn-primary btn-lg">
          <Icon name="eye" size={16} />
          View profile
        </Link>
        <Link href="/dashboard/qr" className="btn btn-ghost btn-lg">
          <Icon name="qr" size={16} />
          QR &amp; share options
        </Link>
        <button
          className="btn btn-ghost btn-lg"
          onClick={() => {
            navigator.clipboard?.writeText(url).catch(() => {});
            toast("Profile link copied", "copy");
          }}
        >
          <Icon name="link" size={16} />
          Copy link
        </button>
      </div>

      <div className="divider" style={{ margin: "26px 0 18px" }} />

      <div className="row wrapped g10" style={{ justifyContent: "center" }}>
        <Link href="/dashboard" className="btn btn-dark">
          Go to dashboard
          <Icon name="right" size={15} className="chev" />
        </Link>
        <Link href="/create" className="btn btn-plain">
          <Icon name="plus" size={15} />
          Create another profile
        </Link>
      </div>
    </div>
  );
}
