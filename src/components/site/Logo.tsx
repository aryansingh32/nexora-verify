import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center" aria-label="Nexora Digital Solutions home">
      <img src="/logo.png" alt="Nexora Digital Solutions Logo" className="h-16 w-auto object-contain transition-transform group-hover:scale-105" />
    </Link>
  );
}
