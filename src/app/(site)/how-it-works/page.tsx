import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  MockProfileList,
  MockQRScreen,
  MockShareSelect,
  MockVisitor,
} from "@/components/step-mockups";
import { QRPanel } from "@/components/qr-panel";
import { Accordion } from "@/components/ui";
import { STEPS, FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "One QR code. Multiple profiles. You choose what people see — and you can change it any time without reprinting.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="section-tight" style={{ background: "var(--grad-brand-soft)" }}>
        <div className="wrap center">
          <p className="eyebrow">Simple. Flexible. Powerful.</p>
          <h1 className="h1" style={{ marginTop: 12 }}>
            How <span className="grad-text">QRSPACE</span> Works
          </h1>
          <p className="lead" style={{ margin: "16px auto 0", maxWidth: "52ch" }}>
            One QR code. Multiple profiles. You choose what people see.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------- the four steps */}
      <section className="section">
        <div className="wrap">
          <div className="steps-rail">
            {STEPS.map((step, i) => (
              <div key={step.n} className="step-cell">
                <span className="step-num" style={{ marginBottom: 14 }}>{step.n}</span>
                <h2 className="h4" style={{ fontSize: "1.1rem" }}>{step.title}</h2>
                <p className="small muted" style={{ marginTop: 6, minHeight: "4.5em" }}>{step.body}</p>
                <div style={{ display: "grid", placeItems: "center", marginTop: 10 }}>
                  {i === 0 && <MockProfileList width={206} />}
                  {i === 1 && <MockShareSelect width={206} />}
                  {i === 2 && <MockQRScreen width={206} />}
                  {i === 3 && <MockVisitor width={206} profileId="pr_social" />}
                </div>
              </div>
            ))}
          </div>
          <p className="small muted center" style={{ marginTop: 22 }}>
            The mockups above are live — try selecting a different profile in step 2.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------- same code, different profiles */}
      <section className="section section-lilac">
        <div className="wrap split">
          <div>
            <p className="eyebrow">One QR code. Endless possibilities.</p>
            <h2 className="h1" style={{ marginTop: 12 }}>
              Same QR Code.
              <br />
              <span className="grad-text">Different Profiles.</span>
            </h2>
            <p className="lead" style={{ marginTop: 16, maxWidth: "44ch" }}>
              Your QR code never changes, but you can switch which profile it shows
              whenever you want. No need to reprint — ever.
            </p>

            <ul className="stack g12" style={{ marginTop: 26 }}>
              {[
                "Use the same QR code everywhere",
                "Show a different profile anytime",
                "Perfect for business cards, tags, signs and more",
              ].map((t) => (
                <li key={t} className="row g10">
                  <span
                    style={{
                      width: 24, height: 24, borderRadius: "50%", flex: "none",
                      background: "var(--ok-50)", color: "var(--ok-600)",
                      display: "grid", placeItems: "center",
                    }}
                  >
                    <Icon name="check" size={14} strokeWidth={3} />
                  </span>
                  <span style={{ fontWeight: 600 }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <QRPanel />
        </div>
      </section>

      {/* ---------------------------------------------- what the visitor sees */}
      <section className="section">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 36 }}>
            <p className="eyebrow">Behind the scan</p>
            <h2 className="h2" style={{ marginTop: 10 }}>What actually happens</h2>
            <p className="lead" style={{ margin: "12px auto 0", maxWidth: "56ch" }}>
              Three moving parts, and only one of them ever changes.
            </p>
          </div>

          <div className="grid grid-3">
            {[
              {
                icon: "qr", title: "The QR code", tone: "#4f46e5",
                body: "Belongs to your account, not to a profile. Printed once, it points at a permanent link and never needs regenerating.",
                pill: "Never changes",
              },
              {
                icon: "layers", title: "The active profile", tone: "#8b5cf6",
                body: "The one profile your code currently resolves to. Switch it in the dashboard and the change is live immediately.",
                pill: "You choose",
              },
              {
                icon: "eye", title: "The visitor page", tone: "#16a34a",
                body: "A plain web page in the visitor's browser. No app, no account. They see only the buttons you switched on.",
                pill: "Only what you allow",
              },
            ].map((c) => (
              <div key={c.title} className="card card-p">
                <span
                  style={{
                    width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center",
                    background: `color-mix(in srgb, ${c.tone} 12%, transparent)`, color: c.tone,
                  }}
                >
                  <Icon name={c.icon} size={21} />
                </span>
                <h3 className="h4" style={{ marginTop: 14 }}>{c.title}</h3>
                <p className="small muted" style={{ marginTop: 7 }}>{c.body}</p>
                <span className="badge" style={{ marginTop: 14 }}>{c.pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- faq preview */}
      <section className="section section-alt">
        <div className="wrap wrap-narrow">
          <div className="between wrapped" style={{ marginBottom: 22 }}>
            <h2 className="h2">Common Questions</h2>
            <Link href="/faq" className="row g6 small" style={{ color: "var(--brand-600)", fontWeight: 700 }}>
              View all FAQs
              <Icon name="chevR" size={14} />
            </Link>
          </div>
          <Accordion items={FAQS.slice(0, 4)} />
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div
            className="between wrapped g24"
            style={{
              background: "var(--grad-brand)", color: "#fff",
              borderRadius: "var(--r-xl)", padding: "clamp(28px, 4vw, 44px)",
            }}
          >
            <div>
              <h2 className="h3" style={{ color: "#fff" }}>Ready to Get Started?</h2>
              <p style={{ color: "rgba(255,255,255,.82)", marginTop: 8 }}>
                Create your QR profile in minutes. It&apos;s easy, flexible and free to try.
              </p>
            </div>
            <div className="stack g8">
              <Link href="/create" className="btn btn-lg" style={{ background: "#fff", color: "var(--brand-700)" }}>
                Create Your Profile
                <Icon name="right" size={17} className="chev" />
              </Link>
              <p className="tiny center" style={{ color: "rgba(255,255,255,.7)" }}>
                No limits. No reprints. Update anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
