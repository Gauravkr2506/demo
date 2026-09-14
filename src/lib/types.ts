/**
 * QRSPACE prototype — data model.
 *
 * This file doubles as the hand-off contract for the WordPress build:
 * every field here is something the production CMS will need to store.
 *
 *   User            1 ──▶ N  Profile          (one account, many profiles)
 *   User            1 ──▶ 1  QR code          (the code NEVER changes)
 *   Profile         1 ──▶ N  ProfileButton    (ordered, individually toggleable)
 *   User.activeProfileId ──▶ the profile the QR currently resolves to
 */

export type ProfileType =
  | "work"
  | "personal"
  | "dating"
  | "social"
  | "business"
  | "selling"
  | "event"
  | "pet"
  | "resume"
  | "custom";

export type ButtonKind =
  | "phone" | "sms" | "email" | "website" | "calendar" | "location" | "whatsapp"
  | "linkedin" | "instagram" | "tiktok" | "youtube" | "facebook" | "pinterest" | "x"
  | "spotify" | "photos" | "about" | "message" | "meet" | "resume" | "portfolio"
  | "shop" | "reviews" | "rsvp" | "registry" | "eventinfo" | "petinfo" | "vet"
  | "emergency" | "menu" | "review" | "custom";

/** A single button on a profile. Order and on/off state are per profile. */
export interface ProfileButton {
  id: string;
  kind: ButtonKind;
  /** Visitor-facing label, editable by the user. */
  label: string;
  /** Optional second line (handle, address, hint). */
  sublabel?: string;
  /** The actual destination: tel:, mailto:, https://… */
  value: string;
  enabled: boolean;
}

export type ButtonStyle = "filled" | "card" | "outline";
export type Corners = "sharp" | "soft" | "round";

export interface ProfileTheme {
  /** Hex accent used for buttons and highlights. */
  accent: string;
  buttonStyle: ButtonStyle;
  corners: Corners;
  /** CSS background value for the cover area. */
  cover: string;
}

export interface Profile {
  id: string;
  /** Public URL segment: /p/{slug} */
  slug: string;
  type: ProfileType;
  /** Internal name shown in the dashboard, e.g. "Work". */
  nickname: string;
  /** Visitor-facing display name. */
  name: string;
  /** The short "Adventure • Dogs • Travel" line under the name. */
  tagline: string;
  bio: string;
  /** Data URL or CSS gradient standing in for an uploaded photo. */
  avatar: string;
  theme: ProfileTheme;
  buttons: ProfileButton[];
  /** The hand-written line above "Powered by QRSPACE". */
  footerNote: string;
  createdAt: string;
  /** Prototype analytics. */
  scans: number;
  taps: number;
}

export type Plan = "free" | "pro" | "business";

export interface User {
  name: string;
  email: string;
  plan: Plan;
  /** The permanent QR slug. Scanning always hits /q/{qrSlug}. */
  qrSlug: string;
  /** Which profile the one QR code currently resolves to. */
  activeProfileId: string;
  joinedAt: string;
}

export interface AppState {
  user: User;
  profiles: Profile[];
  /** Set once the user "signs in" in the prototype. */
  signedIn: boolean;
}

/** Metadata for a profile type — drives the type picker and defaults. */
export interface ProfileTypeMeta {
  type: ProfileType;
  label: string;
  icon: string;
  accent: string;
  blurb: string;
  /** Buttons pre-selected when this type is chosen. */
  suggested: ButtonKind[];
  defaultCover: string;
}

/** Metadata for a button kind — drives the button library. */
export interface ButtonMeta {
  kind: ButtonKind;
  label: string;
  icon: string;
  color: string;
  /** What the user types when configuring it. */
  inputLabel: string;
  inputType: "tel" | "email" | "url" | "text";
  placeholder: string;
  /** Grouping in the "Add button" library. */
  group: "Contact" | "Social" | "Content" | "Commerce" | "Specialty";
}
