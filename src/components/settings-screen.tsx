"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { CopyRow, Field, Modal, Switch } from "./ui";
import { useApp, useToast } from "@/lib/store";
import { useOrigin } from "@/lib/use-origin";

export function SettingsScreen() {
  const { state, resetDemo, signOut } = useApp();
  const toast = useToast();
  const origin = useOrigin();
  const router = useRouter();

  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [prefs, setPrefs] = useState({
    scanAlerts: true,
    weeklyDigest: true,
    productNews: false,
    searchable: false,
    analytics: true,
  });
  const [confirmReset, setConfirmReset] = useState(false);

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <PageHead title="Settings" subtitle="Account, QR code, notifications and privacy." />

      <div className="settings-grid">
        {/* ---------------- account ---------------- */}
        <Card title="Account" body="Your details across the whole account, not one profile.">
          <div className="stack g16">
            <div className="grid grid-2" style={{ gap: 14 }}>
              <Field label="Name">
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email address">
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
            </div>
            <div className="row g8">
              <button className="btn btn-primary btn-sm" onClick={() => toast("Account details saved", "check")}>
                Save changes
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Password email sent — simulated", "check")}>
                Change password
              </button>
            </div>
          </div>
        </Card>

        {/* ---------------- qr identity ---------------- */}
        <Card
          title="Your QR code address"
          body="The permanent link behind your printed code. Changing it would invalidate anything already printed — so it is deliberately hard to do."
        >
          <CopyRow value={`${origin}/q/${state.user.qrSlug}`} label="QR link" />
          <div
            className="row g10"
            style={{
              marginTop: 14, padding: "11px 14px", borderRadius: "var(--r-sm)",
              background: "var(--warn-50)", color: "var(--warn-600)",
            }}
          >
            <Icon name="lock" size={17} style={{ flex: "none" }} />
            <span className="small">
              Locked. Contact support if you genuinely need a new code — every printed copy
              would stop working.
            </span>
          </div>
        </Card>

        {/* ---------------- plan ---------------- */}
        <Card title="Plan & billing" body="Prototype only — no payment processing is connected.">
          <div className="between wrapped g12">
            <div className="row g12">
              <span
                style={{
                  width: 42, height: 42, borderRadius: 13, flex: "none",
                  background: "var(--grad-brand)", color: "#fff",
                  display: "grid", placeItems: "center",
                }}
              >
                <Icon name="sparkle" size={20} />
              </span>
              <div>
                <p style={{ fontWeight: 700, textTransform: "capitalize" }}>{state.user.plan} plan</p>
                <p className="small muted">
                  {state.profiles.length} profiles · unlimited buttons · full analytics
                </p>
              </div>
            </div>
            <Link href="/pricing" className="btn btn-ghost btn-sm">Compare plans</Link>
          </div>
        </Card>

        {/* ---------------- notifications ---------------- */}
        <Card title="Notifications" body="What we email you about.">
          <div className="stack g4">
            <PrefRow
              label="Scan alerts"
              hint="A note the first time a new device scans your code"
              on={prefs.scanAlerts}
              onChange={() => toggle("scanAlerts")}
            />
            <PrefRow
              label="Weekly summary"
              hint="Scans, taps and your best-performing buttons"
              on={prefs.weeklyDigest}
              onChange={() => toggle("weeklyDigest")}
            />
            <PrefRow
              label="Product news"
              hint="New features and profile types"
              on={prefs.productNews}
              onChange={() => toggle("productNews")}
            />
          </div>
        </Card>

        {/* ---------------- privacy ---------------- */}
        <Card title="Privacy" body="What visitors and search engines can see.">
          <div className="stack g4">
            <PrefRow
              label="Allow search engines to index my profiles"
              hint="Off by default — most people don't want a dating profile in Google"
              on={prefs.searchable}
              onChange={() => toggle("searchable")}
            />
            <PrefRow
              label="Collect scan analytics"
              hint="Anonymous counts only. Turning this off disables the analytics screen."
              on={prefs.analytics}
              onChange={() => toggle("analytics")}
            />
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            Visitors never see your email address, your other profiles, or anything you
            switched off.
          </p>
        </Card>

        {/* ---------------- prototype tools ---------------- */}
        <Card
          title="Prototype controls"
          body="Not part of the product — these exist so you can explore the demo freely."
        >
          <div className="row wrapped g8">
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)}>
              <Icon name="refresh" size={14} />
              Reset demo data
            </button>
            <Link href="/spec" className="btn btn-ghost btn-sm">
              <Icon name="file" size={14} />
              Build specification
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <Icon name="logout" size={14} />
              Log out
            </button>
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            All prototype data lives in this browser only. Nothing is sent anywhere.
          </p>
        </Card>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset the demo?"
        width={400}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
                toast("Demo data restored", "refresh");
              }}
            >
              Reset
            </button>
          </>
        }
      >
        <p className="small muted">
          Restores the six sample profiles and discards anything you created or edited.
        </p>
      </Modal>
    </>
  );
}

function Card({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card card-p">
      <h2 className="h4">{title}</h2>
      <p className="small muted" style={{ marginTop: 4, marginBottom: 18, maxWidth: "58ch" }}>{body}</p>
      {children}
    </section>
  );
}

function PrefRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="between g16" style={{ padding: "11px 0", borderBottom: "1px solid var(--line)" }}>
      <div style={{ minWidth: 0 }}>
        <p className="small" style={{ fontWeight: 650 }}>{label}</p>
        <p className="tiny muted" style={{ marginTop: 2 }}>{hint}</p>
      </div>
      <Switch on={on} onChange={onChange} label={label} />
    </div>
  );
}
