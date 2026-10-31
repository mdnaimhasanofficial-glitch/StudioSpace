"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";

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
import {
  ApiError,
  cancelBooking,
  getMyBookings,
  type Booking,
} from "@/lib/api";
import { setToken } from "@/lib/auth-store";
import { cn } from "cn";

export function MyBookingsList() {
  const { token } = useAuth();

  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  // Booking whose cancel dialog is open (AlertDialogAction is a plain button,
  // so the dialog is closed explicitly once the choice is made).
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getMyBookings(token)
      .then((data) => {
        if (!cancelled) setBookings(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          setToken(null);
          return;
        }
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not load your bookings. Please try again.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleCancel(booking: Booking) {
    if (!token) return;
    setError(null);
    setPendingId(booking.id);
    try {
      const updated = await cancelBooking(booking.id, token);
      setBookings(
        (current) =>
          current?.map((item) => (item.id === updated.id ? updated : item)) ??
          null,
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setToken(null);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not cancel the booking. Please try again.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">
          Every studio session you have booked.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {bookings === null ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="size-6 text-muted-foreground" />
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-12 text-center">
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground">
              Find a studio you love and book it by the hour.
            </p>
            <Link href="/studios" className={buttonVariants()}>
              Explore studios
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const cancelled = booking.status === "cancelled";

            return (
              <li key={booking.id}>
                <Card className={cn("gap-0 overflow-hidden", cancelled && "opacity-60")}>
                  <div className="flex flex-col sm:flex-row">
                    <Image
                      src={booking.studioImage}
                      alt={booking.studioName}
                      width={320}
                      height={320}
                      className={cn(
                        "aspect-video w-full object-cover sm:aspect-square sm:size-32 sm:shrink-0",
                        cancelled && "grayscale",
                      )}
                    />
                    <CardContent className="flex flex-1 flex-col gap-1.5 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <Link
                            href={`/studios/${booking.studioSlug}`}
                            className="font-semibold transition-colors hover:text-primary"
                          >
                            {booking.studioName}
                          </Link>
                          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" aria-hidden />
                              {format(
                                parseISO(booking.date),
                                "EEE, MMM d, yyyy",
                              )}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5" aria-hidden />
                              {booking.hours}{" "}
                              {booking.hours === 1 ? "hour" : "hours"}
                            </span>
                          </p>
                        </div>
                        {cancelled ? (
                          <Badge variant="destructive" className="capitalize">
                            {booking.status}
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="capitalize text-primary"
                          >
                            {booking.status}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                        <p className="text-sm text-muted-foreground">
                          ${booking.pricePerHour} × {booking.hours}h
                        </p>
                        <div className="flex items-center gap-3">
                          <p>
                            <span className="font-semibold">
                              ${booking.totalPrice}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {" "}
                              total
                            </span>
                          </p>
                          {!cancelled && (
                            <AlertDialog
                              open={cancelId === booking.id}
                              onOpenChange={(open) =>
                                setCancelId(open ? booking.id : null)
                              }
                            >
                              <AlertDialogTrigger
                                render={
                                  <button
                                    type="button"
                                    className="text-sm text-muted-foreground transition-colors hover:text-destructive"
                                    aria-label={`Cancel booking for ${booking.studioName}`}
                                  />
                                }
                              >
                                Cancel
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel this booking?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    &ldquo;{booking.studioName}&rdquo; on{" "}
                                    {format(
                                      parseISO(booking.date),
                                      "EEE, MMM d, yyyy",
                                    )}{" "}
                                    will be marked as cancelled. This cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep booking
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={() => {
                                      setCancelId(null);
                                      handleCancel(booking);
                                    }}
                                  >
                                    {pendingId === booking.id ? (
                                      <Spinner aria-hidden />
                                    ) : (
                                      "Cancel booking"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
