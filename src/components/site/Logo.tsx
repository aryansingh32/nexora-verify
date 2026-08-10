import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Nexora Digital Solutions home">
      <span
        className="grid size-9 place-items-center rounded-lg text-primary-foreground shadow-[var(--shadow-xs)] transition-transform group-hover:scale-105"
        style={{ backgroundImage: "var(--gradient-primary)" }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 19V5l14 14V5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[0.98rem] font-semibold tracking-tight text-foreground">
          Nexora Digital
        </span>
        {!compact && (
          <span className="block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Solutions Pvt. Ltd.
          </span>
        )}
      </span>
    </Link>
  );
}
