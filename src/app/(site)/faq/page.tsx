import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Accordion } from "@/components/ui";
import { FAQS } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about the one-code-many-profiles model, switching, privacy and plans.",
};

export default function FaqPage() {
  return (
    <>
      <section className="section-tight" style={{ background: "var(--grad-brand-soft)" }}>
        <div className="wrap center">
          <p className="eyebrow">Frequently asked</p>
          <h1 className="h1" style={{ marginTop: 12 }}>Common Questions</h1>
          <p className="lead" style={{ margin: "16px auto 0", maxWidth: "48ch" }}>
            Everything people ask before they print their first code.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap-narrow">
          <Accordion items={FAQS} />

          <div
            className="card card-p between wrapped g16"
            style={{ marginTop: 32, background: "var(--bg-lilac)", borderColor: "transparent" }}
          >
            <div className="row g12">
              <span
                style={{
                  width: 40, height: 40, borderRadius: 12, flex: "none",
                  background: "#fff", color: "var(--brand-600)", display: "grid", placeItems: "center",
                }}
              >
                <Icon name="help" size={20} />
              </span>
              <div>
                <p style={{ fontWeight: 720 }}>Still stuck?</p>
                <p className="small muted">The help centre inside the dashboard has guides and contact options.</p>
              </div>
            </div>
            <Link href="/dashboard/help" className="btn btn-primary">
              Open Help Centre
              <Icon name="right" size={16} className="chev" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
