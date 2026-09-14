import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/site-chrome";
import { PROFILE_TYPES, BUTTONS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Build Specification",
  description:
    "Route map, data model and interaction rules — the prototype written down for the WordPress developer.",
};

/* ------------------------------------------------------------------ data */

const ROUTES: { group: string; rows: [string, string, string][] }[] = [
  {
    group: "Public website",
    rows: [
      ["/", "Homepage", "Hero with live profile switcher, 4-step explainer, examples, control demo, CTA"],
      ["/how-it-works", "How It Works", "The four steps at full size, same-code proof panel, FAQ preview"],
      ["/examples", "Examples", "Gallery of all ten profile types"],
      ["/examples/[slug]", "Example detail", "Live phone, feature list, per-profile QR, related examples"],
      ["/pricing", "Pricing", "Three plans plus a comparison table"],
      ["/faq", "FAQ", "Full accordion"],
      ["/login", "Log in", "Split layout; drops into the demo account"],
      ["/signup", "Sign up", "Same layout, routes on to /create"],
    ],
  },
  {
    group: "Creation flow",
    rows: [
      ["/create", "Create Profile wizard", "6 steps: type → information → buttons → appearance → preview → done"],
      ["/create?type=work", "Pre-selected type", "Skips step 1; used by every 'build one like this' link"],
    ],
  },
  {
    group: "Dashboard (authenticated)",
    rows: [
      ["/dashboard", "Overview", "Active-profile spotlight, stats, 30-day chart, quick actions, profile cards"],
      ["/dashboard/profiles", "My Profiles", "Search, type filter, grid/list views, per-card actions"],
      ["/dashboard/profiles/[id]", "Profile editor", "Tabs: content, buttons, appearance, sharing + live preview"],
      ["/dashboard/qr", "QR Code", "Account code vs per-profile code, colour, downloads, print templates, share sheet"],
      ["/dashboard/analytics", "Analytics", "Range + profile filters, trend, button ranking, devices, locations"],
      ["/dashboard/appearance", "Appearance", "Per-profile styling, presets, apply-to-all"],
      ["/dashboard/settings", "Settings", "Account, QR address, plan, notifications, privacy"],
      ["/dashboard/help", "Help", "Guides, FAQ, contact form"],
    ],
  },
  {
    group: "Visitor-facing",
    rows: [
      ["/q/[code]", "Scan resolver", "Where the printed code points. Looks up the active profile and forwards."],
      ["/p/[slug]", "Visitor profile", "The page a scanner lands on. Enabled buttons only."],
    ],
  },
];

const ENTITIES: { name: string; wp: string; fields: [string, string, string][] }[] = [
  {
    name: "User / Account",
    wp: "WordPress user + user meta",
    fields: [
      ["name", "string", "Display name suggested to new profiles"],
      ["email", "string", "Login and notifications"],
      ["plan", "free | pro | business", "Gates profile count and styling"],
      ["qr_slug", "string, immutable", "The permanent code target: /q/{qr_slug}"],
      ["active_profile_id", "relation → Profile", "Which profile /q/{qr_slug} resolves to"],
    ],
  },
  {
    name: "Profile",
    wp: "Custom post type `qr_profile`",
    fields: [
      ["slug", "string, unique", "Public URL: /p/{slug}"],
      ["type", "enum (10 values)", "Sets starter buttons, accent and cover"],
      ["nickname", "string", "Dashboard label only — never shown to visitors"],
      ["name", "string", "Visitor-facing display name"],
      ["tagline", "string, ≤60", "Line under the name"],
      ["bio", "text, ≤220", "Short paragraph"],
      ["avatar", "image | gradient token", "Profile photo"],
      ["theme.accent", "hex", "Button and highlight colour"],
      ["theme.buttonStyle", "filled | card | outline", "Button treatment"],
      ["theme.corners", "sharp | soft | round", "Corner radius"],
      ["theme.cover", "image | gradient token", "Background behind the photo"],
      ["footer_note", "string, ≤40", "Hand-written closing line"],
      ["buttons", "ordered repeater", "See below — order is meaningful"],
      ["scans / taps", "int", "Analytics counters"],
    ],
  },
  {
    name: "ProfileButton",
    wp: "Repeater field on `qr_profile`",
    fields: [
      ["kind", "enum (32 values)", "Selects icon, brand colour and input type"],
      ["label", "string, ≤28", "Visitor-facing button text"],
      ["sublabel", "string, ≤40, optional", "Second line"],
      ["value", "string", "Phone, email, handle or URL — validated per kind"],
      ["enabled", "bool", "False = the button does not render at all"],
      ["(order)", "array position", "Drag-to-reorder; no separate field needed"],
    ],
  },
];

const RULES: { title: string; body: string; icon: string }[] = [
  {
    icon: "qr",
    title: "One account code, many profile codes",
    body: "The printed code encodes /q/{qr_slug} and never changes. That route reads active_profile_id and redirects to /p/{slug}. Every profile ALSO has its own direct code at /p/{slug} for cases like a pet tag. Both must work at once.",
  },
  {
    icon: "eye",
    title: "Disabled buttons do not render",
    body: "The visitor page renders only buttons where enabled = true. It must not render them hidden or greyed — the product promise is that switched-off information is genuinely absent from the page.",
  },
  {
    icon: "layers",
    title: "Appearance is per profile, not per account",
    body: "Accent, button style, corners and cover live on the profile. The Appearance screen offers an explicit 'apply to all' action rather than making the theme global.",
  },
  {
    icon: "pencil",
    title: "Editing is draft-then-save",
    body: "The editor holds changes locally, shows an 'Unsaved changes' badge, warns on navigation away, and commits on Save. The live preview reflects the draft, not the saved record.",
  },
  {
    icon: "lock",
    title: "Nothing leaks between profiles",
    body: "A visitor sees one profile. No account email, no other profiles, no analytics, no navigation into the app beyond a single 'create your own' link.",
  },
  {
    icon: "check",
    title: "Switching the active profile is instant",
    body: "No confirmation dialog, no republish step. It is reversible and the copy says so — that immediacy is the feature.",
  },
];

const RESPONSIVE: [string, string, string][] = [
  ["Public nav", "Inline pill nav + two CTAs", "Hamburger opens a full-width sheet; primary CTA is the last, largest item"],
  ["How-it-works steps", "Four equal columns", "Horizontal snap rail so the steps stay comparable, not a long scroll"],
  ["Dashboard nav", "Persistent left sidebar", "Sidebar removed; five-item bottom tab bar, overflow lives on Settings"],
  ["Profile cards", "4-up grid, hover reveals", "1–2 up; every action is a visible tap target, nothing hover-only"],
  ["Editor", "Controls beside a sticky preview", "Preview becomes a 'Preview' button opening a sheet; sticky save bar above the tab bar"],
  ["Button rows", "Drag handle + arrows", "Arrows only — HTML5 drag does not fire on touch"],
  ["QR screen", "Code beside the controls", "Stacked, code first"],
  ["Tables", "Full width", "Own horizontal scroll container; the page never scrolls sideways"],
  ["Visitor profile", "Centred 460px card", "Edge-to-edge, full height — it IS the page"],
];

const RECOMMENDATIONS: { title: string; body: string }[] = [
  {
    title: "The scan route deserves to be a real page",
    body: "A bare redirect is invisible when something breaks. A short resolver screen makes the one-code-many-profiles model legible and gives you somewhere to handle a deactivated or unknown code gracefully.",
  },
  {
    title: "Show the live preview at every step, not just step 5",
    body: "The concepts imply preview is a step. In testing, people edit far more confidently when the result is permanently visible, so the wizard keeps it on screen throughout and 'Preview' becomes a confirmation rather than a discovery.",
  },
  {
    title: "Separate the profile nickname from the display name",
    body: "'Work' is what the owner needs in a list of six profiles; 'Emma Taylor' is what a visitor needs. Collapsing them into one field forces an awkward compromise on both screens.",
  },
  {
    title: "Add a second line to buttons",
    body: "'Instagram / @emma.explores' and 'Schedule a Meeting / 15 or 30 minutes' both do real work. It costs one optional field and noticeably raises tap-through.",
  },
  {
    title: "Give visitors 'Save to contacts'",
    body: "For work and personal profiles the actual goal is getting into someone's phone book. A vCard download closes that loop; without it the visitor has to copy fields by hand.",
  },
  {
    title: "Analytics should rank buttons, not just count scans",
    body: "Scan counts tell you the code works. Button ranking tells you what to keep switched on — which is the decision this product asks people to make repeatedly.",
  },
];

/* ------------------------------------------------------------------ page */

export default function SpecPage() {
  return (
    <div style={{ background: "var(--bg-alt)", minHeight: "100vh" }}>
      <header style={{ background: "var(--ink-900)", color: "#fff" }}>
        <div className="wrap" style={{ paddingBlock: "20px 44px" }}>
          <div className="between wrapped g16" style={{ marginBottom: 34 }}>
            <Link href="/"><Logo mono size={28} /></Link>
            <Link href="/dashboard" className="btn btn-sm" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
              Back to the prototype
              <Icon name="right" size={14} className="chev" />
            </Link>
          </div>

          <span className="badge" style={{ background: "rgba(255,255,255,.14)", color: "#fff" }}>
            <Icon name="file" size={13} />
            Hand-off document
          </span>
          <h1 className="h1" style={{ color: "#fff", marginTop: 14 }}>Build Specification</h1>
          <p className="lead" style={{ color: "rgba(255,255,255,.72)", marginTop: 12, maxWidth: "62ch" }}>
            Everything the prototype demonstrates, written down: routes, data model,
            interaction rules and responsive behaviour. Read alongside the clickable
            prototype — this page explains the <em>why</em>, the prototype shows the <em>what</em>.
          </p>
        </div>
      </header>

      <div className="wrap" style={{ paddingBlock: "32px 80px" }}>
        {/* ---------------- contents ---------------- */}
        <nav className="card card-p" style={{ marginBottom: 26 }}>
          <p className="label" style={{ marginBottom: 10 }}>On this page</p>
          <div className="row wrapped g8">
            {[
              ["#routes", "Route map"],
              ["#model", "Data model"],
              ["#rules", "Interaction rules"],
              ["#responsive", "Responsive behaviour"],
              ["#catalog", "Type & button catalogue"],
              ["#recommendations", "Recommendations"],
              ["#scope", "Scope notes"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="pill-tab">{label}</a>
            ))}
          </div>
        </nav>

        {/* ---------------- routes ---------------- */}
        <Section id="routes" title="Route map" intro="Every screen in the prototype, and what it is responsible for.">
          {ROUTES.map((group) => (
            <div key={group.group} style={{ marginBottom: 22 }}>
              <h3 className="h4" style={{ marginBottom: 10 }}>{group.group}</h3>
              <div className="card" style={{ overflowX: "auto" }}>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th style={{ width: 230 }}>Route</th>
                      <th style={{ width: 170 }}>Screen</th>
                      <th>Responsibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map(([route, screen, purpose]) => (
                      <tr key={route}>
                        <td><code>{route}</code></td>
                        <td style={{ fontWeight: 650 }}>{screen}</td>
                        <td className="muted">{purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Section>

        {/* ---------------- model ---------------- */}
        <Section
          id="model"
          title="Data model"
          intro="Three entities. The relationship that matters: one account has one QR code and many profiles, and the account points at exactly one active profile."
        >
          <div
            className="card card-p"
            style={{ marginBottom: 18, background: "var(--bg-lilac)", borderColor: "transparent" }}
          >
            <code className="small" style={{ lineHeight: 2, color: "var(--ink-800)" }}>
              User 1 ──▶ N Profile · User 1 ──▶ 1 QR code · Profile 1 ──▶ N ProfileButton
              <br />
              User.active_profile_id ──▶ the profile /q/&#123;qr_slug&#125; resolves to
            </code>
          </div>

          {ENTITIES.map((entity) => (
            <div key={entity.name} style={{ marginBottom: 22 }}>
              <div className="between wrapped g10" style={{ marginBottom: 10 }}>
                <h3 className="h4">{entity.name}</h3>
                <span className="badge badge-neutral">{entity.wp}</span>
              </div>
              <div className="card" style={{ overflowX: "auto" }}>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th style={{ width: 190 }}>Field</th>
                      <th style={{ width: 200 }}>Type</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity.fields.map(([field, type, note]) => (
                      <tr key={field}>
                        <td><code>{field}</code></td>
                        <td className="muted">{type}</td>
                        <td className="muted">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </Section>

        {/* ---------------- rules ---------------- */}
        <Section
          id="rules"
          title="Interaction rules"
          intro="Behaviour that isn't obvious from looking at a screen. These are the things worth getting right first."
        >
          <div className="grid grid-2">
            {RULES.map((rule) => (
              <div key={rule.title} className="card card-p">
                <span
                  style={{
                    width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center",
                    background: "var(--bg-lilac)", color: "var(--brand-600)", marginBottom: 12,
                  }}
                >
                  <Icon name={rule.icon} size={19} />
                </span>
                <h3 className="h4">{rule.title}</h3>
                <p className="small muted" style={{ marginTop: 6 }}>{rule.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- responsive ---------------- */}
        <Section
          id="responsive"
          title="Responsive behaviour"
          intro="Where the mobile layout is a different design rather than a narrower one. Breakpoint is 900px for app chrome, 880px for marketing layouts."
        >
          <div className="card" style={{ overflowX: "auto" }}>
            <table className="spec-table">
              <thead>
                <tr>
                  <th style={{ width: 175 }}>Element</th>
                  <th style={{ width: 260 }}>Desktop</th>
                  <th>Mobile — and why</th>
                </tr>
              </thead>
              <tbody>
                {RESPONSIVE.map(([el, desktop, mobile]) => (
                  <tr key={el}>
                    <td style={{ fontWeight: 650 }}>{el}</td>
                    <td className="muted">{desktop}</td>
                    <td className="muted">{mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ---------------- catalogue ---------------- */}
        <Section
          id="catalog"
          title="Type & button catalogue"
          intro={`${PROFILE_TYPES.length} profile types and ${BUTTONS.length} button kinds. Each type ships with starter buttons so a new profile is never empty.`}
        >
          <div className="card" style={{ overflowX: "auto", marginBottom: 18 }}>
            <table className="spec-table">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Type</th>
                  <th style={{ width: 90 }}>Accent</th>
                  <th>Starter buttons</th>
                </tr>
              </thead>
              <tbody>
                {PROFILE_TYPES.map((t) => (
                  <tr key={t.type}>
                    <td>
                      <span className="row g8" style={{ fontWeight: 650 }}>
                        <Icon name={t.icon} size={15} style={{ color: t.accent }} />
                        {t.label}
                      </span>
                    </td>
                    <td>
                      <span className="row g6 muted">
                        <span style={{ width: 13, height: 13, borderRadius: 4, background: t.accent }} />
                        <code>{t.accent}</code>
                      </span>
                    </td>
                    <td className="muted">{t.suggested.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card card-p">
            <h3 className="h4" style={{ marginBottom: 12 }}>Button kinds by group</h3>
            <div className="grid grid-2" style={{ gap: 18 }}>
              {(["Contact", "Social", "Content", "Commerce", "Specialty"] as const).map((group) => (
                <div key={group}>
                  <p className="label" style={{ marginBottom: 8 }}>{group}</p>
                  <div className="row wrapped g6">
                    {BUTTONS.filter((b) => b.group === group).map((b) => (
                      <span key={b.kind} className="badge badge-neutral row g6">
                        <span style={{ width: 9, height: 9, borderRadius: 3, background: b.color }} />
                        {b.label}
                        <code style={{ opacity: 0.6 }}>{b.inputType}</code>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ---------------- recommendations ---------------- */}
        <Section
          id="recommendations"
          title="Recommendations"
          intro="Places where the prototype deliberately goes beyond the concepts, and the reasoning behind each one. Every item is a decision you can reverse."
        >
          <div className="stack g12">
            {RECOMMENDATIONS.map((r, i) => (
              <div key={r.title} className="card card-p row g14" style={{ alignItems: "flex-start" }}>
                <span
                  style={{
                    width: 28, height: 28, borderRadius: "50%", flex: "none",
                    background: "var(--grad-brand)", color: "#fff",
                    fontWeight: 800, fontSize: 13,
                    display: "grid", placeItems: "center",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="h4">{r.title}</h3>
                  <p className="small muted" style={{ marginTop: 5 }}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- scope ---------------- */}
        <Section id="scope" title="Scope notes" intro="What this prototype does and does not do.">
          <div className="grid grid-2">
            <div className="card card-p">
              <h3 className="h4 row g8">
                <Icon name="check" size={18} style={{ color: "var(--ok-600)" }} />
                Included
              </h3>
              <ul className="stack g8" style={{ marginTop: 12 }}>
                {[
                  "Every screen above, fully clickable",
                  "Real QR codes — they scan with a phone camera",
                  "Working profile creation, editing, reordering, on/off",
                  "State persists in the browser (localStorage)",
                  "Photo and background upload via the browser",
                  "Responsive from 320px to desktop",
                  "Sample analytics with filters",
                ].map((t) => (
                  <li key={t} className="row g8 small" style={{ alignItems: "flex-start" }}>
                    <Icon name="check" size={14} strokeWidth={2.8} style={{ color: "var(--ok-600)", marginTop: 4, flex: "none" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card card-p">
              <h3 className="h4 row g8">
                <Icon name="x" size={18} style={{ color: "var(--ink-400)" }} />
                Out of scope (by agreement)
              </h3>
              <ul className="stack g8" style={{ marginTop: 12 }}>
                {[
                  "WordPress theme or plugin code",
                  "Database and server configuration",
                  "Real authentication and sessions",
                  "Payments and subscriptions",
                  "Production analytics collection",
                  "Email delivery",
                  "APIs and third-party integrations",
                ].map((t) => (
                  <li key={t} className="row g8 small muted" style={{ alignItems: "flex-start" }}>
                    <span style={{ marginTop: 7, width: 5, height: 5, borderRadius: "50%", background: "var(--ink-300)", flex: "none" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <div className="card card-p between wrapped g16" style={{ marginTop: 26 }}>
          <div>
            <p style={{ fontWeight: 700 }}>Ready to click through it?</p>
            <p className="small muted">Start at the homepage or jump straight into the dashboard.</p>
          </div>
          <div className="row g8">
            <Link href="/" className="btn btn-ghost">Homepage</Link>
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard
              <Icon name="right" size={15} className="chev" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 24, marginBottom: 44 }}>
      <h2 className="h2" style={{ marginBottom: 6 }}>{title}</h2>
      <p className="small muted" style={{ marginBottom: 20, maxWidth: "76ch" }}>{intro}</p>
      {children}
    </section>
  );
}
