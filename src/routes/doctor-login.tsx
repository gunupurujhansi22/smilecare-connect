import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import clinicInterior from "@/assets/clinic-interior.jpg";

export const Route = createFileRoute("/doctor-login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Doctor Login — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "Secure login for SmileCare doctors to view today's bookings, open patient records and issue prescriptions.",
      },
      { property: "og:title", content: "Doctor Login — SmileCare Dental Hospital" },
      { property: "og:description", content: "Secure clinical access for SmileCare dental specialists." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DoctorLoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid doctor email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

function DoctorLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setBusy(true);

    const { data: doctorRow } = await supabase
      .from("doctors")
      .select("id")
      .ilike("email", result.data.email)
      .maybeSingle();

    if (!doctorRow) {
      setBusy(false);
      toast.error("Not a registered doctor account", {
        description: "This email is not listed as a SmileCare doctor.",
      });
      return;
    }

    const response =
      mode === "login"
        ? await supabase.auth.signInWithPassword(result.data)
        : await supabase.auth.signUp({
            ...result.data,
            options: { emailRedirectTo: window.location.origin },
          });

    setBusy(false);

    if (response.error) {
      toast.error(mode === "login" ? "Login failed" : "Could not create account", {
        description: response.error.message,
      });
      return;
    }

    if (!response.data.session) {
      toast.success("Account created", { description: "Please sign in with your new password." });
      setMode("login");
      return;
    }

    toast.success("Welcome back, doctor");
    void navigate({ to: "/doctor/dashboard", replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Logo />
          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-primary">
            <Stethoscope className="h-3.5 w-3.5" /> Clinical Access
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-foreground">
            {mode === "login" ? "Doctor Login" : "Create doctor access"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to view today's bookings, patient records and prescriptions."
              : "Set a password for your registered SmileCare doctor email."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Doctor Email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="anaya@smilecare.com"
                maxLength={255}
              />
              {errors["email"] && <p className="text-xs font-medium text-destructive">{errors["email"]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Password</Label>
              <Input
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                placeholder="••••••••"
                maxLength={72}
              />
              {errors["password"] && <p className="text-xs font-medium text-destructive">{errors["password"]}</p>}
            </div>

            <Button type="submit" variant="brand" size="lg" disabled={busy} className="w-full">
              {busy ? "Please wait…" : mode === "login" ? "Login to Dashboard" : "Create Access & Continue"}
              <LogIn />
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="mt-5 text-sm font-semibold text-primary hover:underline"
          >
            {mode === "login" ? "First time here? Set your password" : "Already have access? Login"}
          </button>

          <div className="mt-8 rounded-2xl border border-border bg-secondary/50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Demo doctor account
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Use <span className="font-semibold text-foreground">anaya@smilecare.com</span> and set a password of at
              least 8 characters via “Set your password” to explore today's bookings and the consultation workflow.
            </p>
          </div>

          <Link to="/" className="mt-6 inline-block text-xs font-semibold text-muted-foreground hover:text-primary">
            ← Back to website
          </Link>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={clinicInterior}
          alt="SmileCare clinical treatment room"
          loading="lazy"
          width={1280}
          height={960}
          className="h-full w-full object-cover"
        />
        <div className="gradient-deep absolute inset-0 opacity-80" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="text-xs font-bold tracking-[0.22em] text-white/70 uppercase">SmileCare Clinical Suite</p>
          <p className="mt-3 text-2xl leading-snug font-extrabold text-white">
            Today's bookings, patient records and prescriptions — in one calm workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
