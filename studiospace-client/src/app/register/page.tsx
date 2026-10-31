import type { Metadata } from "next";

import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a StudioSpace account to list your studio and start taking bookings.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
      <div className="space-y-1.5 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Register to list your studio and start taking bookings.
        </p>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
