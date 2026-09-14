"use client";

/**
 * QR Code screen — dashboard → QR → select profile → display → share.
 *
 * The important idea this screen has to land: there are TWO kinds of code.
 * The account code (permanent, follows whatever is active) and per-profile
 * codes (fixed to one profile). The concepts only implied the first; a real
 * product needs both, and the tabs here make the difference obvious.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { Avatar } from "./profile-view";
import { QRCode } from "./qr-code";
import { CopyRow, Modal, Segmented } from "./ui";
import { typeMeta } from "@/lib/catalog";
import { useApp, useToast } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";

const PRINT_ITEMS = [
  { icon: "file", label: "Business card", size: "85 × 55 mm" },
  { icon: "tag", label: "Sticker sheet", size: "24 per A4" },
  { icon: "paw", label: "Pet tag", size: "30 mm circle" },
  { icon: "image", label: "Poster / sign", size: "A4 or A3" },
];

export function QRScreen() {
  const { state, activeProfile, setActiveProfile } = useApp();
  const params = useSearchParams();
  const origin = useOrigin();
  const toast = useToast();

  const preselected = params.get("profile");
  const [mode, setMode] = useState<"account" | "profile">(preselected ? "profile" : "account");
  const [selectedId, setSelectedId] = useState(preselected ?? state.user.activeProfileId);
  const [color, setColor] = useState<"black" | "brand">("black");
  const [shareOpen, setShareOpen] = useState(false);

  const selected = state.profiles.find((p) => p.id === selectedId) ?? state.profiles[0];
  const isAccount = mode === "account";

  const url = isAccount
    ? `${origin}/q/${state.user.qrSlug}`
    : `${origin}/p/${selected?.slug ?? ""}`;

  const accent = isAccount ? "#4f46e5" : selected?.theme.accent ?? "#4f46e5";
  const qrColor = color === "brand" ? accent : "#0b0b10";

  return (
    <>
      <PageHead
        title="QR Code"
        subtitle="One permanent code for your account, plus a direct code for any individual profile."
        actions={
          <button className="btn btn-primary" onClick={() => setShareOpen(true)}>
            <Icon name="share" size={16} />
            Share
          </button>
        }
      />

      <div className="row wrapped g8" style={{ marginBottom: 20 }}>
        <button className="pill-tab" data-active={isAccount} onClick={() => setMode("account")}>
          My account code
        </button>
        <button className="pill-tab" data-active={!isAccount} onClick={() => setMode("profile")}>
          A specific profile
        </button>
      </div>

      <div className="qr-layout">
        {/* ---------------- the code ---------------- */}
        <div className="card card-p center">
          <div className="qr-card" style={{ margin: "0 auto" }}>
            <QRCode value={url} size={236} color={qrColor} />
            <span className="qr-scan-label" style={color === "brand" ? { background: accent } : undefined}>
              SCAN ME
            </span>
          </div>

          <div className="row g8" style={{ justifyContent: "center", marginTop: 18 }}>
            <Segmented
              value={color}
              onChange={setColor}
              options={[
                { value: "black", label: "Classic black" },
                { value: "brand", label: "Accent colour" },
              ]}
            />
          </div>

          <p className="small muted" style={{ marginTop: 16, maxWidth: "44ch", marginInline: "auto" }}>
            {isAccount ? (
              <>
                This code never changes. It currently opens{" "}
                <strong style={{ color: "var(--ink-900)" }}>{activeProfile?.nickname ?? "nothing"}</strong>.
              </>
            ) : (
              <>
                This code always opens{" "}
                <strong style={{ color: "var(--ink-900)" }}>{selected?.nickname}</strong>, whichever
                profile is active.
              </>
            )}
          </p>

          <div style={{ marginTop: 16, maxWidth: 420, marginInline: "auto" }}>
            <CopyRow value={url} label="Link" />
          </div>

          <div className="row wrapped g8" style={{ justifyContent: "center", marginTop: 16 }}>
            {["PNG", "SVG", "PDF"].map((f) => (
              <button
                key={f}
                className="btn btn-ghost btn-sm"
                onClick={() => toast(`${f} download — simulated`, "check")}
              >
                <Icon name="download" size={14} />
                {f}
              </button>
            ))}
            <Link href={url.replace(origin, "")} className="btn btn-sm btn-soft">
              <Icon name="scan" size={14} />
              Test scan
            </Link>
          </div>

          <p className="tiny muted" style={{ marginTop: 14 }}>
            This is a real QR code — point a phone camera at your screen and it opens.
          </p>
        </div>

        {/* ---------------- controls ---------------- */}
        <div className="stack g16">
          {isAccount ? (
            <div className="card card-p">
              <h3 className="h4">Which profile does it open?</h3>
              <p className="small muted" style={{ marginTop: 4, marginBottom: 14 }}>
                Switching takes effect immediately. Nothing you have printed needs replacing.
              </p>
              <div className="stack g8">
                {state.profiles.map((p) => {
                  const meta = typeMeta(p.type);
                  const isActive = state.user.activeProfileId === p.id;
                  return (
                    <button
                      key={p.id}
                      className="card row g12"
                      style={{
                        padding: 11,
                        borderColor: isActive ? meta.accent : undefined,
                        background: isActive ? `color-mix(in srgb, ${meta.accent} 7%, #fff)` : undefined,
                      }}
                      onClick={() => {
                        setActiveProfile(p.id);
                        toast(`QR code now shows "${p.nickname}"`, "check");
                      }}
                    >
                      <span
                        style={{
                          width: 20, height: 20, borderRadius: "50%", flex: "none",
                          border: `2px solid ${isActive ? meta.accent : "var(--line-strong)"}`,
                          background: isActive ? meta.accent : "#fff",
                          display: "grid", placeItems: "center", color: "#fff",
                        }}
                      >
                        {isActive && <Icon name="check" size={11} strokeWidth={4} />}
                      </span>
                      <Avatar profile={p} style={{ width: 32, height: 32, borderRadius: "50%", flex: "none" }} />
                      <span className="grow" style={{ minWidth: 0, textAlign: "left" }}>
                        <span className="small truncate" style={{ fontWeight: 680, display: "block" }}>
                          {p.nickname}
                        </span>
                        <span className="tiny muted truncate" style={{ display: "block" }}>
                          {p.buttons.filter((b) => b.enabled).length} buttons
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card card-p">
              <h3 className="h4">Pick a profile</h3>
              <p className="small muted" style={{ marginTop: 4, marginBottom: 14 }}>
                Each profile has its own permanent direct link.
              </p>
              <div className="stack g8">
                {state.profiles.map((p) => {
                  const meta = typeMeta(p.type);
                  const chosen = selectedId === p.id;
                  return (
                    <button
                      key={p.id}
                      className="card row g12"
                      style={{
                        padding: 11,
                        borderColor: chosen ? meta.accent : undefined,
                        background: chosen ? `color-mix(in srgb, ${meta.accent} 7%, #fff)` : undefined,
                      }}
                      onClick={() => setSelectedId(p.id)}
                    >
                      <Avatar profile={p} style={{ width: 32, height: 32, borderRadius: "50%", flex: "none" }} />
                      <span className="grow" style={{ minWidth: 0, textAlign: "left" }}>
                        <span className="small truncate" style={{ fontWeight: 680, display: "block" }}>
                          {p.nickname}
                        </span>
                        <span className="tiny muted truncate" style={{ display: "block" }}>/p/{p.slug}</span>
                      </span>
                      {chosen && <Icon name="check" size={16} style={{ color: meta.accent, flex: "none" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card card-p">
            <h3 className="h4">Print options</h3>
            <p className="small muted" style={{ marginTop: 4, marginBottom: 14 }}>
              Ready-made layouts at the right size.
            </p>
            <div className="stack g8">
              {PRINT_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="card row g10"
                  style={{ padding: 11, textAlign: "left" }}
                  onClick={() => toast(`${item.label} template — simulated`, "check")}
                >
                  <span
                    style={{
                      width: 32, height: 32, borderRadius: 9, flex: "none",
                      background: "var(--bg-lilac)", color: "var(--brand-600)",
                      display: "grid", placeItems: "center",
                    }}
                  >
                    <Icon name={item.icon} size={16} />
                  </span>
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="small" style={{ fontWeight: 660, display: "block" }}>
                      {item.label}
                    </span>
                    <span className="tiny muted">{item.size}</span>
                  </span>
                  <Icon name="download" size={14} style={{ color: "var(--ink-300)", flex: "none" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- share sheet ---------------- */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)} title="Share your profile" width={440}>
        <div className="center" style={{ marginBottom: 18 }}>
          <div className="qr-card" style={{ margin: "0 auto" }}>
            <QRCode value={url} size={150} color={qrColor} />
            <span className="qr-scan-label" style={color === "brand" ? { background: accent } : undefined}>
              SCAN ME
            </span>
          </div>
        </div>

        <CopyRow value={url} label="Link" />

        <div className="grid grid-4" style={{ gap: 8, marginTop: 14 }}>
          {[
            { label: "Message", icon: "message", color: "#22c55e" },
            { label: "Email", icon: "mail", color: "#2563eb" },
            { label: "WhatsApp", icon: "whatsapp", color: "#25d366" },
            { label: "AirDrop", icon: "share", color: "#0ea5e9" },
            { label: "Instagram", icon: "instagram", color: "#e1306c" },
            { label: "X", icon: "x", color: "#111114" },
            { label: "LinkedIn", icon: "linkedin", color: "#0a66c2" },
            { label: "More", icon: "grip", color: "#64748b" },
          ].map((s) => (
            <button
              key={s.label}
              className="stack g6"
              style={{ alignItems: "center", padding: "10px 4px", borderRadius: "var(--r-sm)" }}
              onClick={() => {
                setShareOpen(false);
                toast(`Shared via ${s.label} — simulated`, "share");
              }}
            >
              <span
                style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: s.color, color: "#fff",
                  display: "grid", placeItems: "center",
                }}
              >
                <Icon name={s.icon} size={19} />
              </span>
              <span className="tiny" style={{ fontWeight: 620 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
