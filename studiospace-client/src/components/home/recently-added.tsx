"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/animation/reveal";
import { StudioCard } from "@/components/studio/studio-card";
import { buttonVariants } from "@/components/ui/button";
import { myStudioToStudio, request, type MyStudio } from "@/lib/api";
import { getAllStudios, type Studio } from "@/lib/studios";

/** Shown instantly (and kept if the backend is offline). */
const staticFallback = getAllStudios().slice(0, 6);

/**
 * Six most recent studios. Paints the static list immediately, then swaps in
 * whatever the backend has added once the public API answers.
 */
export function RecentlyAdded() {
  const [studios, setStudios] = useState<Studio[]>(staticFallback);

  useEffect(() => {
    let cancelled = false;

    request<MyStudio[]>("/api/studios")
      .then((data) => {
        if (cancelled) return;
        const remote = data
          .map(myStudioToStudio)
          .filter((studio): studio is Studio => studio !== null)
          .slice(0, 6);
        if (remote.length === 0) return;
        // Pad with seed studios so the grid always shows six cards.
        const slugs = new Set(remote.map((studio) => studio.slug));
        const fill = staticFallback.filter((studio) => !slugs.has(studio.slug));
        setStudios([...remote, ...fill].slice(0, 6));
      })
      .catch(() => {
        // Backend offline — the static fallback stays up.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Recently added
          </h2>
          <p className="text-muted-foreground">
            The newest spaces to land on StudioSpace.
          </p>
        </div>
        <Link
          href="/studios"
          className={buttonVariants({ variant: "outline" })}
        >
          View all studios
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio, index) => (
          <Reveal key={studio.slug} delay={(index % 3) * 90}>
            <StudioCard studio={studio} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
