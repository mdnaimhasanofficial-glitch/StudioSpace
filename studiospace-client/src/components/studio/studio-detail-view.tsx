import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, Star } from "lucide-react";

import { BookingPanel } from "@/components/studio/booking-panel";
import { StudioCard } from "@/components/studio/studio-card";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { Badge } from "@/components/ui/badge";
import type { Studio } from "@/lib/studios";

/**
 * The full studio page layout. Shared by the static route (seed data) and the
 * client-side remote loader for studios that only exist in the backend.
 */
export function StudioDetailView({
  studio,
  similar,
}: {
  studio: Studio;
  similar: Studio[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/studios"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All studios
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-10">
          <div className="relative">
            <Image
              src={studio.image}
              alt={`${studio.name} — ${studio.tagline}`}
              width={1400}
              height={1050}
              priority
              className="aspect-4/3 w-full rounded-2xl border border-border/60 object-cover"
            />
            <WishlistButton
              slug={studio.slug}
              name={studio.name}
              className="absolute top-4 right-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">{studio.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star
                  className="size-4 fill-primary text-primary"
                  aria-hidden
                />
                {studio.rating.toFixed(1)} · {studio.reviews} reviews
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {studio.name}
            </h1>

            <p className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {studio.location}
            </p>

            <p className="max-w-2xl text-muted-foreground">
              {studio.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What you get</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 shrink-0 text-primary" aria-hidden />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Inside the space</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {studio.gallery.map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  alt={`${studio.name} photo ${index + 1}`}
                  width={800}
                  height={600}
                  className="aspect-4/3 w-full rounded-xl border border-border/60 object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        <BookingPanel
          studio={{
            slug: studio.slug,
            name: studio.name,
            image: studio.image,
            pricePerHour: studio.pricePerHour,
            amenities: studio.amenities,
          }}
        />
      </div>

      {similar.length > 0 && (
        <section className="mt-20 space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Similar studios</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((studio) => (
              <StudioCard key={studio.slug} studio={studio} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
