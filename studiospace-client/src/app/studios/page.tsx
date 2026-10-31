import type { Metadata } from "next";
import { Suspense } from "react";

import { Reveal } from "@/components/animation/reveal";
import { StudioDirectory } from "@/components/studio/studio-directory";
import { Spinner } from "@/components/ui/spinner";
import { getAllStudios } from "@/lib/studios";

export const metadata: Metadata = {
  title: "Explore studios",
  description:
    "Browse verified photo studios, sound stages, podcast lounges, rehearsal rooms and edit suites available by the hour.",
};

export default function StudiosPage() {
  const studios = getAllStudios();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Explore studios
        </h1>
        <p className="text-muted-foreground">
          Verified spaces, all bookable by the hour — including studios hosts
          have just added. Filter by what you&apos;re making.
        </p>
      </Reveal>

      {/* Suspense lets the directory read ?category= on the client. */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        }
      >
        <StudioDirectory studios={studios} />
      </Suspense>
    </div>
  );
}
