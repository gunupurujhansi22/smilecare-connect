import { Link } from "@tanstack/react-router";

export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const isLight = variant === "light";
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-2.5" aria-label="SmileCare Dental Hospital home">
      <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-2xl shadow-brand transition-smooth group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" aria-hidden="true">
          <path
            d="M12 4.2c-1.5-1.1-3-1.6-4.4-1.3C5.6 3.3 4.3 4.9 4.3 7.4c0 2 .5 3.7 1 5.6.4 1.5.5 3 .7 4.5.2 1.5.6 3 1.7 3 1.4 0 1.5-1.9 1.8-3.5.3-1.5.7-2.6 2.5-2.6s2.2 1.1 2.5 2.6c.3 1.6.4 3.5 1.8 3.5 1.1 0 1.5-1.5 1.7-3 .2-1.5.3-3 .7-4.5.5-1.9 1-3.6 1-5.6 0-2.5-1.3-4.1-3.3-4.5-1.4-.3-2.9.2-4.4 1.3Z"
            fill="white"
          />
          <path d="M9.4 8.6c1.5 1.4 3.7 1.4 5.2 0" stroke="oklch(0.5 0.2 266)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block truncate text-lg font-extrabold ${isLight ? "text-white" : "text-foreground"}`}>
          SmileCare
        </span>
        <span
          className={`block text-[10px] font-semibold tracking-[0.18em] ${
            isLight ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          DENTAL HOSPITAL
        </span>
      </span>
    </Link>
  );
}
