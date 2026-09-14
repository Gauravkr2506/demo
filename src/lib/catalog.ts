import type { ButtonKind, ButtonMeta, ProfileType, ProfileTypeMeta } from "./types";

/* ------------------------------------------------------------------ covers
   Stand-ins for uploaded background photos. Layered radial gradients read as
   stylised photography and keep the prototype fully offline. The production
   build swaps these for real uploads — the field is a plain CSS background.  */

export const COVERS: Record<string, string> = {
  sunset:
    "radial-gradient(120% 90% at 20% 15%, #ffd08a 0%, transparent 55%), radial-gradient(100% 80% at 80% 10%, #ff9a6b 0%, transparent 60%), linear-gradient(175deg, #ff8f6b 0%, #e2607a 42%, #5b3f8f 78%, #2c2350 100%)",
  alpine:
    "radial-gradient(90% 70% at 70% 8%, #cfe9ff 0%, transparent 60%), linear-gradient(180deg, #8fc6f0 0%, #b9dbf2 38%, #6e8fae 62%, #35506b 100%)",
  forest:
    "radial-gradient(100% 80% at 25% 12%, #d7f3c4 0%, transparent 58%), linear-gradient(170deg, #7cc26a 0%, #3f8f5f 45%, #1f5442 100%)",
  ocean:
    "radial-gradient(110% 80% at 75% 12%, #a8f0e6 0%, transparent 58%), linear-gradient(170deg, #4fc3d9 0%, #1f7fb5 50%, #143b6b 100%)",
  dusk:
    "radial-gradient(100% 80% at 30% 18%, #ffc0d8 0%, transparent 55%), linear-gradient(170deg, #f88db5 0%, #b466c9 45%, #4a3a8f 100%)",
  slate:
    "radial-gradient(100% 80% at 70% 10%, #dfe6ef 0%, transparent 60%), linear-gradient(170deg, #9aa8bd 0%, #5b6b85 50%, #2b3648 100%)",
  amber:
    "radial-gradient(100% 80% at 25% 15%, #ffe6a8 0%, transparent 58%), linear-gradient(170deg, #ffc056 0%, #f08a3c 48%, #a8512a 100%)",
  violet:
    "radial-gradient(100% 80% at 70% 12%, #ded4ff 0%, transparent 58%), linear-gradient(165deg, #9c7bf0 0%, #6b4fd4 48%, #33268c 100%)",
  meadow:
    "radial-gradient(110% 80% at 20% 14%, #f4f7c0 0%, transparent 58%), linear-gradient(170deg, #b9d96a 0%, #6fae52 48%, #3a6b3c 100%)",
  studio:
    "radial-gradient(90% 90% at 50% 0%, #f4f2ff 0%, transparent 60%), linear-gradient(170deg, #e8e4fb 0%, #c8c0ee 55%, #8e83c9 100%)",
};

export const COVER_KEYS = Object.keys(COVERS);

/* ---------------------------------------------------------- profile types */

export const PROFILE_TYPES: ProfileTypeMeta[] = [
  {
    type: "work",
    label: "Work",
    icon: "briefcase",
    accent: "#2563eb",
    blurb: "Share your contact info, LinkedIn, website and schedule a meeting.",
    suggested: ["phone", "email", "website", "linkedin", "calendar"],
    defaultCover: "alpine",
  },
  {
    type: "personal",
    label: "Personal",
    icon: "user",
    accent: "#16a34a",
    blurb: "Let friends and family reach you with a call, text or your favourite links.",
    suggested: ["phone", "sms", "email", "photos"],
    defaultCover: "forest",
  },
  {
    type: "dating",
    label: "Dating",
    icon: "heart",
    accent: "#ec4899",
    blurb: "Show your interests, photos and give them a reason to say hi.",
    suggested: ["about", "message", "instagram", "photos", "spotify", "meet"],
    defaultCover: "dusk",
  },
  {
    type: "social",
    label: "Social Media",
    icon: "share",
    accent: "#8b5cf6",
    blurb: "Share your Instagram, TikTok, YouTube and more — all in one place.",
    suggested: ["instagram", "tiktok", "youtube", "facebook", "pinterest", "x"],
    defaultCover: "sunset",
  },
  {
    type: "business",
    label: "Business",
    icon: "tag",
    accent: "#f59e0b",
    blurb: "Perfect for stores, restaurants, services and small businesses.",
    suggested: ["shop", "website", "instagram", "phone", "location", "reviews"],
    defaultCover: "amber",
  },
  {
    type: "selling",
    label: "Selling Items",
    icon: "bag",
    accent: "#06b6d4",
    blurb: "Sell products, promote a garage sale or link to your online store.",
    suggested: ["shop", "message", "photos", "phone"],
    defaultCover: "ocean",
  },
  {
    type: "event",
    label: "Event",
    icon: "ticket",
    accent: "#6366f1",
    blurb: "Share event details, RSVP links, photos and more.",
    suggested: ["eventinfo", "rsvp", "location", "photos", "registry"],
    defaultCover: "violet",
  },
  {
    type: "pet",
    label: "Pet",
    icon: "paw",
    accent: "#65a30d",
    blurb: "Great for pet tags. Share important info if your pet is lost.",
    suggested: ["petinfo", "emergency", "vet", "phone", "photos"],
    defaultCover: "meadow",
  },
  {
    type: "resume",
    label: "Resume",
    icon: "file",
    accent: "#475569",
    blurb: "Share your resume, portfolio and contact info with employers.",
    suggested: ["resume", "linkedin", "portfolio", "email", "phone"],
    defaultCover: "slate",
  },
  {
    type: "custom",
    label: "Custom",
    icon: "wand",
    accent: "#db2777",
    blurb: "Create any type of profile you can imagine. You choose the buttons.",
    suggested: ["custom", "custom", "custom"],
    defaultCover: "studio",
  },
];

export const typeMeta = (type: ProfileType): ProfileTypeMeta =>
  PROFILE_TYPES.find((t) => t.type === type) ?? PROFILE_TYPES[0];

/* --------------------------------------------------------- button library */

export const BUTTONS: ButtonMeta[] = [
  // Contact
  { kind: "phone", label: "Call Me", icon: "phone", color: "#22a06b", inputLabel: "Phone number", inputType: "tel", placeholder: "+1 555 010 2233", group: "Contact" },
  { kind: "sms", label: "Text Me", icon: "message", color: "#3b82f6", inputLabel: "Mobile number", inputType: "tel", placeholder: "+1 555 010 2233", group: "Contact" },
  { kind: "email", label: "Email Me", icon: "mail", color: "#2563eb", inputLabel: "Email address", inputType: "email", placeholder: "you@example.com", group: "Contact" },
  { kind: "whatsapp", label: "WhatsApp", icon: "whatsapp", color: "#25d366", inputLabel: "WhatsApp number", inputType: "tel", placeholder: "+1 555 010 2233", group: "Contact" },
  { kind: "location", label: "Find Me", icon: "pin", color: "#ef4444", inputLabel: "Address or map link", inputType: "text", placeholder: "500 Market St, Denver", group: "Contact" },
  { kind: "calendar", label: "Schedule a Meeting", icon: "calendar", color: "#0ea5e9", inputLabel: "Booking link", inputType: "url", placeholder: "cal.com/your-name", group: "Contact" },
  { kind: "message", label: "Message Me", icon: "message", color: "#22c55e", inputLabel: "Where messages go", inputType: "text", placeholder: "In-app message", group: "Contact" },

  // Social
  { kind: "instagram", label: "Instagram", icon: "instagram", color: "#e1306c", inputLabel: "Instagram handle", inputType: "text", placeholder: "@yourhandle", group: "Social" },
  { kind: "tiktok", label: "TikTok", icon: "tiktok", color: "#111114", inputLabel: "TikTok handle", inputType: "text", placeholder: "@yourhandle", group: "Social" },
  { kind: "youtube", label: "YouTube", icon: "youtube", color: "#ff0033", inputLabel: "Channel name or link", inputType: "text", placeholder: "Your Channel", group: "Social" },
  { kind: "facebook", label: "Facebook", icon: "facebook", color: "#1877f2", inputLabel: "Facebook profile", inputType: "text", placeholder: "@yourhandle", group: "Social" },
  { kind: "pinterest", label: "Pinterest", icon: "pinterest", color: "#e60023", inputLabel: "Pinterest profile", inputType: "text", placeholder: "Your boards", group: "Social" },
  { kind: "x", label: "X (Twitter)", icon: "x", color: "#111114", inputLabel: "X handle", inputType: "text", placeholder: "@yourhandle", group: "Social" },
  { kind: "linkedin", label: "LinkedIn", icon: "linkedin", color: "#0a66c2", inputLabel: "LinkedIn profile", inputType: "text", placeholder: "in/your-name", group: "Social" },
  { kind: "spotify", label: "My Playlist", icon: "spotify", color: "#1db954", inputLabel: "Playlist link", inputType: "url", placeholder: "open.spotify.com/…", group: "Social" },

  // Content
  { kind: "website", label: "Visit My Website", icon: "globe", color: "#7c3aed", inputLabel: "Website address", inputType: "url", placeholder: "yoursite.com", group: "Content" },
  { kind: "photos", label: "More Photos", icon: "image", color: "#3b82f6", inputLabel: "Gallery link or upload", inputType: "text", placeholder: "My favourite moments", group: "Content" },
  { kind: "about", label: "About Me", icon: "user", color: "#ec4899", inputLabel: "Short description", inputType: "text", placeholder: "More photos, interests and fun facts", group: "Content" },
  { kind: "portfolio", label: "Portfolio", icon: "layers", color: "#8b5cf6", inputLabel: "Portfolio link", inputType: "url", placeholder: "yourportfolio.com", group: "Content" },
  { kind: "resume", label: "View Resume", icon: "file", color: "#475569", inputLabel: "Resume file or link", inputType: "text", placeholder: "resume.pdf", group: "Content" },
  { kind: "custom", label: "Any Link", icon: "link", color: "#6366f1", inputLabel: "Any web address", inputType: "url", placeholder: "example.com", group: "Content" },

  // Commerce
  { kind: "shop", label: "Shop Now", icon: "bag", color: "#f59e0b", inputLabel: "Store link", inputType: "url", placeholder: "yourstore.com", group: "Commerce" },
  { kind: "reviews", label: "Reviews", icon: "star", color: "#eab308", inputLabel: "Reviews link", inputType: "url", placeholder: "g.page/your-business", group: "Commerce" },
  { kind: "menu", label: "View Menu", icon: "file", color: "#d97706", inputLabel: "Menu link", inputType: "url", placeholder: "yoursite.com/menu", group: "Commerce" },

  // Specialty
  { kind: "meet", label: "Let's Meet", icon: "heart", color: "#e11d48", inputLabel: "What you're up for", inputType: "text", placeholder: "Coffee, hiking or live music?", group: "Specialty" },
  { kind: "eventinfo", label: "Event Details", icon: "ticket", color: "#6366f1", inputLabel: "Date, time and place", inputType: "text", placeholder: "Sat 14 June, 4pm — The Barn", group: "Specialty" },
  { kind: "rsvp", label: "RSVP", icon: "check", color: "#22c55e", inputLabel: "RSVP link", inputType: "url", placeholder: "rsvp link", group: "Specialty" },
  { kind: "registry", label: "Our Registry", icon: "tag", color: "#f472b6", inputLabel: "Registry link", inputType: "url", placeholder: "registry link", group: "Specialty" },
  { kind: "petinfo", label: "My Info", icon: "paw", color: "#65a30d", inputLabel: "Pet details", inputType: "text", placeholder: "Name, breed, microchip", group: "Specialty" },
  { kind: "vet", label: "Vet Records", icon: "shield", color: "#0891b2", inputLabel: "Vet contact or records", inputType: "text", placeholder: "Denver Animal Clinic", group: "Specialty" },
  { kind: "emergency", label: "Emergency Contact", icon: "bell", color: "#dc2626", inputLabel: "Who to call", inputType: "tel", placeholder: "+1 555 010 2233", group: "Specialty" },
  { kind: "review", label: "Leave a Review", icon: "star", color: "#f59e0b", inputLabel: "Review link", inputType: "url", placeholder: "review link", group: "Specialty" },
];

export const buttonMeta = (kind: ButtonKind): ButtonMeta =>
  BUTTONS.find((b) => b.kind === kind) ?? BUTTONS[BUTTONS.length - 1];

export const BUTTON_GROUPS = ["Contact", "Social", "Content", "Commerce", "Specialty"] as const;

/* ----------------------------------------------------------- theme tokens */

export const ACCENTS = [
  "#4f46e5", "#2563eb", "#0ea5e9", "#06b6d4", "#16a34a",
  "#65a30d", "#f59e0b", "#f97316", "#ec4899", "#e11d48",
  "#8b5cf6", "#475569",
];

/**
 * Stand-in for an uploaded profile photo, derived from the profile accent.
 * Kept deliberately deep so the white initials always have contrast — the
 * pale cover gradients do not work behind text.
 */
export function avatarGradient(accent: string): string {
  return (
    `radial-gradient(115% 115% at 28% 14%, color-mix(in srgb, ${accent} 26%, #ffffff) 0%, transparent 58%), ` +
    `linear-gradient(150deg, color-mix(in srgb, ${accent} 72%, #ffffff) 0%, ${accent} 46%, ` +
    `color-mix(in srgb, ${accent} 62%, #16123d) 100%)`
  );
}
