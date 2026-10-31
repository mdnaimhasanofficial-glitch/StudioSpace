import { StudioCardSkeleton } from "@/components/studio/studio-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Explore directory skeleton — mirrors the heading, filter chips,
 * selects and the studio card grid.
 */
export default function StudiosLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-9 w-64 max-w-full" aria-hidden />
        <Skeleton className="h-5 w-80 max-w-full" aria-hidden />
      </div>

      <div className="mt-10 space-y-8">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2" aria-hidden>
          <Skeleton className="h-8 w-14 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>

        {/* Price + sort row */}
        <div className="flex flex-wrap items-end gap-4" aria-hidden>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-40" />
          </div>
          <Skeleton className="mb-2 h-4 w-20" />
        </div>

        {/* Studio cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <StudioCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
