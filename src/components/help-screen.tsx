"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icon";
import { PageHead } from "./dash-shell";
import { Accordion, Field, Modal } from "./ui";
import { FAQS } from "@/lib/content";
import { useToast } from "@/lib/store";

const GUIDES = [
  { icon: "layers", title: "Creating your first profile", time: "3 min read", body: "Pick a type, add your details and choose your buttons." },
  { icon: "qr", title: "Switching which profile your code shows", time: "1 min read", body: "One tap in the dashboard, live immediately." },
  { icon: "download", title: "Printing your QR code", time: "4 min read", body: "Sizes, contrast and where codes fail to scan." },
  { icon: "chart", title: "Reading your analytics", time: "3 min read", body: "What scans, taps and tap-through actually tell you." },
  { icon: "paw", title: "Setting up a pet tag", time: "2 min read", body: "What to include so a finder can help quickly." },
  { icon: "lock", title: "Privacy and what visitors see", time: "2 min read", body: "Exactly what is and isn't exposed by a scan." },
];

export function HelpScreen() {
  const [contactOpen, setContactOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();

  return (
    <>
      <PageHead title="Help & Support" subtitle="Guides, answers and a way to reach a human." />

      {/* ---------------- search ---------------- */}
      <div className="card card-p" style={{ background: "var(--grad-brand-soft)", borderColor: "transparent" }}>
        <div className="between wrapped g16">
          <div>
            <h2 className="h3">How can we help?</h2>
            <p className="small muted" style={{ marginTop: 6, maxWidth: "48ch" }}>
              Most questions are about switching profiles or printing codes — both are
              covered below.
            </p>
          </div>
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 360 }}>
            <span style={{ position: "absolute", left: 14, top: 13, color: "var(--ink-300)" }}>
              <Icon name="search" size={17} />
            </span>
            <input className="input" style={{ paddingLeft: 42, background: "#fff" }} placeholder="Search help…" />
          </div>
        </div>
      </div>

      {/* ---------------- guides ---------------- */}
      <h2 className="h3" style={{ marginTop: 30, marginBottom: 14 }}>Guides</h2>
      <div className="grid grid-3">
        {GUIDES.map((g) => (
          <button key={g.title} className="card card-hover card-p" style={{ textAlign: "left" }}>
            <span
              style={{
                width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center",
                background: "var(--bg-lilac)", color: "var(--brand-600)", marginBottom: 12,
              }}
            >
              <Icon name={g.icon} size={19} />
            </span>
            <h3 className="h4">{g.title}</h3>
            <p className="small muted" style={{ marginTop: 5 }}>{g.body}</p>
            <span className="row g6 tiny" style={{ marginTop: 12, color: "var(--brand-600)", fontWeight: 700 }}>
              {g.time}
              <Icon name="chevR" size={12} />
            </span>
          </button>
        ))}
      </div>

      {/* ---------------- faqs ---------------- */}
      <h2 className="h3" style={{ marginTop: 34, marginBottom: 14 }}>Frequently asked</h2>
      <Accordion items={FAQS} />

      {/* ---------------- contact ---------------- */}
      <div className="dash-split" style={{ marginTop: 24 }}>
        <div className="card card-p between wrapped g16">
          <div className="row g12">
            <span
              style={{
                width: 44, height: 44, borderRadius: 13, flex: "none",
                background: "var(--grad-brand)", color: "#fff",
                display: "grid", placeItems: "center",
              }}
            >
              <Icon name="message" size={21} />
            </span>
            <div>
              <p style={{ fontWeight: 700 }}>Still need a hand?</p>
              <p className="small muted">We reply within one working day.</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setContactOpen(true)}>
            Contact support
          </button>
        </div>

        <div className="card card-p">
          <h3 className="h4" style={{ marginBottom: 12 }}>Quick links</h3>
          <div className="stack g4">
            {[
              { href: "/how-it-works", label: "How QRSPACE works", icon: "play" },
              { href: "/examples", label: "Example profiles", icon: "layers" },
              { href: "/pricing", label: "Plans and pricing", icon: "sparkle" },
              { href: "/spec", label: "Build specification", icon: "file" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="nav-item">
                <Icon name={l.icon} size={17} className="nav-ico" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Contact support"
        subtitle="Prototype form — nothing is sent"
        width={480}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setContactOpen(false)}>Cancel</button>
            <button
              className="btn btn-primary"
              disabled={!subject.trim() || !message.trim()}
              onClick={() => {
                setContactOpen(false);
                setSubject("");
                setMessage("");
                toast("Message sent — simulated", "check");
              }}
            >
              Send message
            </button>
          </>
        }
      >
        <div className="stack g14">
          <Field label="Subject">
            <input
              className="input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="My QR code isn't scanning"
            />
          </Field>
          <Field label="Message">
            <textarea
              className="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's happening…"
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}
