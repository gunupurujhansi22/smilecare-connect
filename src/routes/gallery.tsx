import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import hero from "@/assets/hero-dental.jpg";
import advanced from "@/assets/advanced-care.jpg";
import clinic from "@/assets/clinic-interior.jpg";
import smile from "@/assets/smile-closeup.jpg";
import team from "@/assets/dental-team.jpg";
import technology from "@/assets/technology.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — SmileCare Dental Hospital" },
      {
        name: "description",
        content:
          "Take a look inside SmileCare Dental Hospital: our clinic, dental team, treatment rooms, technology and patient smiles.",
      },
      { property: "og:title", content: "Gallery — SmileCare Dental Hospital" },
      { property: "og:description", content: "Inside our clinic, treatment rooms, technology and dental team." },
    ],
  }),
  component: GalleryPage,
});

const categories = ["All", "Clinic", "Doctors", "Treatment", "Technology", "Facilities"] as const;

const items = [
  { src: clinic, alt: "SmileCare treatment room interior", category: "Clinic", span: "lg:row-span-2" },
  { src: hero, alt: "Dentist with a smiling patient", category: "Treatment", span: "" },
  { src: team, alt: "The SmileCare dental team", category: "Doctors", span: "lg:col-span-2" },
  { src: technology, alt: "Intraoral scanning in progress", category: "Technology", span: "" },
  { src: advanced, alt: "Digital dental x-ray review", category: "Technology", span: "lg:col-span-2" },
  { src: smile, alt: "Close-up of a healthy bright smile", category: "Treatment", span: "" },
  { src: clinic, alt: "Sterilised clinical facilities", category: "Facilities", span: "" },
];

function GalleryPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");
  const filtered = active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Gallery"
        title="A look inside SmileCare"
        subtitle="Bright, calm and sterilised spaces designed to make dental visits comfortable."
      />

      <section className="section-shell py-12">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={active === category}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-smooth ${
                active === category
                  ? "gradient-brand border-transparent text-primary-foreground shadow-brand"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <figure
              key={`${item.alt}-${index}`}
              className={`group overflow-hidden rounded-3xl border border-border shadow-soft ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-smooth group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
