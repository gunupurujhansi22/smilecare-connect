import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, GraduationCap, Mail, Phone, ShieldCheck, Star } from "lucide-react";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingBlock } from "@/components/states";
import { fetchDoctor } from "@/lib/api";
import { doctorImage } from "@/lib/doctor-images";

export const Route = createFileRoute("/doctors/$doctorId")({
  head: () => ({
    meta: [
      { title: "Doctor Profile — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "View the profile, qualification, speciality and availability of a SmileCare dental specialist and book an appointment.",
      },
      { property: "og:title", content: "Doctor Profile — SmileCare Dental Hospital" },
      { property: "og:description", content: "Qualification, speciality and availability of our dental specialists." },
    ],
  }),
  component: DoctorProfilePage,
});

function DoctorProfilePage() {
  const { doctorId } = Route.useParams();
  const query = useQuery({ queryKey: ["doctor", doctorId], queryFn: () => fetchDoctor(doctorId) });

  if (query.isPending) {
    return (
      <SiteLayout>
        <LoadingBlock label="Loading doctor profile…" />
      </SiteLayout>
    );
  }

  if (query.isError || !query.data) {
    return (
      <SiteLayout>
        <div className="section-shell py-20">
          <ErrorState
            title="Doctor not found"
            text="This profile is unavailable. Browse our full team instead."
            action={
              <Button asChild variant="brand" className="mt-4">
                <Link to="/doctors">View All Doctors</Link>
              </Button>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const doctor = query.data;

  return (
    <SiteLayout>
      <PageHeader eyebrow={doctor.specialization} title={doctor.name} subtitle={doctor.qualification} />

      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <img
            src={doctorImage(doctor.email)}
            alt={`${doctor.name}, ${doctor.specialization}`}
            loading="lazy"
            width={640}
            height={640}
            className="aspect-square w-full rounded-4xl bg-sky object-cover shadow-card"
          />
          <div className="card-surface mt-5 space-y-3 p-6 text-sm">
            <p className="flex items-center gap-2.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> Reg. No. {doctor.registration_number}
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> {doctor.phone}
            </p>
            <p className="flex min-w-0 items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> <span className="truncate">{doctor.email}</span>
            </p>
          </div>
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card-surface p-5">
              <Star className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-extrabold text-foreground">{doctor.experience_years}+</p>
              <p className="text-xs font-semibold text-muted-foreground">Years Experience</p>
            </div>
            <div className="card-surface p-5">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-bold text-foreground">{doctor.availability}</p>
              <p className="text-xs font-semibold text-muted-foreground">Availability</p>
            </div>
            <div className="card-surface p-5">
              <Clock className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-bold text-foreground">{doctor.working_hours}</p>
              <p className="text-xs font-semibold text-muted-foreground">Working Hours</p>
            </div>
          </div>

          <h2 className="mt-10 text-xl font-extrabold text-foreground">About {doctor.name.split(" ")[1] ?? doctor.name}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{doctor.bio}</p>

          <div className="card-surface mt-8 p-6">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" /> {doctor.qualification} · {doctor.specialization}
            </p>
            <Button asChild variant="brand" size="lg" className="mt-5">
              <Link to="/appointment" search={{ doctor: doctor.id }}>
                Book Appointment with {doctor.name}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
