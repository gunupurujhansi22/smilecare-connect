import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, HeartHandshake, Target } from "lucide-react";

import { PageHeader, SectionHeading, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { stats, technologies } from "@/lib/site-data";
import team from "@/assets/dental-team.jpg";
import clinicInterior from "@/assets/clinic-interior.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SmileCare Dental Hospital — Our Story & Mission" },
      {
        name: "description",
        content:
          "Learn about SmileCare Dental Hospital: our story, mission, patient-first approach, experienced dental team and modern clinical technology.",
      },
      { property: "og:title", content: "About SmileCare Dental Hospital" },
      {
        property: "og:description",
        content: "A patient-first dental hospital built on trust, technology and clinical excellence.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About Us"
        title="Dental care built around people, not procedures"
        subtitle="Advanced dental care with a healthier, brighter smile — that promise has guided SmileCare for over a decade."
      />

      <section className="section-shell grid items-center gap-10 py-14 lg:grid-cols-2">
        <img
          src={team}
          alt="The SmileCare dental team at the hospital reception"
          loading="lazy"
          width={1280}
          height={853}
          className="aspect-3/2 w-full rounded-4xl object-cover shadow-card"
        />
        <div>
          <SectionHeading eyebrow="Our Story" title="A decade of gentle, precise dentistry" align="left" />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            SmileCare Dental Hospital began as a single-chair clinic with a simple belief: dental treatment should never
            be something patients dread. Today we are a multi-speciality dental hospital with a team of specialists, a
            fully digital diagnostic workflow and thousands of patients who arrive nervous and leave smiling.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every treatment plan is explained before it begins. Every instrument is sterilised to hospital protocol.
            Every visit is designed to be calm, clear and comfortable.
          </p>
          <Button asChild variant="brand" className="mt-7">
            <Link to="/appointment">Book Your Visit</Link>
          </Button>
        </div>
      </section>

      <section className="section-shell grid gap-5 py-6 md:grid-cols-3">
        {[
          {
            title: "Our Mission",
            text: "To make advanced dental care accessible, comfortable and completely transparent for every patient.",
            Icon: Target,
          },
          {
            title: "Our Vision",
            text: "To be the most trusted dental hospital in the region, known for clinical precision and genuine care.",
            Icon: Eye,
          },
          {
            title: "Patient-First Approach",
            text: "We explain, we listen and we plan treatment together — never a procedure without understanding.",
            Icon: HeartHandshake,
          },
        ].map(({ title, text, Icon }) => (
          <div key={title} className="card-surface hover-lift p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="section-shell py-12">
        <div className="card-surface grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-gradient-brand md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading eyebrow="Technology" title="Modern technology, gentler treatment" align="left" />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {technologies.map((tech) => (
              <li key={tech.name} className="card-surface p-4">
                <p className="text-sm font-bold text-foreground">{tech.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tech.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <img
          src={clinicInterior}
          alt="Modern SmileCare treatment room with digital dental equipment"
          loading="lazy"
          width={1280}
          height={960}
          className="aspect-4/3 w-full rounded-4xl object-cover shadow-card"
        />
      </section>
    </SiteLayout>
  );
}
