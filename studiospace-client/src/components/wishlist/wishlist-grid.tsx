"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudioCardSkeleton } from "@/components/studio/studio-card-skeleton";
import { StudioCard } from "@/components/studio/studio-card";
import { myStudioToStudio, request, type MyStudio } from "@/lib/api";
import { getAllStudios, type Studio } from "@/lib/studios";
import { useWishlist } from "@/lib/wishlist";

export function WishlistGrid() {
  const saved = useWishlist();

  // Studios added through the API resolve too — saved entries only store the
  // slug, so the details are looked up in both catalogues.
  const [remote, setRemote] = useState<Studio[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    request<MyStudio[]>("/api/studios")
      .then((data) => {
        if (cancelled) return;
        setRemote(
          data
            .map(myStudioToStudio)
            .filter((studio): studio is Studio => studio !== null),
        );
      })
      .catch(() => {
        // Backend offline — seed studios still resolve.
        if (!cancelled) setRemote([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (saved.length === 0) {
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <Heart
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden
          />
          <p className="font-medium">No saved studios yet</p>
          <p className="text-sm text-muted-foreground">
            Tap the heart on any studio to save it here for later.
          </p>
          <Link href="/studios" className={buttonVariants()}>
            Explore studios
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (remote === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 3 }).map((_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const bySlug = new Map(
    [...getAllStudios(), ...remote].map((studio) => [studio.slug, studio]),
  );
  const studios = saved
    .map((slug) => bySlug.get(slug))
    .filter((studio): studio is Studio => studio !== undefined);

  if (studios.length === 0) {
    // Every saved slug points at a listing that no longer exists.
    return (
      <Card>
        <CardContent className="space-y-3 py-12 text-center">
          <Heart
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden
          />
          <p className="font-medium">Nothing saved right now</p>
          <p className="text-sm text-muted-foreground">
            The studios you had saved are no longer listed.
          </p>
          <Link href="/studios" className={buttonVariants()}>
            Explore studios
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio.slug} studio={studio} />
      ))}
    </div>
  );
}
