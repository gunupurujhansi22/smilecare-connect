import { Link } from "@tanstack/react-router";
import { Menu, Stethoscope, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Doctors", to: "/doctors" },
  { label: "About Us", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 lg:grid-cols-[auto_1fr_auto]">
        <Logo />

        <nav className="hidden justify-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-smooth hover:bg-primary-soft hover:text-primary data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden font-semibold text-primary md:inline-flex">
            <Link to="/doctor-login">
              <Stethoscope /> Doctor Login
            </Link>
          </Button>
          <Button asChild variant="brand" size="sm" className="hidden sm:inline-flex">
            <Link to="/appointment">Book Appointment</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-foreground transition-smooth hover:bg-muted lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="section-shell flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-smooth hover:bg-muted data-[status=active]:bg-primary-soft data-[status=active]:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2">
              <Button asChild variant="brand">
                <Link to="/appointment" onClick={() => setOpen(false)}>
                  Book Appointment
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/doctor-login" onClick={() => setOpen(false)}>
                  <Stethoscope /> Doctor Login
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
