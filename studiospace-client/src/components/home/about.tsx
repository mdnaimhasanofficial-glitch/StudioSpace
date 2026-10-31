const stats = [
  { value: "200+", label: "verified spaces" },
  { value: "12k", label: "hours booked" },
  { value: "4.9", label: "average rating" },
] as const;

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Built by people who book studios
          </h2>
          <p className="text-muted-foreground">
            StudioSpace started because booking a photo studio shouldn&apos;t
            take a dozen phone calls. We verify every space, set clear hourly
            rates, and keep the keys moving — so the only thing you plan is the
            shoot.
          </p>
          <p className="text-muted-foreground">
            Have a space that sits empty half the week? List it, set your rate,
            and let the room pay for itself.
          </p>
          <a
            href="mailto:mdnaimhasan.official@gmail.com"
            className="text-sm font-medium text-primary underline decoration-2 underline-offset-4"
          >
            Become a host →
          </a>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border/60 bg-muted/20 p-6"
            >
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-3xl font-bold text-primary">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
