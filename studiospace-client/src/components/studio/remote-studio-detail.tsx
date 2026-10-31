"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { StudioDetailSkeleton } from "@/components/studio/studio-detail-skeleton";
import { StudioDetailView } from "@/components/studio/studio-detail-view";
import { buttonVariants } from "@/components/ui/button";
import { fetchStudioBySlug } from "@/lib/api";
import {
  getSimilarStudios,
  studioCategories,
  type Studio,
  type StudioCategory,
} from "@/lib/studios";

/**
 * Client-side fallback for slugs that are not in the seed data — i.e. studios
 * added through the API. Looks the studio up on the backend and renders the
 * same detail view as the static route.
 */
export function RemoteStudioDetail({ slug }: { slug: string }) {
  const [studio, setStudio] = useState<Studio | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchStudioBySlug(slug)
      .then((doc) => {
        if (cancelled) return;
        if (!studioCategories.includes(doc.category as StudioCategory)) {
          setMissing(true);
          return;
        }
        setStudio({ ...doc, category: doc.category as StudioCategory });
        document.title = `${doc.name} — ${doc.tagline}`;
      })
      .catch(() => {
        // Unknown slug or the backend is unreachable — same not-found view.
        if (!cancelled) setMissing(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Studio not found</h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been removed by its host.
        </p>
        <Link href="/studios" className={`${buttonVariants()} mt-6`}>
          <ArrowLeft className="size-4" aria-hidden />
          Back to all studios
        </Link>
      </div>
    );
  }

  if (!studio) {
    // Same skeleton as the route loading state, so the shell, the streamed
    // `params` content and the API lookup read as one continuous page.
    return <StudioDetailSkeleton />;
  }

  return (
    <StudioDetailView
      studio={studio}
      similar={getSimilarStudios(studio.slug, 3)}
    />
  );
}
