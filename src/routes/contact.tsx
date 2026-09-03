import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clinicInfo } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SmileCare Dental Hospital — Book or Ask a Question" },
      {
        name: "description",
        content:
          "Contact SmileCare Dental Hospital in New Delhi. Call +91 98765 43210, email info@smilecare.com or send us a message — we reply the same working day.",
      },
      { property: "og:title", content: "Contact SmileCare Dental Hospital" },
      { property: "og:description", content: "Address, phone, email and working hours for SmileCare Dental Hospital." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(20),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setValues({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent", { description: "Our front desk will get back to you shortly." });
    }, 700);
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="We're here to help"
        subtitle="Call us, email us or send a message — our front desk responds during working hours."
      />

      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="card-surface p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary">
              <MapPin className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-foreground">Address</h2>
            <p className="mt-1 text-sm text-muted-foreground">{clinicInfo.address}</p>
          </div>

          <div className="card-surface p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-magenta-soft text-magenta">
              <Phone className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-foreground">Phone & Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">{clinicInfo.phone}</p>
            <p className="text-sm text-muted-foreground">{clinicInfo.email}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="brand" size="sm">
                <a href={`tel:${clinicInfo.phone.replace(/\s/g, "")}`}>
                  <Phone /> Call Now
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${clinicInfo.email}`}>
                  <Mail /> Email Us
                </a>
              </Button>
            </div>
          </div>

          <div className="card-surface p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-mint">
              <Clock className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-foreground">Working Hours</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {clinicInfo.hours.map((entry) => (
                <li key={entry.days} className="flex justify-between gap-4">
                  <span>{entry.days}</span>
                  <span className="font-semibold text-foreground">{entry.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <form onSubmit={submit} className="card-surface space-y-5 p-7" noValidate>
            <h2 className="text-lg font-extrabold text-foreground">Send us a message</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" error={errors["name"]}>
                <Input
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Your name"
                  maxLength={100}
                />
              </Field>
              <Field label="Phone Number" error={errors["phone"]}>
                <Input
                  value={values.phone}
                  onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  maxLength={20}
                />
              </Field>
            </div>
            <Field label="Email" error={errors["email"]}>
              <Input
                type="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                placeholder="you@example.com"
                maxLength={255}
              />
            </Field>
            <Field label="Message" error={errors["message"]}>
              <Textarea
                rows={5}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                placeholder="How can we help?"
                maxLength={1000}
              />
            </Field>
            <Button type="submit" variant="brand" size="lg" disabled={sending} className="w-full">
              {sending ? "Sending…" : "Send Message"} <Send />
            </Button>
          </form>

          <div className="card-surface mt-5 grid h-56 place-items-center bg-secondary/60 text-center">
            <div>
              <MapPin className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-bold text-foreground">SmileCare Dental Hospital</p>
              <p className="text-xs text-muted-foreground">{clinicInfo.address}</p>
              <p className="mt-2 text-xs text-muted-foreground">Map preview</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
