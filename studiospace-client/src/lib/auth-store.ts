"use client";

import { useSyncExternalStore } from "react";

const TOKEN_KEY = "studiospace_token";

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

export function getToken(): string | null {
  return getSnapshot();
}

export function setToken(token: string | null): void {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
  notify();
}

/**
 * Subscribes React to the JWT in localStorage without effects — the store
 * snapshot is the server value (null) during prerender/hydration, then
 * React re-renders with the live value on the client.
 */
export function useToken(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** Reads the unverified JWT payload — the server is the authority. */
export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) =>
      char.charCodeAt(0),
    );
    const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof claims !== "object" || claims === null) return null;
    const { sub, name, email } = claims as Record<string, unknown>;
    if (typeof sub !== "string" || typeof email !== "string") return null;

    return { id: sub, name: typeof name === "string" ? name : "", email };
  } catch {
    return null;
  }
}
