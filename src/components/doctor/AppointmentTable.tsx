import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import type { Appointment } from "@/lib/api";

function actionLabel(status: Appointment["status"]) {
  if (status === "Completed") return "View Prescription";
  if (status === "In Consultation") return "Continue Consultation";
  return "Start Consultation";
}

export function AppointmentTable({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="card-surface overflow-hidden p-0">
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Appointments assigned to you</caption>
          <thead className="bg-secondary/60 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-5 py-3">Time</th>
              <th scope="col" className="px-5 py-3">Patient</th>
              <th scope="col" className="px-5 py-3">Age</th>
              <th scope="col" className="px-5 py-3">Type</th>
              <th scope="col" className="px-5 py-3">Service</th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-secondary/40">
                <td className="px-5 py-3.5 font-bold text-foreground">{appointment.appointment_time}</td>
                <td className="px-5 py-3.5">
                  <span className="font-semibold text-foreground">{appointment.patients?.name ?? "Patient"}</span>
                  <span className="block text-xs text-muted-foreground">{appointment.appointment_number}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{appointment.patients?.age ?? "—"}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{appointment.appointment_type}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{appointment.service}</td>
                <td className="px-5 py-3.5"><StatusBadge status={appointment.status} /></td>
                <td className="px-5 py-3.5 text-right">
                  <Button asChild size="sm" variant={appointment.status === "Completed" ? "soft" : "brand"}>
                    <Link to="/doctor/consultation/$appointmentId" params={{ appointmentId: appointment.id }}>
                      {actionLabel(appointment.status)} <ArrowRight />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-foreground">{appointment.patients?.name ?? "Patient"}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.appointment_time} · {appointment.appointment_type}
                </p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
            <p className="text-xs text-muted-foreground">{appointment.service}</p>
            <Button asChild size="sm" variant={appointment.status === "Completed" ? "soft" : "brand"} className="w-full">
              <Link to="/doctor/consultation/$appointmentId" params={{ appointmentId: appointment.id }}>
                {actionLabel(appointment.status)} <ArrowRight />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
