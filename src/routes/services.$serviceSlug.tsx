import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";

import { PageHeader, SiteLayout, SectionHeading } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/site-data";
import clinicInterior from "@/assets/clinic-interior.jpg";

export const Route = createFileRoute("/services/$serviceSlug")({
  loader: ({ params }) => {
    const service = services.find((item) => item.slug === params.serviceSlug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found — SmileCare" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: `${service.name} — SmileCare Dental Hospital` },
        { name: "description", content: service.description.slice(0, 155) },
        { property: "og:title", content: `${service.name} — SmileCare Dental Hospital` },
        { property: "og:description", content: service.short },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Services" title="We couldn't find that service" subtitle="Browse all SmileCare treatments instead." />
      <div className="section-shell py-14 text-center">
        <Button asChild variant="brand">
          <Link to="/services">View All Services</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <SiteLayout>
      <PageHeader eyebrow="Dental Service" title={service.name} subtitle={service.short} />

      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-xl font-extrabold text-foreground md:text-2xl">About this treatment</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{service.description}</p>

          <h3 className="mt-10 text-lg font-bold text-foreground">What makes it different</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {service.highlights.map((highlight) => (
              <li key={highlight} className="card-surface flex items-center gap-3 p-4 text-sm font-semibold">
                <Check className="h-4 w-4 shrink-0 text-mint" /> {highlight}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-lg font-bold text-foreground">Treatments included</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.treatments.map((treatment) => (
              <span
                key={treatment}
                className="rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground"
              >
                {treatment}
              </span>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <img
            src={clinicInterior}
            alt={`SmileCare treatment room used for ${service.name}`}
            loading="lazy"
            width={1280}
            height={960}
            className="aspect-4/3 w-full rounded-3xl object-cover shadow-card"
          />
          <div className="card-surface p-6">
            <h3 className="text-base font-bold text-foreground">Book {service.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose your preferred doctor, date and time. Confirmation is instant.
            </p>
            <Button asChild variant="brand" className="mt-5 w-full">
              <Link to="/appointment" search={{ service: service.name }}>
                Book Appointment <ArrowRight />
              </Link>
            </Button>
          </div>
        </aside>
      </section>

      <section className="section-shell pb-14">
        <SectionHeading eyebrow="More Treatments" title="Related dental services" align="left" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ServiceCard key={item.slug} service={item} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
