"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Reveal } from "@/components/animation/reveal";
import { StudioCard } from "@/components/studio/studio-card";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { myStudioToStudio, request, type MyStudio } from "@/lib/api";
import { studioCategories, type Studio } from "@/lib/studios";
import { cn } from "cn";

const categoryFilters = ["All", ...studioCategories];

interface PriceBand {
  value: string;
  label: string;
  test?: (price: number) => boolean;
}

const priceBands: PriceBand[] = [
  { value: "any", label: "Any price" },
  { value: "under-50", label: "Under $50 / hour", test: (price) => price < 50 },
  {
    value: "50-90",
    label: "$50 – $90 / hour",
    test: (price) => price >= 50 && price <= 90,
  },
  { value: "over-90", label: "$90+ / hour", test: (price) => price > 90 },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

type SortValue = (typeof sortOptions)[number]["value"];

const comparators: Record<string, (a: Studio, b: Studio) => number> = {
  "price-asc": (a, b) => a.pricePerHour - b.pricePerHour,
  "price-desc": (a, b) => b.pricePerHour - a.pricePerHour,
  rating: (a, b) => b.rating - a.rating,
};

export function StudioDirectory({ studios }: { studios: Studio[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The category lives in the URL (?category=Photo) so the home page's
  // discipline cards can deep-link here; price and sort are local state.
  const categoryParam = searchParams.get("category");
  const active =
    categoryParam && (studioCategories as readonly string[]).includes(categoryParam)
      ? categoryParam
      : "All";

  const [price, setPrice] = useState("any");
  const [sort, setSort] = useState<SortValue>("featured");

  // Studios added through the API, newest first.
  const [remote, setRemote] = useState<Studio[]>([]);

  useEffect(() => {
    let cancelled = false;

    request<MyStudio[]>("/api/studios")
      .then((data) => {
        if (cancelled) return;
        setRemote(
          data
            .map(myStudioToStudio)
            .filter((studio): studio is Studio => studio !== null),
        );
      })
      .catch(() => {
        // Backend offline — the seed catalogue still renders.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function selectCategory(category: string) {
    router.replace(
      category === "All"
        ? "/studios"
        : `/studios?category=${encodeURIComponent(category)}`,
      { scroll: false },
    );
  }

  // Backend listings come first (so new additions are immediately visible),
  // then the seed catalogue — skipping slug duplicates.
  const remoteSlugs = new Set(remote.map((studio) => studio.slug));
  const catalogue = [
    ...remote,
    ...studios.filter((studio) => !remoteSlugs.has(studio.slug)),
  ];

  const priceBand = priceBands.find((band) => band.value === price);
  const filtered = catalogue.filter(
    (studio) =>
      (active === "All" || studio.category === active) &&
      (!priceBand?.test || priceBand.test(studio.pricePerHour)),
  );
  const comparator = comparators[sort];
  const visible = comparator ? [...filtered].sort(comparator) : filtered;

  return (
    <div className="mt-10 space-y-8">
      <div
        aria-label="Filter studios by category"
        className="flex flex-wrap gap-2"
      >
        {categoryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={active === filter}
            onClick={() => selectCategory(filter)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === filter
                ? "border-primary bg-primary font-medium text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="filter-price" className="text-xs text-muted-foreground">
            Price
          </Label>
          <NativeSelect
            id="filter-price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            {priceBands.map((band) => (
              <NativeSelectOption key={band.value} value={band.value}>
                {band.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="filter-sort" className="text-xs text-muted-foreground">
            Sort by
          </Label>
          <NativeSelect
            id="filter-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortValue)}
          >
            {sortOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <p className="pb-2 text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "studio" : "studios"}
        </p>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((studio, index) => (
            <Reveal key={studio.slug} delay={(index % 3) * 90}>
              <StudioCard studio={studio} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No studios match these filters yet — try widening the price range.
        </p>
      )}
    </div>
  );
}
