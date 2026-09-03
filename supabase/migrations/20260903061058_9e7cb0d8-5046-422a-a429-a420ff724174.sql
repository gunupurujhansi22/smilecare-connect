-- prevent double booking at DB level
CREATE UNIQUE INDEX IF NOT EXISTS appointments_doctor_slot_unique
  ON public.appointments (doctor_id, appointment_date, appointment_time)
  WHERE status <> 'Cancelled';

CREATE INDEX IF NOT EXISTS appointments_doctor_date_idx ON public.appointments (doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS consultations_appointment_idx ON public.consultations (appointment_id);
CREATE INDEX IF NOT EXISTS prescriptions_doctor_idx ON public.prescriptions (doctor_id);
CREATE INDEX IF NOT EXISTS prescription_items_prescription_idx ON public.prescription_items (prescription_id);

-- public availability lookup (returns only booked time strings, no patient data)
CREATE OR REPLACE FUNCTION public.booked_slots(p_doctor_id uuid, p_date date)
RETURNS SETOF text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time
  FROM public.appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND status <> 'Cancelled';
$$;

REVOKE ALL ON FUNCTION public.booked_slots(uuid, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.booked_slots(uuid, date) TO anon, authenticated, service_role;

-- atomic consultation + prescription + items creation for the authenticated doctor
CREATE OR REPLACE FUNCTION public.record_consultation(
  p_appointment_id uuid,
  p_problem text,
  p_symptoms text,
  p_clinical_observation text,
  p_pain_level integer,
  p_affected_area text,
  p_tooth_number text,
  p_diagnosis text,
  p_doctor_notes text,
  p_items jsonb,
  p_follow_up_date date,
  p_status text
)
RETURNS TABLE (prescription_id uuid, prescription_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_doctor uuid := public.current_doctor_id();
  v_appt public.appointments;
  v_consultation uuid;
  v_prescription uuid;
  v_number text;
  v_item jsonb;
BEGIN
  IF v_doctor IS NULL THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  IF p_status NOT IN ('Draft', 'Issued') THEN
    RAISE EXCEPTION 'Invalid prescription status';
  END IF;

  SELECT * INTO v_appt FROM public.appointments
   WHERE id = p_appointment_id AND doctor_id = v_doctor
   FOR UPDATE;
  IF v_appt.id IS NULL THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  -- block duplicate issued prescriptions for the same appointment
  IF EXISTS (
    SELECT 1 FROM public.prescriptions
    WHERE appointment_id = p_appointment_id AND status = 'Issued'
  ) THEN
    RAISE EXCEPTION 'A prescription has already been issued for this appointment';
  END IF;

  DELETE FROM public.prescription_items
   WHERE prescription_id IN (
     SELECT id FROM public.prescriptions
     WHERE appointment_id = p_appointment_id AND status = 'Draft'
   );
  DELETE FROM public.prescriptions
   WHERE appointment_id = p_appointment_id AND status = 'Draft';

  INSERT INTO public.consultations (
    appointment_id, doctor_id, patient_id, problem, symptoms, clinical_observation,
    pain_level, affected_area, tooth_number, doctor_notes, diagnosis
  ) VALUES (
    p_appointment_id, v_doctor, v_appt.patient_id, coalesce(p_problem,''), coalesce(p_symptoms,''),
    coalesce(p_clinical_observation,''), p_pain_level, coalesce(p_affected_area,''),
    coalesce(p_tooth_number,''), coalesce(p_doctor_notes,''), coalesce(p_diagnosis,'')
  ) RETURNING id INTO v_consultation;

  v_number := public.next_prescription_number();

  INSERT INTO public.prescriptions (
    prescription_number, consultation_id, appointment_id, patient_id, doctor_id, status, follow_up_date
  ) VALUES (
    v_number, v_consultation, p_appointment_id, v_appt.patient_id, v_doctor, p_status, p_follow_up_date
  ) RETURNING id INTO v_prescription;

  FOR v_item IN SELECT * FROM jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  LOOP
    INSERT INTO public.prescription_items (
      prescription_id, medicine_id, medicine_name, strength, dosage, frequency, duration, instructions
    ) VALUES (
      v_prescription,
      NULLIF(v_item->>'medicine_id','')::uuid,
      coalesce(v_item->>'medicine_name',''),
      coalesce(v_item->>'strength',''),
      coalesce(v_item->>'dosage',''),
      coalesce(v_item->>'frequency',''),
      coalesce(v_item->>'duration',''),
      coalesce(v_item->>'instructions','')
    );
  END LOOP;

  IF p_status = 'Issued' THEN
    UPDATE public.appointments SET status = 'Completed' WHERE id = p_appointment_id;
  ELSE
    UPDATE public.appointments SET status = 'In Consultation' WHERE id = p_appointment_id
      AND status NOT IN ('Completed','Cancelled');
  END IF;

  RETURN QUERY SELECT v_prescription, v_number;
END;
$$;

REVOKE ALL ON FUNCTION public.record_consultation(uuid, text, text, text, integer, text, text, text, text, jsonb, date, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_consultation(uuid, text, text, text, integer, text, text, text, text, jsonb, date, text) TO authenticated;