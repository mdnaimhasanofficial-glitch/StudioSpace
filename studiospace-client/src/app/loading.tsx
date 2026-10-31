import { Aperture } from "lucide-react";

/**
 * Root loading state — shown while a route without its own loading.tsx
 * streams in (client-side navigation, slow first compile).
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6"
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-2xl"
        />
        <Aperture
          className="size-10 animate-[spin_2.5s_linear_infinite] text-primary motion-reduce:animate-none"
          aria-hidden
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium tracking-tight">
          Setting the stage…
        </p>
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:0ms] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:150ms] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:300ms] motion-reduce:animate-none" />
        </div>
      </div>

      <span className="sr-only">Loading page</span>
    </div>
  );
}
