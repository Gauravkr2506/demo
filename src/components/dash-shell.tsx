"use client";

/**
 * Dashboard chrome.
 *
 * Responsive strategy — this is the part the brief specifically warned against
 * shrinking:
 *  · ≥900px — persistent left sidebar, content beside it.
 *  · <900px — sidebar disappears entirely and becomes a five-item bottom tab
 *    bar (thumb reach), with the overflow items living on the Settings tab.
 *  · The active-profile switcher stays in the top bar at every width, because
 *    it is the single most-used control in the product.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { Logo } from "./site-chrome";
import { Avatar } from "./profile-view";
import { Modal } from "./ui";
import { typeMeta } from "@/lib/catalog";
import { useApp, useToast } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "grid", exact: true },
  { href: "/dashboard/profiles", label: "My Profiles", icon: "layers" },
  { href: "/dashboard/qr", label: "QR Code", icon: "qr" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "chart" },
  { href: "/dashboard/appearance", label: "Appearance", icon: "palette" },
  { href: "/dashboard/settings", label: "Settings", icon: "gear" },
  { href: "/dashboard/help", label: "Help", icon: "help" },
];

const TABS = NAV.filter((n) =>
  ["/dashboard", "/dashboard/profiles", "/dashboard/qr", "/dashboard/analytics", "/dashboard/settings"].includes(n.href),
);

const isActive = (pathname: string, href: string, exact?: boolean) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export function DashShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated, signIn, activeProfile, setActiveProfile, signOut } = useApp();
  const toast = useToast();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Arriving straight at /dashboard (e.g. from a shared link) signs the demo
  // account in rather than bouncing to a login wall.
  useEffect(() => {
    if (hydrated && !state.signedIn) signIn();
  }, [hydrated, state.signedIn, signIn]);

  return (
    <div className="dash">
      {/* ---------------- sidebar ---------------- */}
      <aside className="dash-side">
        <Link href="/" style={{ padding: "4px 8px 14px" }}>
          <Logo size={27} />
        </Link>

        <nav className="stack g2" aria-label="Dashboard">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="nav-item"
              data-active={isActive(pathname, n.href, n.exact)}
            >
              <Icon name={n.icon} size={18} className="nav-ico" />
              {n.label}
            </Link>
          ))}
        </nav>

        <Link href="/create" className="btn btn-primary btn-block" style={{ marginTop: 14 }}>
          <Icon name="plus" size={16} />
          New Profile
        </Link>

        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <div
            className="stack g8"
            style={{ padding: 14, borderRadius: "var(--r-md)", background: "var(--bg-lilac)" }}
          >
            <span className="badge" style={{ background: "#fff" }}>
              <Icon name="sparkle" size={12} />
              {state.user.plan === "free" ? "Free plan" : `${state.user.plan} plan`}
            </span>
            <p className="tiny muted">
              {state.profiles.length} profile{state.profiles.length === 1 ? "" : "s"} · one QR code
            </p>
            <Link href="/pricing" className="tiny" style={{ color: "var(--brand-600)", fontWeight: 700 }}>
              Compare plans →
            </Link>
          </div>
        </div>
      </aside>

      {/* ---------------- main ---------------- */}
      <div className="dash-main">
        <div className="dash-topbar">
          <div className="between g12">
            <Link href="/" className="only-mobile">
              <Logo size={26} />
            </Link>

            {/* Active-profile switcher — the product's core control */}
            <button
              className="row g10"
              onClick={() => setSwitcherOpen(true)}
              style={{
                padding: "6px 12px 6px 6px",
                borderRadius: 999,
                border: "1px solid var(--line-strong)",
                background: "#fff",
                minWidth: 0,
                maxWidth: 300,
              }}
            >
              {activeProfile ? (
                <>
                  <Avatar
                    profile={activeProfile}
                    style={{ width: 28, height: 28, borderRadius: "50%", flex: "none" }}
                  />
                  <span className="stack" style={{ minWidth: 0, textAlign: "left" }}>
                    <span className="tiny muted" style={{ lineHeight: 1.1 }}>QR code shows</span>
                    <span className="small truncate" style={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {activeProfile.nickname}
                    </span>
                  </span>
                </>
              ) : (
                <span className="small" style={{ padding: "0 6px", fontWeight: 650 }}>No active profile</span>
              )}
              <Icon name="chevD" size={15} style={{ color: "var(--ink-400)", flex: "none" }} />
            </button>

            <div className="row g8">
              <button
                className="btn btn-icon btn-plain hide-mobile"
                aria-label="Notifications"
                onClick={() => toast("No new notifications", "check")}
              >
                <Icon name="bell" size={18} />
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Account menu"
                style={{
                  width: 34, height: 34, borderRadius: "50%", flex: "none",
                  background: "var(--grad-brand)", color: "#fff",
                  fontWeight: 750, fontSize: 13, display: "grid", placeItems: "center",
                }}
              >
                {state.user.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </button>
            </div>
          </div>
        </div>

        <div className="dash-content">{children}</div>
      </div>

      {/* ---------------- mobile tab bar ---------------- */}
      <nav className="dash-tabbar" aria-label="Dashboard tabs">
        {TABS.map((n) => (
          <Link key={n.href} href={n.href} data-active={isActive(pathname, n.href, n.exact)}>
            <Icon name={n.icon} size={20} />
            {n.label.replace("My ", "")}
          </Link>
        ))}
      </nav>

      {/* ---------------- profile switcher ---------------- */}
      <Modal
        open={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        title="Which profile should your QR code show?"
        subtitle="Takes effect immediately — nothing to reprint."
        width={460}
      >
        <div className="stack g8">
          {state.profiles.map((p) => {
            const meta = typeMeta(p.type);
            const active = p.id === state.user.activeProfileId;
            return (
              <button
                key={p.id}
                className="card row g12"
                style={{
                  padding: 12,
                  borderColor: active ? meta.accent : undefined,
                  background: active ? `color-mix(in srgb, ${meta.accent} 7%, #fff)` : undefined,
                }}
                onClick={() => {
                  setActiveProfile(p.id);
                  setSwitcherOpen(false);
                  toast(`QR code now shows "${p.nickname}"`, "check");
                }}
              >
                <Avatar profile={p} style={{ width: 40, height: 40, borderRadius: "50%", flex: "none" }} />
                <span className="grow" style={{ minWidth: 0, textAlign: "left" }}>
                  <span className="small truncate" style={{ fontWeight: 700, display: "block" }}>
                    {p.nickname}
                  </span>
                  <span className="tiny muted truncate" style={{ display: "block" }}>
                    {p.buttons.filter((b) => b.enabled).length} buttons · {meta.label}
                  </span>
                </span>
                {active ? (
                  <span className="badge badge-ok" style={{ flex: "none" }}>
                    <Icon name="check" size={12} />
                    Active
                  </span>
                ) : (
                  <span className="tiny" style={{ color: meta.accent, fontWeight: 700, flex: "none" }}>
                    Activate
                  </span>
                )}
              </button>
            );
          })}

          <Link href="/create" className="btn btn-ghost btn-block" onClick={() => setSwitcherOpen(false)}>
            <Icon name="plus" size={16} />
            Create a new profile
          </Link>
        </div>
      </Modal>

      {/* ---------------- account menu ---------------- */}
      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title={state.user.name} subtitle={state.user.email} width={380}>
        <div className="stack g4">
          {[
            { href: "/dashboard/settings", icon: "gear", label: "Account settings" },
            { href: "/dashboard/appearance", icon: "palette", label: "Appearance" },
            { href: "/pricing", icon: "sparkle", label: "Plans & billing" },
            { href: "/dashboard/help", icon: "help", label: "Help & support" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} size={18} className="nav-ico" />
              {item.label}
            </Link>
          ))}
          <hr className="divider" style={{ margin: "8px 0" }} />
          <button
            className="nav-item"
            style={{ color: "var(--danger-600)", width: "100%" }}
            onClick={() => {
              signOut();
              setMenuOpen(false);
              router.push("/");
            }}
          >
            <Icon name="logout" size={18} className="nav-ico" style={{ color: "var(--danger-600)" }} />
            Log out
          </button>
        </div>
      </Modal>
    </div>
  );
}

/** Consistent page header inside the dashboard. */
export function PageHead({
  title,
  subtitle,
  actions,
  back,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      {back && (
        <Link
          href={back.href}
          className="row g6 small"
          style={{ color: "var(--ink-500)", fontWeight: 650, marginBottom: 10 }}
        >
          <Icon name="chevL" size={15} />
          {back.label}
        </Link>
      )}
      <div className="between wrapped g16">
        <div>
          <h1 className="h2" style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.85rem)" }}>{title}</h1>
          {subtitle && <p className="small muted" style={{ marginTop: 5, maxWidth: "62ch" }}>{subtitle}</p>}
        </div>
        {actions && <div className="row wrapped g8">{actions}</div>}
      </div>
    </div>
  );
}
