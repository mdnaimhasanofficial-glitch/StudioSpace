"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError } from "@/lib/api";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const MAX_BUTTON_WIDTH = 400; // GIS caps the button width at 400px.

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleButtonOptions {
  theme: "outline";
  size: "large";
  text: "continue_with";
  shape: "pill";
  logo_alignment: "center";
  width?: number;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonOptions,
          ) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  // A ref, not state: GIS registers `callback` once, so state captured in the
  // closure would go stale and the in-flight guard would stop deduplicating.
  const inFlightRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  function handleCredential(response: GoogleCredentialResponse) {
    const credential = response?.credential;
    if (!credential || inFlightRef.current) return;

    inFlightRef.current = true;
    setError(null);

    loginWithGoogle(credential)
      .then(() => {
        // Same `next` handling as the email form in auth-form.tsx.
        const next = new URLSearchParams(window.location.search).get("next");
        const target =
          next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
        router.push(target);
      })
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? err.message
            : "Google sign-in failed. Please try again.",
        );
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }

  function renderGoogleButton() {
    const container = containerRef.current;
    const accounts = window.google?.accounts.id;
    if (!CLIENT_ID || !container || !accounts || renderedRef.current) return;

    renderedRef.current = true;

    accounts.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
    });
    accounts.renderButton(container, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "center",
      width: Math.min(container.offsetWidth, MAX_BUTTON_WIDTH),
    });
  }

  if (!CLIENT_ID) return null;

  return (
    <div>
      <Script src={GSI_SRC} onReady={renderGoogleButton} />

      <div ref={containerRef} className="flex justify-center" />

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertTitle>Google sign-in failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
