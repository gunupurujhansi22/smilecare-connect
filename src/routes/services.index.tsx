import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/cards";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Dental Services — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "Explore SmileCare dental services: general dentistry, implants, orthodontics, cosmetic dentistry, root canal, pediatric dentistry and oral surgery.",
      },
      { property: "og:title", content: "Dental Services — SmileCare Dental Hospital" },
      {
        property: "og:description",
        content: "Comprehensive dental treatments designed around your comfort and long-term oral health.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Dental Services"
        title="Complete Care for Every Smile"
        subtitle="Comprehensive dental treatments designed around your comfort and long-term oral health."
      />
      <section className="section-shell py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
