import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton shaped like the studio detail page — back link, hero image,
 * content sections and the sticky booking panel. Shared by the route loading
 * state and the client-side lookup for backend-only studios.
 */
export function StudioDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Skeleton className="h-4 w-36" aria-hidden />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-10">
          {/* Hero image */}
          <div className="relative">
            <Skeleton className="aspect-4/3 w-full rounded-2xl" aria-hidden />
            <Skeleton
              className="absolute top-4 right-4 size-8 rounded-full"
              aria-hidden
            />
          </div>

          {/* Title block */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3" aria-hidden>
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-9 w-2/3 max-w-full" aria-hidden />
            <Skeleton className="h-4 w-44" aria-hidden />
            <div className="max-w-2xl space-y-2" aria-hidden>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* What you get */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" aria-hidden />
            <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>

          {/* Inside the space */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" aria-hidden />
            <div className="grid gap-4 sm:grid-cols-3" aria-hidden>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="aspect-4/3 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Booking panel */}
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <div className="flex items-baseline gap-2" aria-hidden>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2" aria-hidden>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <div className="space-y-2" aria-hidden>
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2" aria-hidden>
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-full" aria-hidden />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
