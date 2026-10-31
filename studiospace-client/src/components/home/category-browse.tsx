"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Camera,
  Clapperboard,
  LayoutGrid,
  Mic,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/animation/reveal";
import { Card } from "@/components/ui/card";
import { request, type MyStudio } from "@/lib/api";
import { getAllStudios, studioCategories, type StudioCategory } from "@/lib/studios";
import { cn } from "cn";

interface Discipline {
  category: StudioCategory;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the tinted icon tile. */
  tile: string;
}

const disciplines: Discipline[] = [
  {
    category: "Photo",
    title: "Photo Studios",
    description: "Cyclorama walls, daylight lofts, and profoto lighting setups.",
    icon: Camera,
    tile: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    category: "Sound Stage",
    title: "Sound Stages",
    description:
      "Acoustic blackboxes, green screens, power grids, and drive-in access.",
    icon: LayoutGrid,
    tile: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    category: "Podcast",
    title: "Podcast Rooms",
    description:
      "Turnkey audio and video recording with multi-cam switchers and mics.",
    icon: Mic,
    tile: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    category: "Music",
    title: "Music Suites",
    description:
      "Analog consoles, nearfield monitoring, vocal booths, and live rooms.",
    icon: AudioLines,
    tile: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    category: "Video",
    title: "Video Suites",
    description: "Edit bays, colour-grading rooms, and multi-cam stages.",
    icon: Clapperboard,
    tile: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
];

function seedCounts(): Record<string, number> {
  return getAllStudios().reduce<Record<string, number>>((totals, studio) => {
    totals[studio.category] = (totals[studio.category] ?? 0) + 1;
    return totals;
  }, {});
}

export function CategoryBrowse() {
  const [counts, setCounts] = useState<Record<string, number>>(seedCounts);

  // Studios added through the API count on top of the seed catalogue.
  useEffect(() => {
    let cancelled = false;

    request<MyStudio[]>("/api/studios")
      .then((data) => {
        if (cancelled) return;
        const totals = seedCounts();
        for (const doc of data) {
          if (studioCategories.includes(doc.category as StudioCategory)) {
            totals[doc.category] = (totals[doc.category] ?? 0) + 1;
          }
        }
        setCounts(totals);
      })
      .catch(() => {
        // Backend offline — the seed counts stay.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="max-w-2xl space-y-2">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Browse by creative discipline
        </h2>
        <p className="text-muted-foreground">
          Five kinds of spaces — pick what you&apos;re making.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {disciplines.map((discipline, index) => {
          const count = counts[discipline.category] ?? 0;

          return (
            <Reveal key={discipline.category} delay={index * 80}>
              <Link
                href={`/studios?category=${encodeURIComponent(discipline.category)}`}
                className="group block h-full"
                aria-label={`${discipline.title} — ${count} ${count === 1 ? "space" : "spaces"}`}
              >
                <Card className="h-full gap-3 p-5 transition-colors group-hover:border-primary/40">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      discipline.tile,
                    )}
                  >
                    <discipline.icon className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold">{discipline.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {discipline.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "Space" : "Spaces"}
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden
                    />
                  </div>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
