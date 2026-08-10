import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SERVICES } from "@/lib/company";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Custom Software, Automation & Cloud | Nexora Digital" },
      {
        name: "description",
        content:
          "Custom software development, web and mobile apps, business automation, cloud infrastructure, product design, integration and ongoing technical support.",
      },
      { property: "og:title", content: "Services | Nexora Digital Solutions" },
      {
        property: "og:description",
        content:
          "Eight engineering services covering strategy, design, build, integration and long-term support.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="Engineering services for measurable business outcomes"
        lead="Every engagement starts with the problem you are trying to solve, not the technology we would like to use. Here is what we do and what you receive."
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {s.title}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="container-page divide-y divide-border">
        {SERVICES.map((service, i) => (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-24 py-16"
            aria-labelledby={`${service.slug}-heading`}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
              <div>
                <p className="font-display text-sm font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`${service.slug}-heading`}
                  className="mt-2 text-2xl font-semibold text-foreground md:text-3xl"
                >
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{service.summary}</p>
                <h3 className="mt-6 text-sm font-semibold text-foreground">What it solves</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.solves}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="surface-card p-6">
                  <h3 className="text-sm font-semibold text-foreground">Typical deliverables</h3>
                  <ul className="mt-4 space-y-2.5">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="surface-card flex flex-col p-6">
                  <h3 className="text-sm font-semibold text-foreground">Example use cases</h3>
                  <ul className="mt-4 flex-1 space-y-2.5">
                    {service.useCases.map((u) => (
                      <li key={u} className="text-sm leading-relaxed text-muted-foreground">
                        {u}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="sm" className="mt-5 self-start">
                    <Link to="/contact">
                      Discuss this service <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-border bg-surface py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            Not sure which service you need?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Describe the problem and we will recommend the shortest credible path to solving it.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/contact">Talk to Our Team</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
