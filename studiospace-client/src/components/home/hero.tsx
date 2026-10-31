"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Studio } from "@/lib/studios";
import { cn } from "cn";

export function Hero({ slides }: { slides: Studio[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 size-28rem rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-300"
          >
            Peer-to-peer creative spaces
          </Badge>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Book the room.
            <br />
            <span className="text-primary">Make the thing.</span>
          </h1>

          <p className="max-w-md text-base text-muted-foreground md:text-lg">
            From cyc walls to podcast lounges, book verified creative spaces by
            the hour — no memberships, no minimums, no waiting on a studio
            manager.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/studios" className={buttonVariants({ size: "lg" })}>
              Explore Studios
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/#about"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Host Your Space
            </Link>
          </div>

          <div
            className="flex items-center gap-2 pt-2"
            role="group"
            aria-label="Hero slides"
          >
            {slides.map((slide, index) => (
              <button
                key={slide.slug}
                type="button"
                aria-label={`Show ${slide.name}`}
                aria-current={selected === index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selected === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.slug}>
                <Link
                  href={`/studios/${slide.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/60"
                >
                  <Image
                    src={slide.image}
                    alt={`${slide.name} — ${slide.tagline}`}
                    width={1400}
                    height={1050}
                    priority={index === 0}
                    className="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                          {slide.category}
                        </p>
                        <p className="text-lg font-semibold text-white">
                          {slide.name}
                        </p>
                      </div>
                      <p className="text-sm text-white/80">
                        <span className="text-xl font-semibold text-white">
                          ${slide.pricePerHour}
                        </span>
                        /hr
                      </p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
