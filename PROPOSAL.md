# Proposal — Front-End Designer / Developer for Clickable Web Prototype

> **Before you send this:** the client states plainly that they only reply to proposals
> written personally by the applicant. Treat everything below as *your notes, organised* —
> the understanding of the product is real and comes from the working prototype in this
> repo, but you should retype it in your own voice before sending. Sections 5 and 6 are
> yours alone to fill in; I've left them blank rather than invent anything.

---

Hi,

I read the brief twice before replying, then built a piece of it so I could answer
your questions with something to point at rather than adjectives. A working
prototype of the core loop is here:

**https://demo-nine-kohl-33.vercel.app/**

Homepage, create flow, dashboard, editor, QR screen and visitor page — all clickable.
The QR codes on it are real, not images; scan one with your phone and it opens the
profile. Worth trying in this order:

1. The homepage hero — switch between Work / Personal / Dating / Social and watch the
   QR code beside the phone stay identical.
2. **Create Your Profile** — the full flow through to the saved profile and its code.
3. **/dashboard** → a profile → **Edit** → switch a button off and watch it leave the
   live preview.
4. **/spec** — the same thing written down for your WordPress developer.

**1. What I believe the core concept is**

One person, several contexts — and a physical object that never goes stale.

The interesting part isn't the QR code, it's the layer of indirection behind it. The
printed code points at the *account*, the account points at whichever profile is
currently active, and the visitor sees only the buttons that profile has switched on.
That indirection is what lets someone print a business card, a dog tag and a resume
once and keep changing what they resolve to. Everything else in the product exists to
make those two decisions easy: *which profile is live*, and *what does it show*.

So the prototype has to make two things obvious in the first ten seconds: the code
stays the same, and the content doesn't. On the homepage I did that by letting you
switch profiles with the phone and the QR code side by side — the phone changes, the
code visibly doesn't.

**2. What I think is missing from the concepts**

The concepts nail the visual direction and the pitch. What isn't there yet is mostly
the connective tissue:

- **The moment of the scan.** Nothing shows what happens between the camera and the
  profile. That route is the whole mechanism and deserves a real screen, plus a
  graceful answer for a deactivated or unknown code.
- **Two kinds of QR code.** An account code that follows the active profile, and
  per-profile codes for things like a pet tag. Both need to exist, and the UI has to
  make the difference obvious or it becomes the top support question.
- **The editing model.** Draft vs live, unsaved changes, what happens if you navigate
  away mid-edit.
- **Nickname vs display name.** "Work" is what you need in a list of six profiles;
  "Emma Taylor" is what a visitor needs. One field can't be both.
- **Empty and first-run states.** Zero profiles, a profile with no buttons switched
  on, a plan limit reached.
- **What analytics should actually measure.** Scan counts prove the code works;
  button rankings tell you what to keep switched on, which is the decision the
  product asks people to make over and over.
- **The visitor's own goals.** Saving the contact and passing the profile on. For a
  work profile, getting into someone's phone book *is* the conversion.
- **The dashboard on mobile.** The concept phones show the profile, not the app.
  A sidebar can't just shrink — it needs to become something else.

I'd want to talk through each of these rather than assume; a few are judgement calls
that depend on where you want to take the product.

**3. How I'd build it**

Next.js and TypeScript, with one hand-written design system rather than a UI kit —
the prototype should look like *your* product, not like Bootstrap. Demo data lives in
a small client-side store whose shape deliberately mirrors the CMS schema you'll end
up with, so your WordPress developer can read it as a field list.

The thing I'd push hardest on: one `ProfileView` component renders the marketing
mockups, the editor's live preview and the real visitor page. That's what stops a
prototype drifting out of sync with itself, and it means "turn a button off" is
visibly the same operation everywhere.

I'd also ship a short written spec alongside it — routes, data model, interaction
rules, and the responsive decisions with the reasoning attached — so the prototype
becomes the specification rather than something your developer has to reverse-engineer
by clicking.

**4. AI tools I use**

[YOUR OWN ANSWER — be specific and honest about which tools you actually use and for
what. E.g. which assistant you use for scaffolding and repetitive component work,
where you review its output, and what you still do by hand. The client wants speed,
but they're also testing whether you can tell the difference between accelerating your
work and outsourcing your judgement.]

**5. Recent work**

[3–5 DIRECT LINKS TO LIVE SITES OR APPS YOU BUILT. Not your Upwork profile, not a
portfolio homepage, not Figma files.]

**6. What I personally did on each**

[ONE LINE PER LINK, e.g. "I designed the UI/UX and built the entire front end;
the backend was another developer."]

---

Happy to walk you through the prototype on a call, or to take any single screen and
show you how I'd handle it before you commit to anything.

[YOUR NAME]
