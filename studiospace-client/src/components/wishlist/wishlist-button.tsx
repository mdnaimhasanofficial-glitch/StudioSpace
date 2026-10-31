"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useIsWishlisted, toggleWishlist } from "@/lib/wishlist";
import { cn } from "cn";

/**
 * Heart toggle for saving a studio. Sits as a sibling overlay on cards
 * (never nested inside the card's Link).
 */
export function WishlistButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const saved = useIsWishlisted(slug);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={saved}
      aria-label={
        saved ? `Remove ${name} from your wishlist` : `Save ${name} to your wishlist`
      }
      className={cn(
        "rounded-full bg-background/80 backdrop-blur-sm hover:bg-background",
        className,
      )}
      onClick={() => toggleWishlist(slug)}
    >
      <Heart className={cn("size-4", saved && "fill-current text-primary")} />
    </Button>
  );
}
