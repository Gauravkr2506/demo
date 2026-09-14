"use client";

/**
 * Prototype state layer.
 *
 * Everything lives in React state and is mirrored to localStorage so a
 * click-through survives refreshes and shared links. In production this is
 * exactly the surface WordPress replaces: each action below maps to one
 * REST endpoint / post-type mutation.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_STATE } from "./demo-data";
import { avatarGradient, buttonMeta, typeMeta, COVERS } from "./catalog";
import type { AppState, ButtonKind, Profile, ProfileButton, ProfileType } from "./types";

const STORAGE_KEY = "qrspace.prototype.v1";

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

interface Ctx {
  state: AppState;
  hydrated: boolean;
  /* session */
  signIn: () => void;
  signOut: () => void;
  resetDemo: () => void;
  /* profiles */
  profileById: (id: string) => Profile | undefined;
  profileBySlug: (slug: string) => Profile | undefined;
  activeProfile: Profile | undefined;
  setActiveProfile: (id: string) => void;
  createProfile: (draft: Partial<Profile> & { type: ProfileType }) => Profile;
  updateProfile: (id: string, patch: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  duplicateProfile: (id: string) => Profile | undefined;
  /* buttons */
  addButton: (profileId: string, kind: ButtonKind) => void;
  updateButton: (profileId: string, buttonId: string, patch: Partial<ProfileButton>) => void;
  removeButton: (profileId: string, buttonId: string) => void;
  toggleButton: (profileId: string, buttonId: string) => void;
  moveButton: (profileId: string, from: number, to: number) => void;
  /* prototype analytics */
  recordScan: (profileId: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEMO_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Persisted state is read after mount, not in a state initialiser: the
  // server has no localStorage, so initialising from it would make the first
  // client render disagree with the server HTML. One extra render is the
  // correct trade for matching markup.
  useEffect(() => {
    let restored: AppState | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed?.profiles?.length) restored = parsed;
      }
    } catch {
      /* corrupt or unavailable storage — fall back to the seeded demo */
    }
    // One-time synchronisation from an external store that cannot be read
    // during SSR, which is the case the rule below exists to allow.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((current) => restored ?? current);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) — the prototype still works */
    }
  }, [state, hydrated]);

  const patchProfile = useCallback((id: string, fn: (p: Profile) => Profile) => {
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) => (p.id === id ? fn(p) : p)),
    }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const profileById = (id: string) => state.profiles.find((p) => p.id === id);

    return {
      state,
      hydrated,

      signIn: () => setState((s) => ({ ...s, signedIn: true })),
      signOut: () => setState((s) => ({ ...s, signedIn: false })),
      resetDemo: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {}
        setState({ ...DEMO_STATE, signedIn: true });
      },

      profileById,
      profileBySlug: (slug: string) => state.profiles.find((p) => p.slug === slug),
      activeProfile: profileById(state.user.activeProfileId),
      setActiveProfile: (id: string) =>
        setState((s) => ({ ...s, user: { ...s.user, activeProfileId: id } })),

      createProfile: (draft) => {
        const meta = typeMeta(draft.type);
        const id = uid("pr");
        const name = draft.name?.trim() || state.user.name;
        const profile: Profile = {
          id,
          slug:
            draft.slug ||
            `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${draft.type}`,
          type: draft.type,
          nickname: draft.nickname || meta.label,
          name,
          tagline: draft.tagline ?? "",
          bio: draft.bio ?? "",
          avatar: draft.avatar ?? avatarGradient(meta.accent),
          theme: draft.theme ?? {
            accent: meta.accent,
            buttonStyle: "filled",
            corners: "soft",
            cover: COVERS[meta.defaultCover],
          },
          buttons:
            draft.buttons ??
            meta.suggested.map((kind) => {
              const bm = buttonMeta(kind);
              return { id: uid("bt"), kind, label: bm.label, value: "", enabled: true };
            }),
          footerNote: draft.footerNote ?? "",
          createdAt: new Date().toISOString().slice(0, 10),
          scans: 0,
          taps: 0,
        };
        setState((s) => ({ ...s, profiles: [...s.profiles, profile] }));
        return profile;
      },

      updateProfile: (id, patch) => patchProfile(id, (p) => ({ ...p, ...patch })),

      deleteProfile: (id) =>
        setState((s) => {
          const profiles = s.profiles.filter((p) => p.id !== id);
          const activeProfileId =
            s.user.activeProfileId === id
              ? profiles[0]?.id ?? ""
              : s.user.activeProfileId;
          return { ...s, profiles, user: { ...s.user, activeProfileId } };
        }),

      duplicateProfile: (id) => {
        const source = profileById(id);
        if (!source) return undefined;
        const copy: Profile = {
          ...source,
          id: uid("pr"),
          slug: `${source.slug}-copy`,
          nickname: `${source.nickname} (copy)`,
          buttons: source.buttons.map((btn) => ({ ...btn, id: uid("bt") })),
          createdAt: new Date().toISOString().slice(0, 10),
          scans: 0,
          taps: 0,
        };
        setState((s) => ({ ...s, profiles: [...s.profiles, copy] }));
        return copy;
      },

      addButton: (profileId, kind) =>
        patchProfile(profileId, (p) => {
          const bm = buttonMeta(kind);
          return {
            ...p,
            buttons: [
              ...p.buttons,
              { id: uid("bt"), kind, label: bm.label, value: "", enabled: true },
            ],
          };
        }),

      updateButton: (profileId, buttonId, patch) =>
        patchProfile(profileId, (p) => ({
          ...p,
          buttons: p.buttons.map((b) => (b.id === buttonId ? { ...b, ...patch } : b)),
        })),

      removeButton: (profileId, buttonId) =>
        patchProfile(profileId, (p) => ({
          ...p,
          buttons: p.buttons.filter((b) => b.id !== buttonId),
        })),

      toggleButton: (profileId, buttonId) =>
        patchProfile(profileId, (p) => ({
          ...p,
          buttons: p.buttons.map((b) =>
            b.id === buttonId ? { ...b, enabled: !b.enabled } : b,
          ),
        })),

      moveButton: (profileId, from, to) =>
        patchProfile(profileId, (p) => {
          if (to < 0 || to >= p.buttons.length || from === to) return p;
          const buttons = p.buttons.slice();
          const [moved] = buttons.splice(from, 1);
          buttons.splice(to, 0, moved);
          return { ...p, buttons };
        }),

      recordScan: (profileId) =>
        patchProfile(profileId, (p) => ({ ...p, scans: p.scans + 1 })),
    };
  }, [state, hydrated, patchProfile]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/* --------------------------------------------------------------- toasts */

interface ToastItem {
  id: string;
  message: string;
  icon: string;
}

const ToastCtx = createContext<(message: string, icon?: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, icon = "check") => {
    const id = uid("toast");
    setItems((list) => [...list, { id, message, icon }]);
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <ToastHost items={items} />
    </ToastCtx.Provider>
  );
}

function ToastHost({ items }: { items: ToastItem[] }) {
  if (!items.length) return null;
  return (
    <div className="toast-host" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="toast">
          <ToastIcon name={t.icon} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

function ToastIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    check: "m4.5 12.5 5 5 10-11",
    copy: "M9 9h12v12H9z",
    share: "M12 3v12M7 8l5-5 5 5",
    trash: "M3 6h18M8 6V4h8v2M19 6v14H5V6",
  };
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.check} />
    </svg>
  );
}

export const useToast = () => useContext(ToastCtx);
