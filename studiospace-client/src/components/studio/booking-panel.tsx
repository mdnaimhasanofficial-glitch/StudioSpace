"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Clock } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { ApiError, createBooking } from "@/lib/api";

const HOUR_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12];

interface BookingPanelStudio {
  slug: string;
  name: string;
  image: string;
  pricePerHour: number;
  amenities: string[];
}

export function BookingPanel({ studio }: { studio: BookingPanelStudio }) {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [date, setDate] = useState("");
  const [hours, setHours] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    date: string;
    total: number;
  } | null>(null);
  const [pending, setPending] = useState(false);

  // `new Date()` cannot run during prerender (cacheComponents) — the picker's
  // min date is applied to the DOM in an effect instead, and past dates are
  // also rejected server-side on booking.
  const dateInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (dateInputRef.current) {
      dateInputRef.current.min = new Date().toISOString().slice(0, 10);
    }
  }, []);

  const total = studio.pricePerHour * hours;

  async function handleBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const next = encodeURIComponent(`/studios/${studio.slug}`);
    if (!token) {
      router.push(`/login?next=${next}`);
      return;
    }

    if (date < new Date().toISOString().slice(0, 10)) {
      setError("Please pick today or a future date.");
      return;
    }

    setPending(true);
    try {
      const booking = await createBooking(
        {
          studioSlug: studio.slug,
          studioName: studio.name,
          studioImage: studio.image,
          pricePerHour: studio.pricePerHour,
          date,
          hours,
        },
        token,
      );
      setConfirmation({ date: booking.date, total: booking.totalPrice });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        router.replace(`/login?next=${next}`);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="text-2xl">
          <span className="text-3xl font-bold">${studio.pricePerHour}</span>
          <span className="text-base font-normal text-muted-foreground">
            {" "}
            / hour
          </span>
        </CardTitle>
        <CardDescription>Book this space by the hour</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {studio.amenities.slice(0, 4).map((amenity) => (
            <li
              key={amenity}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check className="size-4 shrink-0" aria-hidden />
              {amenity}
            </li>
          ))}
        </ul>

        {confirmation ? (
          <Alert>
            <AlertTitle>Booking confirmed</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                {studio.name} is booked for{" "}
                <span className="font-medium text-foreground">
                  {confirmation.date}
                </span>{" "}
                — total <span className="font-medium text-foreground">${confirmation.total}</span>.
              </p>
              <Link
                href="/account/bookings"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View my bookings
              </Link>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleBook} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Could not book</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input
                id="booking-date"
                type="date"
                ref={dateInputRef}
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-hours">Duration</Label>
              <NativeSelect
                id="booking-hours"
                className="w-full"
                value={String(hours)}
                onChange={(event) => setHours(Number(event.target.value))}
              >
                {HOUR_OPTIONS.map((option) => (
                  <NativeSelectOption key={option} value={String(option)}>
                    {option} {option === 1 ? "hour" : "hours"}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" aria-hidden />${studio.pricePerHour} ×{" "}
                {hours}h
              </span>
              <span className="font-semibold">${total}</span>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending && <Spinner aria-hidden />}
              Book now
            </Button>
          </form>
        )}

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden />
          Instant confirmation · Free cancellation up to 24h before
        </p>
      </CardContent>
    </Card>
  );
}
