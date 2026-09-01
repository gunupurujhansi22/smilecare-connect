import { supabase } from "@/integrations/supabase/client";

export type Doctor = {
  id: string;
  name: string;
  email: string;
  qualification: string;
  specialization: string;
  experience_years: number;
  registration_number: string;
  phone: string;
  bio: string;
  availability: string;
  working_hours: string;
  status: string;
};

export type Patient = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  gender: string | null;
};

export type AppointmentStatus = "Waiting" | "In Consultation" | "Completed" | "Cancelled" | "No Show";

export type Appointment = {
  id: string;
  appointment_number: string;
  patient_id: string;
  doctor_id: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  reason: string;
  status: AppointmentStatus;
  created_at: string;
  patients?: Patient | null;
};

export type Problem = { id: string; name: string; description: string };

export type Medicine = {
  id: string;
  name: string;
  generic_name: string;
  strength: string;
  form: string;
  default_dosage: string;
  default_frequency: string;
  default_duration: string;
  instructions: string;
};

export type PrescriptionItemDraft = {
  key: string;
  medicine_id: string | null;
  medicine_name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------------- public ---------------- */

export async function fetchDoctors(): Promise<Doctor[]> {
  return unwrap(
    await supabase
      .from("doctors")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: true }),
  ) as Doctor[];
}

export async function fetchDoctor(id: string): Promise<Doctor> {
  return unwrap(await supabase.from("doctors").select("*").eq("id", id).maybeSingle()) as Doctor;
}

export type BookingInput = {
  name: string;
  phone: string;
  email: string;
  age: number | null;
  gender: string;
  doctorId: string;
  service: string;
  date: string;
  time: string;
  type: string;
  reason: string;
};

export async function bookAppointment(input: BookingInput): Promise<string> {
  const { data, error } = await supabase.rpc("book_appointment", {
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email,
    p_age: input.age,
    p_gender: input.gender,
    p_doctor_id: input.doctorId,
    p_service: input.service,
    p_date: input.date,
    p_time: input.time,
    p_type: input.type,
    p_reason: input.reason,
  });
  if (error) throw new Error(error.message);
  return data as unknown as string;
}

/* ---------------- doctor side ---------------- */

export async function fetchCurrentDoctor(): Promise<Doctor | null> {
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email;
  if (!email) return null;
  const { data, error } = await supabase.from("doctors").select("*").ilike("email", email).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Doctor) ?? null;
}

export async function fetchAppointments(opts: { date?: string } = {}): Promise<Appointment[]> {
  let query = supabase
    .from("appointments")
    .select("*, patients(*)")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: true });
  if (opts.date) query = query.eq("appointment_date", opts.date);
  return unwrap(await query) as unknown as Appointment[];
}

export async function fetchAppointment(id: string): Promise<Appointment> {
  return unwrap(
    await supabase.from("appointments").select("*, patients(*)").eq("id", id).maybeSingle(),
  ) as unknown as Appointment;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchProblems(): Promise<Problem[]> {
  return unwrap(await supabase.from("problems").select("*").order("name")) as Problem[];
}

export async function fetchMedicines(): Promise<Medicine[]> {
  return unwrap(
    await supabase.from("medicines").select("*").eq("status", "active").order("name"),
  ) as Medicine[];
}

export async function fetchProblemMedicineMap(): Promise<Record<string, string[]>> {
  const rows = unwrap(await supabase.from("problem_medicines").select("problem_id, medicine_id")) as {
    problem_id: string;
    medicine_id: string;
  }[];
  const map: Record<string, string[]> = {};
  for (const row of rows) {
    map[row.problem_id] = [...(map[row.problem_id] ?? []), row.medicine_id];
  }
  return map;
}

export type ConsultationInput = {
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  problem: string;
  symptoms: string;
  clinical_observation: string;
  pain_level: number | null;
  affected_area: string;
  tooth_number: string;
  doctor_notes: string;
  diagnosis: string;
};

export async function issuePrescription(args: {
  consultation: ConsultationInput;
  items: PrescriptionItemDraft[];
  followUpDate: string | null;
  status: "Issued" | "Draft";
}): Promise<{ prescriptionNumber: string; prescriptionId: string }> {
  const consultation = unwrap(
    await supabase.from("consultations").insert(args.consultation).select("id").maybeSingle(),
  ) as { id: string };

  const { data: numberData, error: numberError } = await supabase.rpc("next_prescription_number");
  if (numberError) throw new Error(numberError.message);
  const prescriptionNumber = numberData as unknown as string;

  const prescription = unwrap(
    await supabase
      .from("prescriptions")
      .insert({
        prescription_number: prescriptionNumber,
        consultation_id: consultation.id,
        appointment_id: args.consultation.appointment_id,
        patient_id: args.consultation.patient_id,
        doctor_id: args.consultation.doctor_id,
        status: args.status,
        follow_up_date: args.followUpDate,
      })
      .select("id")
      .maybeSingle(),
  ) as { id: string };

  if (args.items.length > 0) {
    const { error } = await supabase.from("prescription_items").insert(
      args.items.map((item) => ({
        prescription_id: prescription.id,
        medicine_id: item.medicine_id,
        medicine_name: item.medicine_name,
        strength: item.strength,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
      })),
    );
    if (error) throw new Error(error.message);
  }

  if (args.status === "Issued") {
    await updateAppointmentStatus(args.consultation.appointment_id, "Completed");
  }

  return { prescriptionNumber, prescriptionId: prescription.id };
}

export type PrescriptionRow = {
  id: string;
  prescription_number: string;
  status: string;
  created_at: string;
  follow_up_date: string | null;
  patients: Patient | null;
  consultations: { problem: string; diagnosis: string } | null;
  prescription_items: {
    id: string;
    medicine_name: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
};

export async function fetchPrescriptions(): Promise<PrescriptionRow[]> {
  return unwrap(
    await supabase
      .from("prescriptions")
      .select(
        "id, prescription_number, status, created_at, follow_up_date, patients(*), consultations(problem, diagnosis), prescription_items(*)",
      )
      .order("created_at", { ascending: false }),
  ) as unknown as PrescriptionRow[];
}

export type PatientSummary = {
  patient: Patient;
  lastAppointment: Appointment | null;
  appointments: Appointment[];
};

export async function fetchPatientSummaries(): Promise<PatientSummary[]> {
  const appointments = await fetchAppointments();
  const byPatient = new Map<string, PatientSummary>();
  for (const appointment of appointments) {
    if (!appointment.patients) continue;
    const entry = byPatient.get(appointment.patient_id);
    if (entry) {
      entry.appointments.push(appointment);
    } else {
      byPatient.set(appointment.patient_id, {
        patient: appointment.patients,
        lastAppointment: appointment,
        appointments: [appointment],
      });
    }
  }
  return [...byPatient.values()];
}
