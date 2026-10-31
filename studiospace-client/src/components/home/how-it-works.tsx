import { CalendarClock, Search, Sparkles, type LucideIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Find your space",
    description:
      "Filter by category, neighborhood, and hourly rate. Every listing is verified by us.",
  },
  {
    icon: CalendarClock,
    title: "Book your window",
    description:
      "Pick the hours you need, pay once, and get instant confirmation.",
  },
  {
    icon: Sparkles,
    title: "Show up and create",
    description: "Keys in hand, gear warmed up. Hand it back when you're done.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-border/60 bg-muted/20"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three steps between you and a room that is ready for you.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="gap-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="size-5 text-primary" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
