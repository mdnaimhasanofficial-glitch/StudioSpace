import type { Metadata } from "next";

import { RemoteStudioDetail } from "@/components/studio/remote-studio-detail";
import { StudioDetailView } from "@/components/studio/studio-detail-view";
import {
  getAllStudios,
  getSimilarStudios,
  getStudioBySlug,
} from "@/lib/studios";

export function generateStaticParams() {
  return getAllStudios().map((studio) => ({ slug: studio.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);
  if (!studio) return { title: "Studio — StudioSpace" };
  return {
    title: `${studio.name} — ${studio.tagline}`,
    description: studio.description,
  };
}

/**
 * Awaiting `params` behind the route's `loading.tsx` Suspense boundary keeps
 * the seed studios statically prerenderable while letting unknown slugs
 * (backend-only studios) stream from the client-side lookup.
 */
async function StudioFromParams({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);

  // Seed studios render from static data; anything else is looked up on the
  // backend from the client, so API-created listings never 404.
  if (!studio) return <RemoteStudioDetail slug={slug} />;

  return (
    <StudioDetailView
      studio={studio}
      similar={getSimilarStudios(studio.slug, 3)}
    />
  );
}

export default function StudioDetailPage({
  params,
}: PageProps<"/studios/[slug]">) {
  // The route's `loading.tsx` provides the Suspense boundary for the awaited
  // `params`, so the App Shell carries the detail skeleton and the URL data
  // streams in behind it.
  return <StudioFromParams params={params} />;
}
