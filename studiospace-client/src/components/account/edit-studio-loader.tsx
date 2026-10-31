"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-context";
import { AddStudioForm } from "@/components/studio/add-studio-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, getMyStudios, type MyStudio } from "@/lib/api";
import { setToken } from "@/lib/auth-store";

/**
 * Loads the caller's own listing (only GET /mine exists by id) and hands it to
 * the shared form in edit mode.
 */
export function EditStudioLoader({ id }: { id: string }) {
  const { token } = useAuth();

  // undefined = loading, null = not found / failed to load.
  const [studio, setStudio] = useState<MyStudio | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getMyStudios(token)
      .then((data) => {
        if (cancelled) return;
        setStudio(data.find((item) => item.id === id) ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          // Expired token — clearing it lets ProtectedRoute send us to login.
          setToken(null);
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not load the studio. Please try again.",
        );
        setStudio(null);
      });

    return () => {
      cancelled = true;
    };
  }, [token, id]);

  if (studio) return <AddStudioForm initial={studio} />;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {studio === undefined ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ) : (
        !error && (
          <Alert variant="destructive">
            <AlertTitle>Studio not found</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                This listing is not in your account — it may have been deleted.
              </p>
              <Link
                href="/account/studios"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Back to my studios
              </Link>
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
}
