import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState, LoadingBlock } from "@/components/states";
import { bookAppointment, fetchDoctors, todayISO } from "@/lib/api";
import { appointmentTypes, serviceNames, timeSlots } from "@/lib/site-data";

export const Route = createFileRoute("/appointment")({
  validateSearch: (search: Record<string, unknown>) => ({
    doctor: typeof search["doctor"] === "string" ? search["doctor"] : undefined,
    service: typeof search["service"] === "string" ? search["service"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Dental Appointment — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "Book your dental appointment at SmileCare in three quick steps — choose your service, doctor, date and time and get instant confirmation.",
      },
      { property: "og:title", content: "Book a Dental Appointment — SmileCare" },
      { property: "og:description", content: "Your perfect smile is just a few clicks away. Instant confirmation." },
    ],
  }),
  component: AppointmentPage,
});

const patientSchema = z.object({
  name: z.string().trim().min(2, "Please enter the patient's full name").max(100),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email address").max(255).or(z.literal("")),
  age: z
    .string()
    .trim()
    .refine((v) => v === "" || (Number(v) > 0 && Number(v) < 120), "Enter a valid age"),
  gender: z.string().trim().min(1, "Select a gender"),
});

const appointmentSchema = z.object({
  service: z.string().min(1, "Select a service"),
  doctorId: z.string().uuid("Select a doctor"),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select an available time"),
  type: z.string().min(1, "Select an appointment type"),
  reason: z.string().trim().max(500).optional(),
});

const steps = ["Patient Information", "Appointment Information", "Confirmation"];

function AppointmentPage() {
  const search = Route.useSearch();
  const doctorsQuery = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const [patient, setPatient] = useState({ name: "", phone: "", email: "", age: "", gender: "" });
  const [details, setDetails] = useState({
    service: search.service ?? "",
    doctorId: search.doctor ?? "",
    date: todayISO(),
    time: "",
    type: "New Consultation",
    reason: "",
  });

  const bookMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: (appointmentNumber) => {
      setConfirmation(appointmentNumber);
      toast.success("Appointment confirmed successfully", {
        description: `Your appointment ID is ${appointmentNumber}.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Unable to book appointment", { description: error.message });
    },
  });

  const doctors = doctorsQuery.data ?? [];
  const selectedDoctor = doctors.find((doctor) => doctor.id === details.doctorId);

  function validateStep(index: number) {
    const schema = index === 0 ? patientSchema : appointmentSchema;
    const value = index === 0 ? patient : details;
    const result = schema.safeParse(value);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  if (confirmation) {
    return (
      <SiteLayout>
        <PageHeader eyebrow="Appointment Confirmed" title="Your appointment has been successfully booked" />
        <section className="section-shell max-w-2xl py-14">
          <div className="card-surface p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint-soft text-mint">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="mt-5 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">Appointment ID</p>
            <p className="mt-2 text-3xl font-extrabold text-gradient-brand">{confirmation}</p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(confirmation);
                toast.success("Appointment ID copied");
              }}
              className="mx-auto mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Copy className="h-3.5 w-3.5" /> Copy ID
            </button>

            <dl className="mt-7 grid gap-3 text-left sm:grid-cols-2">
              <Summary label="Patient Name" value={patient.name} />
              <Summary label="Doctor" value={selectedDoctor?.name ?? "—"} />
              <Summary label="Service" value={details.service} />
              <Summary label="Date" value={details.date} />
              <Summary label="Time" value={details.time} />
              <Summary label="Appointment Type" value={details.type} />
              <Summary label="Status" value="Booked" />
            </dl>

            <p className="mt-6 text-sm text-muted-foreground">
              Please arrive 10 minutes early. Your doctor will see your booking in today's schedule.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="brand">
                <Link to="/">Back to Home</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmation(null);
                  setStep(0);
                  setPatient({ name: "", phone: "", email: "", age: "", gender: "" });
                  setDetails({ service: "", doctorId: "", date: todayISO(), time: "", type: "New Consultation", reason: "" });
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Book Appointment"
        title="Book Your Appointment in Seconds"
        subtitle="Your perfect smile is just a click away — choose your doctor, date and time."
      />

      <section className="section-shell max-w-3xl py-14">
        <ol className="mb-8 grid grid-cols-3 gap-2">
          {steps.map((label, index) => (
            <li key={label} className="min-w-0">
              <div
                className={`h-1.5 rounded-full ${index <= step ? "gradient-brand" : "bg-border"}`}
                aria-hidden="true"
              />
              <p
                className={`mt-2 truncate text-xs font-bold ${
                  index <= step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {index + 1}. {label}
              </p>
            </li>
          ))}
        </ol>

        <div className="card-surface p-7">
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full Name" error={errors["name"]}>
                <Input
                  value={patient.name}
                  onChange={(e) => setPatient((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Patient full name"
                  maxLength={100}
                />
              </Field>
              <Field label="Phone Number" error={errors["phone"]}>
                <Input
                  value={patient.phone}
                  onChange={(e) => setPatient((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  maxLength={20}
                />
              </Field>
              <Field label="Email" error={errors["email"]}>
                <Input
                  type="email"
                  value={patient.email}
                  onChange={(e) => setPatient((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </Field>
              <Field label="Age" error={errors["age"]}>
                <Input
                  inputMode="numeric"
                  value={patient.age}
                  onChange={(e) => setPatient((p) => ({ ...p, age: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                  placeholder="32"
                />
              </Field>
              <Field label="Gender" error={errors["gender"]}>
                <Select value={patient.gender} onValueChange={(value) => setPatient((p) => ({ ...p, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Female", "Male", "Other", "Prefer not to say"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {step === 1 &&
            (doctorsQuery.isPending ? (
              <LoadingBlock label="Loading doctors…" />
            ) : doctorsQuery.isError ? (
              <ErrorState title="Unable to load doctors" text="Please refresh and try again." />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Service" error={errors["service"]}>
                  <Select value={details.service} onValueChange={(value) => setDetails((d) => ({ ...d, service: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Preferred Doctor" error={errors["doctorId"]}>
                  <Select value={details.doctorId} onValueChange={(value) => setDetails((d) => ({ ...d, doctorId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} · {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date" error={errors["date"]}>
                  <Input
                    type="date"
                    min={todayISO()}
                    value={details.date}
                    onChange={(e) => setDetails((d) => ({ ...d, date: e.target.value }))}
                  />
                </Field>
                <Field label="Available Time" error={errors["time"]}>
                  <Select value={details.time} onValueChange={(value) => setDetails((d) => ({ ...d, time: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Appointment Type" error={errors["type"]}>
                  <Select value={details.type} onValueChange={(value) => setDetails((d) => ({ ...d, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Reason for Visit" error={errors["reason"]}>
                    <Textarea
                      rows={3}
                      value={details.reason}
                      onChange={(e) => setDetails((d) => ({ ...d, reason: e.target.value }))}
                      placeholder="Briefly describe the problem"
                      maxLength={500}
                    />
                  </Field>
                </div>
              </div>
            ))}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Review your appointment</h2>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <Summary label="Patient Name" value={patient.name} />
                <Summary label="Phone" value={patient.phone} />
                <Summary label="Doctor" value={selectedDoctor?.name ?? "—"} />
                <Summary label="Service" value={details.service} />
                <Summary label="Date" value={details.date} />
                <Summary label="Time" value={details.time} />
                <Summary label="Appointment Type" value={details.type} />
                <Summary label="Reason" value={details.reason || "—"} />
              </dl>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || bookMutation.isPending}
            >
              <ArrowLeft /> Back
            </Button>
            {step < 2 ? (
              <Button
                variant="brand"
                onClick={() => {
                  if (validateStep(step)) setStep((s) => s + 1);
                }}
              >
                Continue <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="brand"
                size="lg"
                disabled={bookMutation.isPending}
                onClick={() =>
                  bookMutation.mutate({
                    name: patient.name,
                    phone: patient.phone,
                    email: patient.email,
                    age: patient.age ? Number(patient.age) : null,
                    gender: patient.gender,
                    doctorId: details.doctorId,
                    service: details.service,
                    date: details.date,
                    time: details.time,
                    type: details.type,
                    reason: details.reason,
                  })
                }
              >
                {bookMutation.isPending ? "Confirming…" : "Confirm Appointment"} <CalendarCheck />
              </Button>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3">
      <dt className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
