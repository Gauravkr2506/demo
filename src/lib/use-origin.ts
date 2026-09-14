"use client";

import { useSyncExternalStore } from "react";

/** No subscription needed — the origin never changes during a session. */
const subscribe = () => () => {};
const getSnapshot = () => window.location.origin;
const getServerSnapshot = () => "https://qrspace.app";

/**
 * The browser origin, SSR-safe.
 *
 * QR codes encode an absolute URL, so the prototype has to know where it is
 * being served from — that way a printed code works on localhost, on a LAN
 * address and on a deployed host without changing anything. The server render
 * uses a stable placeholder so the markup matches until hydration swaps in the
 * real origin.
 */
export function useOrigin() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
