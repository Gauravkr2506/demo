/**
 * Marketing copy shared between server and client components.
 *
 * Kept out of any "use client" file on purpose: values exported from a client
 * module arrive in a Server Component as a client *reference*, not the data.
 */

export const STEPS = [
  {
    n: 1,
    title: "Create Your Profiles",
    body: "Add your photo, choose your buttons and create different profiles — work, personal, dating, social or custom.",
  },
  {
    n: 2,
    title: "Choose What to Share",
    body: "Select the profile you want people to see. You can change it any time from your account.",
  },
  {
    n: 3,
    title: "Use Your QR Code",
    body: "Your QR code stays the same. Use it on business cards, dog tags, resumes — anywhere.",
  },
  {
    n: 4,
    title: "They See Only What You Choose",
    body: "When someone scans your code, they see only the buttons from your selected profile.",
  },
];

export const FAQS = [
  {
    q: "Can I use the same QR code for multiple profiles?",
    a: "Yes — that is the whole idea. Your account has one permanent QR code. In your dashboard you choose which profile it currently points to, and you can switch as often as you like.",
  },
  {
    q: "Do I need to create a new QR code to switch profiles?",
    a: "No. The code never changes. Switching the active profile takes one tap in the dashboard and takes effect immediately, so anything you have already printed keeps working.",
  },
  {
    q: "What if I want different QR codes for different profiles?",
    a: "You can do that too. Every profile has its own direct link and its own QR code, which is useful when you want a dedicated code on, say, a pet tag while your main code stays on your business card.",
  },
  {
    q: "Can I update my profile later?",
    a: "Any time. Change your photo, bio, buttons or their order and the live profile updates instantly for anyone who scans afterwards.",
  },
  {
    q: "What does a visitor see when they scan?",
    a: "Only the buttons you have switched on for the active profile. Nothing else from your account is visible — other profiles, your email address and your analytics stay private.",
  },
  {
    q: "Do visitors need an app or an account?",
    a: "No. Scanning opens a normal web page in their phone's browser. Nothing to install and nothing to sign up for.",
  },
  {
    q: "How many profiles can I create?",
    a: "The free plan includes three. Pro and Business are unlimited. You can switch plans at any time and nothing is deleted when you downgrade — extra profiles simply become inactive.",
  },
  {
    q: "Can I turn a profile off completely?",
    a: "Yes. Deactivating a profile makes its link return a friendly 'this profile is unavailable' page instead of your information.",
  },
];

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Everything you need to try the idea out.",
    features: [
      "3 profiles",
      "1 QR code",
      "All profile types",
      "Unlimited buttons per profile",
      "Basic scan count",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$6",
    period: "per month",
    blurb: "For people who use their code every day.",
    features: [
      "Unlimited profiles",
      "A QR code for every profile",
      "Custom colours and button styles",
      "Full analytics with per-button taps",
      "Download print-ready codes (PNG, SVG, PDF)",
      "Remove QRSPACE branding",
    ],
    cta: "Choose Pro",
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$19",
    period: "per month",
    blurb: "For teams, stores and events.",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared brand kit",
      "Bulk QR code generation",
      "Custom domain",
      "Priority support",
    ],
    cta: "Choose Business",
    featured: false,
  },
];
