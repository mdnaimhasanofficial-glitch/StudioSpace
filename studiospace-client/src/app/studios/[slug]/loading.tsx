import { StudioDetailSkeleton } from "@/components/studio/studio-detail-skeleton";

/**
 * Studio detail loading state — also shown while `params` streams in for
 * backend-only studios (the App Shell is prefetched, content fills after).
 */
export default function StudioDetailLoading() {
  return <StudioDetailSkeleton />;
}
