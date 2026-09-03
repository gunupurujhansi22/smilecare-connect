import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchCurrentDoctor } from "@/lib/api";

const navItems = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/doctor/appointments", label: "Today's Appointments", icon: CalendarDays },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/consultations", label: "Consultations", icon: ClipboardList },
  { to: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/doctor/profile", label: "Profile", icon: UserRound },
  { to: "/doctor/settings", label: "Settings", icon: Settings },
] as const;

export function useCurrentDoctor() {
  return useQuery({ queryKey: ["current-doctor"], queryFn: fetchCurrentDoctor, staleTime: 60_000 });
}

export function DoctorShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: doctor } = useCurrentDoctor();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/doctor-login", replace: true });
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Doctor dashboard">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-secondary/40 lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="hidden border-r border-border bg-background p-5 lg:flex lg:flex-col">
        <Logo />
        <div className="mt-7 flex flex-1 flex-col">{nav}</div>
        <Button variant="soft" onClick={signOut} className="mt-4 justify-start">
          <LogOut /> Logout
        </Button>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-extrabold text-foreground sm:text-lg">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="hidden items-center gap-3 sm:flex">{actions}</div>
          <span className="hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-foreground md:inline">
            {doctor?.name ?? "Doctor"}
          </span>
        </header>

        {actions && <div className="flex gap-2 px-4 pt-4 sm:hidden">{actions}</div>}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close dashboard menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-6 flex flex-1 flex-col">{nav}</div>
            <Button variant="soft" onClick={signOut} className="mt-4 justify-start">
              <LogOut /> Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
