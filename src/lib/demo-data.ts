import { COVERS, avatarGradient, buttonMeta } from "./catalog";
import type { AppState, ButtonKind, Profile, ProfileType } from "./types";

/** Compact helper: build a button from the library with optional overrides. */
function b(
  kind: ButtonKind,
  value: string,
  label?: string,
  sublabel?: string,
  enabled = true,
) {
  const meta = buttonMeta(kind);
  return {
    id: `${kind}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    label: label ?? meta.label,
    sublabel,
    value,
    enabled,
  };
}

function profile(
  p: Pick<Profile, "id" | "slug" | "type" | "nickname" | "name" | "tagline" | "bio"> & {
    accent: string;
    cover: keyof typeof COVERS;
    buttons: Profile["buttons"];
    footerNote?: string;
    scans?: number;
    taps?: number;
    avatar?: string;
    style?: Profile["theme"]["buttonStyle"];
  },
): Profile {
  return {
    id: p.id,
    slug: p.slug,
    type: p.type,
    nickname: p.nickname,
    name: p.name,
    tagline: p.tagline,
    bio: p.bio,
    avatar: p.avatar ?? avatarGradient(p.accent),
    theme: {
      accent: p.accent,
      buttonStyle: p.style ?? "filled",
      corners: "soft",
      cover: COVERS[p.cover],
    },
    buttons: p.buttons,
    footerNote: p.footerNote ?? "",
    createdAt: "2026-04-18",
    scans: p.scans ?? 0,
    taps: p.taps ?? 0,
  };
}

/* ------------------------------------------------ the signed-in demo user */

export const DEMO_PROFILES: Profile[] = [
  profile({
    id: "pr_work",
    slug: "emma-work",
    type: "work",
    nickname: "Work",
    name: "Emma Taylor",
    tagline: "Product Designer · Northwind Studio",
    bio: "Designing digital products for small teams. Always happy to talk shop over coffee.",
    accent: "#2563eb",
    cover: "alpine",
    scans: 412,
    taps: 286,
    footerNote: "Let's build something good.",
    buttons: [
      b("phone", "+1 555 018 4420", "Call Me"),
      b("email", "emma@northwind.studio", "Email Me", "emma@northwind.studio"),
      b("website", "northwind.studio", "Visit My Website", "northwind.studio"),
      b("linkedin", "in/emmataylor", "LinkedIn", "in/emmataylor"),
      b("calendar", "cal.com/emma", "Schedule a Meeting", "15 or 30 minutes"),
    ],
  }),
  profile({
    id: "pr_personal",
    slug: "emma-personal",
    type: "personal",
    nickname: "Personal",
    name: "Emma",
    tagline: "Friends · Family · Dogs",
    bio: "The easy way to reach me. Text is fastest.",
    accent: "#16a34a",
    cover: "forest",
    scans: 168,
    taps: 121,
    footerNote: "See you soon!",
    buttons: [
      b("sms", "+1 555 018 4420", "Text Me", "Fastest way to reach me"),
      b("phone", "+1 555 018 4420", "Call Me"),
      b("email", "emma.taylor@gmail.com", "Email Me"),
      b("photos", "Family album", "Photos", "Recent trips and dog pics"),
    ],
  }),
  profile({
    id: "pr_dating",
    slug: "emma-dating",
    type: "dating",
    nickname: "Dating",
    name: "Emma",
    tagline: "Adventure Seeker | Dog Lover | Good Vibes",
    bio: "Love the outdoors, great food, live music, and meeting new people. Always down for a hike, a good conversation, and exploring new places.",
    accent: "#ec4899",
    cover: "dusk",
    scans: 97,
    taps: 88,
    style: "card",
    footerNote: "Say hi — I don't bite.",
    buttons: [
      b("about", "More photos, interests and fun facts", "About Me", "More photos, interests and fun facts"),
      b("message", "In-app message", "Message Me", "Send a message"),
      b("instagram", "@emma.explores", "Instagram", "@emma.explores"),
      b("photos", "My favourite moments", "More Photos", "See my favourite moments"),
      b("spotify", "open.spotify.com/emma", "My Playlist", "Songs that keep me going"),
      b("meet", "Coffee, hiking or live music?", "Let's Meet", "Coffee, hiking or live music?"),
    ],
  }),
  profile({
    id: "pr_social",
    slug: "emma-social",
    type: "social",
    nickname: "Social Media",
    name: "Emma Taylor",
    tagline: "Adventure · Dogs · Travel · Good Vibes",
    bio: "Exploring new places with my best friend. Sharing life, travel tips and dog-friendly spots.",
    accent: "#8b5cf6",
    cover: "sunset",
    scans: 1184,
    taps: 903,
    footerNote: "Follow the Journey",
    buttons: [
      b("instagram", "@emma.explores", "Instagram", "@emma.explores"),
      b("tiktok", "@emma.explores", "TikTok", "@emma.explores"),
      b("youtube", "Emma Explores", "YouTube", "Emma Explores"),
      b("facebook", "@emma.explores", "Facebook", "@emma.explores"),
      b("pinterest", "Emma's Adventures", "Pinterest", "Emma's Adventures"),
      b("x", "@emmaexplores", "X (Twitter)", "@emmaexplores"),
      b("custom", "emmastravels.com", "My Blog", "www.emmastravels.com"),
    ],
  }),
  profile({
    id: "pr_selling",
    slug: "emma-sale",
    type: "selling",
    nickname: "Selling Items",
    name: "Emma's Garage Sale",
    tagline: "Furniture · Bikes · Camera Gear",
    bio: "Moving house — everything must go by the end of the month. Pickup in Denver.",
    accent: "#06b6d4",
    cover: "ocean",
    scans: 76,
    taps: 64,
    footerNote: "Reasonable offers welcome.",
    buttons: [
      b("photos", "12 items listed", "View Items", "12 items listed"),
      b("message", "In-app message", "Message Me", "Ask about an item"),
      b("shop", "emmasale.bigcartel.com", "My Store", "Shipping available"),
      b("phone", "+1 555 018 4420", "Call Me", undefined, false),
    ],
  }),
  profile({
    id: "pr_pet",
    slug: "buddy",
    type: "pet",
    nickname: "Pet · Buddy",
    name: "Buddy",
    tagline: "Golden Retriever · 4 years old",
    bio: "If you're reading this, I'm probably lost. I'm friendly, chipped, and my human misses me.",
    accent: "#65a30d",
    cover: "meadow",
    scans: 31,
    taps: 29,
    style: "card",
    footerNote: "Thank you for helping me home",
    buttons: [
      b("petinfo", "Golden Retriever, 4yrs, chip 985141002", "My Info", "Breed, age, microchip"),
      b("emergency", "+1 555 018 4420", "Call My Human", "Emma — available 24/7"),
      b("vet", "Denver Animal Clinic · +1 555 992 0110", "Vet Records", "Denver Animal Clinic"),
      b("photos", "Buddy's album", "My Journey", "Photos of my adventures"),
    ],
  }),
];

export const DEMO_STATE: AppState = {
  user: {
    name: "Emma Taylor",
    email: "emma@northwind.studio",
    plan: "pro",
    qrSlug: "emma-t",
    activeProfileId: "pr_work",
    joinedAt: "2026-04-18",
  },
  profiles: DEMO_PROFILES,
  signedIn: false,
};

/* ------------------------------------------ public example profiles (/examples)
   One per profile type, mirroring the names on the concept boards.        */

export const EXAMPLE_PROFILES: Profile[] = [
  profile({
    id: "ex_work", slug: "michael-carter", type: "work",
    nickname: "Work Profile", name: "Michael Carter", tagline: "Real Estate Agent · Summit Realty",
    bio: "Helping families find the right home in the Denver metro area for 12 years.",
    accent: "#2563eb", cover: "alpine", scans: 2140, taps: 1610,
    footerNote: "Let's find your next place.",
    buttons: [
      b("phone", "+1 555 204 7781", "Call Me"),
      b("email", "michael@summitrealty.com", "Email Me"),
      b("website", "summitrealty.com/listings", "View Listings", "24 active listings"),
      b("calendar", "cal.com/michael", "Schedule a Meeting", "Free 20-min consult"),
    ],
  }),
  profile({
    id: "ex_personal", slug: "sarah-taylor", type: "personal",
    nickname: "Personal Profile", name: "Sarah Taylor", tagline: "Family · Travel · Dogs",
    bio: "Mum of two, part-time baker, full-time dog person.",
    accent: "#16a34a", cover: "forest", scans: 640, taps: 470,
    footerNote: "Come say hello",
    buttons: [
      b("phone", "+1 555 771 0092", "Call Me"),
      b("sms", "+1 555 771 0092", "Text Me"),
      b("photos", "Family album", "Photos"),
      b("custom", "sarahbakes.com", "My Blog", "sarahbakes.com"),
    ],
  }),
  profile({
    id: "ex_dating", slug: "emma-lee", type: "dating",
    nickname: "Dating Profile", name: "Emma Lee", tagline: "Let's make new memories",
    bio: "Live music, long walks and terrible puns. Tell me your favourite coffee spot.",
    accent: "#ec4899", cover: "dusk", scans: 380, taps: 344, style: "card",
    footerNote: "Your move",
    buttons: [
      b("message", "In-app message", "Message Me", "Send a message"),
      b("instagram", "@emma.lee", "Instagram", "@emma.lee"),
      b("photos", "My favourite moments", "My Photos"),
      b("meet", "Coffee or live music?", "Let's Meet", "Coffee or live music?"),
    ],
  }),
  profile({
    id: "ex_social", slug: "alex-rivera", type: "social",
    nickname: "Social Media Profile", name: "Alex Rivera", tagline: "Follow My Journey",
    bio: "Surf, skate and street food. New video every Thursday.",
    accent: "#8b5cf6", cover: "sunset", scans: 5820, taps: 4410,
    footerNote: "See you out there",
    buttons: [
      b("instagram", "@alexrivera", "Instagram", "@alexrivera"),
      b("tiktok", "@alexrivera", "TikTok", "412k followers"),
      b("youtube", "Alex Rivera", "YouTube", "Alex Rivera"),
      b("facebook", "@alexrivera", "Facebook"),
      b("website", "alexrivera.tv", "Website", "alexrivera.tv"),
    ],
  }),
  profile({
    id: "ex_business", slug: "paws-and-co", type: "business",
    nickname: "Business Profile", name: "PAWS & CO.", tagline: "Pet Supplies · Denver",
    bio: "Independent pet store. Small-batch treats, toys that survive, and free local delivery.",
    accent: "#f59e0b", cover: "amber", scans: 3190, taps: 2480,
    footerNote: "Good dogs shop here",
    buttons: [
      b("shop", "pawsandco.store", "Shop Now", "Free local delivery"),
      b("website", "pawsandco.store/about", "Our Website"),
      b("instagram", "@pawsandco", "Follow Us", "@pawsandco"),
      b("location", "218 Larimer St, Denver", "Find Us", "218 Larimer St, Denver"),
      b("phone", "+1 555 330 8890", "Contact Us"),
    ],
  }),
  profile({
    id: "ex_selling", slug: "mountain-bikes", type: "selling",
    nickname: "Sell Items Profile", name: "Mountain Bikes", tagline: "Buy · Sell · Trade",
    bio: "Used trail and enduro bikes, serviced and ready to ride. Trade-ins welcome.",
    accent: "#06b6d4", cover: "ocean", scans: 910, taps: 702,
    footerNote: "Test rides every Saturday",
    buttons: [
      b("photos", "18 bikes available", "View Items", "18 bikes available"),
      b("message", "In-app message", "Message Me"),
      b("shop", "trailtraded.com", "My Store"),
      b("phone", "+1 555 662 1140", "Call Me"),
    ],
  }),
  profile({
    id: "ex_event", slug: "jessica-and-mark", type: "event",
    nickname: "Event Profile", name: "Jessica & Mark", tagline: "Our Wedding · 14 June",
    bio: "We're getting married at Cedar Barn and we'd love you there. Everything you need is below.",
    accent: "#6366f1", cover: "violet", scans: 1440, taps: 1290,
    footerNote: "Can't wait to celebrate with you",
    buttons: [
      b("eventinfo", "Sat 14 June, 4pm · Cedar Barn", "Event Details", "Sat 14 June, 4pm · Cedar Barn"),
      b("rsvp", "jessandmark.com/rsvp", "RSVP", "By 1 May please"),
      b("photos", "Shared album", "Photo Gallery", "Add your photos"),
      b("registry", "jessandmark.com/registry", "Our Registry"),
    ],
  }),
  profile({
    id: "ex_pet", slug: "buddy-example", type: "pet",
    nickname: "Pet Profile", name: "Buddy", tagline: "Adventure Dog · 4 years old",
    bio: "Friendly, microchipped and very food-motivated. If I'm alone, I'm lost.",
    accent: "#65a30d", cover: "meadow", scans: 208, taps: 196, style: "card",
    footerNote: "Thanks for helping me home",
    buttons: [
      b("petinfo", "Golden Retriever, 4yrs, chip 985141002", "My Info"),
      b("vet", "Denver Animal Clinic", "Vet Records"),
      b("emergency", "+1 555 018 4420", "Emergency Contact", "Call my human"),
      b("photos", "Buddy's album", "My Journey"),
    ],
  }),
  profile({
    id: "ex_resume", slug: "daniel-kim", type: "resume",
    nickname: "Resume Profile", name: "Daniel Kim", tagline: "Marketing Professional",
    bio: "Six years in growth marketing for B2B SaaS. Currently open to senior roles.",
    accent: "#475569", cover: "slate", scans: 1120, taps: 980, style: "card",
    footerNote: "Happy to chat",
    buttons: [
      b("resume", "daniel-kim-resume.pdf", "View Resume", "PDF · updated May 2026"),
      b("linkedin", "in/danielkim", "LinkedIn"),
      b("portfolio", "danielkim.work", "Portfolio", "Case studies"),
      b("email", "daniel@danielkim.work", "Contact Me"),
    ],
  }),
  profile({
    id: "ex_custom", slug: "custom-example", type: "custom",
    nickname: "Custom Profile", name: "Your Title Here", tagline: "Make it your own",
    bio: "Start from a blank profile and add any buttons you like, in any order.",
    accent: "#db2777", cover: "studio", scans: 0, taps: 0,
    footerNote: "Anything you can imagine",
    buttons: [
      b("custom", "example.com", "Any Link"),
      b("custom", "example.com", "Any Link"),
      b("custom", "example.com", "Any Link"),
      b("custom", "example.com", "Any Link"),
    ],
  }),
];

export const exampleBySlug = (slug: string) =>
  EXAMPLE_PROFILES.find((p) => p.slug === slug);

/* --------------------------------------------------------------- analytics
   Deterministic pseudo-data so charts look alive but never jump around.  */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export interface DayPoint {
  date: string;
  label: string;
  scans: number;
}

export function scanSeries(days: number, seed = 7, base = 18): DayPoint[] {
  const rnd = seeded(seed);
  const out: DayPoint[] = [];
  const today = new Date("2026-09-14T00:00:00Z");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    const trend = 1 + (days - i) / (days * 2.2);
    const value = Math.max(
      1,
      Math.round((base * trend + rnd() * base * 0.9) * (weekend ? 1.35 : 1)),
    );
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      scans: value,
    });
  }
  return out;
}

export const DEVICE_SPLIT = [
  { label: "iPhone", value: 58, color: "#4f46e5" },
  { label: "Android", value: 31, color: "#8b5cf6" },
  { label: "Tablet", value: 7, color: "#06b6d4" },
  { label: "Desktop", value: 4, color: "#a3a7c2" },
];

export const TOP_LOCATIONS = [
  { label: "Denver, CO", value: 41 },
  { label: "Boulder, CO", value: 18 },
  { label: "Austin, TX", value: 12 },
  { label: "Seattle, WA", value: 9 },
  { label: "Other", value: 20 },
];

export const SCAN_SOURCES = [
  { label: "Business card", value: 34, icon: "file" },
  { label: "Phone screen", value: 27, icon: "phoneDevice" },
  { label: "Sticker / tag", value: 21, icon: "tag" },
  { label: "Printed sign", value: 18, icon: "image" },
];

/* --------------------------------------------------------- profile helpers */

export function suggestedName(type: ProfileType, userName: string) {
  if (type === "pet") return "Buddy";
  if (type === "business") return "Your Business";
  if (type === "event") return "Our Event";
  if (type === "selling") return "Items for Sale";
  if (type === "custom") return "Your Title Here";
  return userName;
}
