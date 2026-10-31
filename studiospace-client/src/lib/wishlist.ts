"use client";

import { useSyncExternalStore } from "react";

/**
 * Wishlist of saved studio slugs, persisted in localStorage. Uses the same
 * useSyncExternalStore approach as auth-store: the snapshot is the empty
 * server value during prerender/hydration, then React re-renders with the
 * live client value — no effects, no hydration mismatch.
 */

const WISHLIST_KEY = "studiospace_wishlist";

type Listener = () => void;
const listeners = new Set<Listener>();

// Module-level snapshot so getSnapshot returns a stable reference between
// calls (a React requirement for useSyncExternalStore).
let clientSnapshot: string[] = [];

function notify() {
  for (const listener of listeners) listener();
}

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  if (listeners.size === 1) {
    clientSnapshot = readStorage();
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === WISHLIST_KEY || event.key === null) {
      clientSnapshot = readStorage();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string[] {
  return clientSnapshot;
}

const EMPTY: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY;
}

export function toggleWishlist(slug: string): void {
  clientSnapshot = clientSnapshot.includes(slug)
    ? clientSnapshot.filter((item) => item !== slug)
    : [...clientSnapshot, slug];
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(clientSnapshot));
  notify();
}

/** Live list of saved studio slugs (empty during SSR, filled after hydration). */
export function useWishlist(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Boolean selector that only re-renders when this slug's state flips. */
export function useIsWishlisted(slug: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => clientSnapshot.includes(slug),
    () => false,
  );
}
