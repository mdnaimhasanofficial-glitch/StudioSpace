import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StudioCard } from "@/components/studio/studio-card";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedStudios } from "@/lib/studios";

export function FeaturedStudios() {
  const featured = getFeaturedStudios(3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Spaces ready when you are
          </h2>
          <p className="text-muted-foreground">
            Hand-picked rooms from hosts across New York.
          </p>
        </div>
        <Link
          href="/studios"
          className={buttonVariants({ variant: "outline" })}
        >
          View all studios
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((studio) => (
          <StudioCard key={studio.slug} studio={studio} />
        ))}
      </div>
    </section>
  );
}
