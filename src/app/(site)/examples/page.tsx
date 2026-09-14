import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { ExampleCard } from "@/components/example-card";
import { HeroDevice } from "@/components/hero-device";
import { EXAMPLE_PROFILES } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Ten ready-made profile types — work, personal, dating, social, business, selling, event, pet, resume and custom.",
};

export default function ExamplesPage() {
  return (
    <>
      <section style={{ background: "var(--grad-brand-soft)" }}>
        <div className="wrap hero-grid" style={{ paddingBlock: "clamp(36px, 5vw, 64px)" }}>
          <div>
            <p className="eyebrow">One QR code. Unlimited profiles.</p>
            <h1 className="display" style={{ marginTop: 12, fontSize: "clamp(2.1rem, 5vw, 3.6rem)" }}>
              Endless Ways
              <br />
              <span className="grad-text">to Use It.</span>
            </h1>
            <p className="lead" style={{ marginTop: 18, maxWidth: "44ch" }}>
              Create as many profiles as you want and use the same QR code. Show different
              information for different situations — you&apos;re always in control.
            </p>
            <div className="row wrapped g12" style={{ marginTop: 26 }}>
              <Link href="/create" className="btn btn-primary btn-lg">
                Create Your Profile
                <Icon name="right" size={17} className="chev" />
              </Link>
            </div>
            <div className="row wrapped g20" style={{ marginTop: 26 }}>
              {[
                { icon: "infinity", label: "Unlimited profiles" },
                { icon: "pencil", label: "Change anytime" },
                { icon: "lock", label: "Private and secure" },
              ].map((f) => (
                <span key={f.label} className="row g6 small muted" style={{ fontWeight: 620 }}>
                  <Icon name={f.icon} size={16} style={{ color: "var(--brand-600)" }} />
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          <HeroDevice />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Popular examples</p>
            <h2 className="h1" style={{ marginTop: 10 }}>A profile for every part of your life</h2>
            <p className="lead" style={{ margin: "14px auto 0", maxWidth: "54ch" }}>
              Every example below is a working profile. Open one to see exactly what a
              visitor sees after scanning.
            </p>
          </div>

          <div className="grid grid-5">
            {EXAMPLE_PROFILES.map((p) => (
              <ExampleCard key={p.id} profile={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: 80 }}>
        <div className="wrap">
          <div
            className="between wrapped g24"
            style={{
              background: "var(--ink-900)", color: "#fff",
              borderRadius: "var(--r-xl)", padding: "clamp(28px, 4vw, 48px)",
            }}
          >
            <div>
              <h2 className="h2" style={{ color: "#fff" }}>One QR Code. Unlimited Possibilities.</h2>
              <p style={{ color: "rgba(255,255,255,.72)", marginTop: 10, maxWidth: "48ch" }}>
                Create, customise and switch between profiles anytime. Your QR code stays the same.
              </p>
            </div>
            <Link href="/create" className="btn btn-primary btn-lg">
              Create Your Profile
              <Icon name="right" size={17} className="chev" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
