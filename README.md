# QRSPACE — Clickable Front-End Prototype

A browser-based, fully clickable prototype for a QR profile platform:
**one QR code → multiple profiles → you choose what people see.**

Built from the supplied concept boards. Front-end only — no backend, no database,
no authentication. All data is demo data held in the browser.

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To share it with someone on the same network, run `npm run dev -- -H 0.0.0.0`
and use your machine's LAN address — the QR codes encode whatever origin the
prototype is served from, so they will scan correctly on a phone.

```bash
npm run build && npm start   # production build
```

---

## Where to click

**The 60-second tour**

1. **`/`** — the hero chips switch the phone between Work / Personal / Dating /
   Social while the QR code beside it visibly never changes. That single
   interaction is the product.
2. **`/create`** — full creation flow: type → information → photo → buttons →
   on/off → reorder → appearance → preview → save → QR → share.
3. **`/dashboard`** — active-profile spotlight, stats, profile cards.
4. **`/dashboard/profiles/pr_social`** — the editor, with a live preview that
   updates as you type and toggle.
5. **`/dashboard/qr`** — account code vs per-profile code, colours, downloads,
   print templates, share sheet.
6. **`/q/emma-t`** — what a scan actually does: resolves the account code to the
   active profile and forwards to it.
7. **`/p/alex-rivera`** — the visitor page. Only switched-on buttons appear.
8. **`/spec`** — the build specification: routes, data model, interaction rules,
   responsive behaviour and recommendations for the WordPress developer.

**The QR codes are real.** Point a phone camera at one and it opens the profile.

---

## Route map

| Area | Routes |
| --- | --- |
| Public site | `/` · `/how-it-works` · `/examples` · `/examples/[slug]` · `/pricing` · `/faq` |
| Auth | `/login` · `/signup` |
| Creation | `/create` (`?type=work` pre-selects a type) |
| Dashboard | `/dashboard` · `/profiles` · `/profiles/[id]` · `/qr` · `/analytics` · `/appearance` · `/settings` · `/help` |
| Visitor | `/q/[code]` (scan resolver) · `/p/[slug]` (visitor profile) |
| Hand-off | `/spec` |

---

## How it is built

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | One hand-written design system in `src/app/globals.css` — tokens, primitives, layout. No CSS framework. |
| Icons | Inline SVG set in `src/components/icon.tsx`. No icon library. |
| QR codes | Own encoder in `src/lib/qr.ts` — byte mode, Reed–Solomon, mask optimisation. Real, scannable symbols. |
| State | React context + `localStorage` (`src/lib/store.tsx`) |
| Dependencies | **Zero** beyond Next/React. Nothing to vet, nothing to license. |

### Source layout

```
src/
  app/
    (site)/        public marketing pages
    (auth)/        login, signup
    create/        creation wizard
    dashboard/     the application
    p/[slug]/      visitor profile
    q/[slug]/      scan resolver
    spec/          build specification
  components/      UI — phone frame, profile view, editor parts, screens
  lib/
    types.ts       data model (doubles as the CMS field contract)
    catalog.ts     10 profile types, 32 button kinds, themes
    demo-data.ts   seeded profiles + sample analytics
    store.tsx      state; each action maps to one future REST endpoint
    qr.ts          QR encoder
    links.ts       how a button value resolves to a device action
```

---

## Prototype conventions

- **Demo data.** Six profiles for the signed-in account, ten public examples.
  Changes persist in the browser; *Settings → Reset demo data* restores them.
- **Simulated actions.** Downloads, sharing and outbound links show a
  confirmation instead of firing, and the sheet displays the exact `href` a
  production build would use.
- **Photo upload is real** — handled client-side with `FileReader`, so the
  interaction is genuine rather than mocked.
- **Prototype-only chrome** (the visitor-view banner, the reset control) is
  labelled as such and is not part of the product.

---

## Responsive

Tested at 320 / 390 / 768 / 1024 / 1440. Mobile is a different layout, not a
narrower one — the dashboard sidebar becomes a bottom tab bar, the editor
preview becomes a sheet, the four-step explainer becomes a snap rail, and
button reordering uses arrows because HTML5 drag does not fire on touch.
`/spec` documents every one of these decisions.
