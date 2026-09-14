import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Accordion } from "@/components/ui";
import { PLANS, FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Start free with three profiles. Upgrade for unlimited profiles, analytics and print-ready codes.",
};

const COMPARE: { feature: string; free: string | boolean; pro: string | boolean; business: string | boolean }[] = [
  { feature: "Profiles", free: "3", pro: "Unlimited", business: "Unlimited" },
  { feature: "Account QR code", free: true, pro: true, business: true },
  { feature: "Per-profile QR codes", free: false, pro: true, business: true },
  { feature: "All 10 profile types", free: true, pro: true, business: true },
  { feature: "Buttons per profile", free: "Unlimited", pro: "Unlimited", business: "Unlimited" },
  { feature: "Custom colours & styles", free: false, pro: true, business: true },
  { feature: "Analytics", free: "Scan count", pro: "Full, per button", business: "Full, per button" },
  { feature: "Print-ready downloads", free: "PNG", pro: "PNG, SVG, PDF", business: "PNG, SVG, PDF" },
  { feature: "Remove QRSPACE branding", free: false, pro: true, business: true },
  { feature: "Team members", free: false, pro: false, business: "5 included" },
  { feature: "Custom domain", free: false, pro: false, business: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return <Icon name="check" size={17} strokeWidth={2.6} style={{ color: "var(--ok-600)", margin: "0 auto" }} />;
  if (value === false)
    return <span style={{ color: "var(--ink-300)" }}>—</span>;
  return <span className="small" style={{ fontWeight: 620 }}>{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <section className="section-tight" style={{ background: "var(--grad-brand-soft)" }}>
        <div className="wrap center">
          <p className="eyebrow">Pricing</p>
          <h1 className="h1" style={{ marginTop: 12 }}>Start free. Upgrade when it earns it.</h1>
          <p className="lead" style={{ margin: "16px auto 0", maxWidth: "50ch" }}>
            Every plan includes your permanent QR code. You never pay to reprint.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3" style={{ alignItems: "stretch" }}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="card"
                style={{
                  padding: 26,
                  display: "flex",
                  flexDirection: "column",
                  borderColor: plan.featured ? "var(--brand-500)" : undefined,
                  boxShadow: plan.featured ? "var(--sh-md)" : undefined,
                  position: "relative",
                }}
              >
                {plan.featured && (
                  <span
                    className="badge"
                    style={{
                      position: "absolute", top: -12, left: 26,
                      background: "var(--grad-brand)", color: "#fff",
                    }}
                  >
                    Most popular
                  </span>
                )}
                <h2 className="h4" style={{ fontSize: "1.15rem" }}>{plan.name}</h2>
                <p className="small muted" style={{ marginTop: 4, minHeight: "2.8em" }}>{plan.blurb}</p>

                <div className="row g6" style={{ marginTop: 14, alignItems: "baseline" }}>
                  <span style={{ fontSize: "2.4rem", fontWeight: 850, letterSpacing: "-0.04em" }}>
                    {plan.price}
                  </span>
                  <span className="small muted">{plan.period}</span>
                </div>

                <ul className="stack g10" style={{ marginTop: 20, flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} className="row g8" style={{ alignItems: "flex-start" }}>
                      <Icon
                        name="check"
                        size={15}
                        strokeWidth={2.8}
                        style={{ color: "var(--ok-600)", marginTop: 4, flex: "none" }}
                      />
                      <span className="small">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/create"
                  className={`btn btn-block ${plan.featured ? "btn-primary" : "btn-ghost"}`}
                  style={{ marginTop: 22 }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="small muted center" style={{ marginTop: 22 }}>
            Prototype note: no payment processing is wired up — choosing a plan simply
            continues into profile creation.
          </p>
        </div>
      </section>

      {/* -------------------------------------------- comparison table */}
      <section className="section-tight section-alt">
        <div className="wrap">
          <h2 className="h2 center" style={{ marginBottom: 26 }}>Compare plans</h2>
          {/* Tables get their own scroll container rather than squashing */}
          <div className="card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr>
                  {["", "Free", "Pro", "Business"].map((h, i) => (
                    <th
                      key={h || i}
                      style={{
                        textAlign: i === 0 ? "left" : "center",
                        padding: "16px 18px",
                        fontSize: "0.85rem",
                        fontWeight: 750,
                        borderBottom: "1px solid var(--line)",
                        background: i === 2 ? "var(--bg-lilac)" : undefined,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature}>
                    <td
                      className="small"
                      style={{ padding: "13px 18px", fontWeight: 620, borderBottom: "1px solid var(--line)" }}
                    >
                      {row.feature}
                    </td>
                    {(["free", "pro", "business"] as const).map((k) => (
                      <td
                        key={k}
                        style={{
                          padding: "13px 18px",
                          textAlign: "center",
                          borderBottom: "1px solid var(--line)",
                          background: k === "pro" ? "var(--bg-lilac)" : undefined,
                        }}
                      >
                        <Cell value={row[k]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap-narrow">
          <h2 className="h2 center" style={{ marginBottom: 26 }}>Questions about plans</h2>
          <Accordion items={FAQS.slice(4)} />
        </div>
      </section>
    </>
  );
}
