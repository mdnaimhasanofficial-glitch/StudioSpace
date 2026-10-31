import type { Metadata } from "next";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { MyBookingsList } from "@/components/account/my-bookings-list";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "Every studio session you have booked on StudioSpace.",
};

export default function MyBookingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <ProtectedRoute>
        <MyBookingsList />
      </ProtectedRoute>
    </div>
  );
}
