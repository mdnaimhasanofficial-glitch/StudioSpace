"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-context";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);

      // Read `next` at submit time to avoid useSearchParams + Suspense.
      const next = new URLSearchParams(window.location.search).get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      router.push(target);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setPending(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <GoogleAuthButton />

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            or {(isRegister ? "sign up" : "log in") + " with email"}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>
                Could not {isRegister ? "register" : "log in"}
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegister && (
              <p className="text-xs text-muted-foreground">
                At least 6 characters.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Spinner aria-hidden />}
            {isRegister ? "Create account" : "Log in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account? " : "No account yet? "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="text-primary underline-offset-4 hover:underline"
          >
            {isRegister ? "Log in" : "Register"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
