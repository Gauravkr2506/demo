import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import { ControlDemo } from "@/components/control-demo";
import { Icon } from "@/components/icon";
import {
  MockProfileList,
  MockQRScreen,
  MockShareSelect,
  MockVisitor,
} from "@/components/step-mockups";
import { STEPS } from "@/lib/content";
import { ExampleCard } from "@/components/example-card";
import { EXAMPLE_PROFILES } from "@/lib/demo-data";

const HOME_EXAMPLES = ["ex_work", "ex_personal", "ex_dating", "ex_social", "ex_selling"];

export default function HomePage() {
  const examples = HOME_EXAMPLES.map((id) => EXAMPLE_PROFILES.find((p) => p.id === id)!);

  return (
    <>
      <HomeHero />

      {/* ------------------------------------------------ how it works */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">How it works</p>
            <h2 className="h1" style={{ marginTop: 10 }}>
              It&apos;s Simple. Just 4 Steps.
            </h2>
            <p className="lead" style={{ margin: "14px auto 0", maxWidth: "56ch" }}>
              Create your profiles, choose what to share, and let people scan your QR code.
            </p>
          </div>

          {/* Horizontal scroll on mobile keeps all four steps comparable
              instead of collapsing into a long vertical list. */}
          <div className="steps-rail" style={{ marginTop: 44 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} className="step-cell">
                <div className="row g10" style={{ alignItems: "flex-start" }}>
                  <span className="step-num">{step.n}</span>
                  <div>
                    <h3 className="h4">{step.title}</h3>
                    <p className="small muted" style={{ marginTop: 4 }}>{step.body}</p>
                  </div>
                </div>
                <div style={{ display: "grid", placeItems: "center", marginTop: 22 }}>
                  {i === 0 && <MockProfileList width={198} />}
                  {i === 1 && <MockShareSelect width={198} />}
                  {i === 2 && <MockQRScreen width={198} />}
                  {i === 3 && <MockVisitor width={198} profileId="pr_social" />}
                </div>
              </div>
            ))}
          </div>

          <div className="center" style={{ marginTop: 40 }}>
            <Link href="/how-it-works" className="btn btn-ghost btn-lg">
              See the full walkthrough
              <Icon name="right" size={16} className="chev" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ examples */}
      <section className="section">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Real life examples</p>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Perfect for Every Part of Your Life
            </h2>
            <p className="lead" style={{ margin: "14px auto 0", maxWidth: "58ch" }}>
              Use the same QR code for different situations — from your career to your hobbies.
            </p>
          </div>

          <div className="grid grid-5" style={{ marginTop: 40 }}>
            {examples.map((p) => (
              <ExampleCard key={p.id} profile={p} />
            ))}
          </div>

          <div className="center" style={{ marginTop: 34 }}>
            <Link href="/examples" className="btn btn-dark btn-lg">
              Browse all 10 profile types
              <Icon name="right" size={16} className="chev" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ control demo */}
      <ControlDemo />

      {/* ------------------------------------------------ value props */}
      <section className="section-tight">
        <div className="wrap grid grid-3">
          {[
            { icon: "check", tone: "#16a34a", bg: "var(--ok-50)", title: "Your Information. Your Control.", body: "You decide what to show. Add, remove or update your buttons anytime. Only what you want, when you want." },
            { icon: "infinity", tone: "#0891b2", bg: "#ecfeff", title: "Unlimited Profiles", body: "Create as many profiles as you like — work, personal, dating, social media or custom." },
            { icon: "lock", tone: "#4f46e5", bg: "var(--bg-lilac)", title: "Private & Secure", body: "Your information is safe. You control your content and can deactivate a profile at any time." },
          ].map((v) => (
            <div key={v.title} className="card card-p">
              <span
                style={{
                  width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center",
                  background: v.bg, color: v.tone, marginBottom: 14,
                }}
              >
                <Icon name={v.icon} size={20} />
              </span>
              <h3 className="h4">{v.title}</h3>
              <p className="small muted" style={{ marginTop: 6 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ final CTA */}
      <section className="section">
        <div className="wrap">
          <div
            style={{
              borderRadius: "var(--r-xl)",
              background: "var(--grad-brand)",
              color: "#fff",
              padding: "clamp(32px, 5vw, 56px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(70% 120% at 85% 20%, rgba(255,255,255,.22) 0%, transparent 60%)",
              }}
            />
            <div className="between wrapped g24" style={{ position: "relative" }}>
              <div>
                <h2 className="h2" style={{ color: "#fff" }}>Your Life. Your QR Code.</h2>
                <p style={{ color: "rgba(255,255,255,.82)", marginTop: 10, maxWidth: "46ch" }}>
                  Create your profiles and share them your way. No limits. No reprints.
                  Update anytime.
                </p>
              </div>
              <div className="stack g8">
                <Link
                  href="/create"
                  className="btn btn-lg"
                  style={{ background: "#fff", color: "var(--brand-700)", boxShadow: "var(--sh-md)" }}
                >
                  Create Your Profile
                  <Icon name="right" size={17} className="chev" />
                </Link>
                <p className="tiny center" style={{ color: "rgba(255,255,255,.7)" }}>
                  Free to try · No card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
