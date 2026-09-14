"use client";

/**
 * Editing primitives shared by the creation wizard, the profile editor and the
 * appearance screen. Building them once keeps "create" and "edit" identical —
 * which is what users expect, and one less thing for the WordPress build to
 * implement twice.
 */

import { useRef, useState } from "react";
import { Icon } from "./icon";
import { Avatar } from "./profile-view";
import { Modal, Switch, Segmented } from "./ui";
import { ACCENTS, BUTTONS, BUTTON_GROUPS, COVERS, avatarGradient, buttonMeta } from "@/lib/catalog";
import type { ButtonKind, Profile, ProfileButton } from "@/lib/types";

/* ------------------------------------------------------------ photo picker */

export function PhotoPicker({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (avatar: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUpload = profile.avatar.startsWith("data:");

  // FileReader keeps the upload entirely client-side — no server needed for
  // the prototype, and it proves the interaction rather than faking it.
  const pick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="row g16 wrapped">
      <div style={{ position: "relative", flex: "none" }}>
        <Avatar
          profile={profile}
          style={{
            width: 82, height: 82, borderRadius: "50%",
            border: "3px solid #fff", boxShadow: "var(--sh-sm)",
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          aria-label="Change photo"
          style={{
            position: "absolute", right: -2, bottom: -2,
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--grad-brand)", color: "#fff",
            border: "2px solid #fff", display: "grid", placeItems: "center",
          }}
        >
          <Icon name="camera" size={14} />
        </button>
      </div>

      <div className="grow" style={{ minWidth: 180 }}>
        <p className="small" style={{ fontWeight: 680 }}>Profile photo</p>
        <p className="tiny muted" style={{ marginTop: 2 }}>
          Square works best. JPG or PNG, up to 5 MB.
        </p>
        <div className="row g8" style={{ marginTop: 10 }}>
          <button className="btn btn-sm btn-soft" onClick={() => inputRef.current?.click()}>
            <Icon name="upload" size={13} />
            {isUpload ? "Replace" : "Upload"}
          </button>
          {isUpload && (
            <button
              className="btn btn-sm btn-plain"
              onClick={() => onChange(avatarGradient(profile.theme.accent))}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

/* --------------------------------------------------------- cover selection */

export function CoverPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (cover: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(`url(${reader.result}) center/cover`);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="cover-grid">
        {Object.entries(COVERS).map(([key, css]) => (
          <button
            key={key}
            onClick={() => onChange(css)}
            aria-label={`Background ${key}`}
            aria-pressed={value === css}
            style={{
              height: 52,
              borderRadius: 11,
              background: css,
              border: value === css ? "3px solid var(--ink-900)" : "3px solid transparent",
              boxShadow: "var(--sh-xs)",
              transition: "transform 140ms",
            }}
          />
        ))}
        <button
          onClick={() => inputRef.current?.click()}
          className="stack g4"
          style={{
            height: 52, borderRadius: 11, alignItems: "center", justifyContent: "center",
            border: "2px dashed var(--line-strong)", color: "var(--ink-400)",
          }}
        >
          <Icon name="upload" size={15} />
          <span style={{ fontSize: 10, fontWeight: 650 }}>Upload</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

/* ------------------------------------------------------ appearance controls */

export function AppearanceControls({
  profile,
  onChange,
}: {
  profile: Profile;
  onChange: (patch: Partial<Profile>) => void;
}) {
  const setTheme = (patch: Partial<Profile["theme"]>) =>
    onChange({ theme: { ...profile.theme, ...patch } });

  return (
    <div className="stack g24">
      <div>
        <p className="label" style={{ marginBottom: 10 }}>Accent colour</p>
        <div className="row wrapped g8">
          {ACCENTS.map((c) => (
            <button
              key={c}
              className="swatch"
              style={{ background: c }}
              data-active={profile.theme.accent === c}
              aria-label={`Accent ${c}`}
              onClick={() => setTheme({ accent: c })}
            />
          ))}
          <label
            className="swatch row"
            style={{
              background: "conic-gradient(from 180deg, #ef4444, #eab308, #22c55e, #06b6d4, #6366f1, #ec4899, #ef4444)",
              cursor: "pointer", overflow: "hidden", justifyContent: "center",
            }}
            title="Custom colour"
          >
            <input
              type="color"
              value={profile.theme.accent}
              onChange={(e) => setTheme({ accent: e.target.value })}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div>
        <p className="label" style={{ marginBottom: 10 }}>Button style</p>
        <Segmented
          value={profile.theme.buttonStyle}
          onChange={(v) => setTheme({ buttonStyle: v })}
          options={[
            { value: "filled", label: "Filled" },
            { value: "card", label: "Card" },
            { value: "outline", label: "Outline" },
          ]}
        />
        <p className="hint" style={{ marginTop: 8 }}>
          Filled uses each button&apos;s own brand colour. Card and Outline use your accent.
        </p>
      </div>

      <div>
        <p className="label" style={{ marginBottom: 10 }}>Corners</p>
        <Segmented
          value={profile.theme.corners}
          onChange={(v) => setTheme({ corners: v })}
          options={[
            { value: "sharp", label: "Sharp" },
            { value: "soft", label: "Soft" },
            { value: "round", label: "Round" },
          ]}
        />
      </div>

      <div>
        <p className="label" style={{ marginBottom: 10 }}>Background</p>
        <CoverPicker value={profile.theme.cover} onChange={(cover) => setTheme({ cover })} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- button rows */

export function ButtonRow({
  button,
  index,
  total,
  onPatch,
  onRemove,
  onMove,
  expanded,
  onToggleExpand,
  dragProps,
}: {
  button: ProfileButton;
  index: number;
  total: number;
  onPatch: (patch: Partial<ProfileButton>) => void;
  onRemove: () => void;
  onMove: (to: number) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  dragProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const meta = buttonMeta(button.kind);

  return (
    <div className="card" style={{ overflow: "hidden", opacity: button.enabled ? 1 : 0.62 }}>
      <div className="row g10" style={{ padding: "11px 12px" }} {...dragProps}>
        {/* Desktop: drag. Every screen: arrows — HTML5 drag never works on touch. */}
        <span
          className="hide-mobile"
          style={{ color: "var(--ink-300)", cursor: "grab", flex: "none" }}
          aria-hidden
        >
          <Icon name="grip" size={16} />
        </span>

        <span
          style={{
            width: 34, height: 34, borderRadius: 10, flex: "none",
            background: meta.color, color: "#fff", display: "grid", placeItems: "center",
          }}
        >
          <Icon name={meta.icon} size={17} />
        </span>

        <button className="grow" style={{ textAlign: "left", minWidth: 0 }} onClick={onToggleExpand}>
          <span className="small truncate" style={{ fontWeight: 680, display: "block" }}>
            {button.label || meta.label}
          </span>
          <span className="tiny muted truncate" style={{ display: "block" }}>
            {button.value || <em style={{ color: "var(--warn-600)" }}>Needs a value</em>}
          </span>
        </button>

        <div className="row g4" style={{ flex: "none" }}>
          <div className="stack" style={{ gap: 1 }}>
            <button
              className="btn-plain"
              style={{ padding: "1px 4px", borderRadius: 5, color: "var(--ink-400)" }}
              onClick={() => onMove(index - 1)}
              disabled={index === 0}
              aria-label="Move up"
            >
              <Icon name="chevU" size={13} />
            </button>
            <button
              className="btn-plain"
              style={{ padding: "1px 4px", borderRadius: 5, color: "var(--ink-400)" }}
              onClick={() => onMove(index + 1)}
              disabled={index === total - 1}
              aria-label="Move down"
            >
              <Icon name="chevD" size={13} />
            </button>
          </div>

          <Switch
            small
            on={button.enabled}
            onChange={(next) => onPatch({ enabled: next })}
            label={`Show ${button.label}`}
          />

          <button
            className="btn btn-icon btn-plain"
            style={{ width: 30, height: 30 }}
            onClick={onToggleExpand}
            aria-label={expanded ? "Collapse" : "Edit"}
            aria-expanded={expanded}
          >
            <Icon name={expanded ? "chevU" : "pencil"} size={15} />
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="stack g12"
          style={{ padding: "4px 12px 14px", borderTop: "1px solid var(--line)", marginTop: 2 }}
        >
          <div className="grid grid-2" style={{ gap: 10, marginTop: 10 }}>
            <div className="field">
              <label className="label">Button text</label>
              <input
                className="input"
                value={button.label}
                onChange={(e) => onPatch({ label: e.target.value })}
                placeholder={meta.label}
                maxLength={28}
              />
            </div>
            <div className="field">
              <label className="label">{meta.inputLabel}</label>
              <input
                className="input"
                type={meta.inputType === "url" ? "text" : meta.inputType}
                value={button.value}
                onChange={(e) => onPatch({ value: e.target.value })}
                placeholder={meta.placeholder}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Second line <span className="muted">(optional)</span></label>
            <input
              className="input"
              value={button.sublabel ?? ""}
              onChange={(e) => onPatch({ sublabel: e.target.value })}
              placeholder="Shown under the button text"
              maxLength={40}
            />
          </div>

          <div className="between">
            <span className="tiny muted">
              {button.enabled ? "Visible to visitors" : "Hidden — visitors won't see this"}
            </span>
            <button className="btn btn-sm btn-danger" onClick={onRemove}>
              <Icon name="trash" size={13} />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Ordered, reorderable list of a profile's buttons. */
export function ButtonList({
  buttons,
  onPatch,
  onRemove,
  onMove,
}: {
  buttons: ProfileButton[];
  onPatch: (id: string, patch: Partial<ProfileButton>) => void;
  onRemove: (id: string) => void;
  onMove: (from: number, to: number) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <div className="stack g8">
      {buttons.map((button, i) => (
        <div
          key={button.id}
          className={dragIndex === i ? "dragging" : overIndex === i ? "drag-over" : undefined}
          style={{ borderRadius: "var(--r-lg)" }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null && dragIndex !== i) onMove(dragIndex, i);
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          <ButtonRow
            button={button}
            index={i}
            total={buttons.length}
            expanded={expanded === button.id}
            onToggleExpand={() => setExpanded(expanded === button.id ? null : button.id)}
            onPatch={(patch) => onPatch(button.id, patch)}
            onRemove={() => onRemove(button.id)}
            onMove={(to) => onMove(i, to)}
            dragProps={{
              draggable: true,
              onDragStart: () => setDragIndex(i),
              onDragEnd: () => {
                setDragIndex(null);
                setOverIndex(null);
              },
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- button library */

export function ButtonLibrary({
  open,
  onClose,
  onAdd,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (kind: ButtonKind) => void;
  existing: ButtonKind[];
}) {
  const [group, setGroup] = useState<(typeof BUTTON_GROUPS)[number]>("Contact");
  const [query, setQuery] = useState("");

  const list = BUTTONS.filter((b) =>
    query.trim()
      ? b.label.toLowerCase().includes(query.trim().toLowerCase())
      : b.group === group,
  );

  return (
    <Modal open={open} onClose={onClose} title="Add a button" subtitle="Pick anything — you can rename it after" width={560}>
      <div className="field" style={{ marginBottom: 14 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 13, top: 12, color: "var(--ink-300)" }}>
            <Icon name="search" size={17} />
          </span>
          <input
            className="input"
            style={{ paddingLeft: 40 }}
            placeholder="Search buttons…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {!query.trim() && (
        <div className="scroll-x g6" style={{ marginBottom: 14, gap: 6 }}>
          {BUTTON_GROUPS.map((g) => (
            <button key={g} className="pill-tab" data-active={group === g} onClick={() => setGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-2" style={{ gap: 8 }}>
        {list.map((b) => {
          const already = existing.filter((k) => k === b.kind).length;
          return (
            <button
              key={b.kind}
              className="card row g10"
              style={{ padding: 11, textAlign: "left" }}
              onClick={() => {
                onAdd(b.kind);
                onClose();
              }}
            >
              <span
                style={{
                  width: 34, height: 34, borderRadius: 10, flex: "none",
                  background: b.color, color: "#fff", display: "grid", placeItems: "center",
                }}
              >
                <Icon name={b.icon} size={17} />
              </span>
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="small truncate" style={{ fontWeight: 680, display: "block" }}>{b.label}</span>
                <span className="tiny muted truncate" style={{ display: "block" }}>{b.inputLabel}</span>
              </span>
              {already > 0 && <span className="badge badge-neutral tiny">{already}</span>}
              <Icon name="plus" size={16} style={{ color: "var(--brand-600)", flex: "none" }} />
            </button>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="small muted center" style={{ padding: "26px 0" }}>
          No buttons match “{query}”. Try “Any Link” for anything custom.
        </p>
      )}
    </Modal>
  );
}
