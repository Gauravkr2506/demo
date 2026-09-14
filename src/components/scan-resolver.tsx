"use client";

/**
 * /q/[code] — where the printed QR code actually points.
 *
 * This route is the reason the code never changes: it resolves the account
 * code to whichever profile is currently active, then forwards to it. The
 * brief didn't ask for this screen; the flow needs it, and it is the single
 * most important thing for the WordPress developer to get right.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { Logo } from "./site-chrome";
import { useApp } from "@/lib/store";

export function ScanResolver({ code }: { code: string }) {
  const router = useRouter();
  const { state, hydrated } = useApp();
  const [phase, setPhase] = useState<"reading" | "resolving" | "done">("reading");

  const known = code === state.user.qrSlug;
  const active = state.profiles.find((p) => p.id === state.user.activeProfileId);

  useEffect(() => {
    if (!hydrated) return;
    const a = window.setTimeout(() => setPhase("resolving"), 650);
    const b = window.setTimeout(() => {
      setPhase("done");
      if (known && active) router.replace(`/p/${active.slug}?via=qr`);
    }, 1350);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [hydrated, known, active, router]);

  const unresolvable = hydrated && phase === "done" && (!known || !active);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--grad-brand)",
        padding: 24,
      }}
    >
      <div className="center" style={{ maxWidth: 380, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Logo mono size={34} />
        </div>

        {/* scanning animation */}
        <div
          style={{
            width: 132, height: 132, margin: "0 auto 26px", position: "relative",
            borderRadius: 26, background: "rgba(255,255,255,.14)",
            display: "grid", placeItems: "center",
          }}
        >
          <Icon name="qr" size={54} style={{ color: "#fff" }} />
          {!unresolvable && (
            <span
              aria-hidden
              style={{
                position: "absolute", inset: 0, borderRadius: 26,
                border: "2px solid rgba(255,255,255,.6)",
                animation: "pulse-ring 1.6s ease-out infinite",
              }}
            />
          )}
        </div>

        {unresolvable ? (
          <>
            <h1 className="h3" style={{ color: "#fff" }}>Code not recognised</h1>
            <p className="small" style={{ color: "rgba(255,255,255,.78)", marginTop: 8 }}>
              No active profile is linked to <strong>{code}</strong>. The owner may have
              deactivated it.
            </p>
            <Link
              href="/"
              className="btn btn-lg"
              style={{ marginTop: 22, background: "#fff", color: "var(--brand-700)" }}
            >
              Go to QRSPACE
            </Link>
          </>
        ) : (
          <>
            <h1 className="h3" style={{ color: "#fff" }}>
              {phase === "reading" ? "Reading QR code…" : "Opening profile…"}
            </h1>
            <p className="small" style={{ color: "rgba(255,255,255,.78)", marginTop: 8 }}>
              {phase === "reading"
                ? `Code ${code}`
                : active
                  ? `${state.user.name}'s ${active.nickname.toLowerCase()} profile is active`
                  : "Looking up the active profile"}
            </p>

            <div
              className="stack g6"
              style={{
                marginTop: 26, padding: "14px 16px", borderRadius: "var(--r-md)",
                background: "rgba(255,255,255,.14)", textAlign: "left",
              }}
            >
              <p className="tiny" style={{ color: "#fff", fontWeight: 750, letterSpacing: "0.08em" }}>
                HOW THIS WORKS
              </p>
              <p className="tiny" style={{ color: "rgba(255,255,255,.8)" }}>
                The printed code always points at <code>/q/{code}</code>. This route looks up
                the account&apos;s <strong>active profile</strong> and forwards to it — which is
                why switching profiles never needs a reprint.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
