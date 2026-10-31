import type { Metadata } from "next";
import Link from "next/link";
import { Aperture, ArrowLeft, Compass } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The studio or page you were looking for does not exist on StudioSpace.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-6 py-24">
      {/* Ambient stage lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/10 blur-[120px] motion-reduce:animate-none" />
        <div className="absolute -right-32 -bottom-40 size-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      </div>

      <div className="relative flex max-w-2xl flex-col items-center text-center">
        {/* Logo mark in a soft glow */}
        <div className="relative mb-8">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-2xl"
          />
          <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-background/80 ring-1 ring-primary/10 backdrop-blur">
            <Aperture
              className="size-8 animate-[spin_14s_linear_infinite] text-primary motion-reduce:animate-none"
              aria-hidden
            />
          </div>
        </div>

        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Error 404
        </span>

        <h1 className="mt-6 bg-gradient-to-b from-foreground via-foreground/70 to-foreground/10 bg-clip-text text-[clamp(6rem,20vw,12rem)] leading-none font-black tracking-tighter text-transparent select-none">
          404
        </h1>

        <p className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          This room doesn&apos;t exist
        </p>
        <p className="mt-3 max-w-md text-muted-foreground">
          The listing may have been unlisted by its host, or the link has a
          typo. Either way — there&apos;s no shortage of spaces to explore.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/studios" className={buttonVariants({ size: "lg" })}>
            <Compass className="size-4" aria-hidden />
            Browse studios
          </Link>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
