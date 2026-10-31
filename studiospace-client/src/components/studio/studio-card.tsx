import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import type { Studio } from "@/lib/studios";

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <div className="relative h-full">
      <Link
        href={`/studios/${studio.slug}`}
        className="group block h-full"
        aria-label={`${studio.name} — ${studio.tagline}`}
      >
        <Card className="h-full gap-2 transition-colors group-hover:border-primary/40">
          <Image
            src={studio.image}
            alt={`${studio.name} — ${studio.tagline}`}
            width={800}
            height={600}
            className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">{studio.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star
                  className="size-3.5 fill-primary text-primary"
                  aria-hidden
                />
                {studio.rating.toFixed(1)} ({studio.reviews})
              </span>
            </div>
            <CardTitle className="text-base transition-colors group-hover:text-primary">
              {studio.name}
            </CardTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              {studio.location}
            </p>
          </CardHeader>
          <CardContent className="mt-auto">
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {studio.tagline}
            </p>
            <p className="mt-2">
              <span className="text-lg font-semibold">
                ${studio.pricePerHour}
              </span>
              <span className="text-sm text-muted-foreground"> / hour</span>
            </p>
          </CardContent>
        </Card>
      </Link>
      <WishlistButton
        slug={studio.slug}
        name={studio.name}
        className="absolute top-3 right-3 z-10"
      />
    </div>
  );
}
