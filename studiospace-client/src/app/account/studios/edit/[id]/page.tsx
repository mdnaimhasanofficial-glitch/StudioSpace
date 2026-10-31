import type { Metadata } from "next";
import { Suspense } from "react";

import { EditStudioLoader } from "@/components/account/edit-studio-loader";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Edit Studio",
  description: "Update one of your StudioSpace listings. Log in required.",
};

// The URL (and therefore usePathname in the header) only exists at runtime
// for this route — opt out of the build-time prerender.
export const instant = false;

/** Awaiting `params` inside Suspense keeps the route prerenderable. */
async function EditStudioFromParams({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditStudioLoader id={id} />;
}

export default function EditStudioPage({
  params,
}: PageProps<"/account/studios/edit/[id]">) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-6 text-muted-foreground" />
            </div>
          }
        >
          <EditStudioFromParams params={params} />
        </Suspense>
      </ProtectedRoute>
    </div>
  );
}
