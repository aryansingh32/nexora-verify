import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Compass, HeartHandshake, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { COMPANY, PROCESS, STATS, WHY_US } from "@/lib/company";

const VALUES = [
  { icon: Target, title: "Outcome over output", body: "We measure success by what changed in your business, not by how much software we shipped." },
  { icon: HeartHandshake, title: "Straight answers", body: "Realistic estimates, early warnings and honest trade-offs — even when the news is inconvenient." },
  { icon: Users, title: "Teams, not resources", body: "Small, stable, senior teams who stay with your product long enough to understand it deeply." },
  { icon: Compass, title: "Craft with restraint", body: "A deliberately boring stack, rigorously applied, so the system is still maintainable in five years." },
];

const LEADERSHIP = [
  { name: "R. Kulkarni", role: "Director — Delivery", bio: "Eighteen years across enterprise integration and operations platforms. Owns delivery governance and quality standards." },
  { name: "A. Sharma", role: "Head of Engineering", bio: "Leads architecture and platform engineering, with a focus on reliability, observability and secure defaults." },
  { name: "P. Iyer", role: "Head of Design", bio: "Research-led product designer specialising in complex operational interfaces and accessible design systems." },
];

const TIMELINE = [
  { year: "2016", body: "Founded in Noida as a four-person engineering studio serving regional distribution businesses." },
  { year: "2019", body: "Expanded into cloud and integration engineering; first managed-support contracts signed." },
  { year: "2022", body: "Dedicated design practice established; delivery model formalised into five stages." },
  { year: "2025", body: "Thirty-plus businesses supported across retail, healthcare, education and logistics." },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Nexora Digital Solutions Private Limited" },
      {
        name: "description",
        content:
          "Nexora Digital Solutions is an engineering partner based in Noida, India, building custom software, cloud and automation solutions since 2016.",
      },
      { property: "og:title", content: "About | Nexora Digital Solutions" },
      {
        property: "og:description",
        content: "Our story, values, leadership and how we approach engineering partnerships.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title="An engineering partner for businesses that depend on their software"
        lead={COMPANY.description}
      />

      <section className="container-page grid gap-12 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Our story</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              Nexora began in 2016 with a simple observation: most businesses were not short of
              software, they were short of software that matched how they actually worked. Teams were
              bridging the gap with spreadsheets, re-keyed data and heroic manual effort.
            </p>
            <p>
              We set out to be the partner that closes that gap — combining domain discovery, product
              design and disciplined engineering into one accountable team. Today we work with
              organisations across retail distribution, healthcare services, education and logistics.
            </p>
            <p>
              We stay deliberately small per engagement. Senior people, stable teams, and a long
              enough relationship to understand the business behind the backlog.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="surface-card p-5">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-5">
          <div className="surface-card p-7">
            <Building2 className="size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">Mission</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              To help businesses run better through technology that is well-designed, well-built and
              genuinely maintainable.
            </p>
          </div>
          <div className="surface-card p-7">
            <Compass className="size-5 text-primary" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-foreground">Vision</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              To be the digital engineering partner mid-sized enterprises trust with the systems their
              operations depend on.
            </p>
          </div>
          <ol className="surface-card divide-y divide-border p-7">
            {TIMELINE.map((t) => (
              <li key={t.year} className="flex gap-5 py-3 first:pt-0 last:pb-0">
                <span className="font-display text-sm font-semibold text-primary">{t.year}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{t.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-20" aria-labelledby="values-heading">
        <div className="container-page">
          <h2 id="values-heading" className="text-2xl font-semibold text-foreground md:text-3xl">
            What we value
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article key={v.title} className="surface-card p-6">
                <v.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl font-semibold text-foreground md:text-3xl">
          Leadership
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Demo leadership profiles shown for illustration.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {LEADERSHIP.map((p) => (
            <article key={p.name} className="surface-card p-6">
              <span
                className="grid size-12 place-items-center rounded-full font-display text-base font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-primary)" }}
                aria-hidden="true"
              >
                {p.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{p.name}</h3>
              <p className="text-sm text-primary">{p.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20" aria-labelledby="approach-heading">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 id="approach-heading" className="text-2xl font-semibold text-foreground md:text-3xl">
              How we deliver
            </h2>
            <ol className="mt-6 space-y-4">
              {PROCESS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="font-display text-sm font-semibold text-primary">{s.step}</span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{s.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Button asChild className="mt-8">
              <Link to="/contact">Work with us</Link>
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY_US.map((w) => (
              <li key={w.title} className="surface-card p-5">
                <h3 className="text-sm font-semibold text-foreground">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
