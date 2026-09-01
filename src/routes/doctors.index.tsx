import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { DoctorCard } from "@/components/site/cards";
import { EmptyState, ErrorState, LoadingRows } from "@/components/states";
import { fetchDoctors } from "@/lib/api";

export const Route = createFileRoute("/doctors/")({
  head: () => ({
    meta: [
      { title: "Our Dental Specialists — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "Meet the SmileCare dental team: senior dental surgeons, orthodontists, implantologists and pediatric dentists with years of clinical experience.",
      },
      { property: "og:title", content: "Our Dental Specialists — SmileCare Dental Hospital" },
      { property: "og:description", content: "Qualified dental specialists across every major speciality." },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const doctorsQuery = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Team"
        title="Meet Our Dental Specialists"
        subtitle="Experienced doctors who combine clinical precision with genuine warmth."
      />
      <section className="section-shell py-14">
        {doctorsQuery.isPending ? (
          <LoadingRows rows={3} />
        ) : doctorsQuery.isError ? (
          <ErrorState title="Unable to load doctors" text="Please refresh the page and try again." />
        ) : doctorsQuery.data.length === 0 ? (
          <EmptyState title="No doctors listed yet" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctorsQuery.data.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
