import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { doctorImage } from "@/lib/doctor-images";
import type { Doctor } from "@/lib/api";
import type { Service } from "@/lib/site-data";

const toneClass: Record<Service["tone"], string> = {
  sky: "bg-sky",
  lavender: "bg-lavender",
  magenta: "bg-magenta-soft",
  mint: "bg-mint-soft",
  primary: "bg-primary-soft",
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      to="/services/$serviceSlug"
      params={{ serviceSlug: service.slug }}
      className="card-surface hover-lift group flex flex-col p-6"
    >
      <span className={`grid h-14 w-14 place-items-center rounded-2xl ${toneClass[service.tone]}`}>
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path
            d="M12 4.2c-1.5-1.1-3-1.6-4.4-1.3C5.6 3.3 4.3 4.9 4.3 7.4c0 2 .5 3.7 1 5.6.4 1.5.5 3 .7 4.5.2 1.5.6 3 1.7 3 1.4 0 1.5-1.9 1.8-3.5.3-1.5.7-2.6 2.5-2.6s2.2 1.1 2.5 2.6c.3 1.6.4 3.5 1.8 3.5 1.1 0 1.5-1.5 1.7-3 .2-1.5.3-3 .7-4.5.5-1.9 1-3.6 1-5.6 0-2.5-1.3-4.1-3.3-4.5-1.4-.3-2.9.2-4.4 1.3Z"
            className="fill-primary"
          />
        </svg>
      </span>
      <h3 className="mt-5 text-lg font-bold text-foreground">{service.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Learn More
        <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="card-surface hover-lift overflow-hidden">
      <img
        src={doctorImage(doctor.email)}
        alt={`${doctor.name}, ${doctor.specialization} at SmileCare Dental Hospital`}
        loading="lazy"
        width={640}
        height={640}
        className="h-56 w-full bg-sky object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{doctor.specialization}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" /> {doctor.qualification}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" /> {doctor.experience_years}+ Years Experience
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
        <p className="mt-3 text-xs font-semibold text-mint">Available: {doctor.availability}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="brand" size="sm">
            <Link to="/appointment" search={{ doctor: doctor.id }}>
              Book Appointment
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
              View Profile
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function FeatureCard({
  title,
  text,
  Icon,
}: {
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card-surface hover-lift flex gap-4 p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export function TestimonialCard({
  name,
  treatment,
  rating,
  review,
}: {
  name: string;
  treatment: string;
  rating: number;
  review: string;
}) {
  return (
    <figure className="card-surface hover-lift flex h-full flex-col p-6">
      <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={index < rating ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-border"}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">“{review}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-primary-foreground">
          {name.charAt(0)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-foreground">{name}</span>
          <span className="block text-xs text-muted-foreground">{treatment}</span>
        </span>
      </figcaption>
    </figure>
  );
}
