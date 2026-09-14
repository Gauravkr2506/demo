"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { Avatar } from "./profile-view";
import { Modal } from "./ui";
import { typeMeta } from "@/lib/catalog";
import { useApp, useToast } from "@/lib/store";
import type { Profile } from "@/lib/types";

/**
 * A profile in the dashboard list.
 *
 * Every action the brief lists — view, edit, preview, QR, share — is reachable
 * from this one card, because that is where a user looks for them.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  const { state, setActiveProfile, deleteProfile, duplicateProfile } = useApp();
  const toast = useToast();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const meta = typeMeta(profile.type);
  const active = state.user.activeProfileId === profile.id;
  const visible = profile.buttons.filter((b) => b.enabled);

  return (
    <>
      <div
        className="card card-hover"
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderColor: active ? meta.accent : undefined,
        }}
      >
        {/* cover + avatar */}
        <div style={{ position: "relative", height: 78, background: profile.theme.cover }}>
          {active && (
            <span
              className="badge badge-live"
              style={{ position: "absolute", top: 10, left: 10, background: "#fff" }}
            >
              <span className="dot" />
              Active
            </span>
          )}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label={`More options for ${profile.nickname}`}
            style={{
              position: "absolute", top: 8, right: 8,
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(255,255,255,.9)", color: "var(--ink-700)",
              display: "grid", placeItems: "center",
            }}
          >
            <Icon name="grip" size={15} />
          </button>
          <Avatar
            profile={profile}
            style={{
              position: "absolute", left: 16, bottom: -22,
              width: 52, height: 52, borderRadius: "50%",
              border: "3px solid #fff", boxShadow: "var(--sh-xs)",
            }}
          />
        </div>

        <div style={{ padding: "30px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div className="row g8" style={{ marginBottom: 2 }}>
            <span
              className="badge"
              style={{
                background: `color-mix(in srgb, ${meta.accent} 13%, transparent)`,
                color: meta.accent,
              }}
            >
              <Icon name={meta.icon} size={11} />
              {meta.label}
            </span>
          </div>

          <h3 className="h4" style={{ marginTop: 8 }}>{profile.nickname}</h3>
          <p className="tiny muted truncate">{profile.name}</p>

          {/* the buttons this profile shows — the thing that differs between profiles */}
          <div className="row wrapped g4" style={{ marginTop: 12, minHeight: 26 }}>
            {visible.slice(0, 5).map((b) => (
              <span
                key={b.id}
                title={b.label}
                style={{
                  width: 24, height: 24, borderRadius: 7,
                  background: meta.accent, opacity: 0.9, color: "#fff",
                  display: "grid", placeItems: "center",
                }}
              >
                <Icon name={typeIcon(b.kind)} size={12} />
              </span>
            ))}
            {visible.length > 5 && (
              <span className="tiny muted" style={{ alignSelf: "center" }}>+{visible.length - 5}</span>
            )}
            {visible.length === 0 && <span className="tiny muted">No buttons switched on</span>}
          </div>

          <div className="row g16 tiny muted" style={{ marginTop: 12 }}>
            <span className="row g4"><Icon name="scan" size={12} />{profile.scans}</span>
            <span className="row g4"><Icon name="zap" size={12} />{profile.taps}</span>
          </div>

          <div className="row g6" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <Link href={`/dashboard/profiles/${profile.id}`} className="btn btn-sm btn-soft grow">
              <Icon name="pencil" size={13} />
              Edit
            </Link>
            <Link href={`/p/${profile.slug}`} className="btn btn-sm btn-ghost" aria-label="Preview">
              <Icon name="eye" size={13} />
            </Link>
            <Link href={`/dashboard/qr?profile=${profile.id}`} className="btn btn-sm btn-ghost" aria-label="QR code">
              <Icon name="qr" size={13} />
            </Link>
          </div>

          {!active && (
            <button
              className="btn btn-sm btn-plain btn-block"
              style={{ marginTop: 6 }}
              onClick={() => {
                setActiveProfile(profile.id);
                toast(`QR code now shows "${profile.nickname}"`, "check");
              }}
            >
              Make this my active profile
            </button>
          )}
        </div>
      </div>

      {/* ---------------- options ---------------- */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title={profile.nickname} subtitle={meta.label} width={380}>
        <div className="stack g4">
          <MenuItem icon="pencil" label="Edit profile" onClick={() => router.push(`/dashboard/profiles/${profile.id}`)} />
          <MenuItem icon="eye" label="Preview as visitor" onClick={() => router.push(`/p/${profile.slug}`)} />
          <MenuItem icon="qr" label="QR code & share" onClick={() => router.push(`/dashboard/qr?profile=${profile.id}`)} />
          <MenuItem
            icon="check"
            label={active ? "Already the active profile" : "Make active"}
            disabled={active}
            onClick={() => {
              setActiveProfile(profile.id);
              setMenuOpen(false);
              toast(`QR code now shows "${profile.nickname}"`, "check");
            }}
          />
          <MenuItem
            icon="copy"
            label="Duplicate"
            onClick={() => {
              const copy = duplicateProfile(profile.id);
              setMenuOpen(false);
              toast("Profile duplicated", "copy");
              if (copy) router.push(`/dashboard/profiles/${copy.id}`);
            }}
          />
          <hr className="divider" style={{ margin: "8px 0" }} />
          <MenuItem
            icon="trash"
            label="Delete profile"
            danger
            onClick={() => {
              setMenuOpen(false);
              setConfirmDelete(true);
            }}
          />
        </div>
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete "${profile.nickname}"?`}
        width={420}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteProfile(profile.id);
                setConfirmDelete(false);
                toast("Profile deleted", "trash");
              }}
            >
              <Icon name="trash" size={15} />
              Delete profile
            </button>
          </>
        }
      >
        <p className="small muted">
          This removes the profile and its buttons. Your QR code keeps working —
          {active ? " it will switch to another profile." : " it is not showing this profile."}
        </p>
      </Modal>
    </>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className="nav-item"
      style={{ width: "100%", color: danger ? "var(--danger-600)" : undefined, opacity: disabled ? 0.5 : 1 }}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon
        name={icon}
        size={18}
        className="nav-ico"
        style={danger ? { color: "var(--danger-600)" } : undefined}
      />
      {label}
    </button>
  );
}

/** Button kinds map to their library icon; kept local to avoid a circular import. */
function typeIcon(kind: string) {
  const map: Record<string, string> = {
    phone: "phone", sms: "message", email: "mail", website: "globe",
    calendar: "calendar", location: "pin", whatsapp: "whatsapp",
    linkedin: "linkedin", instagram: "instagram", tiktok: "tiktok",
    youtube: "youtube", facebook: "facebook", pinterest: "pinterest", x: "x",
    spotify: "spotify", photos: "image", about: "user", message: "message",
    meet: "heart", resume: "file", portfolio: "layers", shop: "bag",
    reviews: "star", rsvp: "check", registry: "tag", eventinfo: "ticket",
    petinfo: "paw", vet: "shield", emergency: "bell", menu: "file",
    review: "star", custom: "link",
  };
  return map[kind] ?? "link";
}
