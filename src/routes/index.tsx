import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  HeartHandshake,
  Play,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { SiteLayout, SectionHeading } from "@/components/site/SiteLayout";
import { DoctorCard, FeatureCard, ServiceCard, TestimonialCard } from "@/components/site/cards";
import { Button } from "@/components/ui/button";
import { LoadingRows, ErrorState } from "@/components/states";
import { fetchDoctors } from "@/lib/api";
import { services, stats, technologies, testimonials, trustFeatures } from "@/lib/site-data";
import heroImage from "@/assets/hero-dental.jpg";
import advancedCare from "@/assets/advanced-care.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmileCare Dental Hospital — Advanced Dental Care in New Delhi" },
      {
        name: "description",
        content:
          "SmileCare Dental Hospital offers advanced dental care for a healthier, brighter smile — implants, orthodontics, root canal and cosmetic dentistry by experienced specialists.",
      },
      { property: "og:title", content: "SmileCare Dental Hospital — Advanced Dental Care" },
      {
        property: "og:description",
        content:
          "Compassionate dental care powered by modern technology, experienced specialists and a patient-first approach.",
      },
    ],
  }),
  component: HomePage,
});

const featureIcons = [Sparkles, HeartHandshake, Stethoscope, ShieldCheck];

function HomePage() {
  const doctorsQuery = useQuery({ queryKey: ["doctors"], queryFn: fetchDoctors });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="gradient-surface relative overflow-hidden">
        <div className="section-shell grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-rise">
            <p className="text-xs font-bold tracking-[0.22em] text-primary uppercase">Your Smile, Our Passion</p>
            <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold text-foreground md:text-6xl">
              Advanced Dental Care <br className="hidden sm:block" />
              for a Healthier, <br className="hidden sm:block" />
              <span className="text-gradient-brand">Brighter Smile</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Experience compassionate dental care powered by modern technology, experienced specialists and a
              patient-first approach.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild variant="brand" size="lg">
                <Link to="/appointment">
                  Book Appointment <CalendarCheck />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services">Explore Services</Link>
              </Button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-foreground transition-smooth hover:text-primary"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-primary shadow-soft">
                  <Play className="h-4 w-4" />
                </span>
                Watch Our Story
              </button>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {trustFeatures.map((feature, index) => {
                const Icon = featureIcons[index] ?? Sparkles;
                return (
                  <div key={feature.title} className="min-w-0">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <dt className="mt-2 text-xs font-bold text-foreground">{feature.title}</dt>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="relative animate-rise">
            <img
              src={heroImage}
              alt="Dentist with a smiling patient in a modern SmileCare treatment room"
              width={1280}
              height={1280}
              className="aspect-square w-full rounded-4xl object-cover shadow-float"
            />
            <div className="card-surface absolute -bottom-4 left-0 hidden w-56 p-4 shadow-card sm:block">
              <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                <BadgeCheck className="h-4 w-4 text-primary" /> Patient's Choice
              </p>
              <p className="mt-1 text-2xl font-extrabold text-foreground">2K+</p>
              <p className="text-xs text-muted-foreground">Happy Smiles</p>
            </div>
            <div className="card-surface absolute -top-4 right-0 hidden w-52 p-4 shadow-card sm:block">
              <p className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Smile className="h-4 w-4 text-magenta" /> Experienced Doctors
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Advanced technology, gentle care</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST FEATURES */}
      <section className="section-shell py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              text={feature.text}
              Icon={featureIcons[index] ?? Sparkles}
            />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-shell py-10 md:py-16">
        <SectionHeading
          eyebrow="Our Dental Services"
          title="Complete Care for Every Smile"
          subtitle="Comprehensive dental treatments designed around your comfort and long-term oral health."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="soft">
            <Link to="/services">
              View All Services <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* ADVANCED CARE */}
      <section className="section-shell py-10 md:py-16">
        <div className="gradient-deep grid overflow-hidden rounded-4xl shadow-float lg:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="text-xs font-bold tracking-[0.22em] text-white/70 uppercase">Why SmileCare</p>
            <h2 className="mt-4 text-2xl leading-tight font-extrabold text-white md:text-4xl">
              Advanced Care, <br /> Exceptional Experience
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
              We combine advanced dental technology with a gentle approach to deliver comfortable, effective and
              personalized dental care.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Digital Technology", Icon: Sparkles },
                { label: "Pain-Free Treatment", Icon: HeartHandshake },
                { label: "Sterilized Environment", Icon: ShieldCheck },
                { label: "Friendly Doctors", Icon: Smile },
              ].map(({ label, Icon }) => (
                <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-white" />
                  <p className="mt-2 text-xs font-semibold text-white/90">{label}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="brand" size="lg" className="mt-8">
              <Link to="/about">Learn About Us</Link>
            </Button>
          </div>
          <img
            src={advancedCare}
            alt="Dental specialists reviewing a digital x-ray with a patient"
            loading="lazy"
            width={1280}
            height={960}
            className="h-full min-h-64 w-full object-cover"
          />
        </div>
      </section>

      {/* DOCTORS */}
      <section className="section-shell py-10 md:py-16">
        <SectionHeading
          eyebrow="Our Team"
          title="Meet Our Dental Specialists"
          subtitle="Qualified specialists across restorative, orthodontic, implant and pediatric dentistry."
        />
        <div className="mt-10">
          {doctorsQuery.isPending ? (
            <LoadingRows rows={2} />
          ) : doctorsQuery.isError ? (
            <ErrorState title="Unable to load doctors" text="Please refresh the page and try again." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {doctorsQuery.data.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section className="section-shell py-10">
        <div className="card-surface grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-extrabold text-gradient-brand md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="section-shell py-10 md:py-16">
        <SectionHeading
          eyebrow="Technology"
          title="Modern Dental Technology"
          subtitle="Digital tools that make diagnosis more precise and treatment more comfortable."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech) => (
            <div key={tech.name} className="card-surface hover-lift p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lavender text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{tech.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tech.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-shell py-10 md:py-16">
        <SectionHeading eyebrow="Testimonials" title="What Our Patients Say" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell py-10 md:py-16">
        <div className="card-surface flex flex-col items-center gap-5 px-6 py-12 text-center">
          <h2 className="max-w-xl text-2xl leading-tight font-extrabold text-foreground md:text-3xl">
            Your brighter smile is just a click away
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Book an appointment with a SmileCare specialist and get a personalised treatment plan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="brand" size="lg">
              <Link to="/appointment">Book Appointment</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
