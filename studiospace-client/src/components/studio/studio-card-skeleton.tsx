import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton shaped like a studio card. Used by the route loading states and
 * while client-side catalogues are still resolving.
 */
export function StudioCardSkeleton() {
  return (
    <Card className="h-full gap-2 pt-0">
      <Skeleton className="aspect-4/3 w-full rounded-none" aria-hidden />
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-20 rounded-full" aria-hidden />
          <Skeleton className="h-3.5 w-14" aria-hidden />
        </div>
        <Skeleton className="h-5 w-3/5" aria-hidden />
        <Skeleton className="h-4 w-1/2" aria-hidden />
      </CardHeader>
      <CardContent className="mt-auto space-y-2">
        <Skeleton className="h-4 w-4/5" aria-hidden />
        <Skeleton className="h-5 w-24" aria-hidden />
      </CardContent>
    </Card>
  );
}
