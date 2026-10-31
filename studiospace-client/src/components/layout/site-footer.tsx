import Link from "next/link";
import { Aperture } from "lucide-react";

// Evaluated once at build time — `new Date()` during render is unstable under
// cacheComponents prerendering.
const currentYear = new Date().getFullYear();

const footerLinks = [
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about", label: "About Us" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm space-y-3">
          <Link href="/" className="flex items-center gap-2">
            <Aperture className="size-5 text-primary" aria-hidden />
            <span className="font-semibold tracking-tight">StudioSpace</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Peer-to-peer creative spaces. Book the room, make the thing, hand
            the keys back.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60 py-6">
        <p className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          © {currentYear} StudioSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
