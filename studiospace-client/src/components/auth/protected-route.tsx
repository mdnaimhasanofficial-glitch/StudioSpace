"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-context";
import { Spinner } from "@/components/ui/spinner";
import { decodeToken, getToken } from "@/lib/auth-store";

/**
 * Client-side gate for private pages: renders children only when a valid
 * session exists, otherwise redirects to /login?next=<current path>.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Re-read the live store: during the hydration window `token` can still
    // be the server snapshot (null) while localStorage already holds one,
    // and redirecting then would bounce logged-in users to /login.
    const currentToken = getToken() ?? token;
    const signedIn = currentToken !== null && decodeToken(currentToken) !== null;

    if (!signedIn) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [token, pathname, router]);

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
