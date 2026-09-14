import type { ProfileButton } from "./types";

/**
 * Turns a button's stored value into the action a visitor's phone would take.
 *
 * The prototype never actually navigates — it shows the resolved target in a
 * sheet instead, so the client can see exactly what each button would do and
 * the WordPress developer knows what to build. This function is that contract.
 */
export interface ResolvedAction {
  /** What the device would do. */
  kind: "call" | "sms" | "email" | "open" | "map" | "save" | "message" | "view";
  /** The literal href a production build would use. */
  href: string;
  /** Human wording for the confirmation sheet. */
  verb: string;
  target: string;
}

const clean = (v: string) => v.trim().replace(/^@/, "");
const asUrl = (v: string) =>
  /^https?:\/\//i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
const asTel = (v: string) => `tel:${v.replace(/[^\d+]/g, "")}`;

const SOCIAL_BASE: Partial<Record<ProfileButton["kind"], string>> = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  facebook: "https://facebook.com/",
  x: "https://x.com/",
  pinterest: "https://pinterest.com/",
  linkedin: "https://linkedin.com/",
  youtube: "https://youtube.com/@",
};

export function resolveAction(button: ProfileButton): ResolvedAction {
  const value = button.value || "";
  const kind = button.kind;

  if (kind === "phone" || kind === "emergency")
    return { kind: "call", href: asTel(value), verb: "Call", target: value };

  if (kind === "sms")
    return { kind: "sms", href: `sms:${value.replace(/[^\d+]/g, "")}`, verb: "Text", target: value };

  if (kind === "whatsapp")
    return {
      kind: "message",
      href: `https://wa.me/${value.replace(/[^\d]/g, "")}`,
      verb: "Message on WhatsApp",
      target: value,
    };

  if (kind === "email")
    return { kind: "email", href: `mailto:${value}`, verb: "Email", target: value };

  if (kind === "location")
    return {
      kind: "map",
      href: `https://maps.google.com/?q=${encodeURIComponent(value)}`,
      verb: "Open in Maps",
      target: value,
    };

  const base = SOCIAL_BASE[kind];
  if (base)
    return {
      kind: "open",
      href: `${base}${clean(value)}`,
      verb: "Open profile",
      target: `${base}${clean(value)}`,
    };

  if (kind === "message" || kind === "meet" || kind === "about" || kind === "petinfo")
    return { kind: "view", href: "#", verb: "Open", target: value || button.label };

  if (kind === "photos")
    return { kind: "view", href: "#", verb: "Open gallery", target: value || "Photo gallery" };

  return { kind: "open", href: asUrl(value || "example.com"), verb: "Open link", target: asUrl(value || "example.com") };
}
