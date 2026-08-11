import { Link } from "@tanstack/react-router";

import { COMPANY, SERVICES } from "@/lib/company";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div className="md:col-span-2 md:pr-10">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {COMPANY.description}
          </p>

        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services"
                  hash={s.slug}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="text-sm font-medium text-primary hover:underline">
                All services
              </Link>
            </li>
          </ul>
        </div>


      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p>Engineered in Noida, India.</p>
        </div>
      </div>
    </footer>
  );
}
