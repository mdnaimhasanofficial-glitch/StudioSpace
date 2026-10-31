"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Pencil, Plus, Star, Trash } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, deleteStudio, getMyStudios, type MyStudio } from "@/lib/api";
import { setToken } from "@/lib/auth-store";

export function MyStudiosList() {
  const { token } = useAuth();

  const [studios, setStudios] = useState<MyStudio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getMyStudios(token)
      .then((data) => {
        if (!cancelled) setStudios(data);
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
            : "Could not load your studios. Please try again.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleDelete(studio: MyStudio) {
    if (!token) return;
    setError(null);
    setPendingId(studio.id);
    try {
      await deleteStudio(studio.id, token);
      setStudios(
        (current) => current?.filter((item) => item.id !== studio.id) ?? null,
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setToken(null);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not delete the studio. Please try again.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">
            My Studio Listings
          </h1>
          <p className="text-muted-foreground">
            Studios you have added to StudioSpace.
          </p>
        </div>
        <Link href="/studios/new" className={buttonVariants()}>
          <Plus className="size-4" aria-hidden />
          Add New Studio
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {studios === null ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ) : studios.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-12 text-center">
            <p className="font-medium">No studios listed yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first space and it will show up here.
            </p>
            <Link href="/studios/new" className={buttonVariants()}>
              <Plus className="size-4" aria-hidden />
              Add New Studio
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {studios.map((studio) => (
            <li key={studio.id}>
              <Card className="gap-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <Image
                    src={studio.image}
                    alt={studio.name}
                    width={320}
                    height={320}
                    className="aspect-video w-full object-cover sm:aspect-square sm:size-44 sm:shrink-0"
                  />
                  <CardContent className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{studio.category}</Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star
                              className="size-3.5 fill-primary text-primary"
                              aria-hidden
                            />
                            {studio.rating.toFixed(1)} ({studio.reviews})
                          </span>
                        </div>
                        <h2 className="font-semibold">
                          <Link
                            href={`/studios/${studio.slug}`}
                            className="transition-colors hover:text-primary"
                          >
                            {studio.name}
                          </Link>
                        </h2>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" aria-hidden />
                          {studio.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/account/studios/edit/${studio.id}`}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={`Edit ${studio.name}`}
                        >
                          <Pencil className="size-4" aria-hidden />
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <button
                                type="button"
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                                aria-label={`Delete ${studio.name}`}
                                disabled={pendingId === studio.id}
                              />
                            }
                          >
                            {pendingId === studio.id ? (
                              <Spinner className="size-4" aria-hidden />
                            ) : (
                              <Trash className="size-4" aria-hidden />
                            )}
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete &ldquo;{studio.name}&rdquo;?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the listing from your account. It
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(studio)}
                              >
                                Delete studio
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {studio.tagline}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                      <p>
                        <span className="font-semibold">
                          ${studio.pricePerHour}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / hour
                        </span>
                      </p>
                      {studio.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          Added{" "}
                          {format(
                            new Date(studio.createdAt),
                            "MMM d, yyyy",
                          )}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
