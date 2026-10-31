import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MyStudiosList } from "@/components/account/my-studios-list";

export const metadata: Metadata = {
  title: "My Studio Listings",
  description: "Studios you have listed on StudioSpace.",
};

export default function MyStudiosPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <ProtectedRoute>
        <MyStudiosList />
      </ProtectedRoute>
    </div>
  );
}
