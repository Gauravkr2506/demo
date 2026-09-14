"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { useApp } from "@/lib/store";

export function Logo({ size = 30, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <span className="row g8" style={{ flex: "none" }}>
      <span
        style={{
          width: size, height: size, borderRadius: size * 0.29,
          background: mono ? "#fff" : "var(--grad-brand)",
          display: "grid", placeItems: "center", flex: "none",
        }}
      >
        <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" aria-hidden="true"
          fill={mono ? "var(--brand-600)" : "#fff"}>
          <rect x="2" y="2" width="8.5" height="8.5" rx="2.4" opacity=".95" />
          <rect x="13.5" y="2" width="8.5" height="8.5" rx="2.4" opacity=".7" />
          <rect x="2" y="13.5" width="8.5" height="8.5" rx="2.4" opacity=".7" />
          <rect x="13.5" y="13.5" width="3.6" height="3.6" rx="1.1" />
          <rect x="18.4" y="13.5" width="3.6" height="3.6" rx="1.1" opacity=".55" />
          <rect x="13.5" y="18.4" width="3.6" height="3.6" rx="1.1" opacity=".55" />
          <rect x="18.4" y="18.4" width="3.6" height="3.6" rx="1.1" />
        </svg>
      </span>
      <span
        style={{
          fontWeight: 850, fontSize: size * 0.58, letterSpacing: "-0.035em",
          color: mono ? "#fff" : "var(--ink-900)",
        }}
      >
        QRSPACE
      </span>
    </span>
  );
}

const NAV = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/examples", label: "Examples" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { state } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 60,
        background: scrolled ? "rgba(255,255,255,.88)" : "rgba(255,255,255,.72)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        transition: "border-color 200ms, background 200ms",
      }}
    >
      <div className="wrap between" style={{ height: "var(--header-h)" }}>
        <Link href="/" aria-label="QRSPACE home">
          <Logo />
        </Link>

        <nav className="row g4 hide-mobile" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="pill-tab"
              data-active={pathname === n.href}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="row g8">
          <Link
            href={state.signedIn ? "/dashboard" : "/login"}
            className="btn btn-plain small hide-mobile"
          >
            {state.signedIn ? "Dashboard" : "Log in"}
          </Link>
          <Link href="/create" className="btn btn-primary hide-mobile">
            Create Your Profile
            <Icon name="right" size={16} className="chev" />
          </Link>
          <button
            className="btn btn-icon btn-ghost only-mobile"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile navigation: full-width sheet, thumb-reachable actions last */}
      {open && (
        <div
          className="only-mobile"
          style={{
            borderTop: "1px solid var(--line)",
            background: "var(--surface)",
            padding: "12px 20px 20px",
            animation: "rise 220ms cubic-bezier(.22,1,.36,1) both",
          }}
        >
          <nav className="stack g2" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="between"
                onClick={() => setOpen(false)}
                style={{
                  padding: "13px 4px",
                  borderBottom: "1px solid var(--line)",
                  fontWeight: 650,
                  color: pathname === n.href ? "var(--brand-600)" : "var(--ink-800)",
                }}
              >
                {n.label}
                <Icon name="chevR" size={16} />
              </Link>
            ))}
          </nav>
          <div className="stack g8" style={{ marginTop: 16 }}>
            <Link href="/create" className="btn btn-primary btn-block btn-lg" onClick={() => setOpen(false)}>
              Create Your Profile
            </Link>
            <Link
              href={state.signedIn ? "/dashboard" : "/login"}
              className="btn btn-ghost btn-block"
              onClick={() => setOpen(false)}
            >
              {state.signedIn ? "Go to Dashboard" : "Log in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const FOOTER_COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/examples", label: "Examples" },
      { href: "/pricing", label: "Pricing" },
      { href: "/create", label: "Create Your Profile" },
    ],
  },
  {
    title: "Profile types",
    links: [
      { href: "/examples/michael-carter", label: "Work" },
      { href: "/examples/emma-lee", label: "Dating" },
      { href: "/examples/alex-rivera", label: "Social Media" },
      { href: "/examples/buddy-example", label: "Pet" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/dashboard/help", label: "Help Centre" },
      { href: "/login", label: "Log in" },
      { href: "/spec", label: "Build Spec" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--ink-900)", color: "#fff", marginTop: "auto" }}>
      <div className="wrap" style={{ paddingBlock: "56px 32px" }}>
        <div className="grid footer-grid">
          <div>
            <Logo mono />
            <p className="small" style={{ color: "rgba(255,255,255,.62)", marginTop: 14, maxWidth: "32ch" }}>
              One QR code. Multiple profiles. You choose what people see — and you can
              change it any time without reprinting anything.
            </p>
            <div className="row g8" style={{ marginTop: 18 }}>
              {["instagram", "tiktok", "x", "youtube"].map((s) => (
                <span
                  key={s}
                  style={{
                    width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)",
                  }}
                >
                  <Icon name={s} size={16} />
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="tiny" style={{ color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                {col.title}
              </h4>
              <ul className="stack g8">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="small" style={{ color: "rgba(255,255,255,.66)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="between wrapped"
          style={{ marginTop: 44, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.1)", gap: 12 }}
        >
          <p className="tiny" style={{ color: "rgba(255,255,255,.45)" }}>
            © 2026 QRSPACE · Clickable prototype — demo data, no live accounts
          </p>
          <div className="row g16 tiny" style={{ color: "rgba(255,255,255,.45)" }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Wraps the public marketing pages. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
