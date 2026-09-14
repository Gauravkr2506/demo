"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";
import { Logo } from "./site-chrome";
import { Field } from "./ui";
import { useApp, useToast } from "@/lib/store";

/**
 * Prototype sign-in. No real authentication — the brief excludes it — but the
 * screen still needs to exist so the WordPress developer can see where it sits
 * in the flow and what it collects.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { signIn, state } = useApp();
  const toast = useToast();
  const [email, setEmail] = useState(mode === "login" ? state.user.email : "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(mode === "login" ? "demo-password" : "");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    // A short delay so the pending state is visible — prototypes that respond
    // instantly hide the fact that a real request happens here.
    window.setTimeout(() => {
      signIn();
      toast(isLogin ? "Welcome back, Emma" : "Account created", "check");
      router.push(isLogin ? "/dashboard" : "/create");
    }, 600);
  };

  return (
    <div className="auth-grid">
      {/* ---------------- form ---------------- */}
      <div className="auth-pane">
        <div style={{ width: "min(400px, 100%)" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: 34 }}>
            <Logo />
          </Link>

          <h1 className="h2">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="small muted" style={{ marginTop: 8 }}>
            {isLogin
              ? "Log in to manage your profiles and QR code."
              : "One account, unlimited profiles, one permanent QR code."}
          </p>

          <div className="stack g8" style={{ marginTop: 24 }}>
            {[
              { icon: "globe", label: "Continue with Google" },
              { icon: "phoneDevice", label: "Continue with Apple" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn btn-ghost btn-block"
                onClick={() => toast("Social sign-in is out of scope for the prototype", "share")}
              >
                <Icon name={p.icon} size={17} />
                {p.label}
              </button>
            ))}
          </div>

          <div className="row g12" style={{ margin: "20px 0" }}>
            <hr className="divider grow" />
            <span className="tiny muted">or</span>
            <hr className="divider grow" />
          </div>

          <form onSubmit={submit} className="stack g16">
            {!isLogin && (
              <Field label="Your name">
                <input
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Emma Taylor"
                  autoComplete="name"
                  required
                />
              </Field>
            )}

            <Field label="Email address">
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Password" hint={isLogin ? undefined : "At least 8 characters"}>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </Field>

            {isLogin && (
              <div className="between">
                <label className="row g8 small" style={{ cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--brand-600)" }} />
                  Keep me logged in
                </label>
                <button type="button" className="small" style={{ color: "var(--brand-600)", fontWeight: 650 }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
              {busy ? "One moment…" : isLogin ? "Log in" : "Create account"}
              {!busy && <Icon name="right" size={16} className="chev" />}
            </button>
          </form>

          <p className="small muted center" style={{ marginTop: 20 }}>
            {isLogin ? "New here? " : "Already have an account? "}
            <Link href={isLogin ? "/signup" : "/login"} style={{ color: "var(--brand-600)", fontWeight: 680 }}>
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>

          <div
            className="row g10"
            style={{
              marginTop: 26, padding: "12px 14px", borderRadius: "var(--r-md)",
              background: "var(--bg-alt)", border: "1px dashed var(--line-strong)",
            }}
          >
            <Icon name="sparkle" size={17} style={{ color: "var(--brand-600)", flex: "none" }} />
            <p className="tiny muted">
              Prototype: any details work. Submitting drops you straight into the demo
              account with six sample profiles.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- brand panel (hidden on small screens) ---------------- */}
      <aside className="auth-aside">
        <div style={{ position: "relative", zIndex: 2, maxWidth: 420 }}>
          <h2 className="h2" style={{ color: "#fff" }}>
            One QR code.
            <br />
            Every version of you.
          </h2>
          <p style={{ color: "rgba(255,255,255,.78)", marginTop: 14 }}>
            Work, personal, dating, social, business, pet — switch which profile your
            code shows whenever you like. Nothing to reprint.
          </p>
          <ul className="stack g12" style={{ marginTop: 26 }}>
            {[
              "Unlimited profiles on one account",
              "Change the active profile in one tap",
              "Visitors only see what you switch on",
            ].map((t) => (
              <li key={t} className="row g10" style={{ color: "rgba(255,255,255,.9)" }}>
                <span
                  style={{
                    width: 22, height: 22, borderRadius: "50%", flex: "none",
                    background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center",
                  }}
                >
                  <Icon name="check" size={13} strokeWidth={3} />
                </span>
                <span className="small">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
