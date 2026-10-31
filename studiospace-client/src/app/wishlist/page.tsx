import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { WishlistGrid } from "@/components/wishlist/wishlist-grid";

export const metadata: Metadata = {
  title: "Saved Wishlist",
  description: "Studios you have saved for later on StudioSpace.",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <ProtectedRoute>
        <div className="space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">
              Saved Wishlist
            </h1>
            <p className="text-muted-foreground">
              Studios you have saved for later.
            </p>
          </div>
          <WishlistGrid />
        </div>
      </ProtectedRoute>
    </div>
  );
}
