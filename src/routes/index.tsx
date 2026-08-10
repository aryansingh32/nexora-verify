import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Cloud,
  Code2,
  Cog,
  LayoutDashboard,
  Plug,
  ShieldCheck,
  Smartphone,
  Sparkles,
  LifeBuoy,
  CheckCircle2,
} from "lucide-react";
import heroImage from "@/assets/hero-abstract.jpg";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CASE_STUDIES, COMPANY, PROCESS, SERVICES, STATS, WHY_US } from "@/lib/company";

const SERVICE_ICONS = [Code2, Smartphone, Cog, Cloud, LayoutDashboard, Sparkles, Plug, LifeBuoy];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora Digital Solutions — Custom Software & Digital Transformation" },
      {
        name: "description",
        content:
          "Nexora Digital Solutions Private Limited delivers custom software, web and mobile platforms, business automation, cloud and digital transformation for growing businesses.",
      },
      { property: "og:title", content: "Digital solutions built around your business" },
      {
        property: "og:description",
        content:
          "Custom software, web and mobile apps, automation, cloud and digital transformation from Nexora Digital Solutions Private Limited.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--gradient-halo)" }}
          aria-hidden="true"
        />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-xs)]">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              {COMPANY.tagline}
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Digital solutions built <span className="text-gradient">around your business.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We design and engineer custom software, web and mobile platforms, business automation,
              cloud infrastructure and end-to-end digital transformation programmes — shaped around how
              your teams actually work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  Start a Project <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-semibold text-foreground">{s.value}</dd>
                  <p className="text-xs leading-snug text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="reveal relative">
            <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-elevated)]">
              <img
                src={heroImage}
                alt="Abstract visualisation of connected digital systems"
                width={1408}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="surface-card absolute -bottom-6 left-4 hidden w-64 p-4 sm:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Delivery signal
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Two-week increments, working software every sprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
          <p className="col-span-2 text-center text-xs text-muted-foreground md:col-span-4">
            Demo statistics shown for illustration.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-20" aria-labelledby="services-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Capabilities</p>
          <h2 id="services-heading" className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
            Engineering services, end to end
          </h2>
          <p className="mt-4 text-muted-foreground">
            One accountable team across strategy, design, build and long-term support.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]!;
            return (
              <Link
                key={service.slug}
                to="/services"
                hash={service.slug}
                className="surface-card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
              >
                <span
                  className="grid size-10 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-border bg-surface py-20" aria-labelledby="why-heading">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Why Nexora</p>
            <h2 id="why-heading" className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
              Built for businesses that need software to hold up
            </h2>
            <p className="mt-4 text-muted-foreground">
              We work as an engineering partner, not a vendor — with the same standards of rigour,
              documentation and security you would expect from an in-house team.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/about">About the company</Link>
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY_US.map((item) => (
              <li key={item.title} className="surface-card p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-20" aria-labelledby="process-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How we work</p>
          <h2 id="process-heading" className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
            A delivery process without surprises
          </h2>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS.map((step) => (
            <li key={step.step} className="surface-card relative p-6">
              <span className="font-display text-sm font-semibold text-primary">{step.step}</span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured work */}
      <section className="border-y border-border bg-surface py-20" aria-labelledby="work-heading">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Featured work
              </p>
              <h2 id="work-heading" className="mt-4 text-3xl font-semibold text-foreground md:text-4xl">
                Representative engagements
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo case studies created to illustrate our delivery model.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {CASE_STUDIES.map((cs) => (
              <article key={cs.name} className="surface-card p-7">
                <div className="flex items-center gap-2">
                  <Boxes className="size-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {cs.sector}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-foreground">
                  {cs.name} <span className="text-muted-foreground">— {cs.subtitle}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cs.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cs.outcomes.map((o) => (
                    <li
                      key={o}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div
          className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-primary-foreground shadow-[var(--shadow-elevated)] md:px-16"
          style={{ backgroundImage: "var(--gradient-primary)" }}
        >
          <ShieldCheck className="mx-auto size-8 opacity-90" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-semibold md:text-4xl">
            Have a digital challenge? Let&apos;s build the right solution.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base opacity-90">
            Tell us where the friction is. We will come back with a clear view of scope, sequence and
            what it takes to deliver.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link to="/contact">
              Talk to Our Team <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
