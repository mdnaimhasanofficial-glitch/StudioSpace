import type { Metadata } from "next";

import { AddStudioForm } from "@/components/studio/add-studio-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const metadata: Metadata = {
  title: "Add New Studio",
  description: "List a new studio on StudioSpace. Log in required.",
};

export default function NewStudioPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <ProtectedRoute>
        <AddStudioForm />
      </ProtectedRoute>
    </div>
  );
}
